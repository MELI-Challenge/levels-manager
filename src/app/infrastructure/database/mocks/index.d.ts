import { LevelModel } from '../../input/level/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>

  getLevel(levelId: string): Promise<LevelModel>
}
