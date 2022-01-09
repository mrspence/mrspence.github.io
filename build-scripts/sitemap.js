const fs = require('fs')

const baseUrl = {
    development: "http://localhost:3000",
    production: "https://matt-spence.com",
}[process.env.NODE_ENV]

if (typeof baseUrl === 'undefined') {
    throw new Error('NODE_ENV is not set')
}

// get base/root directory
const baseDir = (process.cwd() + "").replace(/\/$/, '') + "/"

const fileSourcesForPages = [
    ...fs.readdirSync(baseDir + "pages").map(path => `pages/${path}`),
    ...fs.readdirSync(baseDir + "pages/writing").map(path => `pages/writing/${path}`),
]

const staticPages = fileSourcesForPages.filter((filePath) => {

    if (fs.lstatSync(filePath).isDirectory()){
        return false;
    }

    if (!filePath.match(/\.mdx$/)){
        return false;
    }

    return filePath !== "pages/_container.mdx";


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

// Write the sitemap to the file system and overwrite the existing file.
// Fail if `/out` does not exist.
fs.writeFileSync(baseDir + "out/sitemap.xml", sitemap)

console.log("Exported sitemap.xml successful. Written to " + baseDir + "out/sitemap.xml")