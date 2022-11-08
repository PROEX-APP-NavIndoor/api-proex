import { getCustomRepository } from 'typeorm';
import { EnumRoleUser } from '../../entities/User';
import { BuildingRepository } from '../../repositories/BuildingRepository';
import { MapRepository } from '../../repositories/MapRepository';
import { OrganizationRepository } from '../../repositories/OrganizationRepository';
import { PointRepository } from '../../repositories/PointRepository';
import { PointParentRepository } from '../../repositories/Point_ParentRepository';
import { PointChildRepository } from '../../repositories/Point_ChildRepository';
import { EnumTypePoint } from '../../entities/PointParent';
import { UserRepository } from '../../repositories/UserRepository';
import 'dotenv/config';

class DataSeed {
  public static async verifyEntities(): Promise<boolean> {
    const repositoryUser = getCustomRepository(UserRepository);
    try {
      const allUsers = await repositoryUser.find();
      return !!allUsers.length;
    } catch (error) {
      return false;
    }
  }

  public static async createUsers(): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    const arrayUsers = [];

    arrayUsers.push(
      repository.create({
        id: '371c3364-6f04-4d71-be49-424343067e7d',
        name: 'User 1',
        email: 'user1@gmail.com',
        password: '123456',
        role: EnumRoleUser.super,
      }),
    );
    arrayUsers.push(
      repository.create({
        id: 'a052600e-298f-4f03-a8cd-72a44d5fa1e5',
        name: 'User 2',
        email: 'user2@gmail.com',
        password: '123456',
        role: EnumRoleUser.normal,
      }),
    );
    arrayUsers.push(
      repository.create({
        id: '461bba46-d541-493b-8e07-46b03b560a48',
        name: 'User 3',
        email: 'user3@gmail.com',
        password: '123456',
        role: EnumRoleUser.normal,
      }),
    );
    arrayUsers.push(
      repository.create({
        id: 'e9f728b5-9933-4993-8451-2bd0a91a9e8e',
        name: 'User 4',
        email: 'user4@gmail.com',
        password: '123456',
        role: EnumRoleUser.employee,
      }),
    );

