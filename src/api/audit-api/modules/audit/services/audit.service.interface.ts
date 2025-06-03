import { AddAuditLogDto } from '../dtos/add-audit-log.dto';

export interface IAuditLogService {
  addCreateLog(addAuditLog: AddAuditLogDto): Promise<void>;

  addUpdateLog(addAuditLog: AddAuditLogDto): Promise<void>;

  addDeleteLog(addAuditLog: AddAuditLogDto): Promise<void>;

  addActionLog(addAuditLog: AddAuditLogDto): Promise<void>;
}
