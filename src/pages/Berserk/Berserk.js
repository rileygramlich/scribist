import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../../components/Timer/Timer";

import { FaPause, FaPlay, FaCopy } from "react-icons/fa";

// CSS
import "./Berserk.css";

export default function Berserk() {
  const [berserk, setBerserk] = useState(false);
  const [time, setTime] = useState(1800);
  const [target, setTarget] = useState(1000);
  const [timerMode, setTimerMode] = useState(false);

  const [typed, setTyped] = useState("");
  const [typedCount, setTypedCount] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [showTools, setShowTools] = useState(true);

  const textAreaRef = useRef(null);

  const navigate = useNavigate();

  function handleBerserkStart(e) {
    e.preventDefault();
    console.log("going berserk");
    console.log(timerMode)
    setBerserk(!false);
    // start timer
  }

  function handleDone(e) {
    handleCopy(e);
    setBerserk(!berserk);
    navigate("/docs");
  }

  function toggleTools() {
    console.log("toggling tools");
    setShowTools(!showTools);
  }

  function togglePause() {
    console.log("toggling pause");
    setIsPaused(!isPaused);
    console.log(isPaused)
  }

  function handleCopy(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    console.log("text copied");
  }

  function handleTextChange(newValue) {
    setTyped(newValue);
    const count = typed.split(" ").filter((word) => word !== "").length;
    setTypedCount(count);
  }

  useEffect(() => {
    // if (timerMode) return
    console.log('timing')
    const interval = setInterval(() => {
      if (!isPaused) {
        handleTextChange(typed.slice(0, -5));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [typed]);

  return (
    <div className="Berserk">
      <h1 className="title">Go Berserk.</h1>
      {berserk ? (
        <div id="berserking">
          <textarea
            name="berserk-text"
            id=""
            cols="100"
            rows="25"
            placeholder="Go berserk here..."
            value={typed}
            ref={textAreaRef}
            onChange={(e) => handleTextChange(e.target.value)}
          ></textarea>
          <div className="berserk-tools">
            <button className="show-controls" onClick={toggleTools}>
              {showTools ? "Hide" : "Show"}
            </button>
            <Timer
              time={time}
              showTools={showTools}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              timerMode={timerMode}
            />
            {showTools ? (
              <div className="tool-bar-contain">
                <div className="typed">
                  {typedCount} / {target} words
                </div>
                <div className="buttons"></div>
                <button type="submit" className="finish" onClick={handleDone}>
                  Done
                </button>
                <button className="pause" onClick={togglePause}>
                  {isPaused ? <FaPlay /> : <FaPause />}
                </button>
                <button className="copy" onClick={handleCopy}>
                  <FaCopy />
                </button>
              </div>
            ) : (
              <p>Keep on berserkin'!</p>
            )}
          </div>
        </div>
      ) : (
        <form className="berserk-form" onSubmit={handleBerserkStart}>
          <div className="time-contain">
            <h3>Time to write: </h3>
            <input
              type="range"
              name="seconds"
              id="time"
              min="60"
              max="7200"
              onChange={(e) => setTime(e.target.value)}
            />
            <p>
              {Math.floor(time / 60)} minutes {time % 60} seconds
            </p>
          </div>
          <div className="target-contain">
            <h3 className="target">Word Target: </h3>
            <input
              type="number"
              name="target"
              value={target}
              id="word-target"
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          <div className="timer-mode-contain">
            <h3 className="mode">Timer mode? </h3>
            <input
              type="checkbox"
              name="mode"
              value={timerMode}
              onChange={(e) => setTimerMode(e.target.value)}
            />
          </div>
          <button type="submit" id="berserk-button">
            Go Berserk and write {target} words in {Math.floor(time / 60)}{" "}
            minutes
          </button>
        </form>
      )}
    </div>
  );
}
