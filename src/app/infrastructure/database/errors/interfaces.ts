type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}

type GetLevelError = BaseError<'GetLevelError'>
type LevelNotFound = BaseError<'LevelNotFound'>

export type DatabaseOperationError = GetLevelError | LevelNotFound
