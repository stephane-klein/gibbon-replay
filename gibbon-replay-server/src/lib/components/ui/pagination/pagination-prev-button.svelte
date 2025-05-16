<script>
import { Pagination as PaginationPrimitive } from "bits-ui";
import ChevronLeft from "@lucide/svelte/icons/chevron-left";
import { buttonVariants, Button } from "$lib/components/ui/button/index.js";
import { cn } from "$lib/utils.js";

let { ref = $bindable(null), class: className, child, href, ...restProps } = $props();
</script>

{#snippet Fallback({props})}
    <Button
        variant="ghost"
        data-sveltekit-replacestate
        href={props.disabled ? null : href }
        disabled={props.disabled}
        class={cn(
            buttonVariants({
                variant: "ghost",
                class: "gap-1 pl-2.5",
            }),
            className
        )}
    >
        <ChevronLeft class="size-4" />
        <span class="hidden sm:block">Previous</span>
    </Button>
{/snippet}

<PaginationPrimitive.PrevButton
    bind:ref
    child={child || Fallback}
    {...restProps}
/>
