import ErrorHandler from './error.js';
export const TryCatchHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    }
    catch (err) {
        if (err instanceof ErrorHandler) {
            return res.status(err.statusCode).json({
                message: err.message
            });
        }
        return res.status(500).json({
            message: err.message
        });
    }
};
