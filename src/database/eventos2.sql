--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-08-22 10:42:10

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
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: event_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.event_categories OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16405)
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
-- TOC entry 217 (class 1259 OID 16410)
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
-- TOC entry 218 (class 1259 OID 16415)
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    id_event integer NOT NULL,
    id_user integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_registrations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16419)
-- Name: event_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_registrations_id_seq OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 219
-- Name: event_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;


--
-- TOC entry 220 (class 1259 OID 16420)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    id integer NOT NULL,
    id_event integer NOT NULL,
    id_tag integer NOT NULL
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16423)
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
    inscripcion_activada integer NOT NULL,
    maxima_asistencia integer NOT NULL,
    id_creator_user integer NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16428)
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
-- TOC entry 223 (class 1259 OID 16433)
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
-- TOC entry 224 (class 1259 OID 16438)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16443)
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
-- TOC entry 226 (class 1259 OID 16532)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4671 (class 2604 OID 16448)
-- Name: event_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);


--
-- TOC entry 4855 (class 0 OID 16400)
-- Dependencies: 215
-- Data for Name: event_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_categories (id, name, display_order) VALUES (1, 'Música', 1);


--
-- TOC entry 4856 (class 0 OID 16405)
-- Dependencies: 216
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_enrollments (descripcion, "Registro_tiempo", asistencia, observaciones, raiting, id, id_event, id_user) VALUES ('Registrado vía web', '10:00:00-03', 20, 'ninguna', 0, 1, 1, 1);


--
-- TOC entry 4857 (class 0 OID 16410)
-- Dependencies: 217
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_locations (id, id_locations, nombre, direccion, capacidad_max, latitud, longitud, id_creator_user) VALUES (1, 1, 'Auditorio Principal', 'Av. Sarmiento 2704, CABA', '500', -5, -58, 1);


--
-- TOC entry 4858 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4860 (class 0 OID 16420)
-- Dependencies: 220
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_tags (id, id_event, id_tag) VALUES (1, 1, 1);


--
-- TOC entry 4861 (class 0 OID 16423)
-- Dependencies: 221
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events (id, nombre, descripcion, id_evento_categoria, id_evento_locacion, fecha, duracion_minutos, precio, inscripcion_activada, maxima_asistencia, id_creator_user) VALUES (1, 'Concierto de Jazz', 'Una noche de jazz en vivo', 1, 1, '20:00:00-03', 120, 1500, 1, 200, 1);


--
-- TOC entry 4862 (class 0 OID 16428)
-- Dependencies: 222
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations (id, nombre, latitud, longitud, id_provincia) VALUES (1, 'La Rural', '-34.5831', '-58.4108', 1);


--
-- TOC entry 4863 (class 0 OID 16433)
-- Dependencies: 223
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces (id, nombre, nombre_completo, latitud, longitud, display_order) VALUES (1, 'BA', 'Buenos Aires', '-34.6037', '-58.3816', '1');


--
-- TOC entry 4864 (class 0 OID 16438)
-- Dependencies: 224
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags (id, name) VALUES (1, 'Jazz');


--
-- TOC entry 4865 (class 0 OID 16443)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, primer_nombre, ultimo_nombre, username, "contraseña") VALUES (1, 'Lucía', 'Méndez', 'lucia.m', 'password123');
INSERT INTO public.users (id, primer_nombre, ultimo_nombre, username, "contraseña") VALUES (2, 'Lucho', 'Martinez', 'lucho.m', '$2b$10$H6Xkel4VhIMtQ1OQWT/yQ.GYF9r7c71LCv9cz87M0lPlbb.JlpSeC');


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 219
-- Name: event_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_registrations_id_seq', 1, false);


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4674 (class 2606 OID 16450)
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4676 (class 2606 OID 16452)
-- Name: event_enrollments event_enrollments_id_id_event_id_user_id1_id_event1_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_id_event_id_user_id1_id_event1_id_user_key UNIQUE (id, id_event, id_user) INCLUDE (id, id_event, id_user);


--
-- TOC entry 4678 (class 2606 OID 16454)
-- Name: event_enrollments event_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 16456)
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 16458)
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 16460)
-- Name: event_tags event_tags_id_tag_id_id_tag1_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_tag_id_id_tag1_key UNIQUE (id_tag) INCLUDE (id, id_tag);


--
-- TOC entry 4686 (class 2606 OID 16462)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id_event);


--
-- TOC entry 4688 (class 2606 OID 16464)
-- Name: events events_id_evento_categoria_id_creator_user_id_evento_locaci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_evento_categoria_id_creator_user_id_evento_locaci_key UNIQUE (id_evento_categoria, id_creator_user, id_evento_locacion) INCLUDE (id, id_evento_categoria, id_evento_locacion, id_creator_user);


--
-- TOC entry 4690 (class 2606 OID 16466)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4692 (class 2606 OID 16468)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 16470)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 16472)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 16474)
-- Name: users users_id_id1_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_id1_key UNIQUE (id) INCLUDE (id);


--
-- TOC entry 4700 (class 2606 OID 16476)
-- Name: users usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4701 (class 2606 OID 16477)
-- Name: event_enrollments event_enrollments_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) NOT VALID;


--
-- TOC entry 4702 (class 2606 OID 16482)
-- Name: event_enrollments event_enrollments_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4703 (class 2606 OID 16487)
-- Name: event_locations event_locations_id_locations_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_locations_fkey FOREIGN KEY (id_locations) REFERENCES public.locations(id) NOT VALID;


--
-- TOC entry 4706 (class 2606 OID 16492)
-- Name: event_tags event_tags_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) NOT VALID;


--
-- TOC entry 4707 (class 2606 OID 16497)
-- Name: events events_id_creator_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4708 (class 2606 OID 16502)
-- Name: events events_id_creator_user_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey1 FOREIGN KEY (id_creator_user) REFERENCES public.event_categories(id) NOT VALID;


--
-- TOC entry 4709 (class 2606 OID 16507)
-- Name: events events_id_evento_locacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_evento_locacion_fkey FOREIGN KEY (id_evento_locacion) REFERENCES public.event_locations(id) NOT VALID;


--
-- TOC entry 4704 (class 2606 OID 16512)
-- Name: event_registrations fk_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT fk_event FOREIGN KEY (id_event) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4705 (class 2606 OID 16517)
-- Name: event_registrations fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4710 (class 2606 OID 16522)
-- Name: locations locations_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provinces(id) NOT VALID;


--
-- TOC entry 4711 (class 2606 OID 16527)
-- Name: tags tags_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_id_fkey FOREIGN KEY (id) REFERENCES public.event_tags(id_tag) NOT VALID;


-- Completed on 2025-08-22 10:42:10

--
-- PostgreSQL database dump complete
--

