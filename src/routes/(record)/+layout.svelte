<script>
    //import { init } from 'gibbon-replay-js';
    import { init } from 'node_modules/gibbon-replay-js/dist/index.js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(async () => {
        if (browser) {
            init("/_record/");
        }
    });
</script>

<slot />
