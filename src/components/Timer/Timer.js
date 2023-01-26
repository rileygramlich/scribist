import React from "react";
import { useState, useEffect } from "react";

export default function Timer({ time, showTools, isPaused, minutes, seconds }) {

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
