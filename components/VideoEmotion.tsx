"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function VideoEmotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentRef = useRef<number>(0);

  const [emotion, setEmotion] = useState<string>("Detecting...");

  useEffect(() => {
    startVideo();
    loadModels();

    return () => {
      // cleanup interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      // stop camera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    startDetection();
  };

  const startDetection = () => {
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (!detections || !detections.expressions) return;

      const expressions = detections.expressions;

      const dominant = Object.entries(expressions).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      setEmotion(dominant);

      // throttle API calls (5 sec)
      if (Date.now() - lastSentRef.current > 5000) {
        lastSentRef.current = Date.now();

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
      }
    }, 1000);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="300"
        style={{ borderRadius: "10px" }}
      />
      <h2>Emotion: {emotion}</h2>
    </div>
  );
}