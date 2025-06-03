import { AddAuditLogDto } from '@audit-api/modules/audit/dtos/add-audit-log.dto';
import { AuditLog } from '@audit-api/modules/audit/entities/AuditLog.entity';
import { EAuditActionType } from '@audit-api/modules/audit/enums/audit-action-type.enum';

export class AuditLogServiceTestData {
  public static getValidAddAuditLogDto(): AddAuditLogDto {
    return {
      entityId: 123,
      entityReference: 'Test Reference',
      entityTableName: 'TestTable',
      actionDetail: 'Test Action Detail',
    };
  }

  public static getAddAuditLogDtoWithInvalidEntityId(): AddAuditLogDto {
    const DTO: AddAuditLogDto = this.getValidAddAuditLogDto();
    DTO.entityId = undefined;

    return DTO;
  }

  public static getAddAuditLogDtoWithInvalidEntityReference(): AddAuditLogDto {
    const DTO: AddAuditLogDto = this.getValidAddAuditLogDto();
    DTO.entityReference = '';

    return DTO;
  }

  public static getAddAuditLogDtoWithInvalidEntityTableName(): AddAuditLogDto {
    const DTO: AddAuditLogDto = this.getValidAddAuditLogDto();
    DTO.entityTableName = '';

    return DTO;
  }

  public static getAddAuditLogDtoWithInvalidEntityActionDetail(): AddAuditLogDto {
    const DTO: AddAuditLogDto = this.getValidAddAuditLogDto();
    DTO.actionDetail = undefined;

    return DTO;
  }

  public static getValidAuditLogEntity(): AuditLog {
    const AUDIT_LOG_DTO: AddAuditLogDto = this.getValidAddAuditLogDto();

    return {
      id: 1,
      entityId: AUDIT_LOG_DTO.entityId,
      entityReference: AUDIT_LOG_DTO.entityReference,
      entityTableName: AUDIT_LOG_DTO.entityTableName,
      actionType: EAuditActionType.CREATE,
      createdAt: new Date(),
    };
  }
}
