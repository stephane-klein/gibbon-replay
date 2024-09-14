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
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        {#each data.rrweb_session_list as row}
            <tr>
                <td><a href={`./${row.session_uuid}/`}>{row.timestamp}</a></td>
                <td><a href={`./${row.session_uuid}/`}>{row.info.screenWidth}px x {row.info.screenHeight}px</a></td>
                <td><a href={`./${row.session_uuid}/`}>{row.info.userAgent}</a></td>
                <td><a href={`./${row.session_uuid}/`}>{row.info.platform}</a></td>
                <td><a href={`./${row.session_uuid}/`}>{row.fingerprint}</a></td>
                <td><a href={`./${row.session_uuid}/`}>{row.ip}</a></td>
                <td>[<a href={`./${row.session_uuid}/delete/`}>delete</a>]</td>
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
