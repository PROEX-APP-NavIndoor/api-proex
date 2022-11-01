import { DeepPartial, EntityManager, EntityRepository, Repository, TransactionManager } from 'typeorm';
import { PointParent } from '../entities/PointParent';

@EntityRepository(PointParent)
class PointParentRepository extends Repository<PointParent> {
    async savePointParent(
        @TransactionManager() transactionManager: EntityManager,
        pointParent: DeepPartial<PointParent>
    ) {
        const createPointParent: PointParent = await transactionManager.create(PointParent, pointParent);
        return await transactionManager.save(PointParent, createPointParent);
    };

    async updatePointParent(
        @TransactionManager() transactionManager: EntityManager,
        pointParent: DeepPartial<PointParent>,
        pointParentId: string
    ) {
        const updatePointParent: PointParent = await transactionManager
            .create(PointParent, {id: pointParentId, ...pointParent});
        return await transactionManager.save(PointParent, updatePointParent);
    };

    async deletePointParent(
        @TransactionManager() transacationManager: EntityManager,
        pointParendId: string
    ) {
        return await transacationManager.delete(PointParent, pointParendId);
    }
}

export { PointParentRepository };
