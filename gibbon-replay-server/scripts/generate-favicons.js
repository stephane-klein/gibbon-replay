#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { favicons } from "favicons";

const response = await favicons(
    "../assets/gibbon-replay-250x250.png",
    {
        path: "/",
        appName: "Gibbon Replay",
        developerName: "Stéphane Klein",
        developerURL: "https://sklein.xyz",
        lang: "en-US",
        background: "#fff",
        theme_color: "#fff",
        appleStatusBarStyle: "black-translucent",
        display: "standalone",
        scope: "/",
        icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            favicons: true,
            windows: false,
            yandex: false
        }
    }
);

const dest = "static/";

await fs.mkdir(dest, { recursive: true });
await Promise.all(
    response.images.map(
        async(image) =>
            await fs.writeFile(path.join(dest, image.name), image.contents),
    ),
);
await Promise.all(
    response.files.map(
        async(file) =>
            await fs.writeFile(path.join(dest, file.name), file.contents),
    ),
);
await fs.writeFile(path.join(dest, "../src/favicons.html"), response.html.join("\n"));

console.log("Next manual instruction: copy src/favicons.html content to src/app.html");
