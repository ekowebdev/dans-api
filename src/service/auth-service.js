import { validate } from "../validation/validation.js";
import { loginValidation } from "../validation/auth-validation.js";
import { pool } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { compareSync } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const login = async (request) => {
    const loginRequest = validate(loginValidation, request);

    const email = loginRequest.email;
    const password = loginRequest.password;

    const user = await getUserByEmail(email);

    if (!user) {
        throw new ResponseError(401, "Email or password wrong");
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, "Email or password wrong");
    }

    user.password = undefined;
    const jwt = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: '30m' });

    return jwt;
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT name, email, password FROM users WHERE email = ?', [email], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

export default {
    login,
    getUserByEmail,
};
