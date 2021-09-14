import * as yup from 'yup';

class MapDto {
  createUpdateValidation() {
    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      source: yup.string().required('Url é obrigatório'),
      description: yup.string().required('Descrição é obrigatória'),
      building_id: yup
        .string()
        .uuid('Id de prédio deve ser do tipo uuid')
        .required('Id de prédio é obrigatório'),
    });

    return schema;
  }
}

export { MapDto };