import authService from "../service/auth-service.js";

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.cookie('token', result, { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(Number(new Date()) + 30 * 60 * 1000) });
        res.status(200).json({
            token: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    login,
}
