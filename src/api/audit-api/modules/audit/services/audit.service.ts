import { AddAuditLogDto } from '@audit-api/modules/audit/dtos/add-audit-log.dto';
import { AuditLog } from '@audit-api/modules/audit/entities/AuditLog.entity';
import { EAuditActionType } from '@audit-api/modules/audit/enums/audit-action-type.enum';
import { IAuditLogService } from '@audit-api/modules/audit/services/audit.service.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService implements IAuditLogService {
  //#region constructor and attributes

  constructor(@InjectRepository(AuditLog) private _auditLogRepository: Repository<AuditLog>) {}

  //#endregion

  //#region Public methods

  public async addCreateLog(addAuditLog: AddAuditLogDto): Promise<void> {
    await this.saveAuditLog(addAuditLog, EAuditActionType.CREATE);
  }

  public async addUpdateLog(addAuditLog: AddAuditLogDto): Promise<void> {
    await this.saveAuditLog(addAuditLog, EAuditActionType.UPDATE);
  }

  public async addDeleteLog(addAuditLog: AddAuditLogDto): Promise<void> {
    await this.saveAuditLog(addAuditLog, EAuditActionType.DELETE);
  }

  public async addActionLog(addAuditLog: AddAuditLogDto): Promise<void> {
    await this.saveAuditLog(addAuditLog, EAuditActionType.ACTION);
  }

  //#endregion

  //#region Private methods

  private async saveAuditLog(addAuditLog: AddAuditLogDto, actionType: EAuditActionType): Promise<void> {
    if (!addAuditLog.entityId || !addAuditLog?.entityReference?.length || !addAuditLog?.entityTableName?.length || !addAuditLog?.actionDetail?.length) {
      return;
    }

    const AUDIT_LOG_ENTITY = this._auditLogRepository.create({
      entityId: addAuditLog.entityId,
      entityReference: addAuditLog.entityReference,
      entityTableName: addAuditLog.entityTableName,
      actionDetail: addAuditLog.actionDetail,
      actionType: actionType ?? EAuditActionType.OTHERS,
    });

    await this._auditLogRepository.save(AUDIT_LOG_ENTITY);
  }

  //#endregion
}
