import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Bot,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import "./VerificationBadge.css";

const STATUS_CONFIG = {
  verified: {
    icon: CheckCircle2,
    label: "Verified",
    className: "verification-badge--verified",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    className: "verification-badge--suspicious",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "verification-badge--rejected",
  },
  unverified: {
    icon: HelpCircle,
    label: "Unverified",
    className: "verification-badge--unverified",
  },
};

/**
 * Verification status badge component.
 *
 * @param {Object} props
 * @param {string} [props.status="unverified"] - One of: verified, suspicious, rejected, unverified
 * @param {number} [props.score] - Verification score (0-100)
 * @param {boolean} [props.isAiGenerated] - Whether the photo was flagged as AI-generated
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Badge size
 * @param {boolean} [props.showScore=false] - Whether to show the score number
 */
export default function VerificationBadge({
  status = "unverified",
  score,
  isAiGenerated = false,
  size = "md",
  showScore = false,
}) {
  // Show AI-generated badge if flagged
  if (isAiGenerated) {
    return (
      <span
        className={`verification-badge verification-badge--ai-generated ${
          size !== "md" ? `verification-badge--${size}` : ""
        }`}
        title="This photo was flagged as AI-generated"
      >
        <Bot size={size === "sm" ? 10 : size === "lg" ? 14 : 12} />
        AI Image
      </span>
    );
  }

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unverified;
  const IconComponent = config.icon;
  const iconSize = size === "sm" ? 10 : size === "lg" ? 14 : 12;

  return (
    <span
      className={`verification-badge ${config.className} ${
        size !== "md" ? `verification-badge--${size}` : ""
      }`}
      title={`Verification: ${config.label}${score != null ? ` (${score}%)` : ""}`}
    >
      <IconComponent size={iconSize} />
      {config.label}
      {showScore && score != null && (
        <span className="verification-badge__score">{score}</span>
      )}
    </span>
  );
}

/**
 * Renders both verification + AI detection badges in a row.
 *
 * @param {Object} props
 * @param {Object} props.hazard - Hazard object with verification fields
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 */
export function VerificationBadges({ hazard, size = "md" }) {
  if (!hazard) return null;

  const hasVerification =
    hazard.verification_status && hazard.verification_status !== "unverified";
  const hasPhoto = !!hazard.photo_url;

  if (!hasVerification && !hasPhoto) return null;

  return (
    <div className="verification-badges">
      {hasPhoto && (
        <VerificationBadge
          status={hazard.verification_status || "unverified"}
          score={hazard.verification_score}
          size={size}
          showScore={size !== "sm"}
        />
      )}
      {hazard.is_ai_generated && (
        <VerificationBadge isAiGenerated={true} size={size} />
      )}
    </div>
  );
}
