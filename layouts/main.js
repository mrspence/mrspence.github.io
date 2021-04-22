import { Component } from "react"
import Link from 'next/link'
import Theme from "components/theme"

export default class MainLayout extends Component
{
    render()
    {
        return (
            <div>
                <header className="container max-w-5xl mx-auto flex justify-between items-center py-12 p-4">
                    <Link href="/">
                        <a className="inline-block relative font-bold text-secondary ml-10">
                            <img className={"absolute top-0 left-0 inline-block w-[2rem] rounded-full transform -translate-y-1 -translate-x-10"} src="/images/profile.jpg" alt="Matt Spence profile image"/>
                            <span className={`text-heading`}>Matthew</span> Spence
                        </a>
                    </Link>

                    <div className="flex items-center">
                        <nav className="space-x-4 mr-6">
                            <Link href="/">
                                <a className=""><span className="font-bold text-heading">01.</span> Home</a>
                            </Link>
                            <Link href="/blog">
                                <a className=""><span className="font-bold text-heading">02.</span> Writing</a>
                            </Link>
                            <Link href="/contact">
                                <a className=""><span className="font-bold text-heading">03.</span> Contact</a>
                            </Link>
                        </nav>

                        <Theme/>
                    </div>
                </header>

                <main>
                    {this.props.children}
                </main>

                <footer>

                </footer>
            </div>
    );
    }
}
