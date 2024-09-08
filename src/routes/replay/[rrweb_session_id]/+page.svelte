<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import rrwebPlayer from 'rrweb-player';
    import 'rrweb-player/dist/style.css';

    export let data;
    console.log(data);

    let container;

    onMount(() => {
        if (browser) {
            new rrwebPlayer({
                target: container,
                props: {
                    events: data.events
                },
            });
        }
    });
</script>

<h1>Replay</h1>

<div bind:this={container}></div>
