<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { writable } from "svelte/store";
    import prettyBytes from "pretty-bytes";
    import { Render, createTable, createRender } from "@humanspeak/svelte-headless-table";
    import { addPagination } from "@humanspeak/svelte-headless-table/plugins";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import Ellipsis from "@lucide/svelte/icons/ellipsis";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import {
        extractTrackCampaign,
        extractSource
    } from "$lib/utils.js";
    import Link from "./Link.svelte";
    import Info from "./Info.svelte";
    import Ago from "./Ago.svelte";

    const currentPage = $derived(parseInt($page.url.searchParams.get("page") || "1", 10));
    const perPage = $derived(parseInt($page.url.searchParams.get("per_page") || "20", 10));
    let { data } = $props();

    const dataStore = $derived.by(() => {
        return writable(data.sessions);
    });
    const table = $derived.by(() => {
        return createTable(dataStore, {
            page: addPagination({
                serverSide: true,
                serverItemCount: data.sessions_count
            }),
        });
    });

    const AgoCell = ({row}) => {
        return createRender(
            Ago,
            {
                href: `./${row.original.session_uuid}/`,
                timestamp: row.original.timestamp
            }
        );
    };

    const LinkCell = ({row, value}) => {
        return createRender(
            Link,
            {
                href: `./${row.original.session_uuid}/`,
                value: value
            }
        );
    };
    const InfoCell = ({row}) => {
        return createRender(
            Info,
            {
                timestamp: row.original.timestamp,
                durationInSeconds: row.original.duration_in_seconds,
                fingerprint: row.original.fingerprint,
                userAgent: row.original.info.userAgent,
                dataSize: row.original.data_size,
                screenWidth: row.original?.info?.screenWidth,
                screenHeight: row.original?.info?.screenHeight,
                ip: row.original?.ip,
                location: row.original?.info?.location,
                hasUserActions: row.original?.has_user_actions
            }
        );
    };

    const columns = $derived.by(() => {
        return table.createColumns([
            table.column({
                header: "Date",
                plugins: { appendToClass: "w-40" },
                cell: AgoCell
            }),
            table.column({
                header: "",
                cell: InfoCell
            }),
            table.column({
                header: "Campaign",
                accessor: (item) => `${extractTrackCampaign(item.info?.href) || "-"} | ${extractSource(item.info?.href) ||
    "-"}`,
                plugins: { appendToClass: "text-left whitespace-nowrap" },
                cell: LinkCell
            })
        ]);
    });
    const viewModel = $derived.by(() => {
        return table.createViewModel(columns);
    });
    const headerRows = $derived(viewModel.headerRows);
    const rows = $derived(viewModel.rows);
</script>

<div class="hidden flex-col md:flex">
    <div class="border-b">
        <div class="flex h-16 items-center px-4 w-full">
            <nav class="flex flex-auto items-center space-x-4 lg:space-x-6">
                <img
                    src="/logo-gibbon-replay.webp" 
                    srcset="/logo-gibbon-replay.webp, /logo-gibbon-replay@2x.webp 2x"
                    alt="Logo Gibbon-Replay"
                    style="border-radius: 0.5rem"
                />
                <a href="/" class="hover:text-primary text-sm font-medium transition-colors">
                    Recorded sessions ({prettyBytes(data.sessions_size)})
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

<div  class="space-y-4">
    <div class="rounded-md border">
        <Table.Root>
            <Table.Header>
                {#each $headerRows as headerRow (headerRow.id)}
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Table.Head>
                                <Render of={cell.render()} />
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>

            <Table.Body>
                {#each $rows as row (row.id)}
                    <Table.Row id={row.id}>
                        {#each row.cells as cell (cell.id)}
                            <Table.Cell class={`h-16 align-top leading-6 ${cell.column.plugins?.appendToClass || ''}`}>
                                <Render of={cell.render()} />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
    <div class="flex items-center justify-between px-4">
        <div class="flex flex-1 items-center space-x-6 lg:space-x-8">
            <div class="flex items-center space-x-2">
                <p class="text-sm font-medium">Rows per page</p>
                <Select.Root
                    type="single"
                    value={perPage}
                    onValueChange={(newValue) => {
                        goto(`?page=${currentPage+1}&per_page=${newValue}`);
                    }}
                >
                    <Select.Trigger class="h-8 w-[70px]">
                        {perPage}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="10">10</Select.Item>
                        <Select.Item value="20">20</Select.Item>
                        <Select.Item value="30">30</Select.Item>
                        <Select.Item value="40">40</Select.Item>
                        <Select.Item value="50">50</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            <Pagination.Root
                count={data.sessions_count}
                page={currentPage}
                perPage={perPage}
                siblingCount={1}
            >
                {#snippet children({ pages, currentPage })}
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.PrevButton href={`?page=${currentPage-1}&per_page=${perPage}`} />
                        </Pagination.Item>
                        {#each pages as page (page.key)}
                            {#if page.type === "ellipsis"}
                                <Pagination.Item>
                                    <Pagination.Ellipsis />
                                </Pagination.Item>
                            {:else}
                                <Pagination.Item>
                                    <Pagination.Link
                                        {page}
                                        href={`?page=${page.value}&per_page=${perPage}`}
                                        isActive={currentPage === page.value}
                                    />
                                </Pagination.Item>
                            {/if}
                        {/each}
                        <Pagination.Item>
                            <Pagination.NextButton href={`?page=${currentPage+1}&per_page=${perPage}`} />
                        </Pagination.Item>
                    </Pagination.Content>
                {/snippet}
            </Pagination.Root>
        </div>
    </div>
</div>
