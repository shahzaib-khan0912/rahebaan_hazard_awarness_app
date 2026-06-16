import { useState, useCallback } from "react";

const VALID_TYPES = [
  "Pothole",
  "Broken Signal",
  "Waterlogging",
  "Road Crack",
  "Missing Manhole",
  "Other",
];

const SYSTEM_PROMPT = `You are a road hazard classifier for Pakistan. Given a user's description of a road hazard (in English or Urdu), classify it.

Return ONLY valid JSON (no markdown, no explanation) with exactly these keys:
- "hazard_type": one of: Pothole, Broken Signal, Waterlogging, Road Crack, Missing Manhole, Other
- "severity": one of: Low, Medium, High

Example: {"hazard_type": "Pothole", "severity": "High"}`;

/**
 * Hook to classify hazard descriptions using Claude or Gemini API.
 * Falls back gracefully if no API key is configured or the call fails.
 *
 * @returns {{ classify: (description: string) => Promise<{hazard_type: string, severity: string}|null>, classifying: boolean, aiError: string|null }}
 */
export function useAIClassifier() {
  const [classifying, setClassifying] = useState(false);
  const [aiError, setAiError] = useState(null);

  const classify = useCallback(async (description) => {
    if (!description || description.trim().length < 5) {
      return null;
    }

    const claudeKey = import.meta.env.VITE_CLAUDE_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // No API key configured — skip AI, user selects manually
    if (!claudeKey && !geminiKey) {
      console.info("No AI API key configured. Skipping auto-classification.");
      return null;
    }

    setClassifying(true);
    setAiError(null);

    try {
      let result;

      if (claudeKey) {
        result = await classifyWithClaude(description, claudeKey);
      } else if (geminiKey) {
        result = await classifyWithGemini(description, geminiKey);
      }

      // Validate the response
      if (result && VALID_TYPES.includes(result.hazard_type)) {
        return result;
      }

      console.warn("AI returned invalid classification:", result);
      return null;
    } catch (err) {
      console.error("AI classification failed:", err);
      setAiError(err.message);
      return null; // Graceful fallback — user picks manually
    } finally {
      setClassifying(false);
    }
  }, []);

  return { classify, classifying, aiError };
}

/**
 * Classify using Claude (Anthropic) API.
 */
async function classifyWithClaude(description, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Classify this road hazard report:\n"${description}"`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  return JSON.parse(text);
}

/**
 * Classify using Google Gemini API.
 */
async function classifyWithGemini(description, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nClassify this road hazard report:\n"${description}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Gemini sometimes wraps in markdown code blocks — strip them
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}
