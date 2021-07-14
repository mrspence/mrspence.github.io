import {Component} from "react"
import {motion as Motion} from "framer-motion";
import Link from 'next/link'

export default class PostsListings extends Component
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

        if (posts.length === 0){
            return (<div/>);
        }

        posts.sort((a, b) => {
            return a.link > b.link ? -1 : 1
        })

        let isMoreToShow = false;


        if (this.props?.limit !== null){
            isMoreToShow = this.props.limit < posts.length;
            posts = posts.slice(0, this.props.limit)
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
                            <div>
                                <small className="text-sm leading-none text-heading opacity-90">{meta.date}</small>
                            </div>
                            <p>{ meta?.description }</p>
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