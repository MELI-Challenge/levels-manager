import { Request, Response, Router } from 'express'
import { MakeMockDBOperations } from '@src/app/infrastructure/database'
import { ApiError, ApiResponse } from '@src/utils/interfaces'
import {
  handleDatabaseOperationError,
  mappingErrorHandler,
  mappingSuccessHandler
} from '../../input/utils/api-responses-handlers'
import { tryToMapLevel } from '../../input/level'

const getLevelHandler = async (req: Request, res: Response, databaseOperations: MakeMockDBOperations) => {
  const { levelId } = req.params
  return databaseOperations
    .getLevel(levelId)
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundLevel) => {
      return tryToMapLevel(foundLevel).thenMap<ApiResponse>(mappingSuccessHandler).thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getLevelRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/level/:levelId', (req, res) => getLevelHandler(req, res, databaseOperations))
}
