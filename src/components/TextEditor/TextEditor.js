import {useCallback, React}  from 'react'
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


export default function TextEditor() {
    const containerRef = useCallback((container) => {
        const editor = document.createElement("div")
        if (container == null) return
        container.innerHTML = ''
        container.append(editor)
        new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS}})
    
        return () => {
            containerRef.innerHTML = ""
        }
    }, [])

  return (
    <div className='TextEditor-container' ref={containerRef}>TextEditor</div>
  )
}
