import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import bcryptjs from "bcryptjs";

/**
 * Compares a plaintext password with a hashed password.
 *
 * @param {string} password - The plaintext password to compare
 * @param {string} hash - The hashed password to compare with
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the passwords match
 *
 * Example:
 * ```
 * const password = "mysecretpassword";
 * const hash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
 * const isValid = await comparePasswords(password, hash);
 * console.log(isValid); // true or false
 * ```
 */
export const comparePasswords = (password: string, hash: string) => {
  return bcryptjs.compare(password, hash);
};

/**
 * Hashes a plaintext password using bcryptjs.
 *
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} A promise that resolves with the hashed password
 *
 * Example:
 * ```
 * const password = "mysecretpassword";
 * const hash = await hashPassword(password);
 * console.log(hash); // $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
 * ```
 */
export const hashPassword = (password: string) => {
  return bcryptjs.hash(password, 10);
};

/**
 * Creates a JSON Web Token (JWT) for a given user.
 *
 * @param {User} user - The user object to create a JWT for
 * @returns {string} The generated JWT token
 *
 * Example:
 * ```
 * const user = { id: 1, username: "johnDoe" };
 * const token = createJWT(user);
 * console.log(token); // a JSON Web Token string
 * ```
 */
export const createJWT = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};

/**
 * Protects routes by verifying the JWT token in the Authorization header.
 *
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 * @param {NextFunction} next - The next function in the middleware chain
 * @returns {void}
 *
 * Example:
 * ```
 * app.use(protect);
 * ```
 */
export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  // check if header is present
  if (!bearer) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // check if token is present
  const token = bearer.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // check if token is valid
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
