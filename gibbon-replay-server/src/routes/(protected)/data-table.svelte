<script lang="js">
    import { createTable, Render, Subscribe } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";

    import prettyBytes from 'pretty-bytes';
    import {
        convertDatetimeToBrowserTimezone,
        extractTrackCampaign,
        extractSource
    } from '$lib/utils.js';
 
    export let data;
    console.log(data);

    const table = createTable(readable(data));
 
    const columns = table.createColumns([
        table.column({
            accessor: (item) => convertDatetimeToBrowserTimezone(item.timestamp),
            header: "Datetime"
        }),
        table.column({
            accessor: (item) => `${item.info.screenWidth}px x ${item.info.screenHeight}px`,
            header: "Screen"
        }),
        table.column({
            accessor: (item) => item.data_size ? prettyBytes(item.data_size) : '-',
            header: "Size"
        }),
        table.column({
            accessor: (item) => item.info.userAgent,
            header: "UserAgent"
        }),
        table.column({
            accessor: (item) => item.info.platform,
            header: "Platform"
        }),
        table.column({
            accessor: (item) => item.fingerprint,
            header: "Fingerprint"
        }),
        table.column({
            accessor: (item) => item.ip,
            header: "ip"
        }),
        table.column({
            accessor: (item) => `${item.info?.location?.city || "?"}, ${item.info?.location?.country_name || "?"}`,
            header: "Location"
        }),
        table.column({
            accessor: (item) => `${extractTrackCampaign(item.info?.href) || "-"} | ${extractSource(item.info?.href) || "-"}`,
            header: "Compaign"
        }),
    ]);
 
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                                <Table.Head {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
