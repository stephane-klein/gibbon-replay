<script>
import { Pagination as PaginationPrimitive } from "bits-ui";
import ChevronRight from "@lucide/svelte/icons/chevron-right";
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
                class: "gap-1 pr-2.5",
            }),
            className
        )}
    >
        <span class="hidden sm:block">Next</span>
        <ChevronRight class="size-4" />
    </Button>
{/snippet}

<PaginationPrimitive.NextButton
    bind:ref
    child={child || Fallback}
    {...restProps}
/>
