import { Request, Response, NextFunction } from 'express';
import { EnumRoleUser } from '../entities/User';
import { UserService } from '../services/UserService';

export async function ensureNormal(request: Request, response: Response, next: NextFunction) {
  const { userId } = request;

  const userService = new UserService();

  const user = await userService.readById(userId);
  if (
    user.role === EnumRoleUser.normal ||
    user.role === EnumRoleUser.employee ||
    user.role === EnumRoleUser.super
  ) {
    return next();
  }

  return response.status(401).json({ message: 'Usuário não autorizado!' });
}
