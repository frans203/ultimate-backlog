# CLAUDE.md — Ultimate Backlog

## Projeto

Tracker pessoal de jogos com tema cyberpunk/CRT. React 19 + Vite + TypeScript. Supabase (auth + Postgres). RAWG API para catalogo de jogos. Interface em portugues (pt-BR).

## Comandos

```bash
npm run dev      # Dev server (Vite, porta 5173)
npm run build    # tsc + vite build
npm run lint     # ESLint
npm run preview  # Preview do build
```

## Estrutura de pastas

```
src/
  main.tsx                          # Entry point
  index.css                         # Tailwind v4 @theme + todos os efeitos CSS (CRT, glitch, etc)
  app/
    App.tsx                         # Providers + CRTInit + RouterProvider
    providers.tsx                   # QueryClientProvider + AuthProvider
    router.tsx                      # createBrowserRouter (rotas publicas + protegidas)
  shared/
    lib/                            # supabase, query-client, rawg, sounds, utils
    types/database.types.ts         # Tipos TS (Profile, Game, BacklogStatus, Rawg*)
    constants/index.ts              # STATUS_LABELS, STATUS_COLORS, STATUS_FLASH_COLORS
    store/                          # Zustand (ui-slice: crt, tabs, sort, filtros)
    hooks/                          # use-sound, use-crt, use-boot-up, use-page-transition
    components/
      ui/                           # Design system (17 componentes + barrel index.ts)
      layout/                       # AppLayout, Sidebar, BottomNav, PageHeader, CRTVignette
      BootUpScreen.tsx              # Animacao terminal pos-login
  features/
    auth/                           # context/, api/, schemas/, hooks/, components/
    backlog/                        # api/ (queries + mutations), hooks/, components/
    dashboard/                      # components/ (DashboardPage, GameStats, PlatformChart)
    search/                         # api/, components/ (SearchPage, SearchResult, SearchDetailModal)
    profile/                        # api/, schemas/, components/ (ProfilePage, ProfileForm)
```

## Convencoes de codigo

### Arquitetura
- **Feature-based**: cada feature em `src/features/<nome>/` com suas proprias api/, components/, hooks/, schemas/
- **Shared**: tudo reutilizavel fica em `src/shared/`
- **Auth em Context** (async/event-driven), UI state em **Zustand** (sincronico)
- **queryOptions factory pattern** do TanStack Query v5 para queries type-safe

### Estilos
- **Tailwind v4** com `@theme` block em `index.css` — sem tailwind.config.js
- Cores customizadas geram classes automaticamente: `text-neon-red`, `bg-bg-surface`, etc
- **Efeitos complexos** (CRT, glitch, animated-border, trailing dot) ficam em `index.css` como CSS puro
- Layout/spacing/cor basico via classes Tailwind nos componentes
- **IMPORTANTE**: o reset `* { margin: 0; padding: 0 }` esta dentro de `@layer base` para nao sobrescrever utilities do Tailwind. Nunca mover isso para fora da layer

### Componentes
- Componentes UI em `shared/components/ui/` sao genericos e reutilizaveis
- Exportados via barrel `index.ts` — importar de `@/shared/components/ui`
- `showSnackbar()` eh uma funcao global exportada do Snackbar (nao hook)
- Modal usa `createPortal` + scroll lock + ESC + click-outside
- Sons via Web Audio API em `shared/lib/sounds.ts` (playClick, playTabClick, playStatusChange, playCompleted)

### Formularios
- react-hook-form + zodResolver para todos os forms
- Schemas Zod em `<feature>/schemas/`
- Mensagens de validacao em portugues

### Dados
- Supabase client tipado: `createClient<Database>` em `shared/lib/supabase.ts`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_RAWG_API_KEY`
- Mutations invalidam `queryKey: ['games']` ou `queryKey: ['profile']`
- RAWG API wrapper em `shared/lib/rawg.ts`

## Tabelas Supabase

### profiles
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | FK auth.users(id) |
| username | TEXT UNIQUE | |
| display_name | TEXT | |
| bio | TEXT | |
| avatar_url | TEXT | |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | trigger |

### games
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | gen_random_uuid() |
| user_id | UUID FK | auth.users(id) |
| rawg_id | INTEGER | UNIQUE(user_id, rawg_id) |
| name | TEXT | |
| cover | TEXT | URL da imagem |
| released | TEXT | |
| genres | TEXT[] | array |
| platforms | TEXT[] | array |
| description | TEXT | |
| user_rating | SMALLINT | 0-5 |
| status | backlog_status | enum: backlog, playing, completed, dropped, on_hold |
| notes | TEXT | |
| estimated_hours | INTEGER | |
| added_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | trigger |

RLS ativo em ambas. Cada usuario so edita/deleta seus proprios dados.

## Tipos TypeScript importantes

```typescript
type BacklogStatus = 'backlog' | 'playing' | 'completed' | 'dropped' | 'on_hold'

interface Game {
  id: string; user_id: string; rawg_id: number; name: string;
  cover: string; released: string | null; genres: string[];
  platforms: string[]; description: string; user_rating: number;
  status: BacklogStatus; notes: string; estimated_hours: number;
  added_at: string; updated_at: string;
}

interface Profile {
  id: string; username: string; display_name: string | null;
  bio: string | null; avatar_url: string | null;
  created_at: string; updated_at: string;
}
```

## Padroes para novas features

### Adicionar nova pagina/feature
1. Criar pasta `src/features/<nome>/`
2. API: `api/<nome>-queries.ts` (queryOptions) e `api/<nome>-mutations.ts` (useMutation)
3. Componentes: `components/<Nome>Page.tsx` como entry point
4. Schemas (se tiver form): `schemas/<nome>-schema.ts` com Zod
5. Adicionar rota em `src/app/router.tsx` como child do layout protegido
6. Adicionar link no Sidebar (`src/shared/components/layout/Sidebar.tsx`) e BottomNav

### Adicionar novo componente UI
1. Criar em `src/shared/components/ui/<Nome>.tsx`
2. Usar classes CSS do `index.css` para efeitos visuais
3. Exportar no barrel `src/shared/components/ui/index.ts`

### Adicionar nova tabela Supabase
1. Criar tabela via SQL no Supabase (com RLS + policies)
2. Adicionar tipo em `src/shared/types/database.types.ts`
3. Adicionar na interface `Database.public.Tables`
4. Criar queries/mutations na feature correspondente

## Gotchas

- O `@import "tailwindcss"` DEVE ser a primeira linha do `index.css`
- CSS customizado DEPOIS do import. Reset global DENTRO de `@layer base`
- Sidebar usa CSS puro para hover expand (`#sidebar:hover ~ #main`) — sidebar e main devem ser irmaos no DOM
- `showSnackbar()` funciona de qualquer lugar mas o componente `<Snackbar />` precisa estar montado (esta no AppLayout)
- Google OAuth esta preparado mas desabilitado (botao com `disabled` na AuthPage)
- Path alias `@` -> `./src` configurado no `vite.config.ts` e `tsconfig.app.json`
