import { DeepPartial, EntityManager, EntityRepository, Repository, TransactionManager } from 'typeorm';
import { PointChild } from '../entities/PointChild';
import { IPointChild } from '../interfaces/IPointChild.interface';

@EntityRepository(PointChild)
class PointChildRepository extends Repository<PointChild> {
    async savePointChild(
        @TransactionManager() transactionManager: EntityManager,
        pointChild: DeepPartial<PointChild>
    ) {
        const createPointChild: PointChild = await transactionManager.create(PointChild, pointChild);
        return await transactionManager.save(PointChild, createPointChild);
    };

    async updatePointChild(
        @TransactionManager() transactionManager: EntityManager,
        pointChild: IPointChild,
        pointChildId: string
    ) {
        const updatePointChild: PointChild = await transactionManager
            .create(PointChild, {id: pointChildId, ...pointChild});
        return await transactionManager.save(PointChild, updatePointChild);
    };

    async deletePointChild(
        @TransactionManager() transactionManager: EntityManager,
        pointChildId: string
    ) {
        return await transactionManager.delete(PointChild, pointChildId)
    };
}

export { PointChildRepository };
