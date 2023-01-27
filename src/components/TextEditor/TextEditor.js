import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";

// websocket:
import { io } from "socket.io-client";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor({name, setName}) {
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();
  const { docId } = useParams();

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-doc", (doc) => {
      quill.setContents(doc);
      quill.enable();
      console.log(name)
    });

    socket.emit("get-doc", docId);
  }, [socket, quill, docId]);

  // UseEffect for connecting to socket
  useEffect(() => {
    const s = io("http://localhost:3002");
    setSocket(s);
    console.log(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // UseEffect for saving changes to DB
  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      console.log('saving doc to DB')
      socket.emit('save-doc', quill.getContents())
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

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
    q.disable();
    q.setText("Loading doc");
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
