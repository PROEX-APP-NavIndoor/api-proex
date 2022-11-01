import { DeepPartial, getConnection, getCustomRepository, Repository } from 'typeorm';
import { PointParent } from '../../entities/PointParent';
import { Map } from '../../entities/Map';
import { PointRepository } from '../../repositories/PointRepository';
import { PointParentRepository } from '../../repositories/Point_ParentRepository';
import { MapRepository } from '../../repositories/MapRepository';
import { ApiError } from '../../exceptions/ApiError';
import { IPointParent } from '../../interfaces/IPointParent.interface';

class PointParentService {
  private connectPoint: PointRepository;
  private connectPointParent: PointParentRepository;
  private connectMap: Repository<Map>;

  constructor() {
    this.connectPoint = getCustomRepository(PointRepository);
    this.connectPointParent = getCustomRepository(PointParentRepository);
    this.connectMap = getCustomRepository(MapRepository);
  }

  async create(data: IPointParent) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const pointExist = await this.connectPoint.findOne({ name: data.name });
    if (pointExist) {
      throw new ApiError(400, 'Ponto já existe');
    }

    const fkMap = await this.connectMap.findOne({ id: data.map_id });
    if (!fkMap) {
      throw new ApiError(404, 'Id de mapa não existe');
    }

    try {
      const point = await this.connectPoint.savePoint(queryRunner.manager, data);
      const pointParent = await this.connectPointParent.savePointParent(
        queryRunner.manager,
        { id: point.id, ...dataToPoint(data) }
      );

      await queryRunner.commitTransaction();
      return { ...point, ...pointToData(pointParent) };
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(500);
    } finally {
      await queryRunner.release();
    };

  }

  /*
  async read() {
    const allPoints = await this.connectPoint.find({
      order: {
        created_at: "DESC"
      }
    });
    //return allPoints.map(pointToData);
  }

  async readById(id: string) {
    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }

    const pointParent = await this.connectPointParent.findOne({ id });
    if (pointParent) {
      return { ...point, ...pointToData(pointParent) };
    } else {
      return point;
    }
  }
*/

  async update(data: IPointParent, id: string) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }

    const pointParent = await this.connectPointParent.findOne({ id });
    if (!pointParent) {
      throw new ApiError(404, 'Não é ponto pai!');
    }

    try {
      await this.connectPoint.updatePoint(queryRunner.manager, data, point.id);
      await this.connectPointParent.updatePointParent(queryRunner.manager, dataToPoint(data), point.id);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(500, err.message);
    } finally {
      queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }

    try {
      await this.connectPoint.deletePoint(queryRunner.manager, point.id);
      await this.connectPointParent.deletePointParent(queryRunner.manager, point.id);
      await queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      throw new ApiError(500);
    } finally {
      queryRunner.release();
    }
  }
}

/**
 * Converts IPoint to Point, encoding json object `neighbor` to string
 */
function dataToPoint(data: IPointParent): DeepPartial<PointParent> {
  return { ...data, neighbor: JSON.stringify(data.neighbor) };
}

/**
 * Converts Point to IPoint, decoding string `neighbor` to json object
 */
export function pointToData(point: PointParent): IPointParent {
  return { ...point, neighbor: JSON.parse(point.neighbor) };
}

export { PointParentService };