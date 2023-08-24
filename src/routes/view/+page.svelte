<script>
    export let data;

    import { onMount } from "svelte";
	import Map from "../../components/map.svelte";

    let marker = {
        lat: data.lat,
        lng: data.lng,
        text: "คุณอยู่ที่นี่",
        navigate:"/"
    }

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
            console.log("Geolocation is not supported by this browser.");
        }
    });

</script>

<main class="bg-neutral">
    <h1 class="text-center text-2xl font-bold text-white py-5">What is my<input type="text" class=" input input-ghost w-12 text-start text-2xl font-bold text-white" bind:value={km} on:change={() => change = !change}>km area?</h1>
    {#key change}
    <Map {marker} area={km} custom={true}/>
    {/key}
</main>

