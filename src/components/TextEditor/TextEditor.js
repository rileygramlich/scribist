import {useCallback, useState, useEffect, React}  from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import './TextEditor.css'

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]


export default function TextEditor({handleSaveDoc, setContent, content}) {
    const [quill, setQuill] = useState()


    useEffect(() => {
        if (quill == null) return
        const handler = (delta, oldDelta, source) => {
            console.log(delta)
            console.log(source)
            setContent(delta)
            handleSaveDoc()
        }
        quill.on("text-change", handler)

        return () => {
            quill.off("text-change", handler)
        }
    }, [quill])

    const containerRef = useCallback((container) => {
        const editor = document.createElement("div")
        if (container == null) return
        container.innerHTML = ''
        container.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS}})
        setQuill(q)
    
        return () => {
            containerRef.innerHTML = ""
        }
    }, [])

  return (
    <div className='TextEditor-container' ref={containerRef}>TextEditor</div>
  )
}
