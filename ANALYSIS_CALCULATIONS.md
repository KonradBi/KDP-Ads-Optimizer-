# KDP Ads Optimizer - Analyseberechnungen und UI-Dokumentation

Dieses Dokument beschreibt die verschiedenen Abschnitte der Analyseergebnisseite, die angezeigten Metriken und die zugrundeliegenden mathematischen Berechnungen.

## 1. Header

*   **Aussehen:** Zeigt den Titel "KDP Ads Optimizer", einen Untertitel und eine Zeile mit der Anzahl der geladenen Keywords.
*   **Funktion:** Bietet Kontext zur Anwendung und zur aktuell analysierten Datenmenge.
*   **Berechnung:**
    *   `Anzahl Keywords`: Einfache Zählung der gültigen Keyword-Zeilen aus der hochgeladenen CSV-Datei (`data.length` nach dem Filtern in `analyzeAdsData`).

## 2. Analysis Snapshot

*   **Aussehen:** Vier Kacheln, die wichtige Gesamtmetriken hervorheben.
*   **Funktion:** Bietet einen schnellen Überblick über die Gesamtleistung und das Optimierungspotenzial.

    *   **Total Spend:**
        *   **Funktion:** Zeigt die gesamten Werbeausgaben für alle Keywords im analysierten Zeitraum.
        *   **Berechnung:** Summe der `spend`-Werte aller Keyword-Daten.
            \[ \\text{Total Spend} = \\sum_{i=1}^{n} \\text{spend}_i \]
            (Wo `n` die Anzahl der Keywords ist. Entspricht `fullAnalysis.totalSpend`)

    *   **Total Sales:**
        *   **Funktion:** Zeigt den gesamten Umsatz, der durch die Werbeanzeigen generiert wurde.
        *   **Berechnung:** Summe der `sales`-Werte aller Keyword-Daten.
            \[ \\text{Total Sales} = \\sum_{i=1}^{n} \\text{sales}_i \]
            (Entspricht `fullAnalysis.totalSales`)

    *   **Average ACOS (Advertising Cost of Sales):**
        *   **Funktion:** Zeigt das durchschnittliche Verhältnis von Werbeausgaben zu erzieltem Umsatz. Ein wichtiger Indikator für die Rentabilität.
        *   **Berechnung:** Gesamtausgaben geteilt durch Gesamtumsatz. Wenn der Umsatz 0 ist, ist der ACOS ebenfalls 0.
            \[ \\text{Average ACOS} = \\begin{cases} \\frac{\\text{Total Spend}}{\\text{Total Sales}} & \\text{if Total Sales > 0} \\\\ 0 & \\text{if Total Sales = 0} \\end{cases} \]
            (Entspricht `fullAnalysis.averageAcos`. Wird als Prozentsatz angezeigt: `averageAcos * 100`)

    *   **Potential Savings:**
        *   **Funktion:** Schätzt die potenziellen Einsparungen durch die Anwendung der vorgeschlagenen Optimierungen (Pausieren unrentabler Keywords, Gebotssenkungen).
        *   **Berechnung:** Summe der Ausgaben (`spend`) für Keywords, die pausiert werden sollen (Klicks > 5 & Bestellungen = 0) PLUS die berechneten Einsparungen durch Gebotssenkungen bei Keywords mit hohem ACOS.
            *   Einsparung pro Keyword mit hohem ACOS: \[ \\text{spend}_i - \\left( \\text{spend}_i \\times \\frac{\\text{TARGET_ACOS}}{\\text{acos}_i} \\right) \]
            *   Die Gesamteinsparung ist die Summe dieser Werte über alle relevanten Keywords. (`TARGET_ACOS` ist aktuell `0.35`).
            (Entspricht `fullAnalysis.potentialSavings`)

## 3. Performance by Match Type (Nicht mehr Teil der aktuellen `FullResults.tsx`)

*   **Aussehen:** Abschnitt mit Zeilen für jeden Match Type (BROAD, PHRASE, EXACT). Zeigt Spend, Sales, Keywords (Anzahl) und Avg ACOS pro Typ.
*   **Funktion:** Ermöglicht den Vergleich der Leistung zwischen verschiedenen Match Types.
*   **Berechnung:**
    *   Die Keyword-Daten werden nach `matchType` gruppiert.
    *   Für jede Gruppe (BROAD, PHRASE, EXACT):
        *   `Spend`: Summe der `spend`-Werte der Keywords in dieser Gruppe.
        *   `Sales`: Summe der `sales`-Werte der Keywords in dieser Gruppe.
        *   `Keywords`: Anzahl der Keywords in dieser Gruppe.
        *   `Avg ACOS`: `Spend` der Gruppe / `Sales` der Gruppe (oder 0, wenn Sales 0 sind).

## 4. Stop Wasted Ad Spend

