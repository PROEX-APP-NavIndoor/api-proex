import { getCustomRepository, Repository } from 'typeorm';
import { Map } from '../entities/Map';
import { MapRepository } from '../repositories/MapRepository';
import { Building } from '../entities/Building';
import { BuildingRepository } from '../repositories/BuildingRepository';
import { Point } from '../entities/Point';
import { PointRepository } from '../repositories/PointRepository';
import { PointParent } from '../entities/PointParent';
import { PointChild } from '../entities/PointChild';
import { PointChildRepository } from '../repositories/Point_ChildRepository';
import { IMap } from '../interfaces/IMap.interface';
import { IMapResponse } from '../interfaces/IMapResponse.interface'
import { IMapPoint } from '../interfaces/IMapPoint.interface';
import { ApiError } from '../exceptions/ApiError';

class MapService {
  private connectMap: Repository<Map>;

  private connectBuilding: Repository<Building>;

  private connectPoint: Repository<Point>;

  constructor() {
    this.connectMap = getCustomRepository(MapRepository);
    this.connectBuilding = getCustomRepository(BuildingRepository);
    this.connectPoint = getCustomRepository(PointRepository);
  }

  async create(data: IMap) {
    const mapExist = await this.connectMap.findOne({ name: data.name });
    if (mapExist) {
      throw new ApiError(400, 'Mapa já existe');
    }

    const fkBuilding = await this.connectBuilding.findOne({ id: data.building_id });
    if (!fkBuilding) {
      throw new ApiError(404, 'Id de prédio não existe');
    }

    const map = this.connectMap.create(data);
    await this.connectMap.save(map);

    return map;
  }

  async read() {
    const allMaps = await this.connectMap.find();
    return allMaps;
  }

  async readById(id: string) {
    const map: IMapResponse = await this.connectMap.findOne({ id });
    if (!map) {
      throw new ApiError(404, 'Mapa não existe!');
    }


    const mapPointParents = await this.connectPoint
      .createQueryBuilder('point')
      .innerJoinAndMapOne('point.parent', PointParent, 'parent', 'point.id = parent.id')
      .where(`point.map_id = '${id}'`)
      .orderBy('point.created_at', 'ASC')
      .getMany();

    const mapPointChilds = await this.connectPoint
      .createQueryBuilder('point')
      .innerJoinAndMapOne('point.child', PointChild, 'child', 'point.id = child.id')
      .getMany();

    if (mapPointParents)
      map.points = mapPointsToData(mapPointParents, mapPointChilds);
    
    return map;
  }

  async delete(id: string) {
    const map = await this.connectMap.findOne({ id });
    if (!map) {
      throw new ApiError(404, 'Mapa não existe!');
    }
    await this.connectMap.delete(map.id);
  }

  async update(data: IMap, id: string) {
    const map = await this.connectMap.findOne({ id });
    if (!map) {
      throw new ApiError(404, 'Mapa não existe!');
    }
    const fkBuilding = await this.connectBuilding.findOne({ id: data.building_id });
    if (!fkBuilding) {
      throw new ApiError(404, 'Id de prédio não existe');
    }

    await this.connectMap.update(map.id, data);
  }
}

/**
 * Converts Map to `IMapResponse` (response format to be received by front-end applications)
 */
export function mapPointsToData(mapPointParents: Point[], mapPointChilds: Point[]): IMapPoint[] {
  let mapChildren = mapPointChilds.map((mapPointChild: Point) => {
    let point = {
      ...mapPointChild,
      ...mapPointChild.child
    };

    delete point['child'];
    return point;
  })

  return mapPointParents.map((mapPointParent: Point) => {
    let point: IMapPoint = {
      ...mapPointParent,
      ...mapPointParent.parent,
      children: mapChildren.filter(mapChild => mapChild.point_parent_id === mapPointParent.id),
      neighbor: JSON.parse(mapPointParent.parent.neighbor)
    };

    delete point['parent'];
    return point;
  })
}

export { MapService };
