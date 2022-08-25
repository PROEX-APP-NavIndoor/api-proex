import { IMap } from './IMap.interface'
import { IPoint } from './IPoint.interface'

export interface IMapResponse extends IMap{
  points?: IPoint[];
}
