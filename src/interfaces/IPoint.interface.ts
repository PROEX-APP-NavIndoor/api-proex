export interface IPoint {
  name?: string;
  description?: string;
  floor?: number;
  x?: number;
  y?: number;
  breakPoint?: boolean;
  neighbor?: Object;
  map_id?: string;
}
