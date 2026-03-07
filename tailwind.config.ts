import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-color)",
                foreground: "var(--text-primary)",
                primary: "var(--primary-color)",
                accent: "var(--accent-color)"
            },
        },
    },
    plugins: [],
};
export default config;
