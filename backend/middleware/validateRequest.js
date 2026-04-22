import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return res.status(400).json({
    success: false,
    message: formattedErrors[0]?.message || 'Validation failed',
    errors: formattedErrors,
  });
};

export default validateRequest;
