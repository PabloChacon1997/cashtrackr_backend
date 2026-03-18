import jwt from 'jsonwebtoken'


export const generateJWT = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRRET_KEY, {
    expiresIn: '30d'
  })

  return token;
}