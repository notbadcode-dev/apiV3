import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { ICatchExceptionResponse } from '@common/interfaces/catch-exception.interface';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { APP_E2E_CONSTANTS } from './constants/app.e2e.constants';
import { AppModule } from '../../src/app.module';

let app: INestApplication;

beforeEach(async () => {
  const MODULE_FIXTURE: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = MODULE_FIXTURE.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

it('/ (GET) - Get hello API Message', async () => {
  const { path: PATH, response: RESPONSE } = APP_E2E_CONSTANTS.getHelloRoute;

  await request(app.getHttpServer())
    .get(PATH)
    .expect(HttpStatus.OK)
    .expect((response: { body: GlobalResponseDto<null> }) => {
      const {
        data: DATA,
        messageList: [{ type: RESPONSE_MESSAGE_TYPE, message: RESPONSE_MESSAGE }],
      }: GlobalResponseDto<null> = response.body;

      expect(DATA).toBeNull();
      expect(RESPONSE_MESSAGE_TYPE).toEqual(RESPONSE.messageList[0].type);
      expect(RESPONSE_MESSAGE).toEqual(RESPONSE.messageList[0].message);
    });
});

it(
  '/ (POST) - route not defined, handled by exception middleware.',
  async () => {
    const {
      path: PATH,
      request: { body: BODY },
      response: RESPONSE,
    } = APP_E2E_CONSTANTS.notFoundRoute;

    await request(app.getHttpServer())
      .post(PATH)
      .send(BODY)
      .expect(HttpStatus.NOT_FOUND)
      .expect((response: { body: ICatchExceptionResponse }) => {
        const { error: ERROR, message: MESSAGE, statusCode: HTTP_STATUS } = response.body;

        expect(ERROR).toEqual(RESPONSE.error);
        expect(MESSAGE).toEqual(RESPONSE.message);
        expect(HTTP_STATUS).toEqual(RESPONSE.httpStatus);
      });
  },
  APP_E2E_CONSTANTS.defaultExecutionItTimeout,
);
