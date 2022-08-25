import ValidationError from "yup/lib/ValidationError";
import { ApiError } from "./ApiError";

/**
 * Throw an API error. Able to join multiple error messages into one for better visualization on response.
 *
 * For now works with the following error types:
 *
 * `Error`
 * `ValidationError`
 */
function throwApiError(code: number, genericError) {
    let message: string;
    if (genericError instanceof ValidationError)
        message = genericError.errors.join('; ');
    else if (genericError instanceof Error)
        message = genericError.message;

    throw new ApiError(code, message);
}

export { throwApiError }