import { EnumTypePoint } from "../entities/PointParent";
import { IPoint } from "./IPoint.interface";

export interface IPointParent extends IPoint{
    type?: EnumTypePoint,
    neighbor?: Array<Object>
  }

export function isIPointParent(point: any): point is IPointParent { //magic happens here
  return (<IPointParent>point).type !== undefined && (<IPointParent>point).neighbor !== undefined;
}