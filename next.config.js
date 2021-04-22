const remarkSlugs = require('remark-slug');
const rehypeHtml = require('rehype-stringify');

const withMDX = require('@next/mdx')({
    extension: /\.mdx$/,
    options: {
        remarkPlugins: [remarkSlugs],
        rehypePlugins: [rehypeHtml],
    },
})

module.exports = withMDX({
    pageExtensions: ['js', 'jsx', 'mdx'],
})
