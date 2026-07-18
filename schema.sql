[
  {
    "table_name": "admin_users",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admin_users",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admin_users",
    "column_name": "is_admin",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admin_users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admins",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admins",
    "column_name": "username",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "admins",
    "column_name": "password_hash",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('blog_posts_id_seq'::regclass)",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "blog_posts",
    "column_name": "title",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "content",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "table_name": "form_submissions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "subject",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "property_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "property_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "table_name": "properties",
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "table_name": "properties",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "location",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "bhk",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "carpet_area",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "possession",
    "data_type": "date",
    "udt_name": "date",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "no_of_units",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "properties",
    "column_name": "rera_no",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "developed_by",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "property_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "project_area",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "ownership",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "floor",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "property_view",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "parking",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "about_property",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "key_features",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "amenities",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "floor_space_pricing",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "google_map_location",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "explore_neighbourhood",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "about_builder_company",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "about_location",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "google_drive_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "towers",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "properties",
    "column_name": "price",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "role",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "feedback",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "testimonials",
    "column_name": "stars",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "5",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  }
]

[
  {
    "table_name": "admin_users",
    "column_name": "id",
    "constraint_name": "admin_users_pkey"
  },
  {
    "table_name": "admins",
    "column_name": "id",
    "constraint_name": "admins_pkey"
  },
  {
    "table_name": "blog_posts",
    "column_name": "id",
    "constraint_name": "blog_posts_pkey"
  },
  {
    "table_name": "form_submissions",
    "column_name": "id",
    "constraint_name": "form_submissions_pkey"
  },
  {
    "table_name": "properties",
    "column_name": "id",
    "constraint_name": "properties_pkey"
  },
  {
    "table_name": "testimonials",
    "column_name": "id",
    "constraint_name": "testimonials_pkey"
  }
]

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema='public'
ORDER BY tc.table_name;
return: Success. No rows returned

[
  {
    "table_name": "admin_users",
    "column_name": "user_id",
    "constraint_name": "admin_users_user_id_key"
  },
  {
    "table_name": "admins",
    "column_name": "username",
    "constraint_name": "admins_username_key"
  }
]

[
  {
    "table_name": "admin_users",
    "constraint_name": "2200_17853_3_not_null",
    "check_clause": "is_admin IS NOT NULL"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "2200_17853_1_not_null",
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "2200_17853_2_not_null",
    "check_clause": "user_id IS NOT NULL"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "2200_17853_4_not_null",
    "check_clause": "created_at IS NOT NULL"
  },
  {
    "table_name": "admins",
    "constraint_name": "2200_17859_1_not_null",
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "admins",
    "constraint_name": "2200_17859_2_not_null",
    "check_clause": "username IS NOT NULL"
  },
  {
    "table_name": "admins",
    "constraint_name": "2200_17859_3_not_null",
    "check_clause": "password_hash IS NOT NULL"
  },
  {
    "table_name": "blog_posts",
    "constraint_name": "2200_17865_1_not_null",
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "blog_posts",
    "constraint_name": "2200_17865_2_not_null",
    "check_clause": "title IS NOT NULL"
  },
  {
    "table_name": "blog_posts",
    "constraint_name": "2200_17865_3_not_null",
    "check_clause": "content IS NOT NULL"
  },
  {
    "table_name": "form_submissions",
    "constraint_name": "2200_17872_1_not_null",
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "form_submissions",
    "constraint_name": "2200_17872_2_not_null",
    "check_clause": "created_at IS NOT NULL"
  },
  {
    "table_name": "properties",
    "constraint_name": "2200_17879_2_not_null",
    "check_clause": "created_at IS NOT NULL"
  },
  {
    "table_name": "properties",
    "constraint_name": "2200_17879_1_not_null",
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "testimonials",
    "constraint_name": "2200_17886_2_not_null",
    "check_clause": "name IS NOT NULL"
  },
  {
    "table_name": "testimonials",
    "constraint_name": "2200_17886_1_not_null",
    "check_clause": "id IS NOT NULL"
  }
]

