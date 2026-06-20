import { useState, useEffect, useCallback } from "react";
import { X, MapPin, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { insertHazard, updateHazard } from "../../services/hazardService";
import { uploadHazardPhoto } from "../../services/photoService";
import { useAIClassifier } from "../../hooks/useAIClassifier";
import { usePhotoVerification } from "../../hooks/usePhotoVerification";
import VoiceInput from "../VoiceInput/VoiceInput";
import PhotoUpload from "../PhotoUpload/PhotoUpload";
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
 * Integrates voice input, AI auto-classification, photo upload, and AI verification.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Close callback
 * @param {{ lat: number, lng: number } | null} props.location - Map click location
 * @param {(newHazard: Object) => void} props.onSubmitSuccess - Called after successful insert/update
 * @param {Object} [props.initialData] - Existing hazard data if editing
 */
export default function HazardForm({ isOpen, onClose, location, onSubmitSuccess, initialData }) {
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [photo, setPhoto] = useState(null);

  const { classify, classifying, aiError } = useAIClassifier();
  const {
    verify,
    verifying,
    verificationResult,
    verificationError,
    resetVerification,
  } = usePhotoVerification();

  // Reset form when opened/closed
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setHazardType(initialData.hazard_type || "");
        setDescription(initialData.description || "");
        setReportedBy(initialData.reported_by === "anonymous" ? "" : (initialData.reported_by || ""));
      } else {
        setHazardType("");
        setDescription("");
        setReportedBy("");
      }
      setError(null);
      setAiSuggestion(null);
      setPhoto(null);
      resetVerification();
    }
  }, [isOpen, initialData, resetVerification]);

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

  // Run AI photo verification when a photo is selected
  const handlePhotoChange = useCallback(
    (file) => {
      setPhoto(file);
      if (file) {
        // Trigger AI verification with the current hazard type
        verify(file, hazardType || "Unknown");
      } else {
        resetVerification();
      }
    },
    [verify, resetVerification, hazardType]
  );

  const handleApplyVerifiedType = useCallback(
    (type) => {
      setHazardType(type);
    },
    []
  );

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
    if (!location && !initialData) {
      setError("Please click on the map to set a location.");
      return;
    }

    // AI Gatekeeper logic
    if (photo) {
      if (verifying) {
        setError("Please wait for AI photo verification to complete before submitting.");
        return;
      }
      if (verificationResult && verificationResult.is_hazard === false) {
        setError("AI detected that the photo does not contain a valid road hazard. Please upload a clear photo of the hazard or remove it.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Upload photo if present
      let photoUrl = initialData?.photo_url || null;
      if (photo) {
        try {
          photoUrl = await uploadHazardPhoto(photo);
        } catch (uploadErr) {
          console.warn("Photo upload failed, continuing without photo:", uploadErr);
          // Don't block submission if photo upload fails
        }
      }

      const payload = {
        hazard_type: hazardType,
        description: description.trim(),
        latitude: location ? location.lat : initialData?.latitude,
        longitude: location ? location.lng : initialData?.longitude,
        reported_by: reportedBy.trim() || "anonymous",
      };

      // Only include photo/verification fields if they have values
      // (prevents errors if DB migration hasn't been run yet)
      if (photoUrl) payload.photo_url = photoUrl;
      if (verificationResult) {
        payload.verification_score = verificationResult.verification_score;
        payload.verification_status = verificationResult.verification_status;
        payload.is_ai_generated = verificationResult.is_ai_generated;
        payload.ai_analysis = {
          verified_type: verificationResult.verified_type,
          severity: verificationResult.severity,
          is_hazard: verificationResult.is_hazard,
          verification_description: verificationResult.verification_description,
          ai_detection_confidence: verificationResult.ai_detection_confidence,
          ai_detection_reasoning: verificationResult.ai_detection_reasoning,
        };
      }

      let savedHazard;
      if (initialData?.id) {
        // Check if dummy ID (length < 36 means it's not a UUID)
        if (String(initialData.id).length < 36) {
          savedHazard = { ...initialData, ...payload };
        } else {
          savedHazard = await updateHazard(initialData.id, payload);
        }
      } else {
        savedHazard = await insertHazard(payload);
      }

      onSubmitSuccess?.(savedHazard);
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
          <h2 className="hazard-form__title">
            {initialData ? "✏️ Edit Hazard" : "🚨 Report a Hazard"}
          </h2>
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
            ) : initialData ? (
              <span>
                📍 Location: {initialData.latitude.toFixed(4)}, {initialData.longitude.toFixed(4)} (unchanged)
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

          {/* ── Photo Upload + AI Verification ── */}
          <PhotoUpload
            photo={photo}
            onPhotoChange={handlePhotoChange}
            verifying={verifying}
            verificationResult={verificationResult}
            verificationError={verificationError}
            onApplyType={handleApplyVerifiedType}
          />

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
            disabled={submitting || (!location && !initialData)}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send size={18} />
                {initialData ? "Save Changes" : "Submit Report"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
