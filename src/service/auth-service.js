import { validate } from "../validation/validation.js";
import { loginValidation, registerValidation } from "../validation/auth-validation.js";
import { pool } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { compareSync } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (request) => {
    const registerRequest = validate(registerValidation, request);

    const name = registerRequest.name;
    const email = registerRequest.email;
    let password = registerRequest.password;

    const user = await getUserByEmail(email);

    if (user) {
        throw new ResponseError(401, "Email already exists");
    }

    password = await bcrypt.hash(password, 10);

    const data = { name, email, password };

    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                reject(error);
            } else {
                connection.query("INSERT INTO users SET ?", data, (error, results) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        const newUser = {
                            id: results.insertId,
                            name,
                            email,
                        };
                        resolve(newUser);
                    }
                });
            }
        });
    });
}

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
}

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT name, email, password FROM users WHERE email = ?', [email], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
}

export default {
    register,
    login,
    getUserByEmail,
}