[
  {
    "tablename": "admin_users",
    "indexname": "admin_users_pkey",
    "indexdef": "CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (id)"
  },
  {
    "tablename": "admin_users",
    "indexname": "admin_users_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX admin_users_user_id_key ON public.admin_users USING btree (user_id)"
  },
  {
    "tablename": "admins",
    "indexname": "admins_pkey",
    "indexdef": "CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id)"
  },
  {
    "tablename": "admins",
    "indexname": "admins_username_key",
    "indexdef": "CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username)"
  },
  {
    "tablename": "blog_posts",
    "indexname": "blog_posts_pkey",
    "indexdef": "CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id)"
  },
  {
    "tablename": "form_submissions",
    "indexname": "form_submissions_pkey",
    "indexdef": "CREATE UNIQUE INDEX form_submissions_pkey ON public.form_submissions USING btree (id)"
  },
  {
    "tablename": "properties",
    "indexname": "properties_pkey",
    "indexdef": "CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id)"
  },
  {
    "tablename": "testimonials",
    "indexname": "testimonials_pkey",
    "indexdef": "CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id)"
  }
]

SELECT
    event_object_table,
    trigger_name,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema='public'
ORDER BY event_object_table;

result: Success. No rows returned.

SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE specific_schema='public'
ORDER BY routine_name;

result: Success. No rows returned.

SELECT
    table_name
FROM information_schema.views
WHERE table_schema='public';

result: Success. No rows returned.

SELECT
    matviewname
FROM pg_matviews
WHERE schemaname='public';

result: Success. No rows returned.

[
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "rowsecurity": true
  },
  {
    "schemaname": "public",
    "tablename": "admins",
    "rowsecurity": true
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "rowsecurity": true
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "rowsecurity": true
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "rowsecurity": true
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "rowsecurity": true
  }
]

[
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "policyname": "Delete: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "policyname": "Insert: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IS NOT NULL)"
  },
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "policyname": "Read: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "policyname": "Update: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "admins",
    "policyname": "Allow admin login access",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "policyname": "Allow Insert for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "policyname": "Allow Update for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "policyname": "Allow delete for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "policyname": "Allow select for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Allow insert to leads",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Allow read for anyone",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Delete for everyone",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Delete: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Insert: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IS NOT NULL)"
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Read: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Update for everyone",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "form_submissions",
    "policyname": "Update: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Public upload to property-images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(bucket_id = 'property-images'::text)"
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Public upload to testimonials-photos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(bucket_id = 'testimonial-photos'::text)"
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Allow insert for anyone",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Allow public inserts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Allow public selects",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Allow updates for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Delete: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Insert: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IS NOT NULL)"
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Read: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "properties",
    "policyname": "Update: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Allow delete for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Allow insert for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Allow select for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Allow update for all",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Delete: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Insert: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IS NOT NULL)"
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Read: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "testimonials",
    "policyname": "Update: Authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() IS NOT NULL)",
    "with_check": null
  }
]

