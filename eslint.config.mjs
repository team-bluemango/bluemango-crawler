import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";
import plugin from "@stylistic/eslint-plugin-js";

/** @type {import('stylistic').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.node } },
    {
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        rules: {
            "@stylistic/js/indent": ["error", 4],
        },
    },
    {},
];
