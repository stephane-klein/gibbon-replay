<script>
    import gibbonReplayJs from 'gibbon-replay-js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    export let data;

    onMount(async () => {
        if (browser) {
            gibbonReplayJs.init(new URL("/record/", data.gibbon_replay_url).toString());
        }
    });
</script>

<slot />
