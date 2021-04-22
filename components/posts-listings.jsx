import { Component } from "react"
import { motion as Motion } from "framer-motion";
import Link from 'next/link'

export default class PostsListings extends Component
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

        let isMoreToShow = false;


        if (this.props?.limit !== null){
            isMoreToShow = this.props?.limit < posts.length;
            posts = posts.slice(0, this.props?.limit)
        }

        const postsJSX = posts.length ? (<div className="flex flex-wrap -mx-2">
            {
                posts.map((post, index) => {
                    const {link, meta} = post

                    return <article key={link} className={`w-full mb-4`}>
                        <div className="relative">
                            <Link href={link}>
                                 <a className="link-simple">
                                     <Motion.h2
                                        layoutId={this.props.isAnimated === false ? null : `post-${link}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0 }}
                                        className="!text-primary !mb-0"
                                    >{ meta?.title_short ?? 'No article title??' }</Motion.h2>
                                 </a>
                            </Link>
                            <small className="text-sm leading-none text-heading opacity-90">{meta.date}</small>
                            <p>{ meta?.description }</p>
                        </div>
                    </article>
                })
            }
        </div>) : null

        return (
            <div className="pb-8">
                {
                    posts.length === 0 ? <p className="text-base">Uh oh, no more posts to show!</p>:``
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