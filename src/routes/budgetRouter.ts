import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";


const router = Router()


router.get('/', BudgetController.getAll);

router.post('/',
  body('name')
    .notEmpty().withMessage('El nombre del presuepuesto no puede ir vacío'),
  body('amount')
    .notEmpty().withMessage('La cantidad de presupuesto no puede ir vacío')
    .isNumeric().withMessage('La cantidad de presupuesto no es válida')
    .custom(value => value > 0 ).withMessage('El presupuesto debe ser mayor a 0'),
  handleInputErrors,
  BudgetController.create);

router.get('/:id',
  param('id')
    .isInt().withMessage('El id es inválido')
    .custom(value => value > 0 ).withMessage('El id es inválido'),
  handleInputErrors,
  BudgetController.getById);

router.put('/:id', BudgetController.updateById);

router.delete('/:id', BudgetController.deleteById);



export default router;