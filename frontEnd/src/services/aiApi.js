import { json, request } from "./http";

export const getAiStatus = () => request("/ai/status");

/** @returns {Promise<{suggestions: {title, year, mediaType, reason}[], basedOn: string}>} */
export const getAiSuggestions = ({ prompt = "", count = 12, exclude = [], catalog = [] }) =>
  request("/ai/suggestions", {
    method: "POST",
    body: json({ prompt, count, exclude, catalog }),
  });
