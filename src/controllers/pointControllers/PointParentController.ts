import { Request, Response } from 'express';
import { IPoint } from '../../interfaces/IPoint.interface';
import { IPointParent } from '../../interfaces/IPointParent.interface';
import { PointParentService } from '../../services/pointServices/PointParentService';
import { PointParentValidator } from '../../validators/PointParentValidator';
import {throwApiError} from '../../exceptions/ThrowApiError'

class PointParentController {
  async create(req: Request, resp: Response) {
    const { ...data }: IPointParent = req.body;

    const pointParentValidator = new PointParentValidator();
    try {
      await pointParentValidator.createValidation().validate(data, { abortEarly: false });
    } catch (genericError) {
      throwApiError(400, genericError);
    }

    const pointService = new PointParentService();
    const point = await pointService.create(data);
    return resp.status(201).json(point);
  }

  /*
  async read(req: Request, resp: Response) {
    const pointService = new PointParentService();
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

    const pointService = new PointParentService();
    const point = await pointService.readById(id);
    return resp.status(200).json(point);
  }
  */

  async update(req: Request, resp: Response) {
    const { id } = req.params;
    const { ...data }: IPoint = req.body;

    //Prevents changing point map_id
    if(data.map_id)
      delete data.map_id;

    const pointParentValidator = new PointParentValidator();
    try {
      await pointParentValidator.updateValidation().validate({ ...data, id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointParentService();
    await pointService.update(data, id);
    return resp.status(200).json({ message: 'Ponto atualizado com sucesso!' });
  }
  
  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    const pointParentValidator = new PointParentValidator();
    try {
      await pointParentValidator.deleteByIdValidation().validate({ id }, { abortEarly: false });
    } catch (error) {
      throwApiError(400, error);
    }

    const pointService = new PointParentService();
    await pointService.delete(id);
    return resp.status(200).json({ message: 'Ponto removido com sucesso!' });
  }
}

export { PointParentController };
