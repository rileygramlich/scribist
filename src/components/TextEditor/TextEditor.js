import { useCallback, useState, useEffect, React } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";

// websocket:
import { io } from "socket.io-client";



import * as docsAPI from "../../utilities/docs-api";

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
];

export default function TextEditor({ handleSaveDoc, setContent, content }) {
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();

  // UseEffect for connecting to socket
  useEffect(() => {
    const s = io("http://localhost:3002");
    setSocket(s);
    console.log(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // UseEffect for sending changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("emit-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // UseEffect for receiving changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  const containerRef = useCallback((container) => {
    if (container == null) return;
    container.innerHTML = "";
    const editor = document.createElement("div");
    container.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);

    return () => {
      containerRef.innerHTML = "";
    };
  }, []);

  return (
    <div className="TextEditor-container" ref={containerRef}>
      TextEditor
    </div>
  );
}
