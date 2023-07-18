import jsonwebtoken from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (token === undefined) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        jsonwebtoken.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) {
                res.json({
                    errors: "Invalid Token",
                });
            } else {
                next();
            }
        });
    }
};
