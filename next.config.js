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

    pageExtensions: ['js', 'jsx', 'mdx'],

    assetPrefix: '/',

    webpack(config)
    {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        })

        return config
    },

    publicRuntimeConfig: {
        urlNoCorsProxy: "https://api.allorigins.win/get?url=",
        urlMediumRSSFeed: "https://medium.com/feed/@mrspencehimself",
    }

    // i18n: {
    //     locales: ["en-GB"],
    //     defaultLocale: "en-GB",
    // },
})
