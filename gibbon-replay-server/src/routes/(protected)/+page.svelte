<script>
    export let data;
</script>

<table>
    <thead>
        <tr>
            <th>Datetime</th>
            <th>Screen</th>
            <th>UserAgent</th>
            <th>Platform</th>
            <th>Fingerprint</th>
            <th>ip</th>
        </tr>
    </thead>

    <tbody>
        {#each data.rrweb_session_list as row}
            <tr>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.timestamp}</a></td>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.screenWidth}px x {row.screenHeight}px</a></td>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.userAgent}</a></td>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.platform}</a></td>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.fingerprint}</a></td>
                <td><a href={`./${row.rrweb_session_id}/`}>{row.ip}</a></td>
            </tr>
        {/each}
    </tbody>
</table>
<style>
    tr, td {
        font-size: 12px;
        padding: 0.5rem;
    }
</style>
