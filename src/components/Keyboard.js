import { useEffect } from "react"
import QwertyHancock from "qwerty-hancock"

const Keyboard = ({ keyDown, keyUp }) => {
    useEffect(() => {
        const keyboard = new QwertyHancock({
            id: "keyboard",
            width: "640",
            height: "180",
            octaves: "2",
            startNote: "C3"
        })

        keyboard.keyDown = keyDown
        keyboard.keyUp = keyUp
    }, [ keyDown, keyUp ])

    return (
        <div id="keyboard"></div>
    )
}

export default Keyboard
