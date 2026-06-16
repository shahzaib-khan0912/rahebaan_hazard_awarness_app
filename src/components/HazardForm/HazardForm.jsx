import { useState, useEffect, useCallback } from "react";
import { X, MapPin, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { insertHazard } from "../../services/hazardService";
import { useAIClassifier } from "../../hooks/useAIClassifier";
import VoiceInput from "../VoiceInput/VoiceInput";
import "./HazardForm.css";

const HAZARD_TYPES = [
  "Pothole",
  "Broken Signal",
  "Waterlogging",
  "Road Crack",
  "Missing Manhole",
  "Other",
];

/**
 * Modal form for reporting a road hazard.
 * Integrates voice input and AI auto-classification.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Close callback
 * @param {{ lat: number, lng: number } | null} props.location - Map click location
 * @param {(newHazard: Object) => void} props.onSubmitSuccess - Called after successful insert
 */
export default function HazardForm({ isOpen, onClose, location, onSubmitSuccess }) {
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const { classify, classifying, aiError } = useAIClassifier();

  // Reset form when opened/closed
  useEffect(() => {
    if (isOpen) {
      setHazardType("");
      setDescription("");
      setReportedBy("");
      setError(null);
      setAiSuggestion(null);
    }
  }, [isOpen]);

  // Auto-classify when description changes (debounced)
  useEffect(() => {
    if (!description || description.trim().length < 10) {
      setAiSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      const result = await classify(description);
      if (result) {
        setAiSuggestion(result);
        // Auto-select hazard type if user hasn't manually chosen
        if (!hazardType) {
          setHazardType(result.hazard_type);
        }
      }
    }, 1000); // Wait 1 second after user stops typing/speaking

    return () => clearTimeout(timer);
  }, [description, classify, hazardType]);

  const handleVoiceTranscript = useCallback((text) => {
    setDescription((prev) => {
      // Append to existing text or set new
      if (prev.trim()) {
        return prev + " " + text;
      }
      return text;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!hazardType) {
      setError("Please select a hazard type.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the hazard.");
      return;
    }
    if (!location) {
      setError("Please click on the map to set a location.");
      return;
    }

    setSubmitting(true);
    try {
      const newHazard = await insertHazard({
        hazard_type: hazardType,
        description: description.trim(),
        latitude: location.lat,
        longitude: location.lng,
        reported_by: reportedBy.trim() || "anonymous",
      });
      onSubmitSuccess?.(newHazard);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="hazard-form-overlay" onClick={handleBackdropClick}>
      <div className="hazard-form">
        {/* Header */}
        <div className="hazard-form__header">
          <h2 className="hazard-form__title">🚨 Report a Hazard</h2>
          <button
            type="button"
            className="hazard-form__close"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Location display */}
          <div className="hazard-form__location">
            <MapPin size={16} />
            {location ? (
              <span>
                📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            ) : (
              <span className="hazard-form__location--empty">
                ⚠️ Click on the map first to set the hazard location
              </span>
            )}
          </div>

          {/* Hazard Type */}
          <div className="hazard-form__field">
            <label htmlFor="hazard-type">Hazard Type *</label>
            <select
              id="hazard-type"
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              required
            >
              <option value="">— Select hazard type —</option>
              {HAZARD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* AI Suggestion Badge */}
          {classifying && (
            <div className="hazard-form__ai-badge hazard-form__ai-badge--loading">
              <Loader2 size={14} className="spin" />
              <span>AI is analyzing your description…</span>
            </div>
          )}
          {aiSuggestion && !classifying && (
            <div className="hazard-form__ai-badge hazard-form__ai-badge--result">
              <Sparkles size={14} />
              <span>
                AI suggests: <strong>{aiSuggestion.hazard_type}</strong> —
                Severity: <strong>{aiSuggestion.severity}</strong>
              </span>
              {hazardType !== aiSuggestion.hazard_type && (
                <button
                  type="button"
                  className="hazard-form__ai-apply"
                  onClick={() => setHazardType(aiSuggestion.hazard_type)}
                >
                  Apply
                </button>
              )}
            </div>
          )}
          {aiError && (
            <div className="hazard-form__ai-badge hazard-form__ai-badge--error">
              <AlertCircle size={14} />
              <span>AI unavailable — please select type manually</span>
            </div>
          )}

          {/* Description */}
          <div className="hazard-form__field">
            <label htmlFor="hazard-description">Description *</label>
            <textarea
              id="hazard-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hazard — or use the mic button below to speak in Urdu or English…"
              rows={4}
              required
            />
          </div>

          {/* Voice Input */}
          <VoiceInput onTranscript={handleVoiceTranscript} />

          {/* Reported By */}
          <div className="hazard-form__field">
            <label htmlFor="reported-by">Your Name (optional)</label>
            <input
              id="reported-by"
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="Anonymous"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="hazard-form__error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="hazard-form__submit"
            disabled={submitting || !location}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
