import { StatusCodes } from "http-status-codes";
import {
  getMyListService,
  addToMyListService,
  removeFromMyListService,
} from "../service/myList.service.js";

const getMyListController = async (req, res, next) => {
  try {
    const items = await getMyListService(req.user.id);
    res.status(StatusCodes.OK).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

const addToMyListController = async (req, res, next) => {
  try {
    const { movieId, source, mediaType, title, posterPath, backdropPath } = req.body;
    const item = {
      movieId,
      source,
      mediaType,
      title,
      posterPath: posterPath ?? null,
      backdropPath: backdropPath ?? null,
    };

    await addToMyListService(req.user.id, item);
    res.status(StatusCodes.CREATED).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const removeFromMyListController = async (req, res, next) => {
  try {
    const { source, movieId } = req.params;
    await removeFromMyListService(req.user.id, source, movieId);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

export { getMyListController, addToMyListController, removeFromMyListController };
