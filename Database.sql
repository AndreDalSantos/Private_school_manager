CREATE TABLE "teachers" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text,
  "name" text,
  "birth_date" timestamp,
  "education_level" text,
  "class_type" text,
  "subjects_taught" text,
  "created_at" timestamp
);

CREATE TABLE "members" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text,
  "name" text,
  "birth" timestamp,
  "email" text,
  "grade" text,
  "workload" integer,
  "teacher_id" integer
);

ALTER TABLE "students" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");
