import * as yup from 'yup';

class ChangeValidator {
  changeValidation() {
    return yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
      codVerificacao: yup.string().required(),
    });
  }
}

export { ChangeValidator };
