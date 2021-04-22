import { Component } from "react"
import Link from "next/link"
import { motion as Motion } from "framer-motion";
import MainLayout from "./main";
import { LgContainer, XxlContainer } from "pages/_container.mdx"
import PostsCards from "../components/posts-cards";

export default class PostLayout extends Component
{
    constructor(props) {
        super(props);
    }

    render()
    {
        return (
            <MainLayout>
                <div className="pb-8 md:pb-16">
                   <div className="lg:flex items-center lg:min-h-[40rem]">
                        <XxlContainer>
                        <div>
                            <div className="inline-block mb-8 lg:mb-16 border-b-4 border-secondary pl-2 pr-6 lg:pr-12">
                                <small className="text-sm leading-none">{this.props.meta.date}</small>
                            </div>
                        </div>

                        <Motion.h1
                            layoutId={`post-${this.props.meta.link}`}
                            className="!mb-4"
                        >{this.props.meta.title_short}</Motion.h1>

                        <p className="!my-0 !leading-none"><small>{ this.props.meta.description }</small></p>

                        <hr className="md:w-[90%] ml-auto !mb-0 !border-t-4 !border-secondary" />

                        <div className="md:text-right">
                            <Link href="/blog"><a className="text-sm opacity-80 hover:opacity-100 focus:opacity-100">Back to posts</a></Link>
                        </div>
                    </XxlContainer>
                   </div>
                </div>

                <div className="pb-8 md:pb-16">
                    <LgContainer>
                        {this.props.children}
                    </LgContainer>
                </div>

                <XxlContainer>

                    <hr className="!mb-0 !border-t-4 !border-secondary" />

                    <div className="md:text-right">
                        <Link href="/blog"><a className="text-sm opacity-80 hover:opacity-100 focus:opacity-100">Back to posts</a></Link>
                    </div>

                    <h2>Read more posts...</h2>

                    <PostsCards limit={3} isAnimated={false} excludeLink={this.props.meta.link} />

                </XxlContainer>
            </MainLayout>
        )
    }
}
