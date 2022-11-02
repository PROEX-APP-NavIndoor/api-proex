import { EnumTypePoint } from "../entities/PointParent";

export interface IMapPoint {
    name?: string;
    description?: string;
    floor?: number;
    x?: number;
    y?: number;
    map_id?: string;
    type?: EnumTypePoint;
    neighbor?: Array<Object>;
    children?: {
        id?: string;
        name?: string;
        description?: string;
        floor?: number;
        x?: number;
        y?: number;
        map_id?: string;
        point_parent_id?: string;
        is_obstacle?: boolean;
    }[]
}
