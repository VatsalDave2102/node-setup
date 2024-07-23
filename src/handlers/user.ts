import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

/**
 * Creates a new user and returns a JSON Web Token (JWT) for authentication.
 *
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 * @returns {Promise<void>} A promise that resolves with a JSON response containing the JWT
 *
 * Example:
 * ```
 * curl -X POST \
 *   http://localhost:3000/api/users \
 *   -H 'Content-Type: application/json' \
 *   -d '{"username": "johnDoe", "password": "mysecretpassword"}'
 * ```
 */
export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

/**
 * Authenticates an existing user and returns a JSON Web Token (JWT) for authentication.
 *
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 * @returns {Promise<void>} A promise that resolves with a JSON response containing the JWT
 *
 * Example:
 * ```
 * curl -X POST \
 *   http://localhost:3000/api/signin \
 *   -H 'Content-Type: application/json' \
 *   -d '{"username": "johnDoe", "password": "mysecretpassword"}'
 * ```
 */
export const signin = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401).json({ message: "Invalid Credentials" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
