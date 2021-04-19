import { Component } from "react"
import Theme from "components/theme"

export default class MainLayout extends Component
{
    render()
    {
        return (
            <div>
                <header className="container mx-auto flex justify-between py-12 p-4">
                    <a href="/" className="link-simple font-bold text-secondary">
                        <img className={"inline-block w-[2rem] mr-[0.5rem] rounded-full"} src="/images/profile.jpg" alt="Matt Spence profile image"/>
                        <span className={`text-heading`}>Matthew</span> Spence
                    </a>

                    <div className="flex items-center">
                        <nav className="space-x-4 mr-6">
                            <a className="link-simple" href="/"><span className="font-bold text-heading">01.</span> Home</a>
                            <a className="link-simple" href="/blog"><span className="font-bold text-heading">02.</span> Writing</a>
                            <a className="link-simple" href="/contact"><span className="font-bold text-heading">03.</span> Contact</a>
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
