<script>
    export let data;

    console.dir(data);
</script>

<ul>
{#each data.rrweb_session_list as rrweb_session_id}
    <li><a href={`./${rrweb_session_id}/`}>{rrweb_session_id}</a></li>
{/each}
</ul>
