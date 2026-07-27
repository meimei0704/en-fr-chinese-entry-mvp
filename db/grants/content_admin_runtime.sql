-- TiDB-compatible least-privilege runtime/admin-write grants for content-admin.
-- Replace placeholders through a secrets-safe operator process before execution.
-- Do not commit real usernames, hosts, passwords, or database names in this file.
--
-- Invariant: module_revisions is append-only for runtime/admin-write code.
-- The migration/bootstrap credential must not be used by runtime.
-- The runtime/admin-write user must not have global privileges or table-level
-- UPDATE/DELETE privileges on `module_revisions`; rollback/publish must insert a
-- new module_revisions row and then move lesson_modules pointers.

grant select on `__CONTENT_ADMIN_DB__`.`lessons` to '__CONTENT_ADMIN_RUNTIME_USER__'@'__CONTENT_ADMIN_RUNTIME_HOST__';
grant select, update on `__CONTENT_ADMIN_DB__`.`lesson_modules` to '__CONTENT_ADMIN_RUNTIME_USER__'@'__CONTENT_ADMIN_RUNTIME_HOST__';
grant select, insert on `__CONTENT_ADMIN_DB__`.`module_revisions` to '__CONTENT_ADMIN_RUNTIME_USER__'@'__CONTENT_ADMIN_RUNTIME_HOST__';
