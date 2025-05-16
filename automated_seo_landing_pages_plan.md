# Plan: Automatisierte Erstellung von SEO-Landingpages

**Datum:** 2025-05-16

## 1. Zielsetzung

Automatisierte Generierung und Bereitstellung von täglich 5 neuen, SEO-optimierten Landingpages, um organischen Traffic für die KDP Ads Optimizer Webseite zu steigern. Die Seiten sollen thematisch relevant sein und sich stilistisch in die bestehende Webseite integrieren.

## 2. Kerntechnologien

*   **Supabase:**
    *   **PostgreSQL Datenbank:** Speicherung von generierten Keywords und Landingpage-Inhalten.
    *   **Edge Functions (Deno/TypeScript):** Backend-Logik für die Interaktion mit OpenAI und die Datenmanipulation in Supabase.
    *   **Cron Jobs (Scheduled Functions):** Zeitgesteuerte Ausführung der Edge Functions.
*   **OpenAI API (GPT):** Generierung von Long-Tail-Keywords und Artikelinhalten.
*   **Next.js (KDP Ads Optimizer Projekt):**
    *   **App Router / Dynamische Routen:** Darstellung der Landingpages.
    *   **Incremental Static Regeneration (ISR):** Effiziente Bereitstellung der Seiten, ohne für jede neue Seite einen kompletten Rebuild zu benötigen.
    *   **Tailwind CSS:** Einheitliches Styling.

## 3. Vereinfachter Workflow (Supabase-zentriert & Kostengünstig)

Dieser Plan verfolgt einen schlanken Ansatz, um Komplexität und Kosten initial gering zu halten.

### 3.1. Supabase Datenbankstruktur (Initial)

*   **Tabelle: `generated_keywords`**
    *   `id` (UUID, Primary Key)
    *   `keyword_text` (TEXT, UNIQUE) - Das generierte Keyword.
    *   `created_at` (TIMESTAMPZ, default now())
    *   `status` (TEXT, default 'new') - z.B. 'new', 'processing', 'completed', 'failed'

*   **Tabelle: `landing_pages`**
    *   `id` (UUID, Primary Key)
    *   `keyword_id` (UUID, Foreign Key zu `generated_keywords.id`)
    *   `slug` (TEXT, UNIQUE) - URL-freundlicher Slug, abgeleitet vom Keyword.
    *   `title` (TEXT) - SEO-Titel der Seite.
    *   `meta_description` (TEXT) - Meta-Beschreibung für SEO.
    *   `content_markdown` (TEXT) - Hauptinhalt der Seite im Markdown-Format.
    *   `created_at` (TIMESTAMPZ, default now())
    *   `published_at` (TIMESTAMPZ, nullable) - Wann die Seite quasi "live" ging.

### 3.2. Schritt 1: Keyword-Generierung (Täglich)

*   **Supabase Edge Function (`generate-keywords`):**
    1.  Wird durch einen Cron Job aufgerufen.
    2.  Prompt für OpenAI GPT: "Generiere 5 neue und **sehr spezifische** Long-Tail-Keywords zum Oberthema '[Definiertes Hauptthema, z.B. Amazon KDP Werbung]'. Die Keywords sollten sich auf Nischenaspekte konzentrieren."
    3.  Ruft die OpenAI API auf, um 5 Keywords zu erhalten.
    4.  Für jedes generierte Keyword:
        *   Versucht, das Keyword in die `generated_keywords`-Tabelle einzufügen.
        *   Bei Erfolg: Status bleibt 'new'.
        *   Bei Fehler (z.B. wegen `UNIQUE`-Constraint auf `keyword_text`): Protokolliert den Fehler und fährt mit dem nächsten fort (verhindert exakte Duplikate).
*   **Supabase Cron Job (`daily-keyword-generation`):**
    *   Schedule: Einmal täglich (z.B. `0 3 * * *` für 03:00 UTC).
    *   Aktion: Ruft die `generate-keywords` Edge Function auf.

### 3.3. Schritt 2: Landingpage-Content-Generierung (Periodisch)

*   **Supabase Edge Function (`create-landingpage-content`):**
    1.  Wird durch einen Cron Job aufgerufen.
    2.  Fragt die `generated_keywords`-Tabelle nach Einträgen mit `status = 'new'` ab (Limit z.B. 5 pro Lauf).
    3.  Für jedes gefundene "neue" Keyword:
        *   Setzt den `status` des Keywords in `generated_keywords` auf 'processing'.
        *   Generiert einen `slug` aus dem `keyword_text`.
        *   Prompt für OpenAI GPT: "Erstelle einen SEO-freundlichen Artikel (ca. 700 Wörter) für das Keyword: '[Spezifisches neues Keyword]'. Der Artikel soll [Aspekt X], [Aspekt Y] behandeln. Erstelle auch einen passenden SEO-Titel (max. 60 Zeichen) und eine Meta-Beschreibung (max. 160 Zeichen)."
        *   Ruft die OpenAI API auf, um Titel, Meta-Beschreibung und Artikelinhalt (Markdown) zu erhalten.
        *   Speichert die generierten Daten in die `landing_pages`-Tabelle (verknüpft mit `keyword_id`).
        *   Setzt den `status` des Keywords in `generated_keywords` auf 'completed'.
        *   Bei Fehlern während des Prozesses: Setzt den `status` auf 'failed' und protokolliert den Fehler.
