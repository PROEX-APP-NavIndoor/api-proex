import * as yup from 'yup';
import { EnumTypePoint } from '../entities/PointParent';

class PointParentValidator {
  createValidation() {
    return yup.object().shape({
      name: yup.string().required(),
      description: yup.string().required(),
      floor: yup.number().required(),
      x: yup.number().required(),
      y: yup.number().required(),
      map_id: yup.string().uuid().required(),
      type: yup.mixed<keyof typeof EnumTypePoint>().oneOf(Object.values(EnumTypePoint)).required(),
      neighbor: yup.array(
        yup.object().optional()
      ).required()
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
      type: yup.mixed<keyof typeof EnumTypePoint>().oneOf(Object.values(EnumTypePoint)).optional(),
      neighbor: yup.array(
        yup.object().optional()
      ).optional()
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

export { PointParentValidator };