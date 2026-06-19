import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Sparkles,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { validateImageFile, compressImage } from "../../services/photoService";
import "./PhotoUpload.css";

/**
 * Photo upload component with camera capture, drag-and-drop,
 * and AI verification results display.
 *
 * @param {Object} props
 * @param {File|null} props.photo - Current photo file
 * @param {(file: File|null) => void} props.onPhotoChange - Callback when photo changes
 * @param {boolean} props.verifying - Whether AI verification is in progress
 * @param {Object|null} props.verificationResult - AI verification results
 * @param {string|null} props.verificationError - AI verification error
 * @param {(type: string) => void} [props.onApplyType] - Callback to apply AI-suggested type
 */
export default function PhotoUpload({
  photo,
  onPhotoChange,
  verifying,
  verificationResult,
  verificationError,
  onApplyType,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      setFileError(null);

      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setFileError(validation.error);
        return;
      }

      try {
        // Compress the image
        const compressed = await compressImage(file);
        const compressedFile = new File([compressed], file.name, {
          type: "image/jpeg",
        });

        // Create preview URL
        const url = URL.createObjectURL(compressed);
        setPreviewUrl(url);

        onPhotoChange?.(compressedFile);
      } catch (err) {
        console.error("Image processing failed:", err);
        // Fall back to original file
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onPhotoChange?.(file);
      }
    },
    [onPhotoChange]
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileError(null);
    onPhotoChange?.(null);
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="photo-upload">
      <span className="photo-upload__label">
        <Camera size={14} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "-2px" }} />
        Photo Evidence (optional)
      </span>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="photo-upload__input"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="photo-upload__input"
        onChange={handleInputChange}
      />

      {/* Drop zone / Preview */}
      <div
        className={`photo-upload__dropzone ${isDragging ? "photo-upload__dropzone--dragging" : ""} ${
          photo ? "photo-upload__dropzone--has-photo" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!photo ? () => fileInputRef.current?.click() : undefined}
      >
        {!photo ? (
          /* Placeholder */
          <div className="photo-upload__placeholder">
            <div className="photo-upload__icon-group">
              <button
                type="button"
                className="photo-upload__icon-circle"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                title="Take a photo"
              >
                <Camera size={22} />
              </button>
              <span className="photo-upload__icon-divider">or</span>
              <button
                type="button"
                className="photo-upload__icon-circle"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Upload from gallery"
              >
                <Upload size={20} />
              </button>
            </div>
            <span className="photo-upload__text-main">
              Take a photo or upload from gallery
            </span>
            <span className="photo-upload__text-sub">
              Drag & drop an image here, or click to browse • JPEG, PNG, WebP
            </span>
          </div>
        ) : (
          /* Preview */
          <div className="photo-upload__preview-container">
            <div className="photo-upload__preview-wrapper">
              <img
                src={previewUrl}
                alt="Hazard photo preview"
                className="photo-upload__preview-img"
              />
            </div>
            <div className="photo-upload__preview-info">
              <span className="photo-upload__preview-name">{photo.name}</span>
              <span className="photo-upload__preview-size">
                {formatSize(photo.size)} • {photo.type}
              </span>
              <div className="photo-upload__preview-actions">
                <button
                  type="button"
                  className="photo-upload__btn"
                  onClick={handleReplace}
                >
                  <RefreshCw size={12} />
                  Replace
                </button>
                <button
                  type="button"
                  className="photo-upload__btn photo-upload__btn--remove"
                  onClick={handleRemove}
                >
                  <X size={12} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File validation error */}
      {fileError && (
        <div className="photo-upload__error">
          <AlertCircle size={14} />
          <span>{fileError}</span>
        </div>
      )}

      {/* AI Verification Status */}
      {(verifying || verificationResult || verificationError) && photo && (
        <div className="photo-upload__verification">
          {verifying && (
            <div className="photo-upload__verifying">
              <Loader2 size={16} />
              <span>AI agents analyzing your photo…</span>
            </div>
          )}

          {verificationResult && !verifying && (
            <div className="photo-upload__results">
              {/* Agent 1: Hazard Verification */}
              {verificationResult.is_hazard ? (
                <div
                  className={`photo-upload__result-row ${
                    verificationResult.verification_score >= 70
                      ? "photo-upload__result-row--success"
                      : verificationResult.verification_score >= 30
                      ? "photo-upload__result-row--warning"
                      : "photo-upload__result-row--danger"
                  }`}
                >
                  {verificationResult.verification_score >= 70 ? (
                    <CheckCircle2 size={14} />
                  ) : verificationResult.verification_score >= 30 ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  <span>
                    Hazard detected: <strong>{verificationResult.verified_type}</strong>
                    {" "} • Severity: <strong>{verificationResult.severity}</strong>
                    {" "} • Score: <strong>{verificationResult.verification_score}%</strong>
                  </span>
                  {onApplyType &&
                    !verificationResult.matches_reported_type &&
                    verificationResult.verified_type !== "None" && (
                      <button
                        type="button"
                        className="photo-upload__apply-btn"
                        onClick={() => onApplyType(verificationResult.verified_type)}
                      >
                        <Sparkles size={10} />
                        Apply
                      </button>
                    )}
                </div>
              ) : (
                <div className="photo-upload__result-row photo-upload__result-row--danger">
                  <XCircle size={14} />
                  <span>No road hazard detected in the photo</span>
                </div>
              )}

              {/* Agent 2: AI Detection */}
              <div
                className={`photo-upload__result-row ${
                  verificationResult.is_ai_generated
                    ? "photo-upload__result-row--danger"
                    : "photo-upload__result-row--success"
                }`}
              >
                <Shield size={14} />
                <span>
                  {verificationResult.is_ai_generated
                    ? `⚠️ Likely AI-generated image (${verificationResult.ai_detection_confidence}% confidence)`
                    : `✓ Photo appears authentic (${verificationResult.ai_detection_confidence}% confidence)`}
                </span>
              </div>

              {/* Description */}
              {verificationResult.verification_description && (
                <div className="photo-upload__result-row photo-upload__result-row--info">
                  <ImageIcon size={14} />
                  <span>{verificationResult.verification_description}</span>
                </div>
              )}
            </div>
          )}

          {verificationError && !verifying && (
            <div className="photo-upload__result-row photo-upload__result-row--warning">
              <AlertTriangle size={14} />
              <span>AI verification unavailable — you can still submit the report</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
