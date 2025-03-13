<script>
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
    <Card.Root class="mx-auto max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
        </Card.Header>
        <Card.Content>
            <form method="POST">
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="username">Username</Label>
                        <Input name="username" id="username" type="username" placeholder="admin" required />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                        </div>
                        <Input name="password" id="password" type="password" required />
                    </div>
                    <Button type="submit" class="w-full">Login</Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
</div>
