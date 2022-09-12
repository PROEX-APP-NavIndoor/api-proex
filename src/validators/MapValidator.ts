import * as yup from 'yup';

class MapValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      source: yup.string().required(),
      description: yup.string().required(),
      scale_factor: yup.number().optional(),
      building_id: yup.string().uuid().required(),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().optional(),
      source: yup.string().optional(),
      description: yup.string().optional(),
      scale_factor: yup.number().optional(),
      building_id: yup.string().uuid().optional(),
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

export { MapValidator };
