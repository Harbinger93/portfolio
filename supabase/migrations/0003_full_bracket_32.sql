-- ==============================================================
-- SCRIPT DE SEMILLAS: ÁRBOL COMPLETO DE 32 EQUIPOS Y RESULTADOS
-- ==============================================================

DELETE FROM matches;

INSERT INTO tournament_stages (id, tournament_id, stage_key, display_name, sequence_order)
VALUES 
('00000000-0000-0000-0000-000000000000', 'c4c52224-b690-4886-9a25-9c5957b445aa', 'DIECISEISAVOS', 'Eliminatoria de 32', 0)
ON CONFLICT (id) DO UPDATE SET sequence_order = 0;

INSERT INTO teams (id, name, flag_url) VALUES
('RSA', 'Sudáfrica', 'https://flagcdn.com/w320/za.png'),
('CAN', 'Canadá', 'https://flagcdn.com/w320/ca.png'),
('PAR', 'Paraguay', 'https://flagcdn.com/w320/py.png'),
('SWE', 'Suecia', 'https://flagcdn.com/w320/se.png'),
('USA', 'Estados Unidos', 'https://flagcdn.com/w320/us.png'),
('BIH', 'Bosnia y Herzegovina', 'https://flagcdn.com/w320/ba.png'),
('AUT', 'Austria', 'https://flagcdn.com/w320/at.png'),
('CIV', 'Costa de Marfil', 'https://flagcdn.com/w320/ci.png'),
('NOR', 'Noruega', 'https://flagcdn.com/w320/no.png'),
('MEX', 'México', 'https://flagcdn.com/w320/mx.png'),
('ECU', 'Ecuador', 'https://flagcdn.com/w320/ec.png'),
('COD', 'RD Congo', 'https://flagcdn.com/w320/cd.png'),
('SUI', 'Suiza', 'https://flagcdn.com/w320/ch.png'),
('ALG', 'Argelia', 'https://flagcdn.com/w320/dz.png'),
('GHA', 'Ghana', 'https://flagcdn.com/w320/gh.png'),
('AUS', 'Australia', 'https://flagcdn.com/w320/au.png'),
('EGY', 'Egipto', 'https://flagcdn.com/w320/eg.png'),
('CPV', 'Cabo Verde', 'https://flagcdn.com/w320/cv.png')
ON CONFLICT (id) DO NOTHING;

-- PARTIDOS DEL ÁRBOL COMPLETO CON RESULTADOS
INSERT INTO matches (id, stage_id, team_home_id, team_away_id, match_time, goals_home, goals_away, winner_id, is_finished, bracket_match_number) OVERRIDING SYSTEM VALUE VALUES
-- Eliminatoria de 32 (Con resultados ya jugados)
(1, '00000000-0000-0000-0000-000000000000', 'RSA', 'CAN', '2026-06-28T14:00:00Z', 0, 1, 'CAN', true, 1),
(2, '00000000-0000-0000-0000-000000000000', 'NED', 'MAR', '2026-06-29T14:00:00Z', 1, 1, 'MAR', true, 2),
(3, '00000000-0000-0000-0000-000000000000', 'GER', 'PAR', '2026-06-29T18:00:00Z', 1, 1, 'PAR', true, 3),
(4, '00000000-0000-0000-0000-000000000000', 'FRA', 'SWE', '2026-06-30T14:00:00Z', 3, 0, 'FRA', true, 4),
(5, '00000000-0000-0000-0000-000000000000', 'BEL', 'SEN', '2026-07-01T14:00:00Z', 3, 2, 'BEL', true, 5),
(6, '00000000-0000-0000-0000-000000000000', 'USA', 'BIH', '2026-07-01T18:00:00Z', 2, 0, 'USA', true, 6),
(7, '00000000-0000-0000-0000-000000000000', 'ESP', 'AUT', '2026-07-02T14:00:00Z', NULL, NULL, NULL, false, 7),
(8, '00000000-0000-0000-0000-000000000000', 'POR', 'CRO', '2026-07-02T23:00:00Z', NULL, NULL, NULL, false, 8),

