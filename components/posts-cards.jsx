import { Component } from "react"
import { motion as Motion } from "framer-motion";
import Link from 'next/link'

export default class PostsCards extends Component
{
    constructor(props) {
        super(props);
    }

    importAll(r) {
        return r.keys().map((fileName) => {
            const mod = r(fileName)
            return {
            link: mod.meta.link,
            meta: mod.meta,
            module: mod,
        }
        });
    }

    render()
    {
        let posts = this.importAll(require.context("pages/blog", true, /\.mdx$/)).filter(post => post.link !== this.props?.excludeLink)

        posts.sort((a, b) => {
            return a.link > b.link ? -1 : 1
        })

        let isMoreToShow = false

        // if the limit prop is set, apply limit and enable "show more blog posts" link
        if (this.props?.limit !== null){
            isMoreToShow = this.props?.limit < posts.length
            posts = posts.slice(0, this.props?.limit)
        }

        const postsJSX = posts.length ? (<div className="flex flex-wrap -mx-2">
            {
                posts.map((post, index) => {
                    const {link, meta} = post

                    return <article key={link} className={`card w-full md:max-w-sm mx-2 mb-4`}>
                        <Link href={link}>
                             <a className="link-card"><span className="sr-only">Read more {meta?.title_short}</span></a>
                        </Link>
                        <div className="card-content min-h-full flex flex-col justify-between overflow-hidden" style={{backgroundColor: meta?.backgroundColor}}>
                            <Motion.h3
                                layoutId={this.props.isAnimated === false ? null : `post-${link}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0 }}
                                className="!text-white"
                            >{ meta?.title_short ?? 'No article title??' }</Motion.h3>
                            <p className="text-white text-base">{ meta?.description }</p>
                        </div>
                    </article>
                })
            }
        </div>) : null

        return (
            <div className="pb-8">
                {
                    posts.length === 0 ? <p className="text-base">Uh oh, no more posts to show!</p> : ``
                }
                {
                    postsJSX
                }
                {
                    isMoreToShow ? <Link href="/blog"><a className="link-simple text-base text-primary">View more posts...</a></Link> : null
                }
            </div>
        )
    }
}