import { APP_CONSTANTS } from '@common/constants/app.constants';
import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { EMessageType } from '@common/enums/message-type.enum';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../../../../src/app.controller';
import { AppService } from '../../../../src/app.service';

let appController: AppController;

beforeEach(async () => {
  const APP: TestingModule = await Test.createTestingModule({
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  appController = APP.get<AppController>(AppController);
});

it('should return Hello API Message', async () => {
  // Arrange
  const EXPECTED_MESSAGE_LIST_LENGTH = 0;
  const EXPECTED_MESSAGE = APP_CONSTANTS.configuration.getHello;
  const EXPECTED_TYPE = EMessageType.SUCCESSFULLY;

  // Act
  const { data: RESPONSE_DATA, messageList: RESPONSE_MESSAGE_LIST }: GlobalResponseDto = await appController.getHello();

  // Assert
  expect(RESPONSE_DATA).toBeNull();
  expect(RESPONSE_MESSAGE_LIST.length).toBeGreaterThan(EXPECTED_MESSAGE_LIST_LENGTH);
  expect(RESPONSE_MESSAGE_LIST[0].type).toBe(EXPECTED_TYPE);
  expect(RESPONSE_MESSAGE_LIST[0].message).toBe(EXPECTED_MESSAGE);
});
