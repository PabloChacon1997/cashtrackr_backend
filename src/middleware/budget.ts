import type { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Budget from '../models/Budget';

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}


export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
  await param('budgetId')
    .isInt().withMessage('El id es inválido')
    .custom(value => value > 0 ).withMessage('El id es inválido').run(req)
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}


export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget.findByPk(+budgetId)
        if (!budget) {
        const error = new Error('Presupuesto no encontrado');
        return res.status(404).json({error: error.message});
        }
        req.budget = budget;
        return next();
    } catch (error) {
        // console.log(error)
        return res.status(500).json({error: 'Hubo un error'})
    }
}


export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name')
    .notEmpty().withMessage('El nombre del presuepuesto no puede ir vacío').run(req)
  await body('amount')
    .notEmpty().withMessage('La cantidad de presupuesto no puede ir vacío')
    .isNumeric().withMessage('La cantidad de presupuesto no es válida')
    .custom(value => value > 0 ).withMessage('El presupuesto debe ser mayor a 0').run(req)
  next()
}

export function hasAccess(req: Request, res: Response, next: NextFunction) {
  if (req.budget.usertId !== req.user.id) {
    const error = new Error('Acción no válida');
    return res.status(401).json({error: error.message});
  }
  return next()
}