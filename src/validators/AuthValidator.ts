import * as yup from 'yup';

class AuthValidator {
  authValidation() {
    return yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });
  }
}

export { AuthValidator };
