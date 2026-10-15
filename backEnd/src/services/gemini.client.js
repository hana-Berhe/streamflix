import config from '../config/env.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

/**
 * Thin client for the Gemini API's generateContent endpoint, specialised for
 * structured JSON output. Uses Node's built-in fetch, so there is no SDK to keep updated.
 *
 * Docs: https://ai.google.dev/gemini-api/docs/structured-output
 */
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// 429 = rate limited, 500/503 = Google-side hiccup: worth one more try.
const RETRYABLE_STATUS = new Set([429, 500, 503]);
const MAX_ATTEMPTS = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isGeminiConfigured = () => Boolean(config.gemini.apiKey);

/**
 * Sends one prompt and returns the parsed JSON object the model produced.
 *
 * @param {object} options
 * @param {string} options.system  instructions that frame every request
 * @param {string} options.prompt  this request's content
 * @param {object} options.schema  JSON Schema the response must follow
 * @param {number} [options.maxOutputTokens]
 * @returns {Promise<object>}
 */
export const generateJson = async ({ system, prompt, schema, maxOutputTokens = 2048 }) => {
  if (!isGeminiConfigured()) {
    throw new AppError('AI suggestions are not configured on the server', 503, {
      code: 'AI_NOT_CONFIGURED',
    });
  }

  const url = `${BASE_URL}/models/${encodeURIComponent(config.gemini.model)}:generateContent`;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      // Structured output: Gemini guarantees syntactically valid JSON matching the schema.
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
      maxOutputTokens,
      // No temperature: Gemini 3.5 Flash-Lite doesn't accept custom sampling values.
    },
  });

  let response;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Header, not ?key= in the URL, so the key never appears in proxy/access logs.
          'x-goog-api-key': config.gemini.apiKey,
        },
        body,
        signal: AbortSignal.timeout(config.gemini.timeoutMs),
      });
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) continue;
      logger.error('Gemini request failed', { error: error.name, message: error.message });
      throw new AppError("The suggestion service didn't respond. Try again.", 504, {
        code: 'AI_TIMEOUT',
      });
    }

    if (response.ok) break;

    if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
      const retryAfter = Number(response.headers.get('retry-after'));
      await sleep(
        Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) * 1000 : 800
      );
      continue;
    }

    const detail = await response.text().catch(() => '');
    logger.error('Gemini API error', { status: response.status, detail: detail.slice(0, 500) });

    if (response.status === 429) {
      throw new AppError('Suggestions are busy right now. Try again in a minute.', 503, {
        code: 'AI_BUSY',
      });
    }
    throw new AppError('The suggestion service returned an error. Try again.', 502, {
      code: 'AI_ERROR',
    });
  }

  const data = await response.json();

  if (data.promptFeedback?.blockReason) {
    logger.warn('Gemini blocked a prompt', { reason: data.promptFeedback.blockReason });
    throw new AppError("That request can't be answered. Try describing it differently.", 422, {
      code: 'AI_BLOCKED',
    });
  }

  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts || [])
    .filter((part) => typeof part.text === 'string' && !part.thought)
    .map((part) => part.text)
    .join('');

  if (!text) {
    logger.error('Gemini returned no text', { finishReason: candidate?.finishReason });
    throw new AppError('The suggestion service returned an empty answer. Try again.', 502, {
      code: 'AI_EMPTY',
    });
  }

  try {
    return JSON.parse(text);
  } catch {
    // Most likely cut off by maxOutputTokens (finishReason MAX_TOKENS).
    logger.error('Gemini returned unparsable JSON', {
      finishReason: candidate.finishReason,
      sample: text.slice(0, 300),
    });
    throw new AppError('The suggestion service returned an unreadable answer. Try again.', 502, {
      code: 'AI_BAD_OUTPUT',
    });
  }
};
