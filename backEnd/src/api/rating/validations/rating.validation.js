import { body } from "express-validator";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";
import { titleRules, titleKeyRules } from "../../myList/validations/myList.validation.js";

export const rateTitleValidation = [
  ...titleRules,
  // -1 = Not for me, 1 = I like this, 2 = Love this!
  body("rating")
    .isIn([-1, 1, 2])
    .withMessage("rating must be -1, 1 or 2")
    .toInt(),
  validationErrorHandler,
];

export const removeRatingValidation = [...titleKeyRules, validationErrorHandler];
