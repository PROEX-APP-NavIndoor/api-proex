import * as yup from 'yup';

class PointChildValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      description: yup.string().required(),
      floor: yup.number().required(),
      x: yup.number().required(),
      y: yup.number().required(),
      map_id: yup.string().uuid().required(),
      point_parent_id: yup.string().uuid().required(),
      is_obstacle: yup.boolean().required()
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
      point_parent_id: yup.string().uuid().optional(),
      is_obstacle: yup.boolean().optional()
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

export { PointChildValidator };