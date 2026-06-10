-- SQL Supabase Scheme for Chatus
-- Aquest script esborrarà qualsevol taula vella existent amb aquests noms i crearà les noves:
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.minigame_scores CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.club_members CASCADE;
DROP TABLE IF EXISTS public.clubs CASCADE;
DROP TABLE IF EXISTS public.friends CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Taula Principal d'Usuaris
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    avatar_seed TEXT DEFAULT 'Aleix',
    level_name TEXT DEFAULT 'Nou',
    level_num INT DEFAULT 1,
    xp INT DEFAULT 0,
    coins INT DEFAULT 0,
    gems INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Taula del Sistema d'Amics (Relació N:M real entre usuaris)
CREATE TABLE public.friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- Ex: pending, accepted, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, friend_id)
);

-- 3. Taula de Clubs (Grups i Equips)
CREATE TABLE public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    icon TEXT DEFAULT '🏰',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Taula de Membres dels Clubs
CREATE TABLE public.club_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- owner, admin, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(club_id, user_id)
);

-- 5. Taula d'Inventari (L'objectiu de la botiga)
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL, -- Ex: pet, avatar_part, frame
    item_id TEXT NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Taula Puntuacions dels Minijocs (Per la Classificació/Rànquing)
CREATE TABLE public.minigame_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    game_name TEXT NOT NULL, -- Ex: pacman, snake
    score INT NOT NULL,
    season TEXT DEFAULT 'Temporada 1',
    played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Taula de Missatges i Xats (Grupals i Privats)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Null si és per un club
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE, -- Null si és privat
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir un usuari de prova "Aleix" per testejar
INSERT INTO public.users (username, email, level_name, level_num, coins, gems) 
VALUES ('AleixGamer', 'aleix@example.com', 'Novat', 5, 1250, 45);
