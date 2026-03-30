import jwt from 'jsonwebtoken'
export const Jwt_Token_Generator = (email: string, role: string) => {
  return jwt.sign({ role, email }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  })
}
