import { AddAuditLogDto } from '../dtos/add-audit-log.dto';

export interface IAuditLogService {
  addCreateLog(addAuditLog: AddAuditLogDto): Promise<void>;

  // addUpdateLog(addAuditLog: AddAuditLogDto, manager: EntityManager): Promise<void>;

  // addDeleteLog(addAuditLog: AddAuditLogDto, manager: EntityManager): Promise<void>;

  // addActionLog(addAuditLog: AddAuditLogDto, manager: EntityManager): Promise<void>;
}
