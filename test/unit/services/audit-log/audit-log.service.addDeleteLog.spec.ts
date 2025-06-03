import { AddAuditLogDto } from '@audit-api/modules/audit/dtos/add-audit-log.dto';
import { AuditLog } from '@audit-api/modules/audit/entities/audit-log.entity';
import { EAuditActionType } from '@audit-api/modules/audit/enums/audit-action-type.enum';
import { AuditLogService } from '@audit-api/modules/audit/services/audit.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLogServiceTestData } from './data/audit-log-service-test.data';

let auditLogService: AuditLogService;
let auditLogRepositoryMock: Partial<jest.Mocked<Repository<AuditLog>>>;

beforeEach(async () => {
  auditLogRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
  } as Partial<jest.Mocked<Repository<AuditLog>>>;

  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [
      AuditLogService,
      {
        provide: getRepositoryToken(AuditLog),
        useValue: auditLogRepositoryMock,
      },
    ],
  }).compile();

  auditLogService = MODULE.get<AuditLogService>(AuditLogService);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should call save with correct values when addDeleteLog is called', async () => {
  // Arrange
  const AUDIT_LOG_DTO: AddAuditLogDto = AuditLogServiceTestData.getValidAddAuditLogDto();
  const AUDIT_LOG_ENTITY: AuditLog = AuditLogServiceTestData.getValidAuditLogEntity();

  auditLogRepositoryMock?.create?.mockReturnValue(AUDIT_LOG_ENTITY);

  // Act
  await auditLogService.addDeleteLog(AUDIT_LOG_DTO);

  // Assert
  expect(auditLogRepositoryMock.create).toHaveBeenCalledWith({
    entityId: AUDIT_LOG_DTO.entityId,
    entityReference: AUDIT_LOG_DTO.entityReference,
    entityTableName: AUDIT_LOG_DTO.entityTableName,
    actionDetail: AUDIT_LOG_DTO.actionDetail,
    actionType: EAuditActionType.DELETE,
  });

  expect(auditLogRepositoryMock.save).toHaveBeenCalledWith(AUDIT_LOG_ENTITY);
});

it('should not call save if entityId field is missing', async () => {
  // Arrange
  const AUDIT_LOG_DTO: AddAuditLogDto = AuditLogServiceTestData.getAddAuditLogDtoWithInvalidEntityId();

  // Act
  await auditLogService.addDeleteLog(AUDIT_LOG_DTO);

  // Assert
  expect(auditLogRepositoryMock.create).not.toHaveBeenCalled();
  expect(auditLogRepositoryMock.save).not.toHaveBeenCalled();
});

it('should not call save if entityReference field is missing', async () => {
  // Arrange
  const AUDIT_LOG_DTO: AddAuditLogDto = AuditLogServiceTestData.getAddAuditLogDtoWithInvalidEntityReference();

  // Act
  await auditLogService.addDeleteLog(AUDIT_LOG_DTO);

  // Assert
  expect(auditLogRepositoryMock.create).not.toHaveBeenCalled();
  expect(auditLogRepositoryMock.save).not.toHaveBeenCalled();
});

it('should not call save if entityTableName field is missing', async () => {
  // Arrange
  const AUDIT_LOG_DTO: AddAuditLogDto = AuditLogServiceTestData.getAddAuditLogDtoWithInvalidEntityTableName();

  // Act
  await auditLogService.addDeleteLog(AUDIT_LOG_DTO);

  // Assert
  expect(auditLogRepositoryMock.create).not.toHaveBeenCalled();
  expect(auditLogRepositoryMock.save).not.toHaveBeenCalled();
});

it('should not call save if entityTableName field is missing', async () => {
  // Arrange
  const AUDIT_LOG_DTO: AddAuditLogDto = AuditLogServiceTestData.getAddAuditLogDtoWithInvalidEntityActionDetail();

  // Act
  await auditLogService.addDeleteLog(AUDIT_LOG_DTO);

  // Assert
  expect(auditLogRepositoryMock.create).not.toHaveBeenCalled();
  expect(auditLogRepositoryMock.save).not.toHaveBeenCalled();
});
