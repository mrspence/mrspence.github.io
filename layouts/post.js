import { Component } from "react"
import Link from "next/link"
import { motion as Motion } from "framer-motion";
import MainLayout from "./main";
import { XlContainer, XxlContainer } from "pages/_container.mdx"
import PostsCards from "../components/posts-cards";
import Cookies from "components/cookies"

export default class PostLayout extends Component
{
    constructor(props) {
        super(props);
        this.getArticleSchema = this.getArticleSchema.bind(this)
    }

    getArticleSchema(router)
    {
        if (!process.browser){
            return null;
        }

        const pathname = router.router.pathname
        const url = `//${location.host}${pathname}`

        return JSON.stringify({
            "@content": "//schema.org",
            "@type": "Article",
            url,
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": url,
            },
            image: [this.props.meta.image,],
            headline: this.props.meta.title,
            description: this.props.meta.description,
            datePublished: this.props.meta.publishedAt,
            dateModified: this.props.meta.publishedAt,
            author: {
                "@type": "Person",
                name: "Matthew Spence",
            },
            publisher: {
                "@type": "Organization",
                name: "Matthew Spence",
            },
        })
    }

    render()
    {
        const meta = {
            ...this.props.meta,
            schema: this.getArticleSchema,
        }

        return (
            <MainLayout meta={meta} className="blog-post">
                <div className="pb-8 md:pb-16">
                   <div className="lg:flex items-center">
                        <XlContainer>
                            <div>
                                <div className="inline-block mb-8 lg:mb-16 border-b-4 pl-2 pr-6 lg:pr-12" style={{ borderColor: this.props.meta.borderColor }}>
                                    <small className="text-sm leading-none">{this.props.meta.date}</small>
                                </div>
                            </div>

                            <Motion.h1
                                layoutId={`post-${this.props.meta.link}`}
                                className="!mb-4"
                            >{this.props.meta.title_short}</Motion.h1>

                            <p className="!my-0 !leading-none"><small>{ this.props.meta.description }</small></p>

                            <hr className="md:w-[90%] ml-auto !mb-0 !border-t-4" style={{ borderColor: this.props.meta.borderColor }} />

                            <div className="md:text-right">
                                <Link href="/blog"><a className="text-sm opacity-80 hover:opacity-100 focus:opacity-100">Back to posts</a></Link>
                            </div>
                        </XlContainer>
                   </div>
                </div>

                <div className="pb-8 md:pb-16">
                    <XlContainer>
                        {this.props.children}
                    </XlContainer>
                </div>

                <XlContainer>

                    <hr className="!mb-0 !border-t-4" style={{ borderColor: this.props.meta.borderColor }} />

                    <div className="md:text-right">
                        <Link href="/blog"><a className="text-sm opacity-80 hover:opacity-100 focus:opacity-100">Back to posts</a></Link>
                    </div>

                    <h2>Read more posts...</h2>

                    <PostsCards limit={3} isAnimated={false} excludeLink={this.props.meta.link} />

                </XlContainer>
            </MainLayout>
        )
    }
}
