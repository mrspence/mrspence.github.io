import {Component} from "react"
import {motion as Motion} from "framer-motion";
import Link from 'next/link'

export default class PostsCards extends Component
{
    constructor(props)
    {
        super(props);
    }

    importAll(r)
    {
        return r.keys().map((filename, index) => {
            const mod = r(filename)
            return {
                number: index + 1,
                link: filename.replace(/^\.\//, '/writing/').replace(/\.mdx$/, ''),
                meta: mod.meta,
                module: mod,
            }
        });
    }

    render()
    {
        /**
         * NOTE: when using webpack 5, you _must_ match on the `./` at the beginning
         * of the filename, otherwise webpack will output duplicate filepaths
         * @see: https://github.com/webpack/webpack/issues/12087
         */
        let posts = this.importAll(require.context("./../pages/writing", true, /\.\/.*\.mdx$/)).filter(post => post.link !== this.props?.excludeLink)

        posts = posts.concat(this.props.mediumPosts || []);

        if (posts.length === 0){
            return (<div/>);
        }

        posts.sort((a, b) => {
            return new Date(a.meta.publishedAt) > new Date(b.meta.publishedAt) ? -1 : 1
        })

        let isMoreToShow = false

        // if the limit prop is set, apply limit and enable "show more blog posts" link
        if (this.props?.limit !== null){
            isMoreToShow = this.props.limit < posts.length
            posts = posts.slice(0, this.props.limit)
        }

        const postsJSX = posts.length ? (<div className="flex flex-wrap">
            {
                posts.map((post, index) => {

                    const {link, meta, number} = post

                    return <article key={link} className={`card w-full md:max-w-sm mx-2 mb-4`}>
                        <Link href={link}>
                             <a target="_blank" className="link-card"><span className="sr-only">Read more {meta?.title_short}</span></a>
                        </Link>
                        <div className="card-content min-h-full flex flex-col justify-between overflow-hidden" style={{background: meta?.background}}>
                            <Motion.h3
                                layoutId={this.props.isAnimated === false ? null : `post-${link}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0 }}
                                className="!text-white !mt-0"
                            >{ meta?.title_short ?? 'No article title??' }</Motion.h3>

                            <small className="text-white opacity-90">
                                <span className="text-sm !text-white opacity-75 leading-none">Featured on</span> { (new URL(link)).host }
                            </small>
                        </div>
                    </article>
                })
            }
        </div>) : null

        return (
            <div className="pb-8">
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