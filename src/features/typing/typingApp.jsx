import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setText, setUserInput } from "./typingSlice";

const TypingApp = () => {
  const dispatch = useDispatch();
  const { text, userInput } = useSelector((state) => state.typing);
  const [timer, setTimer] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [averageWPM, setAverageWPM] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    generateRandomText();
  }, []);

  const generateRandomText = () => {
    const letters = "asdfjkl";
    let randomText = "";
    let wordCount = 0;

    while (wordCount < 10) {
      const wordLength = Math.floor(Math.random() * 3) + 1;
      let word = "";

      for (let i = 0; i < wordLength; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        word += letters[randomIndex];
      }

      randomText += word + " ";
      wordCount++;
    }

    dispatch(setText(randomText.trim()));
  };

  const handleInputChange = (e) => {
    const { value } = e.target;

    if (!isPlaying) {
      setIsPlaying(true);
      startTimer();
    }

    dispatch(setUserInput(value));

    if (value === text) {
      stopTimer();
      const totalWordsTyped = value.trim().split(" ").length;
      const totalTimeInMinutes = timer / 60;
      const currentWPM = Math.floor(totalWordsTyped / totalTimeInMinutes);
      setCurrentWPM(currentWPM);
      setTotalWords((prevTotalWords) => prevTotalWords + totalWordsTyped);
      setCorrectWords((prevCorrectWords) => prevCorrectWords + 1);
      dispatch(setUserInput(""));
      generateRandomText();
      setIsPlaying(false);
    }
  };

  const startTimer = () => {
    const startTime = Date.now() - timer * 1000;
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
      setTimer(elapsedTimeInSeconds);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const getHighlightedText = (text, userInput) => {
    return [...text].map((char, index) => {
      let charStyle = {};

      if (index < userInput.length) {
        charStyle =
          char === userInput[index] ? { color: "green" } : { color: "red" };
      }

      return (
        <span key={index} style={charStyle}>
          {char}
        </span>
      );
    });
  };

  useEffect(() => {
    if (timer > 0) {
      const currentWPM = Math.floor((totalWords / timer) * 60);
      setCurrentWPM(currentWPM);
    }
  }, [timer, totalWords]);

  useEffect(() => {
    if (correctWords > 0) {
      const averageWPM = Math.floor((totalWords / timer) * 60);
      setAverageWPM(averageWPM);
    }
  }, [correctWords, timer, totalWords]);

  return (
    <div>
      <h1>Touch Typing App</h1>
      <button onClick={generateRandomText}>Generate New</button>
      {text && (
        <div>
          <p>Time: {timer} seconds</p>
          <p>Current WPM: {currentWPM}</p>
          {correctWords > 0 && <p>Average WPM: {averageWPM}</p>}
          <p style={{ fontSize: "50px" }}>
            {getHighlightedText(text, userInput)}
          </p>
          <input type="text" value={userInput} onChange={handleInputChange} />
        </div>
      )}
    </div>
  );
};

export default TypingApp;
