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

    const gradients = [
        'linear-gradient(10deg, rgba(255, 51, 95, 1) 40%, rgb(255 51 117))',
        'linear-gradient(10deg, rgb(67, 169, 163) 60%, rgb(86, 215, 161))',
        'linear-gradient(10deg, rgba(10, 12, 18, 1) 60%, rgb(53, 56, 66))',
        'linear-gradient(10deg, rgba(48, 152, 237, 1) 60%, rgb(48, 193, 237))',
    ];

    return {
        mediumPosts: posts.map((mediumPost, index) => {
            return {
                link: mediumPost.link,
                number: "Medium",
                meta: {
                    title_short: mediumPost.title,
                    description: "",
                    publishedAt: mediumPost['atom:updated'],
                    background: gradients[index % gradients.length],
                },
            };
        }),
    };
}