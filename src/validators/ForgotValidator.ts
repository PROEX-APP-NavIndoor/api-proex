import * as yup from 'yup';

class ForgotValidator {
  forgotValidation() {
    return yup.object().shape({
      email: yup.string().email().required(),
    });
  }
}

export { ForgotValidator };
