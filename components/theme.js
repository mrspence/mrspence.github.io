import { Component, createRef } from "react"
import Icon from '@mdi/react'
import { mdiPaletteOutline } from '@mdi/js'
import themes from "../config/themes.json"

export default class Theme extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            isPickingTheme: false,
            currentTheme: Object.keys(themes)[0],
            themes: themes,
        };
        this.themeRef = createRef();
        this.toggleThemePicker = this.toggleThemePicker.bind(this)
        this.handleClickOutsideHideThemePicker = this.handleClickOutsideHideThemePicker.bind(this)
    }

    componentDidMount()
    {
        this.updateBodyClassName(this.state.currentTheme)
        if (process.browser){
            document.addEventListener('mousedown', this.handleClickOutsideHideThemePicker);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutsideHideThemePicker);
    }

    toggleThemePicker()
    {
        this.setState(state => {
            return {
                ...state,
                isPickingTheme: !state.isPickingTheme,
            }
        })
    }

    handleClickOutsideHideThemePicker(event) {
        if (this.themeRef && !this.themeRef.current.contains(event.target)) {
            this.setState(state => {
            return {
                ...state,
                isPickingTheme: false,
            }
        })
        }
    }

    updateBodyClassName(newTheme)
    {
        this.setState(state => {
            if (process.browser){
                document.body.classList.remove("theme-" + state.currentTheme)
                document.body.classList.add("theme-" + newTheme)
            }

            return {
                ...state,
                currentTheme: newTheme,
                isPickingTheme: false,
            }
        })
    }

    render()
    {
        return (
            <div ref={this.themeRef}>
                {/* Render theme styles in head */}
                {
                    Object.keys(this.state.themes).map((themeName) => {

                        const theme = this.state.themes[themeName];

                        const styleRules = Object.keys(theme).map(cssVariableName => {
                            const value = theme[cssVariableName]
                            return `${cssVariableName}: ${value};`;
                        }).join("");

                        return <div key={themeName}>
                            <style global jsx>{
                                 `body.theme-${themeName} {
                                    ${styleRules}
                                }`
                            }</style>
                        </div>
                    })
                }
                {/* Render inline theme changer */}
                <div className={`relative`}>
                    <button className={'relative rounded-full text-heading p-3 !outline-none ' + (this.state.isPickingTheme ? `shadow-inner`:`shadow`)} onClick={this.toggleThemePicker}>
                        <Icon size={1} path={mdiPaletteOutline} />
                    </button>

                    <div
                        className={this.state.isPickingTheme ? `flex flex-col items-center absolute bottom-0 right-0 min-w-full transform translate-y-full pt-3 -mb-3 z-10` : `hidden`}
                    >
                        {
                        Object.keys(this.state.themes).map((themeName) => {

                                const _themeName = themeName;
                                const theme = this.state.themes[themeName];

                                return <button
                                    key={themeName}
                                    className="block w-6 h-6 rounded-full border border-dashed border-copy shadow mb-3"
                                    style={{ backgroundColor: theme['--color-main'] }}
                                    onClick={() => this.updateBodyClassName(_themeName)}
                                >
                                    <span className="sr-only">{themeName}</span>
                                </button>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}