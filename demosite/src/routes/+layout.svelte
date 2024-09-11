<script>
    import gibbonReplayJs from 'gibbon-replay-js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(async () => {
        if (browser) {
            gibbonReplayJs.init(URL("/_record/", process.env.GIBBON_REPLAY_URL).toString());
        }
    });
</script>

<slot />