*   **Supabase Cron Job (`periodic-content-creation`):**
    *   Schedule: Z.B. alle 30 Minuten (`*/30 * * * *`).
    *   Aktion: Ruft die `create-landingpage-content` Edge Function auf.

### 3.4. Schritt 3: Darstellung der Landingpages (Next.js / Vercel)

*   **Dynamische Route:** In der KDP Ads Optimizer Next.js-Anwendung wird eine dynamische Route erstellt, z.B. `/seo-pages/[slug].tsx` (oder `/app/seo-pages/[slug]/page.tsx` bei App Router).
*   **Datenabruf:**
    *   Die Seitenkomponente ruft den Inhalt (Titel, Meta-Beschreibung, Markdown) für den jeweiligen `slug` aus der `landing_pages`-Tabelle via Supabase Client ab.
    *   Bei nicht gefundenem Slug wird eine 404-Seite angezeigt.
*   **Incremental Static Regeneration (ISR):**
    *   Die Seiten werden mit ISR konfiguriert (`revalidate` Option).
    *   Vercel generiert die Seite beim ersten Aufruf, speichert sie zwischen und aktualisiert sie im Hintergrund nach der `revalidate`-Zeit (z.B. täglich oder wöchentlich).
    *   Neue Seiten werden bei Bedarf on-demand generiert, ohne dass ein neuer Vercel-Deploy nötig ist.
*   **Styling:**
    *   Die Seiten nutzen das globale Layout der Next.js-Anwendung (inkl. Navbar, Footer).
    *   Tailwind CSS wird für das Styling verwendet. Das `@tailwindcss/typography`-Plugin wird empfohlen, um den Markdown-Inhalt ansprechend darzustellen (`<article class="prose">...`).

### 3.5. Schritt 4: Sitemap

*   Eine dynamische `sitemap.xml` wird über eine Next.js API-Route generiert, die alle `slug`s aus der `landing_pages`-Tabelle auflistet.
*   Diese Sitemap wird bei Suchmaschinen eingereicht.

## 4. Kosteneffizienz

*   **Vercel & Supabase:** Nutzung der kostenlosen "Hobby" bzw. "Free" Tiers so lange wie möglich. ISR minimiert Vercel Build-Minuten.
*   **Automatisierung:** Durch die Nutzung von Supabase Edge Functions und Cron Jobs entfallen Kosten für externe Dienste wie Zapier oder Make.com.
*   **OpenAI API:** Die einzigen direkten variablen Kosten. Optimierung durch:
    *   Auswahl kosteneffizienter Modelle (z.B. `gpt-3.5-turbo`, `gpt-4o`).
    *   Präzise Prompts zur Kontrolle der Output-Länge.

## 5. Implementierungsphasen (Grobe Übersicht)

1.  **Setup Supabase:** Tabellen (`generated_keywords`, `landing_pages`) erstellen, Policies definieren.
2.  **Entwicklung Edge Function `generate-keywords`:** Inkl. OpenAI Anbindung, DB-Insert, Fehlerbehandlung.
3.  **Setup Cron Job `daily-keyword-generation`**.
4.  **Entwicklung Edge Function `create-landingpage-content`:** Inkl. OpenAI Anbindung, DB-Insert/Update, Fehlerbehandlung.
5.  **Setup Cron Job `periodic-content-creation`**.
6.  **Entwicklung Next.js dynamische Route:** Seitenkomponente, Datenabruf von Supabase, ISR-Konfiguration, Markdown-Rendering mit Tailwind Typography.
7.  **Styling-Anpassungen** für die SEO-Seiten.
8.  **Erstellung der dynamischen `sitemap.xml` Route.**
9.  **Testing & Monitoring** der gesamten Kette.

## 6. Zukünftige Erweiterungen (Optional)

*   Erweiterte Kontextualisierung für GPT (Berücksichtigung bereits geschriebener Inhalte, falls nötig).
*   System zur internen Verlinkung zwischen den generierten Artikeln.
*   Analyse der Performance der generierten Seiten und Anpassung der Strategie.
*   Einbindung von Bildern (automatisiert oder manuell).

Dieser Plan dient als Grundlage und kann im Laufe der Entwicklung und basierend auf ersten Ergebnissen angepasst werden.
