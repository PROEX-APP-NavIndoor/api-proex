import { DeepPartial, EntityManager, EntityRepository, Repository, TransactionManager } from 'typeorm';
import { Point } from '../entities/Point';
import { IPoint } from '../interfaces/IPoint.interface';
import { IPointChild } from '../interfaces/IPointChild.interface';
import { IPointParent } from '../interfaces/IPointParent.interface';

@EntityRepository(Point)
class PointRepository extends Repository<Point> {
    async savePoint(
        @TransactionManager() transactionManager: EntityManager,
        point: IPoint
    ) {
        const createPoint: Point = await transactionManager.create(Point, point);
        return await transactionManager.save(Point, createPoint);
    };

    async updatePoint(
        @TransactionManager() transactionManager: EntityManager,
        point: IPointParent&IPointChild,
        pointId: string
    ) {
        const updatePoint: Point = await transactionManager
            .create(Point, {id: pointId, ...point});
        return await transactionManager.save(Point, updatePoint);
    };

    async deletePoint(
        @TransactionManager() transactionManager: EntityManager,
        pointId: string
    ) {
        return await transactionManager.delete(Point, pointId)
    }
}

export { PointRepository };
