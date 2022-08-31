import { Request, Response } from 'express';
import { IPoint } from '../interfaces/IPoint.interface';
import { PointService } from '../services/PointService';
import { PointValidator } from '../validators/PointValidator';
import {throwApiError} from '../exceptions/ThrowApiError'

class PointController {
  async create(req: Request, resp: Response) {
    const { ...data }: IPoint = req.body;

    const pointValidator = new PointValidator();
    try {
      await pointValidator.createValidation().validate(data, { abortEarly: false });
    } catch (genericError) {
      throwApiError(400, genericError);
    }

    const pointService = new PointService();
    const point = await pointService.create(data);
    return resp.status(201).json(point);
  }

  async read(req: Request, resp: Response) {
    const pointService = new PointService();
    const allPoints = await pointService.read();
    return resp.json(allPoints);
  }

  async readById(req: Request, resp: Response) {
    const { id } = req.params;

    const pointValidator = new PointValidator();
    try {
      await pointValidator.readByIdValidation().validate({ id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointService();
    const point = await pointService.readById(id);
    return resp.status(200).json(point);
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    const pointValidator = new PointValidator();
    try {
      await pointValidator.deleteByIdValidation().validate({ id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointService();
    await pointService.delete(id);
    return resp.status(200).json({ message: 'Ponto removido com sucesso!' });
  }

  async update(req: Request, resp: Response) {
    const { id } = req.params;
    const { ...data }: IPoint = req.body;

    //Prevents changing point map_id
    if(data.map_id)
      delete data.map_id;

    const pointValidator = new PointValidator();
    try {
      await pointValidator.updateValidation().validate({ ...data, id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointService();
    await pointService.update(data, id);
    return resp.status(200).json({ message: 'Ponto atualizado com sucesso!' });
  }
}

export { PointController };