[
  {
    "table_name": "properties",
    "total_size": "296 kB"
  },
  {
    "table_name": "refresh_tokens",
    "total_size": "160 kB"
  },
  {
    "table_name": "objects",
    "total_size": "152 kB"
  },
  {
    "table_name": "users",
    "total_size": "152 kB"
  },
  {
    "table_name": "audit_log_entries",
    "total_size": "104 kB"
  },
  {
    "table_name": "sessions",
    "total_size": "96 kB"
  },
  {
    "table_name": "one_time_tokens",
    "total_size": "88 kB"
  },
  {
    "table_name": "identities",
    "total_size": "80 kB"
  },
  {
    "table_name": "mfa_factors",
    "total_size": "56 kB"
  },
  {
    "table_name": "custom_oauth_providers",
    "total_size": "56 kB"
  },
  {
    "table_name": "admins",
    "total_size": "48 kB"
  },
  {
    "table_name": "buckets",
    "total_size": "48 kB"
  },
  {
    "table_name": "oauth_consents",
    "total_size": "48 kB"
  },
  {
    "table_name": "blog_posts",
    "total_size": "48 kB"
  },
  {
    "table_name": "mfa_amr_claims",
    "total_size": "48 kB"
  },
  {
    "table_name": "migrations",
    "total_size": "40 kB"
  },
  {
    "table_name": "flow_state",
    "total_size": "40 kB"
  },
  {
    "table_name": "admin_users",
    "total_size": "40 kB"
  },
  {
    "table_name": "oauth_authorizations",
    "total_size": "40 kB"
  },
  {
    "table_name": "saml_relay_states",
    "total_size": "40 kB"
  },
  {
    "table_name": "testimonials",
    "total_size": "32 kB"
  },
  {
    "table_name": "form_submissions",
    "total_size": "32 kB"
  },
  {
    "table_name": "subscription",
    "total_size": "32 kB"
  },
  {
    "table_name": "saml_providers",
    "total_size": "32 kB"
  },
  {
    "table_name": "webauthn_challenges",
    "total_size": "32 kB"
  },
  {
    "table_name": "sso_providers",
    "total_size": "32 kB"
  },
  {
    "table_name": "sso_domains",
    "total_size": "32 kB"
  },
  {
    "table_name": "webauthn_credentials",
    "total_size": "32 kB"
  },
  {
    "table_name": "schema_migrations",
    "total_size": "24 kB"
  },
  {
    "table_name": "mfa_challenges",
    "total_size": "24 kB"
  },
  {
    "table_name": "secrets",
    "total_size": "24 kB"
  },
  {
    "table_name": "oauth_clients",
    "total_size": "24 kB"
  },
  {
    "table_name": "schema_migrations",
    "total_size": "24 kB"
  },
  {
    "table_name": "buckets_analytics",
    "total_size": "24 kB"
  },
  {
    "table_name": "oauth_client_states",
    "total_size": "24 kB"
  },
  {
    "table_name": "s3_multipart_uploads",
    "total_size": "24 kB"
  },
  {
    "table_name": "vector_indexes",
    "total_size": "24 kB"
  },
  {
    "table_name": "instances",
    "total_size": "16 kB"
  },
  {
    "table_name": "s3_multipart_uploads_parts",
    "total_size": "16 kB"
  },
  {
    "table_name": "buckets_vectors",
    "total_size": "16 kB"
  }
]

[
  {
    "table_name": "audit_log_entries",
    "estimated_rows": 132
  },
  {
    "table_name": "objects",
    "estimated_rows": 84
  },
  {
    "table_name": "schema_migrations",
    "estimated_rows": 77
  },
  {
    "table_name": "schema_migrations",
    "estimated_rows": 77
  },
  {
    "table_name": "refresh_tokens",
    "estimated_rows": 69
  },
  {
    "table_name": "migrations",
    "estimated_rows": 61
  },
  {
    "table_name": "properties",
    "estimated_rows": 51
  },
  {
    "table_name": "form_submissions",
    "estimated_rows": 10
  },
  {
    "table_name": "mfa_amr_claims",
    "estimated_rows": 7
  },
  {
    "table_name": "sessions",
    "estimated_rows": 7
  },
  {
    "table_name": "buckets",
    "estimated_rows": 3
  },
  {
    "table_name": "testimonials",
    "estimated_rows": 2
  },
  {
    "table_name": "users",
    "estimated_rows": 1
  },
  {
    "table_name": "blog_posts",
    "estimated_rows": 1
  },
  {
    "table_name": "identities",
    "estimated_rows": 1
  },
  {
    "table_name": "admins",
    "estimated_rows": 1
  },
  {
    "table_name": "admin_users",
    "estimated_rows": 1
  },
  {
    "table_name": "oauth_consents",
    "estimated_rows": 0
  },
  {
    "table_name": "sso_providers",
    "estimated_rows": 0
  },
  {
    "table_name": "buckets_vectors",
    "estimated_rows": 0
  },
  {
    "table_name": "saml_providers",
    "estimated_rows": 0
  },
  {
    "table_name": "vector_indexes",
    "estimated_rows": 0
  },
  {
    "table_name": "mfa_factors",
    "estimated_rows": 0
  },
  {
    "table_name": "s3_multipart_uploads_parts",
    "estimated_rows": 0
  },
  {
    "table_name": "webauthn_credentials",
    "estimated_rows": 0
  },
  {
    "table_name": "oauth_client_states",
    "estimated_rows": 0
  },
  {
    "table_name": "subscription",
    "estimated_rows": 0
  },
  {
    "table_name": "custom_oauth_providers",
    "estimated_rows": 0
  },
  {
    "table_name": "mfa_challenges",
    "estimated_rows": 0
  },
  {
    "table_name": "s3_multipart_uploads",
    "estimated_rows": 0
  },
  {
    "table_name": "sso_domains",
    "estimated_rows": 0
  },
  {
    "table_name": "one_time_tokens",
    "estimated_rows": 0
  },
  {
    "table_name": "flow_state",
    "estimated_rows": 0
  },
  {
    "table_name": "instances",
    "estimated_rows": 0
  },
  {
    "table_name": "saml_relay_states",
    "estimated_rows": 0
  },
  {
    "table_name": "oauth_clients",
    "estimated_rows": 0
  },
  {
    "table_name": "webauthn_challenges",
    "estimated_rows": 0
  },
  {
    "table_name": "secrets",
    "estimated_rows": 0
  },
  {
    "table_name": "oauth_authorizations",
    "estimated_rows": 0
  },
  {
    "table_name": "buckets_analytics",
    "estimated_rows": 0
  },
  {
    "table_name": "messages",
    "estimated_rows": 0
  }
].

