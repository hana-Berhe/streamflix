import * as ratingModel from './rating.model.js';
import { toClientTitle } from '../../utils/titleMapper.js';

export const getRatings = async (req, res) => {
  const rows = await ratingModel.findByUser(req.userId);
  res.status(200).json({
    items: rows.map((row) => ({ ...toClientTitle(row), rating: row.rating })),
  });
};

export const rateTitle = async (req, res) => {
  const { rating, ...title } = { posterPath: null, backdropPath: null, ...req.validated };
  await ratingModel.upsert(req.userId, title, rating);
  res.status(200).json({ item: { ...title, rating } });
};

export const removeRating = async (req, res) => {
  const { source, movieId } = req.validated;
  await ratingModel.remove(req.userId, source, movieId);
  res.status(204).end();
};
