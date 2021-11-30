import { Component } from "react"
import Link from "next/link"
import Icon from "@mdi/react"
import Head from "next/head"
import withRouter from "next/router"
import {mdiClose, mdiGithub, mdiInstagram, mdiLinkedin, mdiMenu, mdiPhone, mdiTwitter} from "@mdi/js"
import Theme from "components/theme"

export default class MainLayout extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            router: withRouter,
            isMobileNavigationVisible: false,
        };
    }

    getOrganisationSchema(router)
    {
        return JSON.stringify( {
            "@content": "//schema.org",
            "@type": "Organisation",
            url: process.browser ? `//${location.host}` : null,
            name: "Matthew Spence",
            founder: "Matthew Spence",
        });
    }

    setIsMobileNavigationVisible(isMobileNavigationVisible)
    {
        this.setState(state => {
            return {
                ...state,
                isMobileNavigationVisible: isMobileNavigationVisible,
            }
        })
    }

    render()
    {
        const currentRoute = withRouter;

        return (
            <div>
                {/*TODO: tech. debt: refactor, quite ugly atm and hard to read/understand*/}
                <Head>
                    <title>{ this.props.meta.title }</title>
                    <meta name="author" content="Matthew Spence" />
                    {
                        this.props.meta.description ? <meta name="description" content={ this.props.meta.description } /> : null
                    }
                    <meta name="og:title" content={this.props.meta.og_title ? this.props.meta.og_title : this.props.meta.title} />
                    <meta name="twitter:title" content={this.props.meta.og_title ? this.props.meta.og_title : this.props.meta.title} />
                    {
                        this.props.meta.description ? <meta name="og:description" content={ this.props.meta.description } /> : null
                    }
                    {
                        this.props.meta.description ? <meta name="twitter:description" content={ this.props.meta.description } /> : null
                    }
                    {
                        this.props.meta.image ? <meta name="og:image" content={this.props.meta.image} /> : null
                    }

                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link rel="preload" as="style" href="//fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap" />

                    <link
                        media="print" onload="this.onload=null;this.removeAttribute('media');"
                        rel="stylesheet"
                        href="//fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"
                    />

                    <script type="application/ld+json">{ this.getOrganisationSchema(this.state.router) }</script>
                    {
                        this.props.meta.schema ? <script type="application/ld+json">{ this.props.meta.schema(this.state.router) }</script> : null
                    }
                </Head>

                <header className="container max-w-5xl mx-auto flex justify-between items-center py-12 p-4">
                    <Link href="/">
                        <a className="inline-block relative font-bold text-secondary ml-10 text-sm md:text-base">
                            <img className={"absolute top-0 left-0 inline-block w-[2rem] rounded-full transform -translate-y-1 -translate-x-10"} src="/images/profile.jpg" alt="Matt Spence profile image"/>
                            <span className={`text-heading`}>Matthew</span> Spence
                        </a>
                    </Link>

                    <div
                        className="flex items-center"
                    >
                        <nav
                            className={
                                "fixed md:relative top-0 left-0 w-full h-full md:w-auto md:h-auto bg-background md:bg-transparent flex flex-col justify-center items-center md:block space-y-6 md:space-y-0 md:space-x-4 mr-6 z-50 " +
                                ( this.state.isMobileNavigationVisible ? "" : "!hidden md:!block" )
                            }
                        >
                            <Link href="/">
                                <a className="text-xl md:text-base"><span className="font-bold text-heading">01.</span> Home</a>
                            </Link>
                            <Link href="/blog">
                                <a className="text-xl md:text-base"><span className="font-bold text-heading">02.</span> Writing</a>
                            </Link>
                            <Link href="/contact">
                                <a className="text-xl md:text-base"><span className="font-bold text-heading">03.</span> Contact</a>
                            </Link>
                            <button
                                className="md:hidden mt-8 text-center"
                                onClick={() => {this.setIsMobileNavigationVisible(false)}}
                            >
                                <Icon size={1} path={mdiClose} className="inline-block" />
                                <div>
                                    Close Menu
                                </div>
                            </button>
                        </nav>

                        <button
                            className="md:hidden mx-1 px-3 py-2"
                            title="Main Menu"
                            onClick={() => {this.setIsMobileNavigationVisible(true)}}
                        >
                            <Icon size={1} path={mdiMenu} />
                        </button>

                        <Theme/>
                    </div>
                </header>

                <main>
                    {this.props.children}
                </main>

                <footer className="border-t-2 pb-20">
                    <div className="flex flex-col xl:flex-row flex-wrap justify-between items-center xl:items-start max-w-5xl mx-auto px-4 py-10">
                        <div className="w-full xl:w-1/2 pb-6 flex flex-wrap justify-center xl:justify-start items-start -mx-2">
                            <Link href="/">
                                <a className="mx-2 mb-4 text-base">Home</a>
                            </Link>
                            <Link href="/contact">
                                <a className="mx-2 mb-4 text-base"><Icon path={mdiPhone} size="1em" className="inline-block"/> Get in touch</a>
                            </Link>
                            <Link href="/cookies-and-privacy">
                                <a className="mx-2 mb-4 text-base">Cookies & Privacy</a>
                            </Link>
                        </div>

                        <div className="w-full xl:w-1/2 ml-auto pb-6 flex flex-wrap justify-center xl:justify-end items-start -mx-2">
                            <Link href="https://twitter.com/mrspencehimself">
                                <a
                                    className="mx-2 mb-4 text-base"
                                    target="_blank"
                                ><Icon path={mdiTwitter} className="inline-block w-8 h-8 xl:w-4 xl:h-4" /><span className="hidden xl:inline-block"> Twitter</span></a>
                            </Link>
                            <Link href="https://instagram.com/mrspencehimself">
                                <a
                                    className="mx-2 mb-4 text-base"
                                    target="_blank"
                                ><Icon path={mdiInstagram} className="inline-block w-8 h-8 xl:w-4 xl:h-4" /><span className="hidden xl:inline-block"> Instagram</span></a>
                            </Link>
                            <Link href="https://www.linkedin.com/in/real-matthew-spence">
                                <a
                                    className="mx-2 mb-4 text-base"
                                    target="_blank"
                                ><Icon path={mdiLinkedin} className="inline-block w-8 h-8 xl:w-4 xl:h-4" /><span className="hidden xl:inline-block"> LinkedIn</span></a>
                            </Link>
                            <Link href="https://github.com/mrspence">
                                <a
                                    className="mx-2 mb-4 text-base"
                                    target="_blank"
                                ><Icon path={mdiGithub} className="inline-block w-8 h-8 xl:w-4 xl:h-4" /><span className="hidden xl:inline-block"> Github</span></a>
                            </Link>
                        </div>

                        <small className="w-full xl:w-auto xl:ml-auto pb-6 text-heading max-w-xs py-1 text-center xl:text-right">
                            Website content is <span className="whitespace-nowrap">Copyright &copy; 2020 - { (new Date).getFullYear() }.</span>
                            <br/>
                            All rights reserved.
                        </small>
                    </div>
                </footer>
            </div>
    );
    }
}
