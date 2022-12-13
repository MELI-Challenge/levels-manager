import joi from '@hapi/joi'
import { LevelModel } from './interfaces'

export const levelValidateSchema = joi.object<LevelModel>({
  id_nivel: joi.string().required(),
  descripción: joi.string().required()
})
