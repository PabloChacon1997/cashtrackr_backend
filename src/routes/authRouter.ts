import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";


const router = Router();

router.post('/create-account',
  body('name')
    .notEmpty().withMessage('El nombre no puede ir vació'),
  body('password')
    .isLength({min: 8}).withMessage('El password es muy corto, minímo 8 carácteres'),
  body('email')
    .isEmail().withMessage('El email no es válido'),
  handleInputErrors,
  AuthController.createAccount);

export default router;