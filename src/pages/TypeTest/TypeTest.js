import React, { useState, useEffect } from "react";
// CSS
import "./TypeTest.css";

const ROOT_URL = "https://philosophy-quotes-api.glitch.me/quotes";

export default function TypeTest() {
  const [quote, setQuote] = useState({});
  const [typed, setTyped] = useState("");
  const [testOn, setTestOn] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    async function renderQuote() {
      const quotes = await fetch(ROOT_URL).then((res) => res.json());
      const q = await quotes[Math.floor(Math.random() * (127 - 1) + 1)];
      setQuote(q);
    }
    renderQuote();
  }, []);

  useEffect(() => {
    setTimerOn(!timerOn);
    if (!timerOn) return;
    const myInterval = setInterval(() => {
      if (timerOn) setTime((time) => time + 1);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [testOn]);

  async function handleSubmit(e) {
    e.preventDefault();
    const quotes = await fetch(ROOT_URL).then((res) => res.json());
    const q = await quotes[Math.floor(Math.random() * (127 - 1) + 1)];
    setQuote(q);
  }

  function handleTestStart(e) {
    e.preventDefault();
    setTestOn(true);
  }

  function handleDoneTest() {
    setTestOn(!testOn);
  }

  return (
    <div className="TypeTest">
      <h1 className="title">Test Typing Speed!</h1>
      <div className="quote">
        <h3>"{quote.quote}"</h3>
        <p className="author">~ {quote.source}</p>
      </div>
      <button className="new-quote" type="submit" onClick={handleSubmit}>
        Type New Quote
      </button>

      <button className="start-btn" onClick={handleTestStart}>
        Start Test
      </button>
      <form action=""></form>
      <textarea
        name="type"
        id=""
        cols="30"
        rows="10"
        className="test-input"
        placeholder="Type quote here ..."
        onChange={(e) => setTyped(e.target.value)}
      ></textarea>
      <button className="finish-btn" onClick={handleDoneTest}>
        Finish Test
      </button>
      <p>{time}</p>

      <h5>
        You typed {typed.split(" ").filter((word) => word !== "").length} words
        in {Math.floor(time / 60)} mins and {time % 60} seconds.
      </h5>
      <h5>
        That's{" "}
        {typed.split(" ").filter((word) => word !== "").length / (time / 60)}{" "}
        wpm
      </h5>
    </div>
  );
}
