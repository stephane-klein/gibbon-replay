<script>
import { Pagination as PaginationPrimitive } from "bits-ui";
import { cn } from "$lib/utils.js";
import { buttonVariants, Button } from "$lib/components/ui/button/index.js";

let {
    ref = $bindable(null),
    class: className,
    size = "icon",
    isActive = false,
    page,
    child,
    href,
    ...restProps
} = $props();
</script>

{#snippet Fallback({props})}
    <Button
        variant="ghost"
        data-sveltekit-replacestate
        href={props.disabled ? null : href }
        disabled={props.disabled}
        class={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className
        )}
    >
        {page.value}
    </Button>
{/snippet}

<PaginationPrimitive.Page
    bind:ref
    {page}
    child={child || Fallback}
    {...restProps}
/>
