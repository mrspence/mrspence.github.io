const remarkSlugs = require('remark-slug')
const rehypeHtml = require('rehype-stringify')

const withMDX = require('@next/mdx')({
    extension: /\.mdx$/,
    options: {
        remarkPlugins: [remarkSlugs],
        rehypePlugins: [rehypeHtml],
    },
})

module.exports = withMDX({
    future: {
        webpack5: true,
    },

    pageExtensions: ['js', 'jsx', 'mdx'],

    webpack(config)
    {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        })

        return config
    },

    i18n: {
        locales: ["en-GB"],
        defaultLocale: "en-GB",
    },
})
