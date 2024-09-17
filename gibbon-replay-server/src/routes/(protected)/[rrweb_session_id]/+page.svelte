<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import rrwebPlayer from 'rrweb-player';
    import 'rrweb-player/dist/style.css';
    import {
        convertDatetimeToBrowserTimezone,
        extractTrackCampaign,
        extractSource
    } from '$lib/utils.js';

    export let data;

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

<table>
    <thead>
        <tr>
            <th>Datetime</th>
            <th>UserAgent</th>
            <th>Platform</th>
            <th>Fingerprint</th>
            <th>ip</th>
            <th>Location</th>
            <th>Campaign</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{convertDatetimeToBrowserTimezone(data.session.timestamp)}</td>
            <td>{data.session.info.userAgent}</td>
            <td>{data.session.info.platform}</td>
            <td>{data.session.fingerprint}</td>
            <td>{data.session.ip}</td>
            <td>{data.session.info?.location?.city || "?"}, {data.session.info?.location?.country_name || "?"}</td>
            <td>{extractTrackCampaign(data.session.info?.href) || "-"} | {extractSource(data.session.info?.href) || "-"}</td>
        </tr>
    </tbody>
</table>

<p>href: {data.session.info?.href || "-"}</p>

<div bind:this={container}></div>

<style>
    tr, td {
        font-size: 12px;
        padding: 0.5rem;
    }
</style>
