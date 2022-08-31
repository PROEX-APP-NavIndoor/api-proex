import * as yup from 'yup';
import { EnumRoleUser } from '../entities/User';

class UserValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      role: yup.mixed<keyof typeof EnumRoleUser>().oneOf(Object.values(EnumRoleUser)).required(),
      organization_id: yup.string().uuid().required(),
    });
  }

  updateValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().optional(),
      email: yup.string().optional(),
      password: yup.string().optional(),
      role: yup.mixed<keyof typeof EnumRoleUser>().oneOf(Object.values(EnumRoleUser)).optional(),
      organization_id: yup.string().uuid().optional(),
    });
  }

  deleteByIdValidation() {
    return yup.object().shape({
      id: yup.string()
        .uuid().required(),
    });
  }

  readByIdValidation() {
    return yup.object().shape({
      id: yup.string().uuid().required(),
    });
  }
}

export { UserValidator };
