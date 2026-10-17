import { StatusCodes } from "http-status-codes";
import { getUserService } from "../service/user.service.js";

const getMeController = async (req, res, next) => {
  try {
    const user = await getUserService(req.user.id);
    res.status(StatusCodes.OK).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export { getMeController };
