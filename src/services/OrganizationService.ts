import { getCustomRepository, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import httpStatus from 'http-status';   

class OrganizationService {
    private connectOrganization: Repository<Organization>;
    constructor() {
        this.connectOrganization = getCustomRepository(OrganizationRepository);
    }

    async create(name: string, cep: string, state: string, district: string, city: string, street: string, number: number, description: string) {
        try {
            const organizationExist = await this.connectOrganization.findOne({ name });
            if (organizationExist) {
                return { status: httpStatus.BAD_REQUEST, message: 'Organização já existe' };
            }
            const organization = this.connectOrganization.create({ 
                name, 
                cep,
                state,
                district,
                city,
                street,
                number,
                description
            });
            await this.connectOrganization.save(organization);

            return { status: httpStatus.CREATED, obj: organization };
        } catch (error) {
            throw error;
        }
    }

    async ready() {
        try {
            return await this.connectOrganization.find();
        } catch (error) {
            throw error;
        }
    }

    async readyById(id: string) {
        try {
            const organization = await this.connectOrganization.findOne({ id });
            if (organization) {
                return { status: httpStatus.OK, obj: organization };
            }
            return { status: httpStatus.NOT_FOUND, message: 'Organização não existe!' };
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string) {
        try {
            const organization = await this.connectOrganization.findOne({ id });
            if (organization) {
                await this.connectOrganization.delete(organization.id);
                return { status: httpStatus.OK, message: 'Organização removida com sucesso!' };
            }
            return { status: httpStatus.NOT_FOUND, message: 'Organização não existe!' };
        } catch (error) {
            throw error;
        }
    }

    async update(id:string, name: string, cep: string, state: string, district: string, city: string, street: string, number: number, description: string) {
        try {
            const organization = await this.connectOrganization.findOne({ id });
            if (organization) {
                await this.connectOrganization.update(organization.id, { name, cep, state, district, city, street, description });
                return { status: httpStatus.OK, message: 'Organização atualizada com sucesso!' };
            }
            return { status: httpStatus.NOT_FOUND, message: 'Organização não existe!' };
        } catch (error) {
            throw error;
        }
    }
}

export { OrganizationService }