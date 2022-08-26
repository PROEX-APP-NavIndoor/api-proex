import { Request, Response } from 'express';
import { throwApiError } from '../exceptions/ThrowApiError';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { AuthValidator } from '../validators/AuthValidator';

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const authValidator = new AuthValidator();
    try {
      await authValidator.authValidation().validate(request.body, { abortEarly: false });
    } catch (genericError) {
      throwApiError(400, genericError);
    }

    const authenticateUserService = new AuthenticateUserService();
    const token = await authenticateUserService.execute({
      email,
      password,
    });

    if (token.status === 400) {
      return response.status(400).json(token);
    }
    return response.json(token);
  }
}

export { AuthenticateUserController };
