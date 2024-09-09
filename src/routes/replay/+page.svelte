<script>
    export let data;

    const headers = Object.keys(data.rrweb_session_list[0]);
</script>

<table>
  <thead>
    <tr>
      {#each headers as header}
        <th>{header}</th>
      {/each}
    </tr>
  </thead>

  <tbody>
    {#each data.rrweb_session_list as row}
      <tr>
        {#each headers as header}
          <td>
            <a href={`./${row['rrweb_session_id']}/`}>{row[header]}</a>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<style>
    tr, td {
        font-size: 12px;
    }
</style>
