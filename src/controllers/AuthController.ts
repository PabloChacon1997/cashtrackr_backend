import { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';



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

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body
    const user = await User.findOne({ where: { token } })
    if (!user) {
      const error = new Error('Token no válido')
      return res.status(401).json({error: error.message})
    }
    user.confirm = true;
    user.token = null;
    await user.save()
    res.json('Cuenta confirmada correctamente.')
  }

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({where: { email }})
    if (!user) {
      const error = new Error('Correo y/o Paswword inválidos');
      return res.status(404).json({error: error.message})
    }

    if (!user.confirm) {
      const error = new Error('La cuenta no ha sido confirmado');
      return res.status(403).json({error: error.message})
    }

    const isPasswordCorret = await checkPassword(password, user.password);
    if (!isPasswordCorret) {
      const error = new Error('Correo y/o Paswword inválidos');
      return res.status(401).json({error: error.message})
    }

    const token = generateJWT(user.id);
    return res.json(token);
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await User.findOne({where: { email }})
    if (!user) {
      const error = new Error('No hay un usuario con este correo');
      return res.status(404).json({error: error.message})
    }
    user.token = generateToken();
    await user.save()

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res.json('Revisa tu email para reestablecer tu contraseña');
  }
  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body
    const tokenExists = await User.findOne({ where: { token } })
    if (!tokenExists) {
      const error = new Error('Token no válido')
      return res.status(404).json({error: error.message})
    }
    res.json('Token confirmado')
  }
  
  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ where: { token } })
    if (!user) {
      const error = new Error('Token no válido')
      return res.status(404).json({error: error.message})
    }
    user.password = await hashPassword(password);
    user.token = null;
    await user.save()
    res.json('Password modificado correctamente')
  }
}