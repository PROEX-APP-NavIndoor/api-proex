import * as yup from 'yup';

class PointValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      description: yup.string().required(),
      floor: yup.number().required(),
      x: yup.number().required(),
      y: yup.number().required(),
      breakPoint: yup.boolean().required(),
      neighbor: yup.object().required(),
      map_id: yup.string().uuid().required(),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().optional(),
      description: yup.string().optional(),
      floor: yup.number().optional(),
      x: yup.number().optional(),
      y: yup.number().optional(),
      breakPoint: yup.boolean().optional(),
      neighbor: yup.object().optional(),
      map_id: yup.string().uuid().optional(),
    });
  }

  deleteByIdValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
    });
  }

  readByIdValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
    });
  }
}

export { PointValidator };