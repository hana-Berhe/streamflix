import { StatusCodes } from "http-status-codes";
import {
  getRatingsService,
  rateTitleService,
  removeRatingService,
} from "../service/rating.service.js";

const getRatingsController = async (req, res, next) => {
  try {
    const items = await getRatingsService(req.user.id);
    res.status(StatusCodes.OK).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

const rateTitleController = async (req, res, next) => {
  try {
    const { movieId, source, mediaType, title, posterPath, backdropPath, rating } =
      req.body;
    const item = {
      movieId,
      source,
      mediaType,
      title,
      posterPath: posterPath ?? null,
      backdropPath: backdropPath ?? null,
      rating,
    };

    await rateTitleService(req.user.id, item);
    res.status(StatusCodes.OK).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const removeRatingController = async (req, res, next) => {
  try {
    const { source, movieId } = req.params;
    await removeRatingService(req.user.id, source, movieId);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

export { getRatingsController, rateTitleController, removeRatingController };
