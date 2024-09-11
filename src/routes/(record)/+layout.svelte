<script>
    import gibbonReplayJs from 'gibbon-replay-js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(async () => {
        if (browser) {
            gibbonReplayJs.init("/_record/");
        }
    });
</script>

<slot />