[
  {
    "sequence_schema": "public",
    "sequence_name": "blog_posts_id_seq"
  }
]

[
  {
    "table_name": "admins",
    "column_name": "id",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_name": "testimonials",
    "column_name": "id",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "admin_users",
    "column_name": "id",
    "column_default": "uuid_generate_v4()"
  }
]

[
  {
    "table_name": "properties",
    "column_name": "amenities",
    "data_type": "jsonb"
  },
  {
    "table_name": "properties",
    "column_name": "floor_space_pricing",
    "data_type": "jsonb"
  }
]

[
  {
    "enum_name": "aal_level",
    "value": "aal1"
  },
  {
    "enum_name": "aal_level",
    "value": "aal2"
  },
  {
    "enum_name": "aal_level",
    "value": "aal3"
  },
  {
    "enum_name": "action",
    "value": "INSERT"
  },
  {
    "enum_name": "action",
    "value": "UPDATE"
  },
  {
    "enum_name": "action",
    "value": "DELETE"
  },
  {
    "enum_name": "action",
    "value": "TRUNCATE"
  },
  {
    "enum_name": "action",
    "value": "ERROR"
  },
  {
    "enum_name": "buckettype",
    "value": "STANDARD"
  },
  {
    "enum_name": "buckettype",
    "value": "ANALYTICS"
  },
  {
    "enum_name": "buckettype",
    "value": "VECTOR"
  },
  {
    "enum_name": "code_challenge_method",
    "value": "s256"
  },
  {
    "enum_name": "code_challenge_method",
    "value": "plain"
  },
  {
    "enum_name": "equality_op",
    "value": "eq"
  },
  {
    "enum_name": "equality_op",
    "value": "neq"
  },
  {
    "enum_name": "equality_op",
    "value": "lt"
  },
  {
    "enum_name": "equality_op",
    "value": "lte"
  },
  {
    "enum_name": "equality_op",
    "value": "gt"
  },
  {
    "enum_name": "equality_op",
    "value": "gte"
  },
  {
    "enum_name": "equality_op",
    "value": "in"
  },
  {
    "enum_name": "equality_op",
    "value": "like"
  },
  {
    "enum_name": "equality_op",
    "value": "ilike"
  },
  {
    "enum_name": "equality_op",
    "value": "is"
  },
  {
    "enum_name": "equality_op",
    "value": "match"
  },
  {
    "enum_name": "equality_op",
    "value": "imatch"
  },
  {
    "enum_name": "equality_op",
    "value": "isdistinct"
  },
  {
    "enum_name": "factor_status",
    "value": "unverified"
  },
  {
    "enum_name": "factor_status",
    "value": "verified"
  },
  {
    "enum_name": "factor_type",
    "value": "totp"
  },
  {
    "enum_name": "factor_type",
    "value": "webauthn"
  },
  {
    "enum_name": "factor_type",
    "value": "phone"
  },
  {
    "enum_name": "oauth_authorization_status",
    "value": "pending"
  },
  {
    "enum_name": "oauth_authorization_status",
    "value": "approved"
  },
  {
    "enum_name": "oauth_authorization_status",
    "value": "denied"
  },
  {
    "enum_name": "oauth_authorization_status",
    "value": "expired"
  },
  {
    "enum_name": "oauth_client_type",
    "value": "public"
  },
  {
    "enum_name": "oauth_client_type",
    "value": "confidential"
  },
  {
    "enum_name": "oauth_registration_type",
    "value": "dynamic"
  },
  {
    "enum_name": "oauth_registration_type",
    "value": "manual"
  },
  {
    "enum_name": "oauth_response_type",
    "value": "code"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "confirmation_token"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "reauthentication_token"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "recovery_token"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "email_change_token_new"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "email_change_token_current"
  },
  {
    "enum_name": "one_time_token_type",
    "value": "phone_change_token"
  }
]

