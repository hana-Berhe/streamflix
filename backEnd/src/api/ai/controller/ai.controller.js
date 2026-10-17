import { StatusCodes } from "http-status-codes";
import { getSuggestionsService } from "../service/ai.service.js";

const getAiStatusController = (req, res) => {
  res.status(StatusCodes.OK).json({ enabled: Boolean(process.env.GEMINI_API_KEY) });
};

const getSuggestionsController = async (req, res, next) => {
  try {
    const { prompt = "", count = 12, exclude = [], catalog = [] } = req.body;

    const result = await getSuggestionsService({
      userId: req.user.id,
      prompt,
      count,
      exclude,
      catalog,
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export { getAiStatusController, getSuggestionsController };
