-- Content admin core model for MySQL/TiDB-compatible providers.
-- Rollback must copy a historical published revision into a new published revision and move the pointer.
-- TiDB-compatible SQL intentionally avoids PostgreSQL-only types/casts/triggers.
-- module_revisions append-only enforcement is handled by least-privilege runtime grants in
-- db/grants/content_admin_runtime.sql because TiDB does not support trigger-based guards.

begin;

create table if not exists lessons (
  lesson_id varchar(191) primary key,
  slug varchar(191) not null unique,
  display_order int not null,
  enabled boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  constraint lessons_display_order_check check (display_order >= 0)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists lesson_modules (
  lesson_id varchar(191) not null,
  module_type varchar(64) not null,
  current_draft_revision_id bigint,
  current_draft_revision_kind varchar(32) not null default 'draft',
  current_published_revision_id bigint,
  current_published_revision_kind varchar(32) not null default 'published',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  primary key (lesson_id, module_type),
  constraint lesson_modules_lesson_fk foreign key (lesson_id)
    references lessons (lesson_id) on delete restrict,
  constraint lesson_modules_module_type_check check (
    module_type in (
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'practice',
      'reviewCards'
    )
  ),
  constraint lesson_modules_draft_kind_check check (current_draft_revision_kind = 'draft'),
  constraint lesson_modules_published_kind_check check (
    current_published_revision_kind = 'published'
  )
) engine=innodb default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists module_revisions (
  revision_id bigint primary key auto_increment,
  lesson_id varchar(191) not null,
  module_type varchar(64) not null,
  payload json not null,
  revision_kind varchar(32) not null,
  source_revision_id bigint,
  created_by varchar(191) not null default 'system',
  created_at timestamp not null default current_timestamp,
  note text,
  key module_revisions_lesson_module_created_idx (lesson_id, module_type, created_at desc, revision_id desc),
  key module_revisions_source_idx (source_revision_id),
  unique key module_revisions_revision_module_kind_uid (revision_id, lesson_id, module_type, revision_kind),
  constraint module_revisions_revision_kind_check check (revision_kind in ('draft', 'published')),
  constraint module_revisions_module_type_check check (
    module_type in (
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'practice',
      'reviewCards'
    )
  ),
  constraint module_revisions_module_fk foreign key (lesson_id, module_type)
    references lesson_modules (lesson_id, module_type) on delete restrict,
  constraint module_revisions_source_fk foreign key (source_revision_id)
    references module_revisions (revision_id) on delete restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_unicode_ci;

alter table lesson_modules
  add constraint lesson_modules_current_draft_revision_fk
  foreign key (current_draft_revision_id, lesson_id, module_type, current_draft_revision_kind)
    references module_revisions (revision_id, lesson_id, module_type, revision_kind)
    on delete restrict;

alter table lesson_modules
  add constraint lesson_modules_current_published_revision_fk
  foreign key (current_published_revision_id, lesson_id, module_type, current_published_revision_kind)
    references module_revisions (revision_id, lesson_id, module_type, revision_kind)
    on delete restrict;

commit;
