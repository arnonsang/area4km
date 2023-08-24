<script>
	import { onMount, onDestroy } from 'svelte';
	import Swal from 'sweetalert2';
	import pin from '../assets/pin.png';

	export let marker = {
		lat: 13.756331,
		lng: 100.501762,
		text: 'Bangkok, Thailand',
		navigate: '#'
	};
	export let custom = false;
	export let area = 4;

	let mapElement;
	let map;
	let mymarker;
	let mycircle;
	let searchTerm = '';
	const setLatLng = (lat, lng) => {
		marker.lat = lat;
		marker.lng = lng;
		map.setView([lat, lng]);
		mymarker.setLatLng([lat, lng]);
		mymarker.bindPopup(marker.text);
		mymarker.openPopup();
		mycircle.setLatLng([lat, lng]);
	};

	const shareMyLocation = async () => {
		//copy to clipboard
		const el = document.createElement('textarea');
		const url =
			window.location.hostname === 'localhost'
				? 'http://localhost:5173'
				: `https://${window.location.hostname}`;
		el.value = `${url}/view?lat=${marker.lat}&lng=${marker.lng}`;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		Swal.fire({
			icon: 'success',
			title: 'คัดลอกลิงค์สำเร็จ',
			text: 'คุณสามารถแชร์ลิงค์นี้ให้เพื่อนๆ ได้เลย'
		});
	};

	const getCurrentLocation = async () => {
		if (custom) {
			return setLatLng(marker.lat, marker.lng);
		}
		Swal.fire({
			title: 'กำลังค้นหาตำแหน่งของคุณ',
			text: 'โปรดอนุญาตการเข้าถึงตำแหน่ง และรอสักครู่',
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,
			didOpen: () => {
				Swal.showLoading();
			}
		});
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLatLng(position.coords.latitude, position.coords.longitude);
					Swal.close();
				},
				(error) => {
					Swal.fire({
						icon: 'error',
						title: 'พบข้อผิดพลาด',
						text: 'ไม่สามารถเข้าถึงตำแหน่งของคุณได้ โปรดใช้อุปกรณ์อื่น'
					});
				}
			);
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'ไม่สามารถเข้าถึงตำแหน่งของคุณได้ โปรดใช้อุปกรณ์อื่น'
			});
		}
	};

	const searchGeoLocationBytext = async (searchTerm) => {
		Swal.fire({
			title: 'กำลังค้นหาตำแหน่ง',
			text: 'กรุณารอสักครู่',
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,
			didOpen: () => {
				Swal.showLoading();
			}
		});
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${searchTerm.trim()}&format=json&limit=1`
		);
		const data = await response.json();
		if (data.length > 0) {
			setLatLng(data[0].lat, data[0].lon);
			Swal.close();
		} else {
			Swal.fire({
				icon: 'error',
				title: 'ไม่พบตำแหน่งที่ค้นหา',
				text: 'กรุณาลองใหม่อีกครั้ง หรือย้ายหมุดไปยังตำแหน่งที่ต้องการด้วยตนเอง'
			});
		}
	};

	onMount(async () => {
		const L = await import('leaflet');

		map = L.map(mapElement).setView([marker.lat, marker.lng], 14);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		mymarker = L.marker([marker.lat, marker.lng], {
			icon: L.icon({
				iconUrl: pin,
				iconSize: [30, 30],
				iconAnchor: [15, 30],
				popupAnchor: [0, -25]
			}),
			title: marker.text,
			autoPanOnFocus: true,
			draggable: true,
			autoPan: true
		})
			.addTo(map)
			.bindPopup(marker.text)
			.openPopup();

		mycircle = L.circle([marker.lat, marker.lng], {
			color: 'green',
			fillColor: '#00FF00',
			fillOpacity: 0.1,
			radius: area * 1000
		}).addTo(map);

		mymarker.on('dragend', function (e) {
			var latlng = e.target.getLatLng();
			setLatLng(latlng.lat, latlng.lng);
			//redirect(marker.navigate);
		});

		map.on('click', function (e) {
			var latlng = e.latlng;
			setLatLng(latlng.lat, latlng.lng);
			//redirect(marker.navigate);
		});

		await getCurrentLocation();
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<main>
	<div class="w-screen h-12 flex flex-row">
		<input
			type="text"
			name="searchbox"
			id="searchbox"
			class="w-full bg-blue-200 px-4 py-4 text-black rounded-none"
			on:change={(e) => searchGeoLocationBytext(e.target.value)}
			bind:value={searchTerm}
			placeholder="ค้นหาตำแหน่งที่ต้องการที่นี่!"
		/>
		<button class="btn btn-primary rounded-none" on:click={searchGeoLocationBytext(searchTerm)}
			>ค้นหา</button
		>
		<button class="btn btn-secondary rounded-none" on:click={shareMyLocation}>Share</button>
	</div>

	<div bind:this={mapElement} id="map" style="width: 100%; height: 83vh;" />
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
</style>
