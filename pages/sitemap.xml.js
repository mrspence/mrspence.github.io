import React from "react"
import fs from "fs"

const Sitemap = ({sitemap}) => {
    return sitemap
}

export const getStaticProps = async function()
{

    const baseUrl = {
        development: "http://localhost:3000",
        production: "https://matt-spence.com",
    }[process.env.NODE_ENV]

    const fileSourcesForPages = [
        ...fs.readdirSync("pages").map(path => `pages/${path}`),
        ...fs.readdirSync("pages/writing").map(path => `pages/writing/${path}`),
    ]

    const staticPages = fileSourcesForPages.filter((filePath) => {

        if (fs.lstatSync(filePath).isDirectory()){
            return false;
        }

        if (!filePath.match(/\.mdx$/)){
            return false;
        }

        if (filePath === "pages/_container.mdx"){
            return false
        }

        return true;
    })
    .map((filePath) => { // map filepath to url
        let validUrlPath = filePath.replace(/^pages\//, "")
        validUrlPath = validUrlPath.replace(/\.mdx$/, "")
        validUrlPath = validUrlPath === "index" ? "" : validUrlPath
        return `${baseUrl}/${validUrlPath}`.replace(/\/$/, "")
    })
    .sort()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticPages
                .map((url) => {
                    return `
                    <url>
                    <loc>${url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>${ baseUrl === url ? '1.0':'0.9' }</priority>
                    </url>
                    `
                })
                .join("")
            }
        </urlset>
    `

    return {
        props: {
            sitemap,
        },
    }
}

export default Sitemap