# Supabase Setup - Ultimate Backlog

## 1. Criar conta e projeto

1. Acesse [supabase.com](https://supabase.com) e clique em **Start your project**
2. Faça login com **GitHub** (mais prático)
3. Clique em **New Project**
4. Preencha:
   - **Organization**: selecione ou crie uma (ex: "Personal")
   - **Project name**: `ultimate-backlog`
   - **Database password**: crie uma senha FORTE e **anote ela** (você vai precisar)
   - **Region**: `South America (São Paulo)` — menor latência pra você
   - **Plan**: Free (já vem selecionado)
5. Clique em **Create new project** e aguarde (~2 minutos)

---

## 2. Pegar as chaves do projeto

O Supabase atualizou o sistema de chaves. Existem duas formas de encontrar:

### Opção A: Pelo botão Connect (mais rápido)

1. No dashboard do projeto, clique no botão **Connect** (canto superior direito)
2. Ali você encontra a **Project URL** e a chave que precisa pra conectar

### Opção B: Pelo menu Settings

1. Vá em **Settings** (ícone de engrenagem) → **API Keys**
2. Copie:
   - **Project URL**: algo como `https://xyzxyzxyz.supabase.co`
   - **Publishable key** (`sb_publishable_...`): essa é a chave pública pro frontend

> **Nota sobre chaves novas vs legadas:**
> O Supabase migrou de chaves JWT (`anon`/`service_role` que começam com `eyJ...`) para um novo formato:
> - `sb_publishable_...` — substitui a antiga `anon key` (segura pro frontend)
> - `sb_secret_...` — substitui a antiga `service_role` (NUNCA expor no frontend)
>
> Se seu projeto mostrar as chaves legadas, elas estão na aba **"Legacy anon, service_role API keys"** dentro de Settings → API Keys. Ambos os formatos funcionam.

O que o frontend precisa:
- **Project URL**
- **Publishable key** (ou a legacy `anon key`)

Ambas são seguras pra expor no frontend porque o Row Level Security protege os dados.

---

## 3. Configurar autenticação

### 3.1 Email/Senha (já vem habilitado por padrão)

1. Vá em **Authentication** → **Providers**
2. **Email** já deve estar habilitado
3. RECOMENDADO: Desative **"Confirm email"** por enquanto (pra facilitar o desenvolvimento):
   - Vá em **Authentication** → **Settings** (aba Email)
   - Desmarque **"Enable email confirmations"**
   - Salve

### 3.2 (Opcional) Login com Google

Se quiser adicionar login social depois:

1. **Authentication** → **Providers** → **Google**
2. Habilite e siga as instruções pra criar OAuth credentials no Google Cloud Console
3. Por enquanto, **pule isso**. Email/senha é suficiente pro desenvolvimento.

---

## 4. Criar as tabelas no banco

Vá em **SQL Editor** (ícone no menu lateral) e cole **todo** o SQL abaixo de uma vez:

```sql
-- =============================================
-- TABELA: profiles
-- Extensão do auth.users com dados públicos
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- ENUM: status do item no backlog
-- =============================================
CREATE TYPE public.backlog_status AS ENUM (
  'backlog',
  'playing',
  'completed',
  'dropped',
  'on_hold'
);

-- =============================================
-- TABELA: games
-- Cada jogo adicionado ao backlog de um usuário
-- =============================================
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados vindos da RAWG API
  rawg_id INTEGER,
  title TEXT NOT NULL,
  cover_url TEXT,
  release_date DATE,
  platforms TEXT[],
  genres TEXT[],
  rawg_rating NUMERIC(3,1),

  -- Dados do usuário
  status backlog_status DEFAULT 'backlog' NOT NULL,
  user_rating SMALLINT CHECK (user_rating >= 0 AND user_rating <= 10),
  notes TEXT,
  started_at DATE,
  completed_at DATE,

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Um usuário não pode ter o mesmo jogo duplicado
  UNIQUE(user_id, rawg_id)
);

-- =============================================
-- INDEXES para performance
-- =============================================
CREATE INDEX idx_games_user_id ON public.games(user_id);
CREATE INDEX idx_games_status ON public.games(user_id, status);
CREATE INDEX idx_games_rawg_id ON public.games(rawg_id);

-- =============================================
-- FUNCTION: atualizar updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- FUNCTION: criar profile automaticamente no signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Protege os dados: cada user só vê/edita o que é dele
-- =============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: qualquer um pode ver"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Profiles: user edita o proprio"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games: qualquer um pode ver"
  ON public.games FOR SELECT
  USING (true);

CREATE POLICY "Games: user insere os proprios"
  ON public.games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Games: user edita os proprios"
  ON public.games FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Games: user deleta os proprios"
  ON public.games FOR DELETE
  USING (auth.uid() = user_id);
```

Clique em **Run** (ou Ctrl+Enter). Deve retornar `Success. No rows returned.`

---

## 5. Verificar se tudo foi criado

Ainda no **SQL Editor**, rode:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

Deve retornar:
- `profiles`
- `games`

---

## 6. Testar a autenticação

1. Vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Coloque um email e senha de teste
4. Após criar, vá em **Table Editor** → **profiles**
5. Deve existir uma row com o `id` do user criado (o trigger funcinou)

Se a row apareceu em `profiles`, tudo está funcionando.

---

## 7. Checklist final

- [ ] Projeto criado no Supabase (região São Paulo)
- [ ] Project URL anotada
- [ ] Publishable Key (ou legacy Anon Key) anotada
- [ ] SQL executado sem erros
- [ ] Tabelas `profiles` e `games` existem
- [ ] User de teste criado e profile gerado automaticamente
- [ ] Confirmação de email desativada (pra dev)

---

## Próximo passo

Quando terminar tudo acima, me avise e me passe:
- A **Project URL**
- A **Publishable Key** (ou legacy Anon Key)

(Ambas são seguras pra compartilhar — o RLS protege os dados)

Aí eu monto o projeto React + Vite com tudo conectado.