*   **Aussehen:** Roter Kasten, der den gesamten verschwendeten Betrag anzeigt, die Anzahl der verantwortlichen Keywords und Beispiele dieser Keywords als Tags.
*   **Funktion:** Hebt Keywords hervor, die Kosten verursachen, aber keine Verkäufe generieren, und schlägt sie als negative Keywords vor.
*   **Berechnung:**
    *   `Total Wasted Spend Identified`: Summe der `spend`-Werte aller Keywords, bei denen `spend > 0` und `orders === 0`.
        \[ \\text{Wasted Spend} = \\sum_{i \\in \\text{NoSalesKeywords}} \\text{spend}_i \]
        (Wo `NoSalesKeywords` die Menge der Keywords mit `spend > 0` und `orders == 0` ist. Entspricht `painPoints.wastedSpend`).
    *   `from X keywords`: Anzahl der Keywords, die `spend > 0` und `orders === 0` UND `clicks > 5` erfüllen. Diese werden als negative Keywords vorgeschlagen.
    *   Keyword-Tags: Die tatsächlichen `keyword`-Strings der oben genannten Keywords.

## 5. Match Type Optimizations

*   **Aussehen:** Gelber Kasten mit einer Liste von Keywords. Für jedes Keyword wird eine Änderung des Match Types (z.B. von BROAD zu EXACT) vorgeschlagen, der aktuelle ACOS angezeigt und eine Begründung/Zielsetzung gegeben.
*   **Funktion:** Identifiziert Keywords, bei denen ein spezifischerer Match Type wahrscheinlich zu einem besseren ACOS führen würde.
*   **Berechnung:**
    *   Die Logik gruppiert Keywords nach ihrem Basis-Keyword-String.
    *   Wenn ein Keyword in mehreren Match Types vorkommt (z.B. als BROAD und EXACT):
        *   Vergleich des ACOS: Wenn `exactMatch.acos < broadMatch.acos` und `exactMatch.orders > 0`, wird empfohlen, von BROAD zu EXACT zu wechseln.
        *   Ähnlich wird der Vergleich zwischen PHRASE und BROAD durchgeführt.
    *   `Current ACOS`: Der ACOS des *aktuellen* (weniger spezifischen) Match Types, der zur Änderung vorgeschlagen wird (z.B. der ACOS des BROAD-Keywords). Wird als Prozentsatz angezeigt.

## 6. Filter Results

*   **Aussehen:** Eingabefelder zur Filterung der Haupttabelle nach Keyword-Text, Match Type und Recommendation.
*   **Funktion:** Ermöglicht dem Benutzer das schnelle Finden spezifischer Keywords oder Keyword-Gruppen in der Hauptanalysetabelle.
*   **Berechnung:** Keine Berechnung, reine UI-Filterfunktion auf den angezeigten Daten.

## 7. Complete Analysis Table

