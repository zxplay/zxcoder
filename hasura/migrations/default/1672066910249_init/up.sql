SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.project (
    project_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title text NOT NULL,
    code text DEFAULT ''::text NOT NULL,
    owner_user_id uuid,
    updated_at timestamp(6) with time zone DEFAULT now(),
    created_at timestamp(6) with time zone DEFAULT now(),
    lang text DEFAULT 'zxbasic'::text NOT NULL,
    is_public boolean DEFAULT false NOT NULL
);
COMMENT ON TABLE public.project IS 'Saved projects';
CREATE TABLE public.role (
    role_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now()
);
COMMENT ON TABLE public.role IS 'Named role assigned to some users';
CREATE TABLE public.session (
    session_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    auth_token character varying(255) NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    updated timestamp(6) with time zone,
    expires timestamp(6) with time zone NOT NULL
);
COMMENT ON TABLE public.session IS 'Authenticated user sessions';
CREATE TABLE public.text (
    text_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    lang text NOT NULL,
    text text NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.text IS 'Markdown page content';
CREATE TABLE public."user" (
    user_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username text NOT NULL,
    greeting_name text,
    full_name text,
    email_address text,
    created_at timestamp(6) with time zone DEFAULT now()
);
COMMENT ON TABLE public."user" IS 'Authenticated user';
CREATE TABLE public.user_role (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now()
);
COMMENT ON TABLE public.user_role IS 'User assigned to role. Added and removed but never updated.';
CREATE VIEW public.v_projects AS
 SELECT project.title,
    project.lang,
    project.updated_at,
    "user".username,
    "user".email_address,
    "user".greeting_name,
    project.code
   FROM (public.project
     JOIN public."user" ON ((project.owner_user_id = "user".user_id)))
  ORDER BY project.updated_at DESC;
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_key UNIQUE (name);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_auth_token_key UNIQUE (auth_token);
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);
ALTER TABLE ONLY public.text
    ADD CONSTRAINT text_name_lang_key UNIQUE (name, lang);
ALTER TABLE ONLY public.text
    ADD CONSTRAINT text_pkey PRIMARY KEY (text_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_address_key UNIQUE (email_address);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (user_id, role_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
CREATE TRIGGER set_public_text_updated_at BEFORE UPDATE ON public.text FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_text_updated_at ON public.text IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public."user"(user_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
