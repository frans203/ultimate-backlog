# Ultimate Backlog

Tracker pessoal de jogos com visual cyberpunk/CRT. Busque jogos pela RAWG API, organize seu backlog, acompanhe progresso e avalie seus jogos.

## Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** (`@theme`, sem `tailwind.config.js`)
- **Supabase** — auth (email/senha), banco Postgres, RLS
- **TanStack React Query v5** — server state (`queryOptions` pattern)
- **Zustand v5** — client state (CRT toggle, filtros, ordenacao)
- **React Hook Form** + Zod — formularios e validacao
- **React Router v7** — `createBrowserRouter`
- **RAWG API** — catalogo de jogos

## Rotas

| Rota | Pagina | Acesso |
|------|--------|--------|
| `/auth` | Login / Registro | Publica |
| `/auth/callback` | OAuth redirect | Publica |
| `/` | Dashboard | Protegida |
| `/backlog` | Backlog de jogos | Protegida |
| `/search` | Busca RAWG | Protegida |
| `/profile` | Perfil do usuario | Protegida |

## Setup local

```bash
# Instalar dependencias
npm install

# Criar .env na raiz com:
VITE_SUPABASE_URL=<sua_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<sua_chave>
VITE_RAWG_API_KEY=<sua_chave>

# Dev server
npm run dev

# Build
npm run build
```

## Supabase

Veja `SUPABASE_SETUP.md` para configuracao completa do banco, auth, RLS e triggers.

### Tabelas

- **profiles** — extensao do `auth.users` (username, display_name, bio)
- **games** — jogos no backlog do usuario (status, rating, notes, dados RAWG)

### RLS

Cada usuario so ve/edita seus proprios dados. Profiles sao visiveis publicamente (SELECT).

## Deploy (Vercel)

1. Push pro GitHub
2. Importar na Vercel
3. Adicionar as 3 variaveis de ambiente
4. Criar `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
5. No Supabase, adicionar a URL do deploy em Authentication > URL Configuration

## Efeitos visuais

- CRT (scanlines, noise, vignette, flicker) — toggle via sidebar
- Glitch logo (clip-path RGB split + scramble no hover)
- Animated borders (conic-gradient spin)
- Game card trailing dot + 3D tilt no hover
- Boot-up stagger nas transicoes de pagina
- Page glitch (RGB shift) na troca de rota
- Status flash ao mudar status de um jogo
- Sons via Web Audio API (click, tab, status change, completed)
