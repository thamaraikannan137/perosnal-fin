import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { USER_ROLES } from "../config/constants.js";

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

class UserService {
  async createUser(data: CreateUserData): Promise<User> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    return User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: (data.role as typeof USER_ROLES[keyof typeof USER_ROLES]) || USER_ROLES.USER,
    }) as Promise<User>;
  }

  async getUserById(id: string): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } }) as Promise<User | null>;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
    }

    await user.update(data);
    return (await user.reload()) as User;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await user.destroy();
  }

  async verifyPassword(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number; pages: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return {
      users: rows as User[],
      total: count,
      pages: Math.ceil(count / limit),
    };
  }
}

export default new UserService();
