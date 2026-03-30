import { NextFunction, Request, Response } from "express"
import { sql } from "../utils/db.js"
import ErrorHandler from "../utils/error.js"
import jwt, { JwtPayload } from "jsonwebtoken"

interface IUser {
  user_id: number
  name: string
  email: string
  phone_number: string
  role: "jobseeker" | "recruiter"
  bio: string | null
  resume: string | null
  resume_public_id: string | null
  profile_pic: string | null
  profile_pic_public_id: string | null
  skills: string[]
  subscription: string | null
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export { }

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ErrorHandler(401, "Invalid auth")
    }

    const token = authHeader.split(" ")[1]

    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    if (!decodedPayload || !decodedPayload.email) {
      throw new ErrorHandler(401, "Invalid auth")
    }

    const users = await sql`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone_number,
        u.role,
        u.bio,
        u.resume,
        u.resume_public_id,
        u.profile_pic,
        u.profile_pic_public_id,
        u.subscription,
        ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
      FROM users u
      LEFT JOIN user_skills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE u.email = ${decodedPayload.email}
      GROUP BY u.user_id
    `

    if (users.length === 0) {
      throw new ErrorHandler(401, "Invalid auth")
    }

    const user = users[0] as IUser

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}
