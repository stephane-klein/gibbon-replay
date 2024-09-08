<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { record } from '@rrweb/record';


    let events = [];

    onMount(() => {
        if (browser) {
            record({
                emit(event) {
                    events.push(event);
                },
            });

            function save() {
                if (events.length > 0) {
                    const body = JSON.stringify({ events });
                    events = [];
                    fetch('/_record/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body,
                    });
                }
            }

            setInterval(save, 2 * 1000); // 2 seconds
            window.addEventListener('beforeunload', save);
        }
    });
</script>

<slot />
