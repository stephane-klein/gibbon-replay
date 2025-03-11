<script>
    import gibbonReplayJs from 'gibbon-replay-js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    let { data, children } = $props();

    onMount(async () => {
        if (browser) {
            gibbonReplayJs.init(new URL("/record/", data.gibbon_replay_url).toString());
        }
    });
</script>

{@render children?.()}
