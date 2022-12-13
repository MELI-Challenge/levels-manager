import { Level } from '@src/app/domain/entities/level'
import { Result, ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { LevelModel } from './interfaces'
import { levelValidateSchema } from './schemas'

export const tryToMapLevel = (userModel: LevelModel): ResultPromise<Level, ValidateSchemaError> => {
  return ResultPromise.fromResult(
    validateSchema(levelValidateSchema, userModel)
      .mapFailure((e) => e)
      .map<Level>((r) => ({
        id: r.id_nivel,
        description: r.descripción
      }))
  )
}
