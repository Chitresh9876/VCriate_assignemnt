import React, { useState, useEffect, useRef } from "react";
import "./fullscreenexam.css";

const FullScreenExam = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [violationCount, setViolationCount] = useState(0);
  const [examStatus, setExamStatus] = useState("Not Started");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenExit);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenExit);
    };
  }, [isFullScreen, violationCount]);

  useEffect(() => {
    if (isExamStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      terminateExam("Time's up!");
    //   setViolationCount(1);
    }
    return () => clearTimeout(timerRef.current);
  }, [isExamStarted, timeLeft]);

  const handleFullScreenExit = () => {
    if (!document.fullscreenElement && isFullScreen) {
      setViolationCount((prev) => (prev + 1) % 2);
        if (violationCount + 1 === 1) alert(`Warning ${violationCount + 1}: Do not exit full screen mode`);
        else alert(`You are terminated form the exam.`);
      if (violationCount + 1 >= 2) {
        terminateExam(
          "You attempted to exit full-screen twice. Exam terminated."
        );
      } else {
        setIsExamStarted(false);
      }
    }
  };

  const startExam = () => {
    if (window.confirm("Are you sure you want to start the exam?")) {
      setIsExamStarted(true);
      setExamStatus("In Progress");
      openFullScreen();
    }
  };

  const terminateExam = (message) => {
    clearTimeout(timerRef.current);
    setIsExamStarted(false);
    setExamStatus(message);
    closeFullScreen();
  };

  const submitExam = () => {
    clearTimeout(timerRef.current);
    setIsExamStarted(false);
    setExamStatus("Exam Submitted");
    closeFullScreen();
  };

  const resetExam = () => {
    setTimeLeft(600);
    setViolationCount(0);
    setExamStatus("Not Started");
  };

  const openFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  return (
    <div className="exam-container">
      <h1>Full-Screen Exam Platform</h1>

      {!isExamStarted && (
        <>
          <button onClick={startExam}>Start Exam</button>
          <button onClick={resetExam}>Reset Exam</button>
        </>
      )}

      {isExamStarted && (
        <>
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </div>
          <button onClick={submitExam}>Submit Exam</button>
        </>
      )}

      {examStatus && <p>Exam Status: {examStatus}</p>}
    </div>
  );
};

export default FullScreenExam;
