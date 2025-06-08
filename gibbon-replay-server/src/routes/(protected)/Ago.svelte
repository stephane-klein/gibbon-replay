<script>
    import {
        convertDatetimeToBrowserTimezone,
        timeAgo
    } from "$lib/utils.js";

    let {
        href,
        timestamp
    } = $props();
</script>
<a
    href={href}
    title={convertDatetimeToBrowserTimezone(timestamp)}
>
    {timeAgo(timestamp)}
</a>
