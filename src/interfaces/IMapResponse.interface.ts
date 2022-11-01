import { IMap } from './IMap.interface'
import { IPointParent } from './IPointParent.interface';

export interface IMapResponse extends IMap{
  points?: IPointParent[];
}
