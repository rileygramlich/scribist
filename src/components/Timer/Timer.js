import React, { useState, useEffect } from "react";

export default function Timer({ time, showTools, isPaused, timerMode }) {
  const initSecs = time;
  const [timer, setTimer] = useState(initSecs);

  useEffect(() => {
    if (isPaused) return;
    const myInterval = setInterval(() => {
      if (timer > -1800 && !isPaused) {
        setTimer((timer) => timer - 1);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [isPaused]);

  return (
    <div className="Timer">
      {showTools ? (
        <div className="timer">
          <h3>
            {" "}
            {Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </h3>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
