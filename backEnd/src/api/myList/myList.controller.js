import * as myListModel from './myList.model.js';
import { toClientTitle } from '../../utils/titleMapper.js';

export const getMyList = async (req, res) => {
  const rows = await myListModel.findByUser(req.userId);
  res.status(200).json({ items: rows.map(toClientTitle) });
};

export const addToMyList = async (req, res) => {
  const title = { posterPath: null, backdropPath: null, ...req.validated };
  await myListModel.add(req.userId, title);
  res.status(201).json({ item: title });
};

export const removeFromMyList = async (req, res) => {
  const { source, movieId } = req.validated;
  await myListModel.remove(req.userId, source, movieId);
  res.status(204).end();
};
