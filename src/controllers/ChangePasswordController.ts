import { Request, Response } from 'express';
import { throwApiError } from '../exceptions/ThrowApiError';
import { ChangeService } from '../services/ChangeService';
import { ChangeValidator } from '../validators/ChangeValidator';

class ChangePasswordController {
  async handle(request: Request, response: Response) {
    const { email, password, codVerificacao } = request.body;

    const changeValidator = new ChangeValidator();
    try {
      await changeValidator.changeValidation().validate(request.body, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const changeService = new ChangeService();
    await changeService.execute(email, password, codVerificacao);
    return response.status(200).json({ message: 'Senha recuperada com sucesso!' });
  }
}

export { ChangePasswordController };
