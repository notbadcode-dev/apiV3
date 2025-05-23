import { APP_CONSTANTS } from '@common/constants/app.constants';
import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { EMessageType } from '@common/enums/message-type.enum';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../../../../src/app.service';

let service: AppService;

beforeEach(async () => {
  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [AppService],
  }).compile();

  service = MODULE.get<AppService>(AppService);
});

it('should return the correct API response', async () => {
  // Arrange
  const EXPECTED_MESSAGE_LIST_LENGTH = 0;
  const EXPECTED_MESSAGE_TYPE = EMessageType.SUCCESSFULLY;
  const EXPECTED_MESSAGE = APP_CONSTANTS.configuration.getHello;

  // Act
  const { data: RESPONSE_DATA, messageList: RESPONSE_MESSAGE_LIST }: GlobalResponseDto<null> = await service.getHello();

  // Assert
  expect(RESPONSE_DATA).toBeNull();
  expect(RESPONSE_MESSAGE_LIST.length).toBeGreaterThan(EXPECTED_MESSAGE_LIST_LENGTH);
  expect(RESPONSE_MESSAGE_LIST[0].type).toBe(EXPECTED_MESSAGE_TYPE);
  expect(RESPONSE_MESSAGE_LIST[0].message).toBe(EXPECTED_MESSAGE);
});
