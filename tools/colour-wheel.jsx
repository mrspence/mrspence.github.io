import {Component, createRef} from "react"
import {hsvToRgb} from "../shared/resources/hsvToRgb";

export default class ColourWheel extends Component
{
    constructor(props) {
        super(props);
        this.canvasRef = createRef()
        this.color1Ref = createRef()
        this.color2Ref = createRef()

        this.state = {
            convasContext: null,
            currentInteractingColor: null,
            isCanvasActive: false,
            isUserInteracting: false,

            color1: [348, 0.82, 0.95], // HSV/HSL
            color2: [156.70, 0.82, 0.95], // HSV/HSL
        }

        this.renderCanvas = this.renderCanvas.bind(this)
        this.windowResizeEvent = this.windowResizeEvent.bind(this)
        this.mouseDownChangeColor1Event = this.mouseDownChangeColor1Event.bind(this)
        this.mouseDownChangeColor2Event = this.mouseDownChangeColor2Event.bind(this)
        this.mouseUpChangeColorEvent = this.mouseUpChangeColorEvent.bind(this)
        this.mouseMoveChangeColorEvent = this.mouseMoveChangeColorEvent.bind(this)
        this.handleColorInputEvent = this.handleColorInputEvent.bind(this)
    }

    cartesianToPolar(x, y){
        const radialDistance = Math.sqrt(x * x + y * y)
        const angle = Math.atan2(y, x)
        return [radialDistance, angle]
    }

    radiansToDegrees(radians){
        return ( ( radians + Math.PI ) / ( 2 * Math.PI ) ) * 360
    }