[
  {
    "extname": "pg_graphql",
    "extversion": "1.6.1"
  },
  {
    "extname": "pg_stat_statements",
    "extversion": "1.10"
  },
  {
    "extname": "pgcrypto",
    "extversion": "1.3"
  },
  {
    "extname": "pgjwt",
    "extversion": "0.2.0"
  },
  {
    "extname": "plpgsql",
    "extversion": "1.0"
  },
  {
    "extname": "supabase_vault",
    "extversion": "0.3.1"
  },
  {
    "extname": "uuid-ossp",
    "extversion": "1.1"
  }
]

[
  {
    "table_name": "admin_users"
  },
  {
    "table_name": "admins"
  },
  {
    "table_name": "blog_posts"
  },
  {
    "table_name": "form_submissions"
  },
  {
    "table_name": "properties"
  },
  {
    "table_name": "testimonials"
  }
]

[
  {
    "table_name": "admin_users",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "admin_users",
    "column_name": "user_id",
    "description": null
  },
  {
    "table_name": "admin_users",
    "column_name": "is_admin",
    "description": null
  },
  {
    "table_name": "admin_users",
    "column_name": "created_at",
    "description": null
  },
  {
    "table_name": "admins",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "admins",
    "column_name": "username",
    "description": null
  },
  {
    "table_name": "admins",
    "column_name": "password_hash",
    "description": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "title",
    "description": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "content",
    "description": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "image_url",
    "description": null
  },
  {
    "table_name": "blog_posts",
    "column_name": "created_at",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "created_at",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "name",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "email",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "subject",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "phone",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "message",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "property_name",
    "description": null
  },
  {
    "table_name": "form_submissions",
    "column_name": "property_id",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "created_at",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "name",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "location",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "bhk",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "carpet_area",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "possession",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "no_of_units",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "rera_no",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "developed_by",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "property_type",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "project_area",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "ownership",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "floor",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "property_view",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "parking",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "about_property",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "key_features",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "amenities",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "floor_space_pricing",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "google_map_location",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "explore_neighbourhood",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "about_builder_company",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "about_location",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "image_url",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "google_drive_url",
    "description": "Google Drive URL for browser"
  },
  {
    "table_name": "properties",
    "column_name": "towers",
    "description": null
  },
  {
    "table_name": "properties",
    "column_name": "price",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "id",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "name",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "role",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "feedback",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "image_url",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "created_at",
    "description": null
  },
  {
    "table_name": "testimonials",
    "column_name": "stars",
    "description": null
  }
]

