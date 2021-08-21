import {Component} from "react"
import Link from "next/link"

export default class Cookies extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            isCookiesEnabled: ( JSON.parse(process.browser ? localStorage.getItem("isCookiesEnabled") : null) ) ?? true,
            isCookieMessageDismissed: ( JSON.parse(process.browser ? localStorage.getItem("isCookieMessageDismissed") : null) ) ?? false,
        };

        // lets be the 0.01% of websites that respects the doNotTrack browser signal
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
        if (process.browser && navigator && navigator.doNotTrack && navigator.doNotTrack === "1"){
            this.state.isCookiesEnabled = false;
            this.state.isCookiesMessageDismissed = true;
        }

        this.dismissCookies = this.dismissCookies.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext)
    {
        if (process.browser){
            localStorage.setItem("isCookiesEnabled", JSON.stringify(nextState.isCookiesEnabled))
            localStorage.setItem("isCookieMessageDismissed", JSON.stringify(nextState.isCookieMessageDismissed))
        }

        return true
    }

    dismissCookies()
    {
        // Allow button press animation to happen
        return new Promise(resolve => {
            setTimeout(() => {
                this.setState(state => {
                    resolve()
                    return {
                        ...state,
                        isCookieMessageDismissed: true,
                    }
                })
            }, 150)
        })
    }

    toggleCookies(isCookiesEnabled)
    {
        this.setState(state => {
            return {
                ...state,
                isCookiesEnabled: isCookiesEnabled,
            }
        })
    }

    render()
    {
        const cookiesMessage = (
            <div className="flex flex-wrap justify-center items-center lg:space-x-4 py-8">
                <div className="lg:inline-block rounded-lg shadow px-6 py-4 text-xs mb-4">
                    <div>
                        {
                            this.state.isCookiesEnabled ?
                                <div>I use cookies to <Link href="/cookies-and-privacy"><a>anonymously see</a></Link> who my general audience is over time.</div>
                                :
                                <div>Cookies disabled. Please consider enabling them to <Link href="/cookies-and-privacy"><a>help me</a></Link> know my audience better.</div>
                        }
                    </div>
                    <div>
                         {
                            this.state.isCookiesEnabled ? (
                                <div className="pt-1">
                                    <button
                                        className="whitespace-nowrap text-secondary text-xs hover:underline focus:underline"
                                        onClick={() => {this.toggleCookies(false)}}
                                    >
                                        No thanks
                                    </button>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                <button
                    className="whitespace-nowrap bg-secondary text-white mb-4 px-4 py-2 rounded-full text-xs hover:shadow focus:shadow-inner"
                    onClick={() => {
                        this.dismissCookies().then(() => {
                            this.toggleCookies(true)
                        })
                    }}
                >
                    { this.state.isCookiesEnabled ? "That's cool" : "Enable cookies" }
                </button>
            </div>
        )

        return this.state.isCookieMessageDismissed === true ? null : cookiesMessage
    }
}