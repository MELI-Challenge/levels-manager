import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { LevelModel } from '../input/level/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getLevel: (levelId: string) => ResultPromise<LevelModel, DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getLevel = (levelId: string): ResultPromise<LevelModel, DatabaseOperationError> => {
    return ResultPromise.fromPromise<LevelModel, DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getLevel(levelId)
          .then((r) => handleDatabaseSuccess<LevelModel>(r, databaseOperationErrorHandler.onLevelNotFound))
          .catch((e) =>
            handleDatabaseError<LevelModel>(
              e,
              databaseOperationErrorHandler.onLevelNotFound,
              databaseOperationErrorHandler.onGetLevelError
            )
          )
      )
    )
  }

  return {
    getLevel
  }
}
