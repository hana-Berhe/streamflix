import * as aiService from './ai.service.js';

export const getStatus = (req, res) => {
  res.status(200).json({ enabled: aiService.isAiConfigured() });
};

export const suggest = async (req, res) => {
  const result = await aiService.getSuggestions(req.userId, req.validated);
  res.status(200).json(result);
};
