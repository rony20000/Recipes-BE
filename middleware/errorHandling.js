import { validationResult } from "express-validator";
import { body } from "express-validator";
export const validationErrors = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const err = new Error("validation failed");
      err.statusCode = 422;
      err.data = errors.array();
      err.message = errors.array()[0].msg;
      throw err;
    } catch (error) {
      next(error);
    }
  }
};
export const recipeValidations = () => {
  return [
    body("title").trim().not().isEmpty(),
    body("ingredients").trim().not().isEmpty(),
    body("instructions").trim().not().isEmpty(),
  ];
};
export const serverSideErrorHandling = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

export const expectedErrorHandling = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