    renderCanvas()
    {
        if (this.state.isCanvasActive && this.state.canvasContext !== null && this.canvasRef && this.canvasRef.current){

            // clear screen
            this.state.canvasContext.clearRect(0, 0, this.state.canvasContext.canvas.width, this.state.canvasContext.canvas.height)

            // give any shape or render a shadow
            this.state.canvasContext.shadowBlur = 3;
            this.state.canvasContext.shadowOffsetX = 2;
            this.state.canvasContext.shadowOffsetY = 2;
            this.state.canvasContext.shadowColor = "rgba(0, 0, 0, 0.2)";

            // draw circle
            const radius = this.state.canvasContext.canvas.width / 2
            let image = this.state.canvasContext.createImageData(this.state.canvasContext.canvas.width, this.state.canvasContext.canvas.height)
            let data = image.data

            const polarToCartesian = (radialDistance, angle) => {
                return [(radialDistance * Math.cos(angle)) + radius, (radialDistance * Math.sin(angle)) + radius]
            }

            for (let x = -radius; x < radius; x++){
                for (let y = -radius; y < radius; y++){
                    const [radialDistance, angle] = this.cartesianToPolar(x, y)

                    // as we're looping through radius x/y, skip coords that are outside the circle radius
                    if (radialDistance > radius){
                        continue
                    }

                    const angleDegrees = this.radiansToDegrees(angle)

                    const rowLength = 2 * radius
                    const adjustedX = x + radius // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    const adjustedY = y + radius // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    const pixelWidth = 4 // each pixel requires 4 slots in the data array
                    const index = ( adjustedX + ( adjustedY * rowLength ) ) * pixelWidth

                    const hue = angleDegrees // we want the angle to change the hue colour as you go around the circle
                    const saturation = radialDistance / radius // we want saturation to change based on distance from the center of the circle
                    const value = 0.95

                    const [red, green, blue] = hsvToRgb(hue, saturation, value)
                    const alpha = 255

                    data[index] = red
                    data[index + 1] = green
                    data[index + 2] = blue
                    data[index + 3] = alpha
                }
            }

            this.state.canvasContext.putImageData(image, 0, 0)

            // circle drawn ✅


            // draw where our two target colours are

            // convert our colours to coords on the circle
            const hsvToPolar = (h, s, v) => {
                return [ radius * s, (h * Math.PI / 180) + (-180 * Math.PI / 180)]
            }

            const color1Polar = hsvToPolar(...this.state.color1)
            const color1Coord = polarToCartesian(...color1Polar)


            const color2Polar = hsvToPolar(...this.state.color2)
            const color2Coord = polarToCartesian(...color2Polar)

            if (this.state.isUserInteracting === false){
                // lets also make sure the DOM  for the colours are up to date
                this.color1Ref.current.style.top = `${color1Coord[1]}px`
                this.color1Ref.current.style.left = `${color1Coord[0]}px`

                this.color2Ref.current.style.top = `${color2Coord[1]}px`
                this.color2Ref.current.style.left = `${color2Coord[0]}px`
            }

            const coords = [color1Coord, color2Coord]

            // render straight line between
            this.state.canvasContext.strokeStyle = "rgba(120, 120, 120, 0.5)"
            this.state.canvasContext.strokeWidth = 1

            this.state.canvasContext.beginPath()
            this.state.canvasContext.moveTo(...color1Coord)
            this.state.canvasContext.lineTo(...color2Coord)
            this.state.canvasContext.stroke()

            // render curved line between - https://www.numerade.com/questions/the-midpoint-formula-in-polar-coordinates-mleftfracr-cos-alphar-cos-beta2-fracr-sin-alphar-sin-beta2/#:~:text=M%3D(rcos%CE%B1%2B,found%20using%20the%20formula%20shown.
            const perfectMidpointPolar = [
                ( ( ( color1Polar[0]  ) + ( color2Polar[0] ) ) / 2 ),
                Math.abs(color1Polar[1] - color2Polar[1]) > 180 * Math.PI / 180 ?
                    (
                        ( color1Polar[1] + color2Polar[1] + ( 360 * Math.PI / 180 ) ) / 2
                    ) :
                    ( color1Polar[1] + color2Polar[1] ) / 2
            ]

            const perfectMidpointCoord = polarToCartesian(...perfectMidpointPolar)

            this.state.canvasContext.strokeStyle = "#fff"
            this.state.canvasContext.strokeWidth = 2

            this.state.canvasContext.beginPath()
            this.state.canvasContext.moveTo(color1Coord[0], color1Coord[1])
            this.state.canvasContext.quadraticCurveTo(perfectMidpointCoord[0], perfectMidpointCoord[1], color2Coord[0], color2Coord[1])
            this.state.canvasContext.stroke()

            const circles = [
                {
                    coords: color1Coord,
                    rgb: hsvToRgb(...this.state.color1),
                },
                {
                    coords: color2Coord,
                    rgb: hsvToRgb(...this.state.color2),
                },
            ]

            // finally render circles
            circles.forEach((circle) => {
                this.state.canvasContext.strokeStyle = "#fff"
                this.state.canvasContext.strokeWidth = 2
                this.state.canvasContext.fillStyle = `rgb(${circle.rgb[0]}, ${circle.rgb[1]}, ${circle.rgb[2]})`

                this.state.canvasContext.beginPath()
                this.state.canvasContext.arc(circle.coords[0], circle.coords[1], 10, 0, 2 * Math.PI)
                this.state.canvasContext.fill()
                this.state.canvasContext.stroke()
            })

            // lets also show what the current selected colours actually are at the bottom of the canvas

            const colors = [this.state.color1, this.state.color2]

            colors.forEach((hsv, index) => {
                const rgb = hsvToRgb(...hsv)

                this.state.canvasContext.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`

                this.state.canvasContext.beginPath()
                this.state.canvasContext.rect(16 * (index + 1), this.state.canvasContext.canvas.height - 32, 12, 12)

                this.state.canvasContext.fill()
            })

            requestAnimationFrame(this.renderCanvas)
        }
    }

    windowResizeEvent()
    {
        if (this.canvasRef && this.canvasRef.current && this.state.canvasContext){
            // check canvas dimensions - lets always be screen-responsive
            const width = this.canvasRef.current.getBoundingClientRect().width
            // want 1:1

            this.state.canvasContext.canvas.width = width
            this.state.canvasContext.canvas.height = width + 32
        }
    }

    mouseUpChangeColorEvent(event)
    {
        this.setState(state => {
            return {
                ...state,
                isUserInteracting: false,
                currentInteractingColor: null,
            }
        })
    }

    mouseDownChangeColor1Event(event)
    {
        this.setState(state => {
            return {
                ...state,
                isUserInteracting: true,
                currentInteractingColor: "color1",
            }
        })
    }

    mouseDownChangeColor2Event(event)
    {
        this.setState(state => {
            return {
                ...state,
                isUserInteracting: true,
                currentInteractingColor: "color2",
            }
        })
    }

    mouseMoveChangeColorEvent(event){

        if (this.state.isUserInteracting === false || this.state.currentInteractingColor === null){
            return
        }

        const parentElement = this.canvasRef.current
        const radius = this.state.canvasContext.canvas.width / 2

        const getRelativeCoordinates = (event, referenceElement) => {

            const position = {
                x: event.pageX,
                y: event.pageY
            };

            const offset = {
                left: referenceElement.offsetLeft,
                top: referenceElement.offsetTop
            };

            let reference = referenceElement.offsetParent

            while(reference){
                offset.left += reference.offsetLeft
                offset.top += reference.offsetTop
                reference = reference.offsetParent
            }

            return [
                (position.x - offset.left) - radius,
                (position.y - offset.top) - radius,
            ]
        }

        const temporaryCoords = getRelativeCoordinates(event, parentElement)

        const [radialDistance, angle] = this.cartesianToPolar(...temporaryCoords)

        // if it is out of radius, ignore mouse move event
        if (radialDistance + 10 > radius){
            return
        }

        const hue = this.radiansToDegrees(angle) // we want the angle to change the hue colour as you go around the circle
        const saturation = radialDistance / radius // we want saturation to change based on distance from the center of the circle
        const value = 0.9

        const hsv = [hue, saturation, value]

        this[this.state.currentInteractingColor + "Ref"].current.style.top = `${temporaryCoords[1]}px`
        this[this.state.currentInteractingColor + "Ref"].current.style.left = `${temporaryCoords[0]}px`

        this.setState(state => {
            return {
                ...state,
                [this.state.currentInteractingColor]: hsv,
            }
        })
    }

    handleColorInputEvent(event)
    {
        const target = event.target
        const value = target.value
        const name = target.name

        const colorNumber = name[5]
        const colorHSLIndex = name[7]
        const colorNumberVariableName = `color${colorNumber}`

        this.setState(state => {

            let hsl = state[colorNumberVariableName]

            hsl[colorHSLIndex] = Number.parseFloat(value)

            return {
                ...state,
                [colorNumberVariableName]: hsl,
            }
        })
    }

    componentDidMount()
    {
        const canvas = this.canvasRef.current
        this.setState(state => {
            return {
                ...state,
                canvasContext: canvas.getContext("2d"),
                isCanvasActive: true,
            }
        }, () => {
            if (process.browser){

                this.color1Ref.current.addEventListener("mousedown", this.mouseDownChangeColor1Event)
                this.color2Ref.current.addEventListener("mousedown", this.mouseDownChangeColor2Event)

                window.addEventListener("mouseup", this.mouseUpChangeColorEvent)

                this.canvasRef.current.addEventListener("mousemove", this.mouseMoveChangeColorEvent)

                window.addEventListener("resize", this.windowResizeEvent)
                this.windowResizeEvent()
            }

            // fix anti-aliasing for any browser
            this.state.canvasContext.imageSmoothingEnabled = true

            this.renderCanvas()
        })
    }

    componentWillUnmount() {

        if (process.browser){

            this.color1Ref.current.removeEventListener("mousedown", this.mouseDownChangeColor1Event)
            this.color2Ref.current.removeEventListener("mousedown", this.mouseDownChangeColor2Event)

            window.removeEventListener("mouseup", this.mouseUpChangeColorEvent)

            this.canvasRef.current.removeEventListener("mousemove", this.mouseMoveChangeColorEvent)

            window.removeEventListener("resize", this.windowResizeEvent)
        }

        this.setState(state => {
            return {
                ...state,
                canvasContext: null,
                isCanvasActive: null,
            }
        })
    }

    render()
    {
        const colorStyle = {
            position: "absolute",
            padding: "10px",
            borderRadius: "50%",
            zIndex: 50,
            transform: "translate(-50%, -50%)",
            cursor: this.state.isUserInteracting ? 'grabbing' : 'grab',
        }

        const colorInputGenerator = (colorVariableName) => {

            const rgb = hsvToRgb(...this.state[colorVariableName])

            return (
                <div className="flex pb-2">

                    <div
                        style={{
                            width: "1rem",
                            height: "1rem",
                            background: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                        }}
                    />

                    <input
                        type="number"
                        className={"px-3 py-1 border-none rounded text-xs"}
                        name={`${colorVariableName}_0`}
                        value={+this.state[colorVariableName][0].toFixed(2)}
                        onChange={this.handleColorInputEvent}
                        min={0}
                        max={360}
                        step={1}
                    />
                    <input
                        type="number"
                        className={"px-3 py-1 border-none rounded text-xs"}
                        name={`${colorVariableName}_1`}
                        value={+this.state[colorVariableName][1].toFixed(2)}
                        onChange={this.handleColorInputEvent}
                        min={0}
                        max={1}
                        step={0.01} />
                    <input
                        type="number"
                        className={"px-3 py-1 border-none rounded text-xs"}
                        name={`${colorVariableName}_2`}
                        value={+this.state[colorVariableName][2].toFixed(2)}
                        onChange={this.handleColorInputEvent}
                        min={0}
                        max={1}
                        step={0.1}
                        disabled
                    />
                </div>
            )
        }

        return (
            <div className={"relative"}>
                <canvas ref={this.canvasRef} style={{ width: "100%" }} />
                <div ref={this.color1Ref} style={colorStyle} />
                <div ref={this.color2Ref} style={colorStyle} />

                {colorInputGenerator("color1")}
                {colorInputGenerator("color2")}
            </div>
        )
    }
}