<script>
	import { onMount } from 'svelte';
	import Map from '../components/map.svelte';
/** @type {import('@sveltejs/adapter-vercel').Config} */
	export const config = {
		runtime: 'edge'
	};

	let marker = {
		lat: 51.505,
		lng: -0.09,
		text: 'You are here',
		navigate: '/whereami'
	};
	let km = 4;
	let change = false;
	onMount(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					marker.lat = position.coords.latitude;
					marker.lng = position.coords.longitude;
					getLocationName();
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
	});

	const getLocationName = async () => {
		await fetch(
			`https://nominatim.openstreetmap.org/search?q=${marker.lat},${marker.lng}&format=json`
		)
			.then((res) => res.json())
			.then((data) => {
				marker.text = data[0].display_name;
				return data[0].display_name;
			});
	};
</script>

<main class="bg-neutral">
	<h1 class="text-center text-2xl font-bold text-white py-5">
		What is my<input
			type="text"
			class=" input input-ghost w-12 text-start text-2xl font-bold text-white"
			bind:value={km}
			on:change={() => (change = !change)}
		/>km area?
	</h1>
	{#key change}
		<Map {marker} area={km} />
	{/key}
</main>
