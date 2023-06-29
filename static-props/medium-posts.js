import getConfig from 'next/config'
const XmlParser = require("fast-xml-parser")
const { publicRuntimeConfig } = getConfig()

const generatePost = (link, number, titleShort, description, publishedAt) => ({
    link,
    number,
    meta: {
        title_short: titleShort,
        description,
        publishedAt,
    }
})

export default async function getStaticProps()
{
    console.log("Fetching Medium posts...");

    let posts = []

    if (process.env.NODE_ENV === "production") {
        let response = await fetch(publicRuntimeConfig.urlNoCorsProxy + encodeURIComponent(publicRuntimeConfig.urlMediumRSSFeed))

        if (!response.ok){
            console.error("Unable to fetch Medium posts");
            return;
        }

        const json = await response.json();
        const rssXml = json.contents;

        const rssJson = XmlParser.parse(rssXml, {}, true)

        posts = Array.isArray(rssJson.rss.channel.item) === false ? [rssJson.rss.channel.item] : rssJson.rss.channel.item;

        posts = posts.map((mediumPost, index) => generatePost(mediumPost.link, "Medium", mediumPost.title, "", mediumPost['pubDate']));
    }
    else {
        posts = [
            generatePost("http://matt-spence.com/#", "Medium", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "", (new Date).toISOString()),
            generatePost("http://matt-spence.com/#", "Medium", "Nulla nec augue ac lacus fermentum faucibus.", "", (new Date).toISOString()),
            generatePost("http://matt-spence.com/#", "Medium", "Sed vulputate mauris non libero molestie tincidunt.", "", (new Date).toISOString()),
            generatePost("http://matt-spence.com/#", "Medium", "Praesent at felis a eros auctor lacinia.", "", (new Date).toISOString()),
            generatePost("http://matt-spence.com/#", "Medium", "Donec auctor mi sit amet ligula euismod, ac scelerisque lorem commodo.", "", (new Date).toISOString()),
            generatePost("http://matt-spence.com/#", "Medium", "Vestibulum consequat ipsum a semper eleifend.", "", (new Date).toISOString()),
        ]
    }

    // Make sure sorted by date
    posts.sort((a, b) => {
        return new Date(a.meta.publishedAt) > new Date(b.meta.publishedAt) ? -1 : 1
    })

    console.log(`Found ${posts.length} Medium posts! Latest post: ${posts[0].title}`);

    const gradients = [
        'linear-gradient(10deg, rgba(255, 51, 95, 1) 40%, rgb(255 51 117))',
        'linear-gradient(10deg, rgb(67, 169, 163) 60%, rgb(86, 215, 161))',
        'linear-gradient(10deg, rgba(10, 12, 18, 1) 60%, rgb(53, 56, 66))',
        'linear-gradient(10deg, rgba(48, 152, 237, 1) 60%, rgb(48, 193, 237))',
    ];

    return {
        mediumPosts: posts.map((post, index) => {
            post.meta.background = gradients[index % gradients.length];
            return post;
        })
    };
}