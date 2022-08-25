import { getCustomRepository, Repository } from 'typeorm';
import { Map } from '../entities/Map';
import { MapRepository } from '../repositories/MapRepository';
import { Building } from '../entities/Building';
import { BuildingRepository } from '../repositories/BuildingRepository';
import { Point } from '../entities/Point';
import { PointRepository } from '../repositories/PointRepository';
import { ApiError } from '../exceptions/ApiError';
import { IMap } from '../interfaces/IMap.interface';
import { IMapResponse } from '../interfaces/IMapResponse.interface'
import { pointToData } from './PointService'

class MapService {
  private connectMap: Repository<Map>;

  private connectBuilding: Repository<Building>;

  private connectPoint: Repository<Point>;

  constructor() {
    this.connectMap = getCustomRepository(MapRepository);
    this.connectBuilding = getCustomRepository(BuildingRepository);
    this.connectPoint = getCustomRepository(PointRepository)
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

    const mapPoints = await this.connectPoint.find({map_id: id});
    if(mapPoints)
      map.points = mapPoints.map(pointToData);

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

export { MapService };
