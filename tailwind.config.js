module.exports = {
    mode: 'jit',
    purge: [
        './layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: true, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
                background: "var(--color-background)",
                copy: "var(--color-copy)",
                heading: "var(--color-heading)",
                faint: "var(--color-faint)"
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}