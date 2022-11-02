import { Request, Response } from 'express';
import { IPoint } from '../../interfaces/IPoint.interface';
import { IPointChild } from '../../interfaces/IPointChild.interface';
import { PointChildService } from '../../services/pointServices/PointChildService';
import { PointChildValidator } from '../../validators/PointChildValidator';
import { throwApiError } from '../../exceptions/ThrowApiError'

class PointChildController {
  async create(req: Request, resp: Response) {
    const { ...data }: IPointChild = req.body;

    const pointChildValidator = new PointChildValidator();
    try {
      await pointChildValidator.createValidation().validate(data, { abortEarly: false });
    } catch (genericError) {
      throwApiError(400, genericError);
    }

    const pointService = new PointChildService();
    const point = await pointService.create(data);
    return resp.status(201).json(point);
  }

  /*
  async read(req: Request, resp: Response) {
    const pointService = new PointChildService();
    const allPoints = await pointService.read();
    return resp.json(allPoints);
  }

  async readById(req: Request, resp: Response) {
    const { id } = req.params;

    const pointChildValidator = new PointChildValidator();
    try {
      await pointChildValidator.readByIdValidation().validate({ id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointChildService();
    const point = await pointService.readById(id);
    return resp.status(200).json(point);
  }
*/

  async update(req: Request, resp: Response) {
    const { id } = req.params;
    const { ...data }: IPoint = req.body;

    //Prevents changing point map_id
    if (data.map_id)
      delete data.map_id;

    const pointChildValidator = new PointChildValidator();
    try {
      await pointChildValidator.updateValidation().validate({ ...data, id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointChildService();
    await pointService.update(data, id);
    return resp.status(200).json({ message: 'Ponto atualizado com sucesso!' });
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    const pointValidator = new PointChildValidator();
    try {
      await pointValidator.deleteByIdValidation().validate({ id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointChildService();
    await pointService.delete(id);
    return resp.status(200).json({ message: 'Ponto removido com sucesso!' });
  }
}

export { PointChildController };
