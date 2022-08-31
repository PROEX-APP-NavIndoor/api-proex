import { DeepPartial, getCustomRepository, Repository } from 'typeorm';
import { Point } from '../entities/Point';
import { Map } from '../entities/Map';
import { PointRepository } from '../repositories/PointRepository';
import { MapRepository } from '../repositories/MapRepository';
import { ApiError } from '../exceptions/ApiError';
import { IPoint } from '../interfaces/IPoint.interface';

class PointService {
  private connectPoint: Repository<Point>;

  private connectMap: Repository<Map>;

  constructor() {
    this.connectPoint = getCustomRepository(PointRepository);
    this.connectMap = getCustomRepository(MapRepository);
  }

  async create(data: IPoint) {
    const pointExist = await this.connectPoint.findOne({ name: data.name });
    if (pointExist) {
      throw new ApiError(400, 'Ponto já existe');
    }

    const fkMap = await this.connectMap.findOne({ id: data.map_id });
    if (!fkMap) {
      throw new ApiError(404, 'Id de mapa não existe');
    }

    const point = this.connectPoint.create(dataToPoint(data));
    await this.connectPoint.save(point);

    return pointToData(point);
  }

  async read() {
    const allPoints = await this.connectPoint.find();
    return allPoints.map(pointToData);
  }

  async readById(id: string) {
    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }
    return pointToData(point);
  }

  async delete(id: string) {
    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }
    await this.connectPoint.delete(point.id);
  }

  async update(data: IPoint, id: string) {
    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }
    await this.connectPoint.update(point.id, dataToPoint(data));
  }
}

/**
 * Converts IPoint to Point, encoding json object `neighbor` to string
 */
function dataToPoint(data: IPoint): DeepPartial<Point> {
  return {...data, neighbor: JSON.stringify(data.neighbor)};
}

/**
 * Converts Point to IPoint, decoding string `neighbor` to json object
 */
 export function pointToData(point: Point): IPoint {
  return {...point, neighbor: JSON.parse(point.neighbor)};
}

export { PointService };