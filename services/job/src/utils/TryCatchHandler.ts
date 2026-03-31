import { Request, Response, RequestHandler, NextFunction } from 'express'
import ErrorHandler from './error.js'

import * as Sentry from "@sentry/node"

export const TryCatchHandler = (controller: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => async (req, res, next) => {
  try {
    await controller(req, res, next)

  } catch (err: any) {
    if (err instanceof ErrorHandler) {
      return res.status(err.statusCode).json({
        message: err.message
      })
    }
    Sentry.captureException(err)
    return res.status(500).json({
      message: err.message
    })

  }

}



