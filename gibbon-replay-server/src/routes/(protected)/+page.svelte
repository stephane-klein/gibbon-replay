<script>
    import prettyBytes from 'pretty-bytes';
    import {
        convertDatetimeToBrowserTimezone,
        extractTrackCampaign,
        extractSource
    } from '$lib/utils.js';
    import * as Table from "$lib/components/ui/table/index.js";
    import { Trash2 } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data } = $props();
</script>

<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Datetime</Table.Head>
                <Table.Head>Screen</Table.Head>
                <Table.Head>Size</Table.Head>
                <Table.Head>UserAgent</Table.Head>
                <Table.Head>Platform</Table.Head>
                <Table.Head>Fingerprint</Table.Head>
                <Table.Head>ip</Table.Head>
                <Table.Head>Location</Table.Head>
                <Table.Head>Campaign</Table.Head>
                <Table.Head>Actions</Table.Head>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {#each data.rrweb_session_list as row (row.session_uuid)}
                <Table.Row>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{convertDatetimeToBrowserTimezone(row.timestamp)}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.info.screenWidth}px x {row.info.screenHeight}px</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-right whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.data_size ? prettyBytes(row.data_size) : '-'}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left">
                        <a href={`./${row.session_uuid}/`}>{row.info.userAgent}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.info.platform}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.fingerprint}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.ip}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <a href={`./${row.session_uuid}/`}>{row.info?.location?.city || "?"}, {row.info?.location?.country_name || "?"}</a>
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        {extractTrackCampaign(row.info?.href) || "-"} | {extractSource(row.info?.href) || "-"}
                    </Table.Cell>
                    <Table.Cell class="h-24 text-left whitespace-nowrap">
                        <Button
                            href={`./${row.session_uuid}/delete/`}
                            variant="secondary"
                        >
                            <Trash2 class="mr-0 size-4" />
                            Delete
                        </Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
