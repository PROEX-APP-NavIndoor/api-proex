import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Map } from './Map';
import { PointChild } from './PointChild';
import { PointParent } from './PointParent';

@Entity('points')
class Point {
  @PrimaryColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  x: number;

  @Column()
  y: number;
  
  @Column()
  floor: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  map_id: string;

  @ManyToOne(() => Map, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'map_id' })
  map: Map;

  @OneToOne(() => PointParent, (point_parent) => point_parent.id)
  parent: PointParent;

  @OneToOne(() => PointChild, (point_child) => point_child.id)
  child: PointChild;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Point };
