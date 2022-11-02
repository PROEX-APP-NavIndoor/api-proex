import {
    PrimaryColumn,
    Column,
    Entity,
    OneToMany,
    OneToOne
  } from 'typeorm';
import { Point } from './Point';
import { PointChild } from './PointChild';

export enum EnumTypePoint {
    COMMON = 'COMMON',
    ENTRANCE = 'ENTRANCE',
    PASSAGE = 'PASSAGE'
}
  
  @Entity('point_parents')
  class PointParent {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: EnumTypePoint, default: EnumTypePoint.COMMON })
    type: EnumTypePoint
  
    @Column()
    neighbor: string;

    @OneToOne(() => Point, (point) => point.id)
    point: Point;

    @OneToMany(() => PointChild, (point_child) => point_child.point_parent_id)
    children: PointChild[];

    constructor() {
    }
  }
  
  export { PointParent };
  