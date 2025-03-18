<script>
    import prettyBytes from 'pretty-bytes';
    import {
        convertDatetimeToBrowserTimezone,
        extractTrackCampaign,
        extractSource
    } from '$lib/utils.js';
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Trash2, Ellipsis } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data } = $props();
</script>

<div class="hidden flex-col md:flex">
    <div class="border-b">
        <div class="flex h-16 items-center px-4 w-full">
            <nav class="flex flex-auto items-center space-x-4 lg:space-x-6">
                <a href="/" class="hover:text-primary text-sm font-medium transition-colors">
                    Recorded sessions
                </a>
            </nav>
            <DropdownMenu.Root class="flex-none">
                <DropdownMenu.Trigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        class="data-[state=open]:bg-accent h-7 w-7"
                    >
                        <Ellipsis />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56" align="end">
                    <DropdownMenu.Item>
                        <a href="/logout/" data-sveltekit-reload class="w-full block">Log out</a>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    </div>
</div>


<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Datetime</Table.Head>
                <Table.Head class="whitespace-nowrap">Screen size in px</Table.Head>
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
                        <a href={`./${row.session_uuid}/`}>{row.info.screenWidth}x{row.info.screenHeight}</a>
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
