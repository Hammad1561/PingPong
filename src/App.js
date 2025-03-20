import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import detectFace from "./faceDetection";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [paddleX, setPaddleX] = useState(50); // Paddle position (percentage)
  const [ball, setBall] = useState({ x: 50, y: 50, dx: 2, dy: 2 }); // Ball movement
  const [score, setScore] = useState(0);

  useEffect(() => {
    console.log("📸 Webcam initialized");
    detectFace(videoRef, setPaddleX);
  }, []);

  useEffect(() => {
    const updateBall = () => {
      setBall((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Ball bouncing off walls
        if (newX <= 0 || newX >= 100) newDx = -newDx;
        if (newY <= 0) newDy = -newDy;

        // Ball hitting paddle
        if (newY >= 90 && Math.abs(newX - paddleX) < 10) {
          newDy = -newDy;
          setScore((s) => s + 1);
          console.log("🏓 Ball hit paddle! Score:", score + 1);
        }

        // Ball missed
        if (newY > 100) {
          console.log("❌ Ball missed! Resetting...");
          newX = 50;
          newY = 50;
          setScore(0);
        }

        return { x: newX, y: newY, dx: newDx, dy: newDy };
      });
    };

    const interval = setInterval(updateBall, 30);
    return () => clearInterval(interval);
  }, [paddleX]);

  return (
    <div className="game-container">
      <h1>Face Pong</h1>
      <Webcam ref={videoRef} className="webcam" />
      <div className="game-area">
        <div className="paddle" style={{ left: `${paddleX}%` }}></div>
        <div className="ball" style={{ left: `${ball.x}%`, top: `${ball.y}%` }}></div>
      </div>
      <p>Score: {score}</p>
    </div>
  );
}

export default App;
