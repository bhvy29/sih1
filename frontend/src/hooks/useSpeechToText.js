import { useState, useRef } from "react";

/**
 * Free, browser-native speech-to-text using the Web Speech API.
 * No API key, no backend call, no cost. Works in Chrome/Edge.
 * Supports Indian English and Hindi out of the box; other regional
 * languages may have inconsistent browser support (fine for a demo).
 */
export default function useSpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  const startListening = (lang = "en-IN") => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang; // "en-IN" for English, "hi-IN" for Hindi
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const resetTranscript = () => setTranscript("");

  return {
    transcript,
    setTranscript,
    listening,
    supported,
    startListening,
    stopListening,
    resetTranscript,
  };
}