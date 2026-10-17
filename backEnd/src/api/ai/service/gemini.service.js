import { ServiceUnavailableError } from "../../../utility/errors/errors.js";

// Docs: https://ai.google.dev/gemini-api/docs/structured-output
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_TIMEOUT_MS = 20000; // give up after 20 seconds

/**
 * Sends one prompt to Gemini and returns the JSON object it answers with.
 */
export const askGemini = async ({ system, prompt, schema }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_TEXT_MODEL || "gemini-3.5-flash-lite";

  // The frontend sees this code and shows "Because you liked..." picks instead
  if (!apiKey) {
    throw new ServiceUnavailableError(
      "AI suggestions are not configured on the server",
      "AI_NOT_CONFIGURED",
    );
  }

  let response;
  try {
    response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // In a header, not in the URL, so the key never shows up in logs
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: schema,
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Gemini request failed:", error.message);
    throw new ServiceUnavailableError("The suggestion service didn't respond. Try again.");
  }

  if (!response.ok) {
    console.error("Gemini error:", response.status, await response.text());
    if (response.status === 429) {
      throw new ServiceUnavailableError("Suggestions are busy right now. Try again in a minute.");
    }
    throw new ServiceUnavailableError("The suggestion service returned an error. Try again.");
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = parts
    .filter((part) => !part.thought)
    .map((part) => part.text)
    .join("");

  try {
    return JSON.parse(text);
  } catch {
    console.error("Gemini answer was not JSON:", text.slice(0, 300));
    throw new ServiceUnavailableError("Couldn't read the suggestions. Try again.");
  }
};
