import { pool } from "../src/application/database";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    const email = "test@test.com";
    return pool.query('DELETE FROM users WHERE email = ?', [email]);
}

export const createTestUser = () => {
    return new Promise((resolve, reject) => {
        const data = {
            name: "Testing",
            email: "test@test.com",
        };

        (async () => {
            try {
                data.password = await bcrypt.hash("rahasia", 10);

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
                                    name: data.name,
                                    email: data.email,
                                    token: "test"
                                };
                                resolve(newUser);
                            }
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        })();
    });
}
