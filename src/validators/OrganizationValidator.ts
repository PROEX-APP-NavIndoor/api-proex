import * as yup from 'yup';

class OrganizationValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      cep: yup.string().required(),
      state: yup.string().required(),
      district: yup.string().required(),
      city: yup.string().required(),
      street: yup.string().required(),
      number: yup.number().required(),
      description: yup.string().required(),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().optional(),
      cep: yup.string().optional(),
      state: yup.string().optional(),
      district: yup.string().optional(),
      city: yup.string().optional(),
      street: yup.string().optional(),
      number: yup.number().optional(),
      description: yup.string().optional(),
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

export { OrganizationValidator };
