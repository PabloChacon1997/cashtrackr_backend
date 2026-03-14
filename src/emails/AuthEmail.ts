import { transport } from "../config/nodemailer"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    await transport.sendMail({
      from: 'CashTrackr <admin@cashtrackr.com>',
      to: user.email,
      subject: 'Cashtrackr - Confirma tu cuenta',
      html: `
        <p>Hola: ${user.name}, has creado tu cuenta en CashTrackr, ya esta casi lista</p>
        <p>Visita el siguiente enlace:</p>
        <a href="#">Confirma tu cuenta</a>
        <p>e ingresa el código <b>${user.token}</b></p>
      `
    });
  }
}