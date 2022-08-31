import { Request, Response } from 'express';
import { throwApiError } from '../exceptions/ThrowApiError';
import { ForgotService } from '../services/ForgotService';
import { ForgotValidator } from '../validators/ForgotValidator';

class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const { email } = request.body;

    const forgotValidator = new ForgotValidator();
    try {
      await forgotValidator.forgotValidation().validate({ email }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const forgotService = new ForgotService();
    const forgotPassword = await forgotService.execute(email);
    return response.status(forgotPassword.status).json({ message: forgotPassword.message });
  }
}

export { ForgotPasswordController };
