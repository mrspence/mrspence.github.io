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
            container: {
                center: true,
                padding: '1rem',
            },
            colors: {
                transparent: "rgba(0, 0, 0, 0)",
                main: "var(--color-main)",
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
                background: "var(--color-background)",
                copy: "var(--color-copy)",
                heading: "var(--color-heading)",
                faint: "var(--color-faint)"
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.copy"),
                        a: {
                            color: theme("colors.copy")
                        },
                        h1: {
                            color: theme("colors.heading"),
                        },
                        h2: {
                            color: theme("colors.heading"),
                        },
                        h3: {
                            color: theme("colors.heading"),
                        },
                        h4: {
                            color: theme("colors.heading"),
                        },
                        h5: {
                            color: theme("colors.heading"),
                        },
                        h6: {
                            color: theme("colors.heading"),
                        },
                    }
                }
            }),
            boxShadow: {
                sm: '0 1px 2px 0 rgba(var(--shadow-rgb-raw), 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(var(--shadow-rgb-raw), 0.2), 0 1px 2px 0 rgba(var(--shadow-rgb-raw), 0.06)',
                md: '0 4px 6px -1px rgba(var(--shadow-rgb-raw), 0.2), 0 2px 4px -1px rgba(var(--shadow-rgb-raw), 0.06)',
                lg: '0 10px 15px -3px rgba(var(--shadow-rgb-raw), 0.2), 0 4px 6px -2px rgba(var(--shadow-rgb-raw), 0.05)',
                xl: '0 20px 25px -5px rgba(var(--shadow-rgb-raw), 0.2), 0 10px 10px -5px rgba(var(--shadow-rgb-raw), 0.04)',
                '2xl': '0 25px 50px -12px rgba(var(--shadow-rgb-raw), 0.25)',
                '3xl': '0 35px 60px -15px rgba(var(--shadow-rgb-raw), 0.3)',
                inner: 'inset 0 2px 4px 0 rgba(var(--shadow-rgb-raw), 0.06)',
                none: 'none',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
    ],
}