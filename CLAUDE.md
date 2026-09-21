# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Monorepo for anin.uz (Antares Investment), an industrial equipment catalog site. Three deployables, all pushed to one cPanel host over FTP by `.github/workflows/` on every push to `main`:

| Path | Stack | Deploys to |
|---|---|---|
| `antares-front/` | Next.js 15 (App Router, `output: "export"`), React 19, Tailwind 4, next-intl | `public_html/` (static files from `antares-front/out/`) |
| `antares-back-main/` | Laravel 11, PHP 8.2, Blade admin dashboard built with Vite | `public_html/api/antares-back-main/` |
| `index.php` + `api-entry/.htaccess` | Laravel front controller for the `/api` subdirectory | `public_html/api/` (CI copies `index.php` and `antares-back-main/public/build` into `api-entry/` first) |

CI only rebuilds the side whose paths changed. The root `package-lock.json` is an empty placeholder and `debug.php` is a one-off server diagnostic, neither is app code. The root `.htaccess` is not deployed; the one that ships with the site is `antares-front/public/.htaccess`, which holds the root locale redirect and the clean-URL rewrites onto the exported `.html` files.

## Commands

Frontend (`cd antares-front`):

```bash
npm install            # CI uses npm, ignore the stray pnpm-lock.yaml
npm run dev            # http://localhost:3000
npm run build          # static export to out/
npm run lint
```

There is no frontend test runner. The only frontend config is `NEXT_PUBLIC_API_URL`, and it must include the `/api` segment because every Laravel route is prefixed with it (locally `http://localhost:8000/api`). There is no `.env.example` for the frontend.

Backend (`cd antares-back-main`):

```bash
composer install && cp .env.example .env && php artisan key:generate
php artisan migrate
php artisan serve                      # http://localhost:8000, CORS already allows localhost:3000
php artisan test                       # PHPUnit
php artisan test --filter=ClassName    # single test class or method
vendor/bin/pint                        # formatter
npm install && npm run build           # Blade dashboard assets (Vite, output in public/build/dashboard)
```

The feature tests use `RefreshDatabase` and `phpunit.xml` has the sqlite in-memory lines commented out, so `php artisan test` wipes whatever database `.env` points at. Uncomment those two lines before running tests locally.

## Frontend: consequences of `output: "export"`

The site is a static export, so `middleware.ts` never runs in production and nothing server-side happens at request time. Several pieces of the codebase exist only because of that, and new work has to follow the same pattern:

- **Every top-level route has a twin.** `app/[locale]/<page>` is the real page. `app/(root)/<page>/page.tsx` renders `LocaleRedirect` with a meta-refresh to `/ru/<page>` because next-intl cannot prefix the locale for you. Adding a top-level page means adding both.
- **Locale comes from the URL, not the cookie.** `http/instance.ts` reads the first path segment and sends it as `Accept-Language` on every axios request.
- **Build-time fetches go through `http/buildFetch.ts`.** It pins `Accept-Language` to the default locale (Node's fetch sends `*`) and logs failures instead of throwing. Dynamic routes (`products/[companyId]`, `products/[companyId]/[product]`, `services/[service]`, `events/[event]`) fall back to a `"_"` placeholder param when the API is unreachable so the build does not fail silently. Set `NEXT_PUBLIC_API_URL` before building or you get placeholder routes.
- **`/dashboard` is a client-side bounce** to the Laravel Blade admin at `${NEXT_PUBLIC_API_URL}/dashboard`.
- Images are `unoptimized` and accept any remote host.

Other frontend conventions:

- Locales are `ru` (default), `en`, `uz`, defined once in `i18n/routing.ts`. Messages live in `i18n/locales/<locale>.json`. Use `Link`, `useRouter`, `usePathname` exported from `i18n/routing.ts`, not the ones from `next/navigation`.
- API calls live in `http/requests/<domain>/index.ts` and are re-exported from `http/requests/index.ts`. They wrap the shared `$api` axios instance, which rejects with the API's error body directly.
- React Query defaults (`components/Providers.tsx`): no retries, 10 minute stale time, no refetch on focus.
- Cart is a persisted zustand store in `states/store.ts`; the drawer open state is in `states/cart-drawer.ts`. Checkout posts the cart to `/checkout`.
- Prettier: no semicolons, double quotes, and import order enforced by `@ianvs/prettier-plugin-sort-imports` (react, next, third party, then `@/types`, `@/lib`, `@/http`, `@/hooks`, `@/components/ui`, `@/components`, `@/app`, then relative).
- `siteConfig.ts` holds site metadata and the nav tabs.

## Backend: routing map

`bootstrap/app.php` is the single place routes are wired. Controllers are resolved by namespace, so a route file maps to one controller folder:

| Route file | URL prefix | Controllers | Middleware |
|---|---|---|---|
| `routes/api.php` | `api/` | `App\Http\Controllers\Site` | `web`, `locale` |
| `routes/auth.php` | `api/auth/` | `App\Http\Controllers\Auth` (Breeze) | `web` |
| `routes/dashboard.php` | `api/dashboard/` | `App\Http\Controllers\Admin` (Blade admin) | `web`, `auth` |
| `routes/admin_api.php` | `api/admin/` | `App\Http\Controllers\AdminApi` (JSON, Sanctum) | `api` |
| `routes/web.php` | domain `config('app.site_url')` | `Site` | `web`, `locale` |

Things that trip people up:

- The public site API uses the `web` middleware group, so it is session and CSRF based. Public POST endpoints (`checkout`, `review`, `datasheet-lead`, `products/search`, `products/getinfo`) are exempted from CSRF by path in `bootstrap/app.php`. A new public POST route needs adding to that list.
- `LocaleMiddleware` only honours an `Accept-Language` value that is in `config/translatable.php` (`en`, `ru`, `uz`); anything else leaves the app locale untouched.
- The Telegram bot is a separate `TelegramBot\` namespace under `bot/`, registered in `bootstrap/providers.php`. Its routes (`telegram-bot/set-hook`, `del-hook`) are declared inside `TelegramBotProvider::register()`, not in `routes/`.
- `index.php` at the repo root overrides `SCRIPT_NAME` and `ASSET_URL` so Laravel works from the `/api` subdirectory. Edit that file, not a copy in `api-entry/`.

Data model: content models (`Product`, `Category`, `Brand`, `Service`, `Event`, `ProductFaq`) use `astrotomic/laravel-translatable` with a paired `*Translation` model each. `Product` auto-generates its slug from the `en` title on save and uses soft deletes. Global helpers are in `app/Extensions/Helpers/helper.php` (composer-autoloaded).

## Deployment notes

- FTP deploy excludes `vendor/`, `node_modules/` and `.env`, so `composer install` and `.env` must already exist on the server.
- CORS origins are hard-coded in `config/cors.php` and duplicated in `api-entry/.htaccess`; add a new origin in both.
