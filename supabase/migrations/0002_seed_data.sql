-- ==========================================
-- SCRIPT DE SEMILLAS (SEED DATA) PARA QUINIELA
-- ==========================================

-- 1. Crear el Torneo
INSERT INTO tournaments (id, name, year, is_active) 
VALUES ('c4c52224-b690-4886-9a25-9c5957b445aa', 'Copa Mundial de la FIFA', 2026, true)
ON CONFLICT DO NOTHING;

-- 2. Crear las Fases (Octavos, Cuartos, Semis, Final)
INSERT INTO tournament_stages (id, tournament_id, stage_key, display_name, sequence_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'c4c52224-b690-4886-9a25-9c5957b445aa', 'OCTAVOS', 'Octavos de Final', 1),
('22222222-2222-2222-2222-222222222222', 'c4c52224-b690-4886-9a25-9c5957b445aa', 'CUARTOS', 'Cuartos de Final', 2),
('33333333-3333-3333-3333-333333333333', 'c4c52224-b690-4886-9a25-9c5957b445aa', 'SEMIFINAL', 'Semifinales', 3),
('44444444-4444-4444-4444-444444444444', 'c4c52224-b690-4886-9a25-9c5957b445aa', 'FINAL', 'Gran Final', 4)
ON CONFLICT DO NOTHING;

-- 3. Insertar Selecciones Principales (Equipos de prueba comunes en fases finales)
INSERT INTO teams (id, name, flag_url) VALUES
('ARG', 'Argentina', 'https://flagcdn.com/w320/ar.png'),
('FRA', 'Francia', 'https://flagcdn.com/w320/fr.png'),
('BRA', 'Brasil', 'https://flagcdn.com/w320/br.png'),
('ENG', 'Inglaterra', 'https://flagcdn.com/w320/gb-eng.png'),
('ESP', 'España', 'https://flagcdn.com/w320/es.png'),
('GER', 'Alemania', 'https://flagcdn.com/w320/de.png'),
('POR', 'Portugal', 'https://flagcdn.com/w320/pt.png'),
('ITA', 'Italia', 'https://flagcdn.com/w320/it.png'),
('NED', 'Países Bajos', 'https://flagcdn.com/w320/nl.png'),
('BEL', 'Bélgica', 'https://flagcdn.com/w320/be.png'),
('CRO', 'Croacia', 'https://flagcdn.com/w320/hr.png'),
('URU', 'Uruguay', 'https://flagcdn.com/w320/uy.png'),
('COL', 'Colombia', 'https://flagcdn.com/w320/co.png'),
('MAR', 'Marruecos', 'https://flagcdn.com/w320/ma.png'),
('JPN', 'Japón', 'https://flagcdn.com/w320/jp.png'),
('SEN', 'Senegal', 'https://flagcdn.com/w320/sn.png')
ON CONFLICT (id) DO NOTHING;

-- 4. Generar Partidos de Octavos de Final (Ejemplo)
-- La fecha de estos partidos está en UTC (se ajustarán automáticamente al uso horario del usuario en la web)
INSERT INTO matches (stage_id, team_home_id, team_away_id, match_time, bracket_match_number) VALUES
('11111111-1111-1111-1111-111111111111', 'ARG', 'SEN', '2026-06-30T14:00:00Z', 1),
('11111111-1111-1111-1111-111111111111', 'ENG', 'COL', '2026-06-30T18:00:00Z', 2),
('11111111-1111-1111-1111-111111111111', 'FRA', 'URU', '2026-07-01T14:00:00Z', 3),
('11111111-1111-1111-1111-111111111111', 'BRA', 'JPN', '2026-07-01T18:00:00Z', 4),
('11111111-1111-1111-1111-111111111111', 'ESP', 'MAR', '2026-07-02T14:00:00Z', 5),
('11111111-1111-1111-1111-111111111111', 'GER', 'CRO', '2026-07-02T18:00:00Z', 6),
('11111111-1111-1111-1111-111111111111', 'POR', 'BEL', '2026-07-03T14:00:00Z', 7),
('11111111-1111-1111-1111-111111111111', 'ITA', 'NED', '2026-07-03T18:00:00Z', 8);
