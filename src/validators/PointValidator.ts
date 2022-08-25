import * as yup from 'yup';

class PointValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      description: yup.string().required('Descrição é obrigatória'),
      floor: yup.number().required('O Andar é obrigatório'),
      x: yup.number().required('A coordenada x é obrigatória'),
      y: yup.number().required('A coordenada y é obrigatória'),
      breakPoint: yup.boolean().required('O Break Point é obrigatório'),
      neighbor: yup
        .object()
        .required('Os vizinhos são obrigatórios'),
      map_id: yup
        .string()
        .uuid('Id de mapa deve ser do tipo uuid')
        .required('Id de mapa é obrigatório'),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup
        .string()
        .uuid('Id de ponto deve ser do tipo uuid')
        .required('Id de ponto é obrigatório no parametro da requisição'),
      name: yup.string().optional(),
      description: yup.string().optional(),
      floor: yup.number().optional(),
      x: yup.number().optional(),
      y: yup.number().optional(),
      breakPoint: yup.boolean().optional(),
      neighbor: yup
        .object()
        .optional(),
      map_id: yup.string().uuid('Id de mapa deve ser do tipo uuid').optional(),
    });
  }

  deleteByIdValidation() {
    return yup.object().shape({
      id: yup
        .string()
        .uuid('Id de ponto deve ser do tipo uuid')
        .required('Id de ponto é obrigatório no parametro da requisição'),
    });
  }

  readByIdValidation() {
    return yup.object().shape({
      id: yup
        .string()
        .uuid('Id de ponto deve ser do tipo uuid')
        .required('Id de ponto é obrigatório no parametro da requisição'),
    });
  }
}

export { PointValidator };