import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Map } from '../../entities/Map';
import { PointRepository } from '../../repositories/PointRepository';
import { PointChildRepository } from '../../repositories/Point_ChildRepository';
import { MapRepository } from '../../repositories/MapRepository';
import { ApiError } from '../../exceptions/ApiError';
import { IPoint } from '../../interfaces/IPoint.interface';
import { IPointChild } from '../../interfaces/IPointChild.interface';

class PointChildService {
  private connectPoint: PointRepository;
  private connectPointChild: PointChildRepository;
  private connectMap: Repository<Map>;

  constructor() {
    this.connectPoint = getCustomRepository(PointRepository);
    this.connectPointChild = getCustomRepository(PointChildRepository);
    this.connectMap = getCustomRepository(MapRepository);
  }

  async create(data: IPointChild) {
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
      const pointChild = await this.connectPointChild.savePointChild(queryRunner.manager, { id: point.id, ...data })
      await queryRunner.commitTransaction();
      return { ...point, ...pointChild };
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

    const pointChild = await this.connectPointChild.findOne({ id });
    if (pointChild) {
      return { ...point, ...pointChild };
    }
    else {
      return point;
    }
  }
  */

  async update(data: IPointChild, id: string) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }

    const pointChild = await this.connectPointChild.findOne({ id });
    if (!pointChild) {
      throw new ApiError(404, 'Não é ponto filho!');
    }

    try {
      await this.connectPoint.updatePoint(queryRunner.manager, data, point.id);
      await this.connectPointChild.updatePointChild(queryRunner.manager, data, point.id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(500, err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const point = await this.connectPoint.findOne({ id });
    if (!point) {
      throw new ApiError(404, 'Ponto não existe!');
    }
    await this.connectPoint.delete(point.id);

    try {
      await this.connectPoint.deletePoint(queryRunner.manager, point.id);
      await this.connectPointChild.deletePointChild(queryRunner.manager, point.id)
      await queryRunner.commitTransaction();
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ApiError(500, err.message);
    } finally {
      await queryRunner.release();
    };
  }
}

export { PointChildService };