*   **Aussehen:** Haupttabelle mit detaillierten Daten und Empfehlungen für jedes Keyword.
*   **Funktion:** Liefert die detaillierteste Ansicht der Keyword-Leistung und der spezifischen Optimierungsvorschläge.

    *   **PRIORITY (Priority Score):**
        *   **Funktion:** Ein Score (0-10), der angibt, wie dringend eine Aktion für dieses Keyword ist, basierend auf Ausgaben und Leistung. Höhere Scores erfordern mehr Aufmerksamkeit.
        *   **Berechnung:** Grundscore basiert auf Ausgaben: `min(10, round((item.spend / 5) * 10))`. Dieser Score wird erhöht, wenn bestimmte Bedingungen zutreffen: +3 wenn `clicks > 5` und `orders === 0`; +2 wenn `ctr < LOW_CTR_THRESHOLD` (`0.002`) und `impressions > 100`; +1 wenn `acos > TARGET_ACOS` (`0.35`) und `orders > 0`. Der Score ist auf maximal 10 begrenzt.

    *   **KEYWORD:**
        *   **Funktion:** Der spezifische Keyword-String.
        *   **Berechnung:** Direkte Übernahme aus den CSV-Daten (`item.keyword`).

    *   **MATCH TYPE:**
        *   **Funktion:** Der verwendete Match Type (z.B. BROAD, EXACT, PHRASE).
        *   **Berechnung:** Direkte Übernahme aus den CSV-Daten (`item.matchType`).

    *   **CLICKS:**
        *   **Funktion:** Anzahl der Klicks auf die Anzeige für dieses Keyword.
        *   **Berechnung:** Direkte Übernahme aus den CSV-Daten (`item.clicks`).

    *   **SPEND:**
        *   **Funktion:** Ausgaben für dieses Keyword.
        *   **Berechnung:** Direkte Übernahme aus den CSV-Daten (`item.spend`). Formatiert als Währung.

    *   **ORDERS:**
        *   **Funktion:** Anzahl der Bestellungen, die diesem Keyword zugeordnet werden.
        *   **Berechnung:** Direkte Übernahme aus den CSV-Daten (`item.orders`).

    *   **ACOS:**
        *   **Funktion:** Advertising Cost of Sales für dieses spezifische Keyword.
        *   **Berechnung:** \[ \\text{ACOS}_i = \\begin{cases} \\frac{\\text{spend}_i}{\\text{sales}_i} & \\text{if sales}_i > 0 \\\\ 0 & \\text{if sales}_i = 0 \\end{cases} \]
            (Wird als Prozentsatz angezeigt: `item.acos * 100`).

    *   **RECOMMENDATION:**
        *   **Funktion:** Die vorgeschlagene Aktion für dieses Keyword (z.B. Pause, Lower bid, Boost, Maintain). Visuell durch farbigen Hintergrund (rot, gelb, grün) hervorgehoben.
        *   **Berechnung:** Basiert auf einer Reihe von Bedingungen (siehe Code `analyzeAdsData`):
            *   `Pause`: Wenn `clicks > 5` und `orders === 0`. (Farbe: rot)
            *   `Low CTR`: Wenn `ctr < LOW_CTR_THRESHOLD` (`0.002`) und `impressions > 100`. (Farbe: rot)
            *   `Lower bid`: Wenn `acos > TARGET_ACOS` (`0.35`) und `orders > 0`. (Farbe: gelb)
            *   `Boost`: Wenn `acos < GOOD_ACOS_THRESHOLD` (`0.245`, d.h. 70% von `TARGET_ACOS`) und `orders > 0`. (Farbe: grün)
            *   `Maintain`: Wenn `orders > 0` und keine der obigen Bedingungen zutrifft. (Farbe: grün)

    *   **CURRENT BID:** (Nicht direkt in `FullResults.tsx` angezeigt, aber für die Berechnung von `NEW BID` relevant)
        *   **Funktion:** Das aktuelle durchschnittliche Cost-per-Click (CPC), das als Näherung für das Gebot dient.
        *   **Berechnung:** \[ \\text{Current Bid}_i = \\begin{cases} \\frac{\\text{spend}_i}{\\text{clicks}_i} & \\text{if clicks}_i > 0 \\\\ 0 & \\text{if clicks}_i = 0 \\end{cases} \]

    *   **NEW BID:**
        *   **Funktion:** Das vorgeschlagene neue Gebot zur Optimierung der Leistung.
        *   **Berechnung:** Abhängig von der `RECOMMENDATION`:
            *   `Pause`: Kein neues Gebot relevant.
            *   `Low CTR`: \[ \\text{New Bid}_i = \\max(\\text{MIN_BID}, \\text{Current Bid}_i \\times 0.7) \] (Reduzierung um 30%, `MIN_BID` ist `0.20`).
            *   `Lower bid`: \[ \\text{New Bid}_i = \\max(\\text{MIN_BID}, \\text{Current Bid}_i \\times \\frac{\\text{TARGET_ACOS}}{\\text{acos}_i}) \] (Anpassung basierend auf dem Verhältnis zum Ziel-ACOS).
            *   `Boost`: \[ \\text{New Bid}_i = \\text{Current Bid}_i \\times 1.2 \] (Erhöhung um 20%).
            *   `Maintain`: \[ \\text{New Bid}_i = \\text{Current Bid}_i \\times 1.02 \] (Leichte Erhöhung um 2%).
            (Angezeigt als Währung oder '-', wenn nicht berechnet).

## 8. Bid Adjustment Recommendations (Top 5)

*   **Aussehen:** Blaue Tabelle, die die Top 5 Keywords (ohne "Maintain") auflistet, für die eine Gebotsanpassung empfohlen wird. Zeigt Keyword, Match Type, Current Bid, Recommended Bid, Action (Increase/Decrease) und den erwarteten Impact.
*   **Funktion:** Hebt die wichtigsten Gebotsänderungen hervor.
*   **Berechnung:**
    *   Filtert die `bidRecommendations`-Liste aus `analyzeAdsData`, um nur 'increase' und 'decrease' Aktionen zu behalten.
    *   Zeigt die ersten 5 Einträge dieser gefilterten Liste.
    *   Die Spaltenwerte (`Current Bid`, `Recommended Bid`, `Action`, `Impact`) werden direkt aus dem `bidRecommendations`-Objekt übernommen.
    *   `Current Bid`: Wie oben berechnet (`spend / clicks`).
    *   `Recommended Bid`: Wie oben für `NEW BID` berechnet.
    *   `Impact`: Textbeschreibung des erwarteten Ergebnisses der Gebotsänderung (z.B. ACOS-Reduzierung, Umsatzsteigerung). 