[
  {
    "id": "property-images",
    "name": "property-images",
    "owner": null,
    "created_at": "2025-04-13 08:40:02.216187+00",
    "updated_at": "2025-04-13 08:40:02.216187+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  },
  {
    "id": "testimonial-photos",
    "name": "testimonial-photos",
    "owner": null,
    "created_at": "2025-04-14 04:30:20.495201+00",
    "updated_at": "2025-04-14 04:30:20.495201+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  },
  {
    "id": "blog-images",
    "name": "blog-images",
    "owner": null,
    "created_at": "2025-04-18 04:56:48.177192+00",
    "updated_at": "2025-04-18 04:56:48.177192+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  }
]

[
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Public upload to testimonials-photos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(bucket_id = 'testimonial-photos'::text)"
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Public upload to property-images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(bucket_id = 'property-images'::text)"
  }
]

[
  {
    "bucket_id": "blog-images",
    "total_files": 1
  },
  {
    "bucket_id": "property-images",
    "total_files": 83
  }
]

[
  {
    "oid": 18313,
    "pubname": "supabase_realtime",
    "pubowner": 16388,
    "puballtables": false,
    "pubinsert": true,
    "pubupdate": true,
    "pubdelete": true,
    "pubtruncate": true,
    "pubviaroot": false
  }
]

[
  {
    "oid": 18313,
    "pubname": "supabase_realtime",
    "pubowner": 16388,
    "puballtables": false,
    "pubinsert": true,
    "pubupdate": true,
    "pubdelete": true,
    "pubtruncate": true,
    "pubviaroot": false
  }
]

[
  {
    "version": "PostgreSQL 15.14 on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 15.2.0, 64-bit"
  }
]. 

[
  {
    "name": "address_standardizer",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "Used to parse an address into constituent elements. Generally used to support geocoding address normalization step."
  },
  {
    "name": "address_standardizer_data_us",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "Address Standardizer US dataset example"
  },
  {
    "name": "adminpack",
    "default_version": "2.1",
    "installed_version": null,
    "comment": "administrative functions for PostgreSQL"
  },
  {
    "name": "amcheck",
    "default_version": "1.3",
    "installed_version": null,
    "comment": "functions for verifying relation integrity"
  },
  {
    "name": "autoinc",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions for autoincrementing fields"
  },
  {
    "name": "bloom",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "bloom access method - signature file based index"
  },
  {
    "name": "btree_gin",
    "default_version": "1.3",
    "installed_version": null,
    "comment": "support for indexing common datatypes in GIN"
  },
  {
    "name": "btree_gist",
    "default_version": "1.7",
    "installed_version": null,
    "comment": "support for indexing common datatypes in GiST"
  },
  {
    "name": "citext",
    "default_version": "1.6",
    "installed_version": null,
    "comment": "data type for case-insensitive character strings"
  },
  {
    "name": "cube",
    "default_version": "1.5",
    "installed_version": null,
    "comment": "data type for multidimensional cubes"
  },
  {
    "name": "dblink",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "connect to other PostgreSQL databases from within a database"
  },
  {
    "name": "dict_int",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "text search dictionary template for integers"
  },
  {
    "name": "dict_xsyn",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "text search dictionary template for extended synonym processing"
  },
  {
    "name": "earthdistance",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "calculate great-circle distances on the surface of the Earth"
  },
  {
    "name": "file_fdw",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "foreign-data wrapper for flat file access"
  },
  {
    "name": "fuzzystrmatch",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "determine similarities and distance between strings"
  },
  {
    "name": "hstore",
    "default_version": "1.8",
    "installed_version": null,
    "comment": "data type for storing sets of (key, value) pairs"
  },
  {
    "name": "http",
    "default_version": "1.6",
    "installed_version": null,
    "comment": "HTTP client for PostgreSQL, allows web page retrieval inside the database."
  },
  {
    "name": "hypopg",
    "default_version": "1.4.1",
    "installed_version": null,
    "comment": "Hypothetical indexes for PostgreSQL"
  },
  {
    "name": "index_advisor",
    "default_version": "0.2.0",
    "installed_version": null,
    "comment": "Query index advisor"
  },
  {
    "name": "insert_username",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions for tracking who changed a table"
  },
  {
    "name": "intagg",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "integer aggregator and enumerator (obsolete)"
  },
  {
    "name": "intarray",
    "default_version": "1.5",
    "installed_version": null,
    "comment": "functions, operators, and index support for 1-D arrays of integers"
  },
  {
    "name": "isn",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "data types for international product numbering standards"
  },
  {
    "name": "lo",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "Large Object maintenance"
  },
  {
    "name": "ltree",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "data type for hierarchical tree-like structures"
  },
  {
    "name": "moddatetime",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions for tracking last modification time"
  },
  {
    "name": "old_snapshot",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "utilities in support of old_snapshot_threshold"
  },
  {
    "name": "pageinspect",
    "default_version": "1.11",
    "installed_version": null,
    "comment": "inspect the contents of database pages at a low level"
  },
  {
    "name": "pg_buffercache",
    "default_version": "1.3",
    "installed_version": null,
    "comment": "examine the shared buffer cache"
  },
  {
    "name": "pg_cron",
    "default_version": "1.6.4",
    "installed_version": null,
    "comment": "Job scheduler for PostgreSQL"
  },
  {
    "name": "pg_freespacemap",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "examine the free space map (FSM)"
  },
  {
    "name": "pg_graphql",
    "default_version": "1.6.1",
    "installed_version": "1.6.1",
    "comment": "pg_graphql: GraphQL support"
  },
  {
    "name": "pg_hashids",
    "default_version": "1.3.0-cd0e1b31d52b394a0df64079406a14a4f7387cd6",
    "installed_version": null,
    "comment": "pg_hashids"
  },
  {
    "name": "pg_jsonschema",
    "default_version": "0.3.3",
    "installed_version": null,
    "comment": "pg_jsonschema"
  },
  {
    "name": "pg_net",
    "default_version": "0.20.3",
    "installed_version": null,
    "comment": "Async HTTP"
  },
  {
    "name": "pg_partman",
    "default_version": "5.3.1",
    "installed_version": null,
    "comment": "Extension to manage partitioned tables by time or ID"
  },
  {
    "name": "pg_prewarm",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "prewarm relation data"
  },
  {
    "name": "pg_repack",
    "default_version": "1.5.2",
    "installed_version": null,
    "comment": "Reorganize tables in PostgreSQL databases with minimal locks"
  },
  {
    "name": "pg_stat_monitor",
    "default_version": "2.1",
    "installed_version": null,
    "comment": "The pg_stat_monitor is a PostgreSQL Query Performance Monitoring tool, based on PostgreSQL contrib module pg_stat_statements. pg_stat_monitor provides aggregated statistics, client information, plan details including plan, and histogram information."
  },
  {
    "name": "pg_stat_statements",
    "default_version": "1.10",
    "installed_version": "1.10",
    "comment": "track planning and execution statistics of all SQL statements executed"
  },
  {
    "name": "pg_surgery",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "extension to perform surgery on a damaged relation"
  },
  {
    "name": "pg_tle",
    "default_version": "1.4.0",
    "installed_version": null,
    "comment": "Trusted Language Extensions for PostgreSQL"
  },
  {
    "name": "pg_trgm",
    "default_version": "1.6",
    "installed_version": null,
    "comment": "text similarity measurement and index searching based on trigrams"
  },
  {
    "name": "pg_visibility",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "examine the visibility map (VM) and page-level visibility info"
  },
  {
    "name": "pg_walinspect",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions to inspect contents of PostgreSQL Write-Ahead Log"
  },
  {
    "name": "pgaudit",
    "default_version": "1.7.1",
    "installed_version": null,
    "comment": "provides auditing functionality"
  },
  {
    "name": "pgcrypto",
    "default_version": "1.3",
    "installed_version": "1.3",
    "comment": "cryptographic functions"
  },
  {
    "name": "pgjwt",
    "default_version": "0.2.0",
    "installed_version": "0.2.0",
    "comment": "JSON Web Token API for Postgresql"
  },
  {
    "name": "pgmq",
    "default_version": "1.5.1",
    "installed_version": null,
    "comment": "A lightweight message queue. Like AWS SQS and RSMQ but on Postgres."
  },
  {
    "name": "pgroonga",
    "default_version": "3.2.5",
    "installed_version": null,
    "comment": "Super fast and all languages supported full text search index based on Groonga"
  },
  {
    "name": "pgroonga_database",
    "default_version": "3.2.5",
    "installed_version": null,
    "comment": "PGroonga database management module"
  },
  {
    "name": "pgrouting",
    "default_version": "3.4.1",
    "installed_version": null,
    "comment": "pgRouting Extension"
  },
  {
    "name": "pgrowlocks",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "show row-level locking information"
  },
  {
    "name": "pgsodium",
    "default_version": "3.1.8",
    "installed_version": null,
    "comment": "Postgres extension for libsodium functions"
  },
  {
    "name": "pgstattuple",
    "default_version": "1.5",
    "installed_version": null,
    "comment": "show tuple-level statistics"
  },
  {
    "name": "pgtap",
    "default_version": "1.3.3",
    "installed_version": null,
    "comment": "Unit testing for PostgreSQL"
  },
  {
    "name": "plcoffee",
    "default_version": "3.1.10",
    "installed_version": null,
    "comment": "PL/CoffeeScript (v8) trusted procedural language"
  },
  {
    "name": "plls",
    "default_version": "3.1.10",
    "installed_version": null,
    "comment": "PL/LiveScript (v8) trusted procedural language"
  },
  {
    "name": "plpgsql",
    "default_version": "1.0",
    "installed_version": "1.0",
    "comment": "PL/pgSQL procedural language"
  },
  {
    "name": "plpgsql_check",
    "default_version": "2.8",
    "installed_version": null,
    "comment": "extended check for plpgsql functions"
  },
  {
    "name": "plv8",
    "default_version": "3.1.10",
    "installed_version": null,
    "comment": "PL/JavaScript (v8) trusted procedural language"
  },
  {
    "name": "postgis",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "PostGIS geometry and geography spatial types and functions"
  },
  {
    "name": "postgis_raster",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "PostGIS raster types and functions"
  },
  {
    "name": "postgis_sfcgal",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "PostGIS SFCGAL functions"
  },
  {
    "name": "postgis_tiger_geocoder",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "PostGIS tiger geocoder and reverse geocoder"
  },
  {
    "name": "postgis_topology",
    "default_version": "3.3.2",
    "installed_version": null,
    "comment": "PostGIS topology spatial types and functions"
  },
  {
    "name": "postgres_fdw",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "foreign-data wrapper for remote PostgreSQL servers"
  },
  {
    "name": "refint",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions for implementing referential integrity (obsolete)"
  },
  {
    "name": "rum",
    "default_version": "1.3",
    "installed_version": null,
    "comment": "RUM index access method"
  },
  {
    "name": "seg",
    "default_version": "1.4",
    "installed_version": null,
    "comment": "data type for representing line segments or floating-point intervals"
  },
  {
    "name": "sslinfo",
    "default_version": "1.2",
    "installed_version": null,
    "comment": "information about SSL certificates"
  },
  {
    "name": "supabase_vault",
    "default_version": "0.3.1",
    "installed_version": "0.3.1",
    "comment": "Supabase Vault Extension"
  },
  {
    "name": "tablefunc",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "functions that manipulate whole tables, including crosstab"
  },
  {
    "name": "tcn",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "Triggered change notifications"
  },
  {
    "name": "timescaledb",
    "default_version": "2.16.1",
    "installed_version": null,
    "comment": "Enables scalable inserts and complex queries for time-series data (Apache 2 Edition)"
  },
  {
    "name": "tsm_system_rows",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "TABLESAMPLE method which accepts number of rows as a limit"
  },
  {
    "name": "tsm_system_time",
    "default_version": "1.0",
    "installed_version": null,
    "comment": "TABLESAMPLE method which accepts time in milliseconds as a limit"
  },
  {
    "name": "unaccent",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "text search dictionary that removes accents"
  },
  {
    "name": "uuid-ossp",
    "default_version": "1.1",
    "installed_version": "1.1",
    "comment": "generate universally unique identifiers (UUIDs)"
  },
  {
    "name": "vector",
    "default_version": "0.8.2",
    "installed_version": null,
    "comment": "vector data type and ivfflat and hnsw access methods"
  },
  {
    "name": "wal2json",
    "default_version": "2.6",
    "installed_version": null,
    "comment": null
  },
  {
    "name": "wrappers",
    "default_version": "0.6.2",
    "installed_version": null,
    "comment": "Foreign data wrappers developed by Supabase"
  },
  {
    "name": "xml2",
    "default_version": "1.1",
    "installed_version": null,
    "comment": "XPath querying and XSLT"
  }
].
