import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense';


export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        // TODO: Filtrar por el usuario
      });
      return res.json(budgets)
    } catch (error) {
      // console.log(error)
      return res.status(500).json({error: 'Hubo un error'})
    }
  }

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      return res.status(201).json('Presupuesto creado correctamente');
    } catch (error) {
      // console.log(error)
      return res.status(500).json({error: 'Hubo un error'})
    }
  }

  static getById = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense]
    })
    res.json(budget);
  }

  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body)
    return res.json('Presupuesto actualizado correctamente');
  }
  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy()
    return res.json('Presupuesto eliminado correctamente');
  }
}

