import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'
import { Level } from '@src/app/domain/entities/level'
import { LevelModel } from '@src/app/infrastructure/input/level/interfaces'
import { cloneDeep, set } from 'lodash'

const dummyLevelModel: LevelModel = {
  id_nivel: '1',
  descripción: 'fakeNombre'
}
const dummyLevelDomain: Level = {
  id: '1',
  description: 'fakeNombre'
}

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)
  const setAPIRoute = (levelId: string) => `/api/v1/level/${levelId}`

  jest.spyOn(global.console, 'error').mockImplementation(() => {})

  beforeEach(() => {})

  afterEach(async () => {})
  it('Should return client data and status 200', async () => {
    const apiRoute = setAPIRoute('ORO')
    mockClient.getLevel.mockImplementation(() => Promise.resolve(dummyLevelModel))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyLevelDomain)
      })
  })
  it('Should return an error and 404 if no client found', async () => {
    const apiRoute = setAPIRoute('ORO')
    mockClient.getLevel.mockImplementation(() => Promise.resolve({} as any))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('LevelNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown', async () => {
    const apiRoute = setAPIRoute('ORO')
    let error = new Error()
    mockClient.getLevel.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.InternalServerError)
      .then((response) => {
        expect(response.body.code).toBe('GetLevelError')
      })
  })
  it('Should return an error and 500 if schema validation fails', async () => {
    const apiRoute = setAPIRoute('ORO')
    const dummyClientBadFormat = cloneDeep(dummyLevelModel)
    dummyClientBadFormat.descripción = undefined as any
    mockClient.getLevel.mockImplementation(() => Promise.resolve(dummyClientBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })

  it('Should return the error code if not found', async () => {
    const apiRoute = setAPIRoute('ORO')
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getLevel.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('LevelNotFound')
      })
  })
})
