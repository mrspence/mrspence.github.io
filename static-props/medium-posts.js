import getConfig from 'next/config'
const XmlParser = require("fast-xml-parser")
const { publicRuntimeConfig } = getConfig()

export default async function getStaticProps()
{
    console.log("Fetching Medium posts...");

    let response = await fetch(publicRuntimeConfig.urlNoCorsProxy + encodeURIComponent(publicRuntimeConfig.urlMediumRSSFeed))

    if (!response.ok){
        console.error("Unable to fetch Medium posts");
        return;
    }

    const json = await response.json();
    const rssXml = json.contents;

    const rssJson = XmlParser.parse(rssXml, {}, true)

    let posts = Array.isArray(rssJson.rss.channel.item) === false ? [rssJson.rss.channel.item] : rssJson.rss.channel.item;

    console.log(`Found ${posts.length} Medium posts! Latest post: ${posts[0].title}`);

    return {
        mediumPosts: posts.map(mediumPost => {
            return {
                link: mediumPost.link,
                number: "Medium",
                meta: {
                    title_short: mediumPost.title,
                    description: "",
                    publishedAt: mediumPost['atom:updated'],
                    background: "var(--color-primary)",
                },
            };
        }),
    };
}