<script>
    import Bowser from 'bowser';
    import { humanReadableDuration } from "$lib/utils.js";
    import prettyBytes from "pretty-bytes";

    let {
        durationInSeconds,
        fingerprint,
        userAgent,
        dataSize,
        screenWidth,
        screenHeight,
        ip,
        location,
        hasUserActions
    } = $props();

    let detectedBrowser = $state();

    if (userAgent) {
        detectedBrowser = Bowser.parse(userAgent);
    }

    let locationTmp = [
        location?.city,
        location?.country_name
    ]
        .filter((item) => item)
        .join(', ');
</script>
<div>
    Visit from {fingerprint} during {humanReadableDuration(durationInSeconds)}
    {#if !hasUserActions} without any user action{/if}
    with browser {detectedBrowser?.browser?.name}
    {detectedBrowser?.browser?.version} under {detectedBrowser?.os?.name} ({screenWidth}x{screenHeight})<br />
    Location: {ip ? ip : '-'} {(locationTmp ? ` (${locationTmp})` : '')}<br />
    Size: {dataSize ? prettyBytes(dataSize) : '-'}
</div>
