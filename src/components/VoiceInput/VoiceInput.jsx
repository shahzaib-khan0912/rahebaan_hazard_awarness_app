import { useState, useCallback } from "react";
import { Mic, MicOff, Languages } from "lucide-react";
import { useVoiceInput } from "../../hooks/useVoiceInput";
import "./VoiceInput.css";

const LANGUAGES = [
  { code: "en-US", label: "English", flag: "🇬🇧" },
  { code: "ur-PK", label: "اردو", flag: "🇵🇰" },
];

/**
 * Voice input component with mic button, language toggle, and transcript display.
 * @param {{ onTranscript: (text: string) => void }} props
 */
export default function VoiceInput({ onTranscript }) {
  const [langIndex, setLangIndex] = useState(0);
  const currentLang = LANGUAGES[langIndex];

  const handleResult = useCallback(
    (text) => {
      onTranscript?.(text);
    },
    [onTranscript]
  );

  const { isListening, transcript, isSupported, startListening, stopListening } =
    useVoiceInput({
      lang: currentLang.code,
      onResult: handleResult,
    });

  const toggleLanguage = () => {
    setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
  };

  if (!isSupported) {
    return (
      <div className="voice-input voice-input--unsupported">
        <MicOff size={18} />
        <span>Voice input not supported. Please use Chrome.</span>
      </div>
    );
  }

  return (
    <div className="voice-input">
      <div className="voice-input__controls">
        <button
          type="button"
          className={`voice-input__mic-btn ${isListening ? "voice-input__mic-btn--active" : ""}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? "Stop recording" : "Start recording"}
        >
          {isListening ? (
            <>
              <span className="voice-input__pulse" />
              <MicOff size={20} />
            </>
          ) : (
            <Mic size={20} />
          )}
        </button>

        <button
          type="button"
          className="voice-input__lang-btn"
          onClick={toggleLanguage}
          title="Switch language"
        >
          <Languages size={16} />
          <span>
            {currentLang.flag} {currentLang.label}
          </span>
        </button>
      </div>

      {isListening && (
        <p className="voice-input__status">
          🔴 Listening in {currentLang.label}… speak now
        </p>
      )}

      {transcript && !isListening && (
        <p className="voice-input__transcript">
          <strong>Heard:</strong> "{transcript}"
        </p>
      )}
    </div>
  );
}
