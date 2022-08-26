import * as yup from 'yup';

class BuildingValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      description: yup.string().required(),
      organization_id: yup.string().uuid().required(),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().optional(),
      latitude: yup.number().optional(),
      longitude: yup.number().optional(),
      description: yup.string().optional(),
      organization_id: yup.string().uuid().optional(),
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

export { BuildingValidator };
