import { IPoint } from "./IPoint.interface";

export interface IPointChild extends IPoint{
    point_parent_id?: string,
    is_obstacle?: boolean;
  }

export function isIPointChild(point: any): point is IPointChild { //magic happens here
  return (<IPointChild>point).point_parent_id !== undefined && (<IPointChild>point).is_obstacle !== undefined;
}