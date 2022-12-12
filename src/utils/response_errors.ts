import { HttpStatusCode } from './httpStatusCodes'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  GetLevelError = HttpStatusCode.InternalServerError,
  LevelNotFound = HttpStatusCode.NotFound,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'GetLevelError' | 'LevelNotFound' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}
