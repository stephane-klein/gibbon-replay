import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default [
    js.configs.recommended,
    ...svelte.configs.recommended,
    {
        ignores: [
            ".DS_Store",
            "node_modules/*",
            "/build/*",
            ".svelte-kit/*",
            "pnpm-lock.yaml"
        ]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
    },
    {
        files: [
            "src/**/*.svelte",
            'src/**/*.svelte.js'
        ],
        languageOptions: {
            parserOptions: {
                svelteConfig
            }
        }
    },
    {
        rules: {
            semi: "error",
            "array-callback-return": ["error"],
            "no-useless-concat": ["error"],
            "space-before-function-paren": ["error", "never"],
            "no-duplicate-imports": ["error"],
            "no-irregular-whitespace": "off",
            "svelte/a11y-no-static-element-interactions": "off",
            "svelte/no-at-html-tags": "off",
            "svelte/a11y-missing-attribute": "off"
        }
    }
];
