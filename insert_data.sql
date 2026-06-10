-- Script per afegir les dades dels usuaris Aleix, Mat, Luke i Leo

-- 1. Inserir usuaris i la seva experiència
INSERT INTO public.users (username, email, level_name, level_num, coins, gems, xp) VALUES 
('Aleix', 'aleix@chatus.com', 'Llegenda', 99, 15000, 350, 99999),
('Mat', 'mat@chatus.com', 'Expert', 42, 1200, 30, 85420),
('Luke', 'luke@chatus.com', 'Dominant', 25, 800, 15, 72100),
('Leo', 'leo@chatus.com', 'Aprenent', 10, 300, 5, 12000)
ON CONFLICT (username) DO UPDATE 
SET xp = EXCLUDED.xp, coins = EXCLUDED.coins, level_num = EXCLUDED.level_num, level_name = EXCLUDED.level_name;

-- 2. Afegir puntuacions falses (aleatòries) dels minijocs per a què surtin al rànquing 
INSERT INTO public.minigame_scores (user_id, game_name, score, season)
SELECT id, 'Pac-Man', round(random() * 5000), 'Temporada 3' FROM public.users
WHERE username IN ('Aleix', 'Mat', 'Luke', 'Leo');

-- 3. Crear el Club "La Colla" on l'Aleix és el propietari
INSERT INTO public.clubs (name, description, icon, owner_id)
SELECT 'La Colla', 'El millor club de Chatus', '🚀', id
FROM public.users WHERE username = 'Aleix'
ON CONFLICT (name) DO NOTHING;

-- 4. Afegir Mat, Luke i Leo al club acabat de crear
INSERT INTO public.club_members (club_id, user_id, role)
SELECT 
    (SELECT id FROM public.clubs WHERE name = 'La Colla' LIMIT 1),
    id,
    'member'
FROM public.users WHERE username IN ('Mat', 'Luke', 'Leo');
