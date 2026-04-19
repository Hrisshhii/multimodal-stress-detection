"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function VideoEmotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState("Loading...");
  const lastSentRef = useRef(0);

  // 🎥 Start webcam
  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setEmotion("Camera denied ❌");
    }
  }

  // 📦 Load models
  async function loadModels() {
    const MODEL_URL = "/models";

    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      setEmotion("Detecting...");
      detectEmotion();
    } catch (err) {
      console.error("Model error:", err);
      setEmotion("Model failed ❌");
    }
  }

  // 🧠 Detect emotion
  function detectEmotion() {
    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections?.expressions) {
        const expressions = detections.expressions;

        const dominant = Object.entries(expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];

        setEmotion(dominant);

        // throttle using ref (IMPORTANT FIX)
        if (Date.now() - lastSentRef.current > 5000) {
          lastSentRef.current = Date.now();

          try {
            await fetch("/api/interaction", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "video",
                emotion: dominant,
                stressScore:
                  dominant === "angry" || dominant === "sad"
                    ? 0.8
                    : dominant === "happy"
                    ? 0.2
                    : 0.4,
              }),
            });
          } catch (err) {
            console.error("API error:", err);
          }
        }
      }
    }, 1000);
    
  }

  // ✅ NOW safe to call
 useEffect(() => {
  let isMounted = true;

  const init = async () => {
    try {
      // start camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current && isMounted) {
        videoRef.current.srcObject = stream;
      }

      // load models
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      if (isMounted) {
        setEmotion("Detecting...");
        detectEmotion();
      }
    } catch (err) {
      console.error(err);
      if (isMounted) setEmotion("Init failed ❌");
    }
  };

  init();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="260"
        style={{ borderRadius: "12px" }}
      />
      <p style={{ marginTop: "10px" }}>
        Emotion: <b>{emotion}</b>
      </p>
    </div>
  );
}