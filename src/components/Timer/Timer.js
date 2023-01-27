import React from "react";
import { useState, useEffect } from "react";

export default function Timer({ time, showTools, isPaused, minutes, seconds }) {
  const initMins = Math.floor(time / 60);
  const initSecs = time % 60;
  const [minutes, setMinutes] = useState(initMins);
  const [seconds, setSeconds] = useState(initSecs);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if ((seconds > -1800) && (!isPaused)) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });


  return (
    <div className="Timer">
      {showTools ? (
        <div className="timer">
          <h3>
            {" "}
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h3>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