    await repository.save(arrayUsers);
  }

  public static async createOrganizations(): Promise<void> {
    const repository = getCustomRepository(OrganizationRepository);
    const arrayOrganizations = [];

    arrayOrganizations.push(
      repository.create({
        id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
        name: 'Organização 1',
        cep: '37510-002',
        state: 'Minas Gerais',
        district: 'Centro',
        city: 'Itajubá',
        street: 'Rua Inácio Ferrão',
        number: 122,
        description: 'Escola',
      }),
    );
    arrayOrganizations.push(
      repository.create({
        id: '45659fc4-1946-4080-adba-d084543c3324',
        name: 'Organização 2',
        cep: '37510-012',
        state: 'Minas Gerais',
        district: 'Centro',
        city: 'Itajubá',
        street: 'Rua Castro Alves',
        number: 100,
        description: 'Faculdade',
      }),
    );

    await repository.save(arrayOrganizations);
  }

  public static async createBuildings(): Promise<void> {
    const repository = getCustomRepository(BuildingRepository);
    const arrayBuilding = [];

    arrayBuilding.push(
      repository.create({
        id: '5a6d70a4-d0c6-4f38-90fe-730fed66cd66',
        name: 'Prédio 1',
        latitude: -25.334776,
        longitude: -48.5304419,
        description: 'Descrição do prédio 1',
        organization_id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
      }),
    );
    arrayBuilding.push(
      repository.create({
        id: 'f372b5a3-bf4d-4fe8-bd4b-07fe1fb33011',
        name: 'Prédio 2',
        latitude: -25.33477,
        longitude: -48.5304422,
        description: 'Descrição do prédio 2',
        organization_id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
      }),
    );
    arrayBuilding.push(
      repository.create({
        id: '8ff9f33a-d975-4483-b305-95aeab4c0226',
        name: 'Prédio 3',
        latitude: -25.3348,
        longitude: -48.5304615,
        description: 'Descrição do prédio 3',
        organization_id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
      }),
    );
    arrayBuilding.push(
      repository.create({
        id: 'cb1584a7-d998-477c-ae99-00ff3e27ba45',
        name: 'Prédio 1',
        latitude: -28.334776,
        longitude: -45.5304419,
        description: 'Descrição do prédio 1',
        organization_id: '45659fc4-1946-4080-adba-d084543c3324',
      }),
    );
    arrayBuilding.push(
      repository.create({
        id: 'a37262f8-0ff5-4bec-ac90-9279f3f2dc9a',
        name: 'Prédio 2',
        latitude: -28.33421,
        longitude: -45.5301,
        description: 'Descrição do prédio 2',
        organization_id: '45659fc4-1946-4080-adba-d084543c3324',
      }),
    );

    await repository.save(arrayBuilding);
  }

  public static async createMaps(): Promise<void> {
    const repository = getCustomRepository(MapRepository);
    const arrayMaps = [];

    arrayMaps.push(
      repository.create({
        id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e',
        name: 'Map 1',
        source:
          'https://lh3.googleusercontent.com/proxy/MYVsPb8GalrYmSgYbGOvJLGC4nf9pmHRfmkHWc_Cv6H5zHuOV4nstIMk3m0LankaxsK9lpJMrKsEdkvCzHYEKawF7Ya0dc_tui5CIKEVPJGidDiAab95jnEXtxfPFheXOdcE60RI9AxI6uJFYpKEaxZrYnl6Lj-W4o07tR22QpnAsTC1bzlZBjJYcCvBnS4Kyw7IiJUKJhw7_AIMzpo-hw',
        description: 'Descrição do Mapa 1',
        building_id: '5a6d70a4-d0c6-4f38-90fe-730fed66cd66',
      }),
    );
    arrayMaps.push(
      repository.create({
        id: 'd80c3e0f-97b7-4a1d-bba3-384db2c1ff5c',
        name: 'Map 2',
        source:
          'https://ct.ufes.br/sites/ct.ufes.br/files/imagem/ct-adm-estrutura-fisica-mapa-geral.png',
        description: 'Descrição do Mapa 2',
        building_id: '5a6d70a4-d0c6-4f38-90fe-730fed66cd66',
      }),
    );
    arrayMaps.push(
      repository.create({
        id: 'bb0c94d4-8dda-4ce3-8742-5704d0fbd04b',
        name: 'Map 1',
        source:
          'https://ct.ufes.br/sites/ct.ufes.br/files/imagem/ct-adm-estrutura-fisica-mapa-geral.png',
        description: 'Descrição do Mapa 1',
        building_id: 'f372b5a3-bf4d-4fe8-bd4b-07fe1fb33011',
      }),
    );
    arrayMaps.push(
      repository.create({
        id: 'a7184129-4c29-4d8e-b271-4d043393a1d0',
        name: 'Map 1',
        source:
          'https://lh3.googleusercontent.com/proxy/MYVsPb8GalrYmSgYbGOvJLGC4nf9pmHRfmkHWc_Cv6H5zHuOV4nstIMk3m0LankaxsK9lpJMrKsEdkvCzHYEKawF7Ya0dc_tui5CIKEVPJGidDiAab95jnEXtxfPFheXOdcE60RI9AxI6uJFYpKEaxZrYnl6Lj-W4o07tR22QpnAsTC1bzlZBjJYcCvBnS4Kyw7IiJUKJhw7_AIMzpo-hw',
        description: 'Descrição do Mapa 1',
        building_id: '8ff9f33a-d975-4483-b305-95aeab4c0226',
      }),
    );
    arrayMaps.push(
      repository.create({
        id: 'c14330a6-841e-4cde-8d03-da0a66823975',
        name: 'Map 2',
        source:
          'https://ct.ufes.br/sites/ct.ufes.br/files/imagem/ct-adm-estrutura-fisica-mapa-geral.png',
        description: 'Descrição do Mapa 2',
        building_id: '8ff9f33a-d975-4483-b305-95aeab4c0226',
      }),
    );
    arrayMaps.push(
      repository.create({
        id: '7731f4c4-9866-4cb2-a723-3e1c6935e687',
        name: 'Map 3',
        source:
          'https://ct.ufes.br/sites/ct.ufes.br/files/imagem/ct-adm-estrutura-fisica-mapa-geral.png',
        description: 'Descrição do Mapa 3',
        building_id: '8ff9f33a-d975-4483-b305-95aeab4c0226',
      }),
    );

    await repository.save(arrayMaps);
  }

  public static async createPoints(): Promise<void> {
    const repository = {
      point: getCustomRepository(PointRepository),
      parent: getCustomRepository(PointParentRepository),
      child: getCustomRepository(PointChildRepository)
    };
    const array = {
      points:[],
      parents: [],
      childs: []
    };

    array.points.push(
      repository.point.create({
        id: '9fcbbe36-b52d-4192-8ff3-987049d7d9b3',
        name: 'Ponto pai 1',
        description: 'Descrição do ponto pai 1',
        x: 10.123,
        y: -25.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.parents.push(
      repository.parent.create({
        id: '9fcbbe36-b52d-4192-8ff3-987049d7d9b3',
        type: EnumTypePoint.entrance,
        neighbor: JSON.stringify([{
          id: "02036a0b-f170-4bd8-bed5-4f7d4b69e1da",
          direction: "n"
        }])
      })
    );

    array.points.push(
      repository.point.create({
        id: '02036a0b-f170-4bd8-bed5-4f7d4b69e1da',
        name: 'Ponto pai 2',
        description: 'Descrição do ponto pai 2',
        x: 10.123,
        y: 20.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.parents.push(
      repository.parent.create({
        id: '02036a0b-f170-4bd8-bed5-4f7d4b69e1da',
        type: EnumTypePoint.common,
        neighbor: JSON.stringify([
          {
            id: "9fcbbe36-b52d-4192-8ff3-987049d7d9b3",
            direction: "s"
          },
          {
            id: "a241e031-6890-46ad-a150-0cfa642eabbb",
            direction: "e"
          }
        ])
      })
    );

    array.points.push(
      repository.point.create({
        id: 'a241e031-6890-46ad-a150-0cfa642eabbb',
        name: 'Ponto pai 3',
        description: 'Descrição do ponto pai 3',
        x: 25.123,
        y: 20.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.parents.push(
      repository.parent.create({
        id: 'a241e031-6890-46ad-a150-0cfa642eabbb',
        type: EnumTypePoint.common,
        neighbor: JSON.stringify([
          {
            id: "02036a0b-f170-4bd8-bed5-4f7d4b69e1da",
            direction: "w"
          },
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "s"
          }
        ])
      })
    );

    array.points.push(
      repository.point.create({
        id: '7673ae02-8c33-46a4-a7ea-14836259dbc0',
        name: 'Ponto pai 4',
        description: 'Descrição do ponto pai 4',
        x: 2.123,
        y: 30.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.parents.push(
      repository.parent.create({
        id: '7673ae02-8c33-46a4-a7ea-14836259dbc0',
        type: EnumTypePoint.common,
        neighbor: JSON.stringify([
          {
            id: "a241e031-6890-46ad-a150-0cfa642eabbb",
            direction: "n"
          }
        ])
      })
    );

    array.points.push(
      repository.point.create({
        id: '8eb19032-85bc-4258-a54d-fbfe71883aea',
        name: 'Ponto Filho 1',
        description: 'Descrição do ponto filho 1',
        x: 9.123,
        y: -26.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.childs.push(
      repository.child.create({
        id: '7673ae02-8c33-46a4-a7ea-14836259dbc0',
        point_parent_id: '9fcbbe36-b52d-4192-8ff3-987049d7d9b3',
        is_obstacle: false
      })
    );

    array.points.push(
      repository.point.create({
        id: '2966b802-2f06-4bcd-8aa6-4e0e5dd3c555',
        name: 'Ponto Filho 2',
        description: 'Descrição do ponto filho 2',
        x: 11.123,
        y: -23.3347773,
        floor: 1,
        map_id: 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e'
      })
    );
    array.childs.push(
      repository.child.create({
        id: '2966b802-2f06-4bcd-8aa6-4e0e5dd3c555',
        point_parent_id: '9fcbbe36-b52d-4192-8ff3-987049d7d9b3',
        is_obstacle: true
      })
    );

    await repository.point.save(array.points);
    await repository.parent.save(array.parents);
    await repository.child.save(array.childs);
  }

  public static async associateUserOrganization() {
    const repository = getCustomRepository(UserRepository);
    const arrayUsers = await repository.find();

    arrayUsers.forEach((item, index) => {
      if (index % 2 === 0) item.organization_id = 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d';
      else item.organization_id = '45659fc4-1946-4080-adba-d084543c3324';
    });
    await repository.save(arrayUsers);
  }

  public static async createOneOrganization(): Promise<void> {
    const repository = getCustomRepository(OrganizationRepository);
    const organizatiotion = repository.create({
      id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
      name: 'Unifei - Universidade Federal',
      cep: '37510-002',
      state: 'Minas Gerais',
      district: 'Centro',
      city: 'Itajubá',
      street: 'Rua Inácio Ferrão',
      number: 122,
      description: 'Universidade Federal',
    });
    await repository.save(organizatiotion);
  }

  public static async createOneUser(): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    const user = repository.create({
      id: 'd8fbf4cb-3395-41db-81f3-a4db9ef9f657',
      name: 'PROEX ADMIN',
      email: process.env.INIT_USER_EMAIL,
      password: process.env.INIT_USER_PASSWORD,
      role: EnumRoleUser.super,
      organization_id: 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d',
    });
    await repository.save(user);
  }

  public static async findUserByEmail(email: string): Promise<boolean> {
    const repository = getCustomRepository(UserRepository);
    const user = await repository.findOne({ email });
    return !!user;
  }
}

export { DataSeed };
