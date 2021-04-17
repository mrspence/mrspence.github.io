import { Component} from "react"

export default class MainLayout extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            currentTheme: "theme-light",
        }
        this.handleToggleThemeClick = this.handleToggleThemeClick.bind(this)
    }

    isThemeLight(theme){
        return theme === "theme-light";
    }

    handleToggleThemeClick()
    {
        this.setState(state => {
            return {
                ...state,
                currentTheme: ( this.isThemeLight(state.currentTheme) ) ? 'theme-dark' : 'theme-light'
            }
        })
    }

    render(children)
    {
        const toggleThemeButtonEmoji = this.isThemeLight(this.state.currentTheme) ? '🌘' : "☀"

        return (
            <div className={"theme " + this.state.currentTheme}>
                <header className="container mx-auto flex justify-between p-4">
                    <div>
                        <img className={"inline-block w-[2rem] mr-[0.5rem]"} src="/images/profile.jpg" alt="Matt Spence profile image"/>
                        Matthew Spence
                    </div>
                    <div>
                        <button
                            className={'rounded-full w-[1rem] h-[1rem]'}
                            onClick={this.handleToggleThemeClick}
                        >
                            {toggleThemeButtonEmoji}
                        </button>
                    </div>

                </header>
                {children}
            </div>
    );
    }
}
