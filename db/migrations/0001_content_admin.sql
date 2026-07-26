-- Content admin core model for lessons, lesson-internal modules, and immutable revisions.
-- Rollback must copy a historical published revision into a new published revision and move the pointer;
-- module_revisions rows are intentionally immutable.

begin;

create table if not exists lessons (
  lesson_id text primary key,
  slug text not null unique,
  display_order integer not null check (display_order >= 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lesson_modules (
  lesson_id text not null references lessons (lesson_id) on delete restrict,
  module_type text not null,
  current_draft_revision_id bigint,
  current_published_revision_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (lesson_id, module_type),
  constraint lesson_modules_module_type_check check (
    module_type in (
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'pronunciation',
      'hanziRecognition',
      'practice',
      'reviewCards',
      'shortInput'
    )
  )
);

create table if not exists module_revisions (
  revision_id bigserial primary key,
  lesson_id text not null,
  module_type text not null,
  payload jsonb not null,
  revision_kind text not null check (revision_kind in ('draft', 'published')),
  source_revision_id bigint references module_revisions (revision_id) on delete restrict,
  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  note text,
  constraint module_revisions_module_type_check check (
    module_type in (
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'pronunciation',
      'hanziRecognition',
      'practice',
      'reviewCards',
      'shortInput'
    )
  ),
  constraint module_revisions_module_fk foreign key (lesson_id, module_type)
    references lesson_modules (lesson_id, module_type) on delete restrict
);

create index if not exists module_revisions_lesson_module_created_idx
  on module_revisions (lesson_id, module_type, created_at desc, revision_id desc);

alter table lesson_modules
  drop constraint if exists lesson_modules_current_draft_revision_fk;

alter table lesson_modules
  add constraint lesson_modules_current_draft_revision_fk
  foreign key (current_draft_revision_id) references module_revisions (revision_id) on delete restrict;

alter table lesson_modules
  drop constraint if exists lesson_modules_current_published_revision_fk;

alter table lesson_modules
  add constraint lesson_modules_current_published_revision_fk
  foreign key (current_published_revision_id) references module_revisions (revision_id) on delete restrict;

create or replace function validate_lesson_module_revision_pointers()
returns trigger
language plpgsql
as $$
declare
  revision record;
begin
  if new.current_published_revision_id is not null then
    select lesson_id, module_type, revision_kind
    into revision
    from module_revisions
    where revision_id = new.current_published_revision_id;

    if not found
      or revision.revision_kind <> 'published'
      or revision.lesson_id <> new.lesson_id
      or revision.module_type <> new.module_type then
      raise exception 'current_published_revision_id must point to a published revision for the same lesson module';
    end if;
  end if;

  if new.current_draft_revision_id is not null then
    select lesson_id, module_type, revision_kind
    into revision
    from module_revisions
    where revision_id = new.current_draft_revision_id;

    if not found
      or revision.revision_kind <> 'draft'
      or revision.lesson_id <> new.lesson_id
      or revision.module_type <> new.module_type then
      raise exception 'current_draft_revision_id must point to a draft revision for the same lesson module';
    end if;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists validate_lesson_module_revision_pointers on lesson_modules;

create trigger validate_lesson_module_revision_pointers
before insert or update on lesson_modules
for each row execute function validate_lesson_module_revision_pointers();

create or replace function prevent_module_revision_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'module_revisions are immutable; create a new revision instead';
end;
$$;

drop trigger if exists prevent_module_revision_mutation on module_revisions;

create trigger prevent_module_revision_mutation
before update or delete on module_revisions
for each row execute function prevent_module_revision_mutation();

commit;
