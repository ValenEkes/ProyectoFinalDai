--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-08-04 12:11:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: event_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.event_categories OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16404)
-- Name: event_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_enrollments (
    descripcion character varying NOT NULL,
    "Registro_tiempo" time with time zone NOT NULL,
    asistencia integer NOT NULL,
    observaciones character varying NOT NULL,
    raiting integer NOT NULL,
    id integer NOT NULL,
    id_event integer NOT NULL,
    id_user integer NOT NULL
);


ALTER TABLE public.event_enrollments OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16409)
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_locations (
    id integer NOT NULL,
    id_locations integer NOT NULL,
    nombre character varying NOT NULL,
    direccion character varying NOT NULL,
    capacidad_max character varying NOT NULL,
    latitud integer NOT NULL,
    longitud integer NOT NULL,
    id_creator_user integer NOT NULL
);


ALTER TABLE public.event_locations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16414)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    id integer NOT NULL,
    id_event integer NOT NULL,
    id_tag integer NOT NULL
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16417)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying NOT NULL,
    id_evento_categoria integer NOT NULL,
    id_evento_locacion integer NOT NULL,
    fecha time with time zone NOT NULL,
    duracion_minutos integer NOT NULL,
    precio integer NOT NULL,
    maxima_asistencia integer NOT NULL,
    id_creator_user integer NOT NULL,
    inscripcion_activada boolean
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16422)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    latitud character varying NOT NULL,
    longitud character varying NOT NULL,
    id_provincia integer NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16427)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    nombre_completo character varying NOT NULL,
    latitud character varying NOT NULL,
    longitud character varying NOT NULL,
    display_order character varying NOT NULL
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16432)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16437)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    primer_nombre character varying NOT NULL,
    ultimo_nombre character varying NOT NULL,
    username character varying NOT NULL,
    "contraseña" character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4843 (class 0 OID 16399)
-- Dependencies: 215
-- Data for Name: event_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_categories VALUES (1, 'Música', 1);


--
-- TOC entry 4844 (class 0 OID 16404)
-- Dependencies: 216
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_enrollments VALUES ('Registrado vía web', '10:00:00-03', 20, 'ninguna', 0, 1, 1, 1);


--
-- TOC entry 4845 (class 0 OID 16409)
-- Dependencies: 217
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_locations VALUES (1, 1, 'Auditorio Principal', 'Av. Sarmiento 2704, CABA', '500', -5, -58, 1);


--
-- TOC entry 4846 (class 0 OID 16414)
-- Dependencies: 218
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_tags VALUES (1, 1, 1);


--
-- TOC entry 4847 (class 0 OID 16417)
-- Dependencies: 219
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (1, 'Concierto de Jazz', 'Una noche de jazz en vivo', 1, 1, '20:00:00-03', 120, 1500, 200, 1, true);


--
-- TOC entry 4848 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations VALUES (1, 'La Rural', '-34.5831', '-58.4108', 1);


--
-- TOC entry 4849 (class 0 OID 16427)
-- Dependencies: 221
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces VALUES (1, 'BA', 'Buenos Aires', '-34.6037', '-58.3816', '1');


--
-- TOC entry 4850 (class 0 OID 16432)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags VALUES (1, 'Jazz');


--
-- TOC entry 4851 (class 0 OID 16437)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Lucía', 'Méndez', 'lucia.m', 'password123');


--
-- TOC entry 4666 (class 2606 OID 16443)
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4668 (class 2606 OID 16445)
-- Name: event_enrollments event_enrollments_id_id_event_id_user_id1_id_event1_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_id_event_id_user_id1_id_event1_id_user_key UNIQUE (id, id_event, id_user) INCLUDE (id, id_event, id_user);


--
-- TOC entry 4670 (class 2606 OID 16447)
-- Name: event_enrollments event_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4672 (class 2606 OID 16449)
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4674 (class 2606 OID 16451)
-- Name: event_tags event_tags_id_tag_id_id_tag1_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_tag_id_id_tag1_key UNIQUE (id_tag) INCLUDE (id, id_tag);


--
-- TOC entry 4676 (class 2606 OID 16453)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id_event);


--
-- TOC entry 4678 (class 2606 OID 16455)
-- Name: events events_id_evento_categoria_id_creator_user_id_evento_locaci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_evento_categoria_id_creator_user_id_evento_locaci_key UNIQUE (id_evento_categoria, id_creator_user, id_evento_locacion) INCLUDE (id, id_evento_categoria, id_evento_locacion, id_creator_user);


--
-- TOC entry 4680 (class 2606 OID 16457)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 16459)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 16461)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16463)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 16465)
-- Name: users users_id_id1_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_id1_key UNIQUE (id) INCLUDE (id);


--
-- TOC entry 4690 (class 2606 OID 16467)
-- Name: users usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4691 (class 2606 OID 16468)
-- Name: event_enrollments event_enrollments_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) NOT VALID;


--
-- TOC entry 4692 (class 2606 OID 16473)
-- Name: event_enrollments event_enrollments_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4693 (class 2606 OID 16478)
-- Name: event_locations event_locations_id_locations_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_locations_fkey FOREIGN KEY (id_locations) REFERENCES public.locations(id) NOT VALID;


--
-- TOC entry 4694 (class 2606 OID 16483)
-- Name: event_tags event_tags_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) NOT VALID;


--
-- TOC entry 4695 (class 2606 OID 16488)
-- Name: events events_id_creator_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4696 (class 2606 OID 16493)
-- Name: events events_id_creator_user_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey1 FOREIGN KEY (id_creator_user) REFERENCES public.event_categories(id) NOT VALID;


--
-- TOC entry 4697 (class 2606 OID 16498)
-- Name: events events_id_evento_locacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_evento_locacion_fkey FOREIGN KEY (id_evento_locacion) REFERENCES public.event_locations(id) NOT VALID;


--
-- TOC entry 4698 (class 2606 OID 16503)
-- Name: locations locations_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provinces(id) NOT VALID;


--
-- TOC entry 4699 (class 2606 OID 16508)
-- Name: tags tags_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_id_fkey FOREIGN KEY (id) REFERENCES public.event_tags(id_tag) NOT VALID;


-- Completed on 2025-08-04 12:11:50

--
-- PostgreSQL database dump complete
--

