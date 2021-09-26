import React, { Suspense, useRef, useState, useEffect } from "react"
import {MathUtils} from "three";
import {Canvas, useLoader, useFrame, useThree, extend} from "@react-three/fiber"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {Html, Stats, useAnimations} from "@react-three/drei"
import {Vector3} from "three";

// convert to JSX
extend({OrbitControls})

function FaceModel()
{
    const face = useRef()
    const model = useLoader(GLTFLoader, "models/face.glb")
    const {camera} = useThree()

    useFrame(({clock}) => {
        camera.lookAt(face.current.position)
        camera.rotateX(MathUtils.degToRad(37))

        face.current.position.z = -0.1 - ( Math.cos(clock.getElapsedTime() / 2) / 10 )
    })

    const {actions} = useAnimations(model.animations, face)

    useEffect(() => {
        actions.idle_eyes.play()
    })

    return <primitive
        ref={face}
        object={model.scene}
        position={[0, 0, 0]}
    />
}

function Light()
{
    const light = useRef()

    useFrame(({clock}) => {
        light.current.intensity = 1 + ( (Math.cos(clock.getElapsedTime() / 2)) / 2 )
    })

    return <directionalLight
            ref={light}
            castShadow
            position={[8, 8, 8]}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-left={-8}
            shadow-camera-bottom={-8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            intensity={1.5}
            shadow-bias={-0.0001}
        />
}

function CameraPosition()
{
    const {camera} = useThree()

    const htmlRef = useRef()

    const [pos, setPos] = useState('')

    useFrame(() => {
        setPos(camera.position.toArray().map(n => n.toFixed(2)).toString())

        let htmlVector = new Vector3(0, 0, -1.8)
        htmlVector.applyQuaternion(camera.quaternion)
        htmlRef.current.position = new Vector3(htmlRef.current.position).copy(htmlVector)
        htmlRef.current.rotation = new Vector3(htmlRef.current.rotation).copy(camera.rotation)
    })

    return <Html ref={htmlRef} position={[0, 0, 0]}>
        <div className={'text-sm text-primary'}>{ pos }</div>
    </Html>
}

export default function Face()
{
    return (
        <div className={'relative my-6'} style={{paddingBottom: "56%",}}>

            <Stats/>

            <Canvas

                className={'!absolute'}

                camera={{
                    fov: 40,
                    near: 0.1,
                    far: 200,
                    position: [0, 0.7, 0.6],
                    rotation: [0, 0, 1],

                }}
            >

                <CameraPosition/>

                <Light/>

                <Suspense fallback={null}>
                    <FaceModel/>
                </Suspense>
            </Canvas>
        </div>
    )
}
