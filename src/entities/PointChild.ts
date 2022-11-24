import {
    PrimaryColumn,
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
import { Point } from './Point';
import { PointParent } from './PointParent';
  
  @Entity('point_childs')
  class PointChild {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column()
    is_obstacle: boolean;

    @Column()
    point_parent_id: string;

    @OneToOne(() => Point, (point) => point.id)
    point: Point;

    @ManyToOne(() => PointParent, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({ name: 'point_parent_id' })
    point_parent: PointParent;

    constructor() {}
  }
  
  export { PointChild };
  