(9, '00000000-0000-0000-0000-000000000000', 'BRA', 'JPN', '2026-06-29T14:00:00Z', 2, 1, 'BRA', true, 9),
(10, '00000000-0000-0000-0000-000000000000', 'CIV', 'NOR', '2026-06-30T14:00:00Z', 1, 2, 'NOR', true, 10),
(11, '00000000-0000-0000-0000-000000000000', 'MEX', 'ECU', '2026-06-30T18:00:00Z', 2, 0, 'MEX', true, 11),
(12, '00000000-0000-0000-0000-000000000000', 'ENG', 'COD', '2026-07-01T14:00:00Z', 2, 1, 'ENG', true, 12),
(13, '00000000-0000-0000-0000-000000000000', 'SUI', 'ALG', '2026-07-02T03:00:00Z', NULL, NULL, NULL, false, 13),
(14, '00000000-0000-0000-0000-000000000000', 'COL', 'GHA', '2026-07-03T01:30:00Z', NULL, NULL, NULL, false, 14),
(15, '00000000-0000-0000-0000-000000000000', 'AUS', 'EGY', '2026-07-03T18:00:00Z', NULL, NULL, NULL, false, 15),
(16, '00000000-0000-0000-0000-000000000000', 'ARG', 'CPV', '2026-07-03T22:00:00Z', NULL, NULL, NULL, false, 16),

-- OCTAVOS DE FINAL (Con los clasificados)
(17, '11111111-1111-1111-1111-111111111111', 'CAN', 'MAR', '2026-07-04T17:00:00Z', NULL, NULL, NULL, false, 17),
(18, '11111111-1111-1111-1111-111111111111', 'PAR', 'FRA', '2026-07-04T21:00:00Z', NULL, NULL, NULL, false, 18),
(19, '11111111-1111-1111-1111-111111111111', 'BEL', 'USA', '2026-07-05T13:00:00Z', NULL, NULL, NULL, false, 19),
(20, '11111111-1111-1111-1111-111111111111', NULL, NULL, '2026-07-05T17:00:00Z', NULL, NULL, NULL, false, 20),
(21, '11111111-1111-1111-1111-111111111111', 'BRA', 'NOR', '2026-07-06T13:00:00Z', NULL, NULL, NULL, false, 21),
(22, '11111111-1111-1111-1111-111111111111', 'MEX', 'ENG', '2026-07-06T17:00:00Z', NULL, NULL, NULL, false, 22),
(23, '11111111-1111-1111-1111-111111111111', NULL, NULL, '2026-07-07T13:00:00Z', NULL, NULL, NULL, false, 23),
(24, '11111111-1111-1111-1111-111111111111', NULL, NULL, '2026-07-07T17:00:00Z', NULL, NULL, NULL, false, 24),

-- CUARTOS DE FINAL 
(25, '22222222-2222-2222-2222-222222222222', NULL, NULL, '2026-07-09T14:00:00Z', NULL, NULL, NULL, false, 25),
(26, '22222222-2222-2222-2222-222222222222', NULL, NULL, '2026-07-10T14:00:00Z', NULL, NULL, NULL, false, 26),
(27, '22222222-2222-2222-2222-222222222222', NULL, NULL, '2026-07-11T14:00:00Z', NULL, NULL, NULL, false, 27),
(28, '22222222-2222-2222-2222-222222222222', NULL, NULL, '2026-07-11T18:00:00Z', NULL, NULL, NULL, false, 28),

-- SEMIFINALES
(29, '33333333-3333-3333-3333-333333333333', NULL, NULL, '2026-07-14T14:00:00Z', NULL, NULL, NULL, false, 29),
(30, '33333333-3333-3333-3333-333333333333', NULL, NULL, '2026-07-15T14:00:00Z', NULL, NULL, NULL, false, 30),

-- GRAN FINAL
(31, '44444444-4444-4444-4444-444444444444', NULL, NULL, '2026-07-19T14:00:00Z', NULL, NULL, NULL, false, 31);

-- CONEXIONES DE LAS LLAVES
UPDATE matches SET next_match_id = 17 WHERE id IN (1, 2);
UPDATE matches SET next_match_id = 18 WHERE id IN (3, 4);
UPDATE matches SET next_match_id = 19 WHERE id IN (5, 6);
UPDATE matches SET next_match_id = 20 WHERE id IN (7, 8);
UPDATE matches SET next_match_id = 21 WHERE id IN (9, 10);
UPDATE matches SET next_match_id = 22 WHERE id IN (11, 12);
UPDATE matches SET next_match_id = 23 WHERE id IN (13, 14);
UPDATE matches SET next_match_id = 24 WHERE id IN (15, 16);
UPDATE matches SET next_match_id = 25 WHERE id IN (17, 18);
UPDATE matches SET next_match_id = 26 WHERE id IN (19, 20);
UPDATE matches SET next_match_id = 27 WHERE id IN (21, 22);
UPDATE matches SET next_match_id = 28 WHERE id IN (23, 24);
UPDATE matches SET next_match_id = 29 WHERE id IN (25, 26);
UPDATE matches SET next_match_id = 30 WHERE id IN (27, 28);
UPDATE matches SET next_match_id = 31 WHERE id IN (29, 30);
