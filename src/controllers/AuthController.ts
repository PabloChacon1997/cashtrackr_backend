import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';



export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userExists = await User.findOne({where: { email }})
    if (userExists) {
      const error = new Error('Ya existe un usuario con este email, inicie sesión')
      return res.status(409).json({error: error.message})
    }
    try {
      const user = new User(req.body)
      user.password = await hashPassword(password)
      user.token = generateToken()
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      })
      return res.status(201).json('Cuenta creada correctamente')
    } catch (error) {
      // console.log(error)
      return res.status(500).json({error: 'Internal Server Error'})
    }
  }
}