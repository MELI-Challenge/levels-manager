import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onGetLevelError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetLevelError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetLevelError'
    }
  },
  onLevelNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] LevelNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'LevelNotFound'
    }
  }
}
