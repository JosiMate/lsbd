/* Trener SQL — uruchamia zapytania ucznia w przeglądarce.
 *
 * Silnikiem jest SQLite skompilowany do WebAssembly (sql.js). Baza żyje
 * w pamięci karty: nic nie wychodzi na serwer, nic nie da się zepsuć na stałe,
 * a przycisk „Przywróć bazę" cofa wszystko do stanu wyjściowego.
 *
 * Użycie w treści strony:
 *     <div class="sql-trener" data-baza="obuwie"
 *          data-start="SELECT * FROM produkt;"
 *          data-wzorzec="SELECT nazwa, cena FROM produkt WHERE cena > 200;"></div>
 *
 *   data-baza     — nazwa zestawu danych z obiektu BAZY (niżej):
 *                   „obuwie" — komplet danych, każdy produkt ma kategorię;
 *                   „braki"  — ten sam sklep z dziurami: puste ceny, kolory
 *                              i wysokości, produkty bez kategorii oraz jedna
 *                              kategoria bez produktów (do NULL i LEFT JOIN)
 *                   „zamowienia" — „obuwie" plus klienci, zamówienia i pozycje
 *                              zamówień (pięć tabel; złączenia trzech tabel,
 *                              klienci bez zamówień, produkt nigdy niekupiony)
 *   data-start    — treść wpisana do pola na starcie (opcjonalnie)
 *   data-wzorzec  — poprawne zapytanie; jeśli podane, trener porówna wynik
 *                   ucznia z wynikiem wzorca i powie, czy się zgadza
 *   data-dialekt  — "mariadb": polecenia struktury (CREATE/ALTER/DROP TABLE,
 *                   klucze obce) w składni MariaDB są tłumaczone na SQLite,
 *                   a błędy pokazywane tak, jak zgłosiłaby je MariaDB (dział V)
 *   data-pamiec   — nazwa, pod którą baza i treść pola zostają w tej
 *                   przeglądarce (localStorage) — praca na kilku lekcjach
 *   data-zadania  — nazwa pliku assets/trener/<nazwa>.json z zadaniami:
 *                   wybór zadania, „Sprawdź zadanie”, podpowiedzi, kod startowy;
 *                   kliknięcie w pole karty pracy przełącza trener na to zadanie
 *
 *   Zestaw „pusta” nie ma żadnej tabeli — uczeń buduje bazę sam.
 *
 * Silnik (sql-wasm.js + sql-wasm.wasm, licencja MIT) leży w assets/sqljs/,
 * więc trener działa bez dostępu do internetu.
 *
 * UWAGA merytoryczna: to jest SQLite, nie MariaDB. Składnia SELECT, WHERE,
 * ORDER BY, JOIN, GROUP BY i HAVING jest ta sama, ale poleceń administracyjnych
 * (CREATE USER, GRANT) SQLite nie ma — te ćwiczy się w phpMyAdminie.
 */
(function () {
  "use strict";

  // Silnik leży w repozytorium (assets/sqljs/), więc trener działa także wtedy,
  // gdy sieć szkolna blokuje serwisy CDN albo gdy nie ma jej wcale. Adres z sieci
  // zostaje jako zapas — na wypadek, gdyby plików lokalnych zabrakło.
  var LOKALNY = "assets/sqljs/";
  var ZAPASOWY = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/";


  /* ─────────────────────────────── zestawy danych ─────────────────────────── */
  var BAZY = {
    // Układ wzorowany na arkuszach INF.03: dwie tabele połączone kluczem obcym.
    obuwie: [
      "CREATE TABLE kategoria (",
      "  id_kategorii INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL",
      ");",
      "CREATE TABLE produkt (",
      "  id_produktu  INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL,",
      "  cena         REAL NOT NULL,",
      "  kolor        TEXT,",
      "  material     TEXT,",
      "  wysokosc     INTEGER,",
      "  id_kategorii INTEGER REFERENCES kategoria(id_kategorii)",
      ");",
      "INSERT INTO kategoria VALUES",
      " (1,'Trzewiki'),(2,'Kozaki'),(3,'Sandały'),(4,'Sportowe');",
      "INSERT INTO produkt VALUES",
      " (1,'Trzewik Alpin',    329.00,'czarny','skóra naturalna',18,1),",
      " (2,'Trzewik Roboczy',  259.50,'brązowy','skóra naturalna',15,1),",
      " (3,'Kozak Klasyk',     449.00,'czarny','skóra naturalna',34,2),",
      " (4,'Kozak Zimowy',     519.99,'bordowy','skóra naturalna',36,2),",
      " (5,'Sandał Lato',      129.00,'beżowy','skóra ekologiczna',4,3),",
      " (6,'Sandał Trekking',  189.00,'szary','tkanina',6,3),",
      " (7,'Biegacz 200',      279.00,'niebieski','tkanina',9,4),",
      " (8,'Biegacz 300',      349.00,'czarny','tkanina',11,4),",
      " (9,'Halówka Pro',      219.00,'biały','skóra ekologiczna',8,4),",
      " (10,'Trzewik Turysta', 399.00,'zielony','tkanina',22,1);",
    ].join("\n"),

    // Ten sam sklep, ale z brakami w danych — do tematów o wartościach NULL
    // (dział III) i o złączeniach zewnętrznych (dział IV). Celowo różni się od
    // zestawu „obuwie": kolumna cena dopuszcza NULL, kategoria „Kapcie" nie ma
    // żadnego produktu, a dwa produkty nie mają kategorii. Dzięki temu widać
    // różnicę między INNER JOIN a LEFT JOIN i między zerem a brakiem wartości.
    braki: [
      "CREATE TABLE kategoria (",
      "  id_kategorii INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL",
      ");",
      "CREATE TABLE produkt (",
      "  id_produktu  INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL,",
      "  cena         REAL,",
      "  kolor        TEXT,",
      "  material     TEXT,",
      "  wysokosc     INTEGER,",
      "  id_kategorii INTEGER REFERENCES kategoria(id_kategorii)",
      ");",
      "INSERT INTO kategoria VALUES",
      " (1,'Trzewiki'),(2,'Kozaki'),(3,'Sandały'),(4,'Sportowe'),(5,'Kapcie');",
      "INSERT INTO produkt VALUES",
      " (1,'Trzewik Alpin',    329.00,'czarny',   'skóra naturalna',  18,   1),",
      " (2,'Trzewik Roboczy',  259.50,'brązowy',  'skóra naturalna',  NULL, 1),",
      " (3,'Kozak Klasyk',     449.00,NULL,       'skóra naturalna',  34,   2),",
      " (4,'Kozak Zimowy',     519.99,'bordowy',  'skóra naturalna',  36,   2),",
      " (5,'Sandał Lato',      129.00,'beżowy',   'skóra ekologiczna', 4,   3),",
      " (6,'Sandał Trekking',  NULL,  'szary',    'tkanina',           6,   3),",
      " (7,'Biegacz 200',      279.00,'niebieski','tkanina',           9,   4),",
      " (8,'Biegacz 300',        0.00,'czarny',   'tkanina',        NULL,   4),",
      " (9,'Halówka Pro',      219.00,NULL,       'skóra ekologiczna', 8,   4),",
      " (10,'Trzewik Turysta', 399.00,'zielony',  'tkanina',          22,NULL),",
      " (11,'Wkładka Zima',    NULL,  NULL,       'filc',           NULL,NULL);",
    ].join("\n"),

    // Sklep „obuwie" rozszerzony o sprzedaż — do karty pracy działu IV
    // (zamowienia-praktyka.md). Kategorie i produkty są te same co w zestawie
    // „obuwie", dochodzą klienci, zamówienia i pozycje zamówień. Celowo: dwóch
    // klientów nie ma żadnego zamówienia, a „Biegacz 300" nie trafił do
    // żadnego — do LEFT JOIN, IS NULL i NOT IN. Pozycja łączy zamówienie
    // z produktem, więc da się ćwiczyć złączenie trzech tabel.
    zamowienia: [
      "CREATE TABLE kategoria (",
      "  id_kategorii INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL",
      ");",
      "CREATE TABLE produkt (",
      "  id_produktu  INTEGER PRIMARY KEY,",
      "  nazwa        TEXT NOT NULL,",
      "  cena         REAL NOT NULL,",
      "  kolor        TEXT,",
      "  material     TEXT,",
      "  wysokosc     INTEGER,",
      "  id_kategorii INTEGER REFERENCES kategoria(id_kategorii)",
      ");",
      "CREATE TABLE klient (",
      "  id_klienta   INTEGER PRIMARY KEY,",
      "  imie         TEXT NOT NULL,",
      "  nazwisko     TEXT NOT NULL,",
      "  miasto       TEXT",
      ");",
      "CREATE TABLE zamowienie (",
      "  id_zamowienia   INTEGER PRIMARY KEY,",
      "  id_klienta      INTEGER REFERENCES klient(id_klienta),",
      "  data_zamowienia TEXT NOT NULL",
      ");",
      "CREATE TABLE pozycja (",
      "  id_pozycji    INTEGER PRIMARY KEY,",
      "  id_zamowienia INTEGER REFERENCES zamowienie(id_zamowienia),",
      "  id_produktu   INTEGER REFERENCES produkt(id_produktu),",
      "  ilosc         INTEGER NOT NULL",
      ");",
      "INSERT INTO kategoria VALUES",
      " (1,'Trzewiki'),",
      " (2,'Kozaki'),",
      " (3,'Sandały'),",
      " (4,'Sportowe');",
      "INSERT INTO produkt VALUES",
      " (1,'Trzewik Alpin',329.00,'czarny','skóra naturalna',18,1),",
      " (2,'Trzewik Roboczy',259.50,'brązowy','skóra naturalna',15,1),",
      " (3,'Kozak Klasyk',449.00,'czarny','skóra naturalna',34,2),",
      " (4,'Kozak Zimowy',519.99,'bordowy','skóra naturalna',36,2),",
      " (5,'Sandał Lato',129.00,'beżowy','skóra ekologiczna',4,3),",
      " (6,'Sandał Trekking',189.00,'szary','tkanina',6,3),",
      " (7,'Biegacz 200',279.00,'niebieski','tkanina',9,4),",
      " (8,'Biegacz 300',349.00,'czarny','tkanina',11,4),",
      " (9,'Halówka Pro',219.00,'biały','skóra ekologiczna',8,4),",
      " (10,'Trzewik Turysta',399.00,'zielony','tkanina',22,1);",
      "INSERT INTO klient VALUES",
      " (1,'Anna','Nowak','Tarnów'),",
      " (2,'Piotr','Wiśniewski','Kraków'),",
      " (3,'Katarzyna','Lis','Szczucin'),",
      " (4,'Marek','Zając','Tarnów'),",
      " (5,'Ewa','Kowalczyk','Dąbrowa Tarnowska'),",
      " (6,'Tomasz','Wójcik','Kraków');",
      "INSERT INTO zamowienie VALUES",
      " (1,1,'2026-09-02'),",
      " (2,2,'2026-09-05'),",
      " (3,1,'2026-09-14'),",
      " (4,3,'2026-09-20'),",
      " (5,4,'2026-10-01'),",
      " (6,2,'2026-10-03'),",
      " (7,1,'2026-10-08');",
      "INSERT INTO pozycja VALUES",
      " (1,1,1,1),",
      " (2,1,5,2),",
      " (3,2,7,1),",
      " (4,2,9,1),",
      " (5,3,3,1),",
      " (6,4,9,2),",
      " (7,4,6,1),",
      " (8,5,4,1),",
      " (9,5,2,1),",
      " (10,6,7,2),",
      " (11,7,10,1),",
      " (12,7,5,1);",
    ].join("\n"),

    // Pusta baza — do działu V (struktura bazy): tabele tworzy uczeń.
    pusta: [
    ].join("\n"),
  };

  /* ─────────────────────────────────── style ──────────────────────────────── */
  var STYL = [
    ".sql-trener{border:1px solid var(--md-default-fg-color--lightest);border-radius:.3rem;margin:1.2em 0;overflow:hidden}",
    ".sql-trener__pasek{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;",
    "  padding:.45rem .6rem;background:var(--md-default-fg-color--lightest);font-size:.72rem}",
    ".sql-trener__pasek strong{font-weight:700}",
    ".sql-trener textarea{width:100%;min-height:5.5rem;border:0;border-top:1px solid var(--md-default-fg-color--lightest);",
    "  padding:.6rem;font-family:var(--md-code-font-family);font-size:.72rem;line-height:1.5;",
    "  background:var(--md-code-bg-color);color:var(--md-code-fg-color);resize:vertical;display:block}",
    ".sql-trener textarea:focus{outline:2px solid var(--md-accent-fg-color);outline-offset:-2px}",
    ".sql-trener__przyciski{display:flex;flex-wrap:wrap;gap:.4rem;padding:.5rem .6rem;",
    "  border-top:1px solid var(--md-default-fg-color--lightest)}",
    ".sql-trener button{font:inherit;font-size:.7rem;padding:.3rem .75rem;border-radius:.2rem;",
    "  border:1px solid var(--md-default-fg-color--lighter);background:transparent;",
    "  color:var(--md-default-fg-color);cursor:pointer}",
    ".sql-trener button:hover{background:var(--md-default-fg-color--lightest)}",
    ".sql-trener button.glowny{background:var(--md-primary-fg-color);color:var(--md-primary-bg-color);border-color:transparent}",
    ".sql-trener button.uwaga{border-color:#e65100;color:#e65100}",
    ".sql-trener__wynik{padding:.6rem;font-size:.72rem;border-top:1px solid var(--md-default-fg-color--lightest);overflow-x:auto}",
    ".sql-trener__wynik table{width:auto;min-width:60%;font-size:.7rem}",
    ".sql-trener__wynik th{text-align:left;white-space:nowrap}",
    ".sql-trener__wynik pre{margin:.4em 0;padding:.5em .6em;background:var(--md-code-bg-color);",
    "  font-size:.68rem;white-space:pre-wrap;border-radius:.2rem}",
    ".sql-trener__wynik h4{margin:.9em 0 .3em;font-size:.74rem}",
    ".sql-trener__wynik h4:first-child{margin-top:0}",
    ".sql-trener__blad{color:#c62828;font-weight:600}",
    "[data-md-color-scheme=slate] .sql-trener__blad{color:#ef9a9a}",
    ".sql-trener__ok{color:#2e7d32;font-weight:600}",
    "[data-md-color-scheme=slate] .sql-trener__ok{color:#a5d6a7}",
    ".sql-trener__info{color:var(--md-default-fg-color--light)}",
    ".sql-trener__ostrzezenie{color:#b45309}",
    "[data-md-color-scheme=slate] .sql-trener__ostrzezenie{color:#fbbf24}",
    ".sql-trener__log{list-style:none;margin:0 0 .5em;padding:0}",
    ".sql-trener__log li{margin:.15em 0;padding-left:1.3em;text-indent:-1.3em}",
    ".sql-trener__rada{margin:.4em 0;padding:.45em .6em;border-left:3px solid #e65100;",
    "  background:var(--md-default-fg-color--lightest)}",
    ".sql-trener__zadania{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;padding:.45rem .6rem;",
    "  border-top:1px solid var(--md-default-fg-color--lightest);font-size:.7rem}",
    ".sql-trener__zadania select{font:inherit;font-size:.7rem;padding:.25rem .3rem;max-width:16rem;",
    "  background:var(--md-default-bg-color);color:var(--md-default-fg-color);",
    "  border:1px solid var(--md-default-fg-color--lighter);border-radius:.2rem}",
    ".sql-trener__podp{margin:.4em 0;padding:.45em .6em;border-left:3px solid var(--md-accent-fg-color);",
    "  background:var(--md-default-fg-color--lightest)}",
  ].join("");

  function wstawStyl() {
    if (document.getElementById("sql-trener-styl")) return;
    var s = document.createElement("style");
    s.id = "sql-trener-styl";
    s.textContent = STYL;
    document.head.appendChild(s);
  }

  /* ───────────────────────────── ładowanie silnika ────────────────────────── */
  var silnik = null; // obietnica z gotowym SQL.js

  function zrodla() {
    // Strony leżą na różnych głębokościach (/dzial-1/temat/, /dzial-4/temat/),
    // więc adres do zasobów liczymy od korzenia witryny. Material wstawia go
    // w przełączniku motywu; gdy go nie ma, cofamy się o tyle poziomów, ile
    // segmentów ma bieżąca ścieżka.
    var wskazowka = document.querySelector("link[rel=canonical]");
    var prefiks = "";
    var sciezka = location.pathname;
    if (wskazowka && wskazowka.href) {
      try { sciezka = new URL(wskazowka.href).pathname; } catch (e) { /* zostaje location */ }
    }
    var segmenty = sciezka.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (!sciezka.endsWith("/") && segmenty.length) segmenty.pop();
    for (var i = 0; i < segmenty.length; i++) prefiks += "../";
    // Baza MUSI być bezwzględna — new URL("a/", "../") rzuca wyjątkiem.
    return [new URL(prefiks + LOKALNY, location.href).href, ZAPASOWY];
  }

  function sprobuj(lista, i) {
    var baza = lista[i];
    if (baza === undefined) return Promise.reject(new Error("brak silnika SQL"));
    return new Promise(function (ok, blad) {
      var s = document.createElement("script");
      s.src = baza + "sql-wasm.js";
      s.onload = function () {
        window
          .initSqlJs({ locateFile: function (f) { return baza + f; } })
          .then(ok, blad);
      };
      s.onerror = function () { blad(new Error("nie pobrano " + s.src)); };
      document.head.appendChild(s);
    }).catch(function () { return sprobuj(lista, i + 1); });
  }

  function zaladujSilnik() {
    if (!silnik) {
      try {
        silnik = sprobuj(zrodla(), 0);
      } catch (e) {
        silnik = sprobuj([ZAPASOWY], 0);
      }
    }
    return silnik;
  }

  /* ──────────────────────────────── pomocnicze ────────────────────────────── */
  function esc(t) {
    return String(t === null || t === undefined ? "NULL" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function tabela(wynik) {
    var h = "<table><thead><tr>";
    wynik.columns.forEach(function (k) { h += "<th>" + esc(k) + "</th>"; });
    h += "</tr></thead><tbody>";
    wynik.values.forEach(function (w) {
      h += "<tr>";
      w.forEach(function (k) { h += "<td>" + esc(k) + "</td>"; });
      h += "</tr>";
    });
    return h + "</tbody></table>";
  }

  function odmien(n) {
    if (n === 1) return "1 wiersz";
    var d = n % 10, s = n % 100;
    if (d >= 2 && d <= 4 && !(s >= 12 && s <= 14)) return n + " wiersze";
    return n + " wierszy";
  }

  // Porównanie wyników: te same wiersze, niezależnie od kolejności kolumn i wierszy.
  function taSama(a, b) {
    if (!a || !b) return false;
    var norm = function (w) {
      return w.values
        .map(function (r) { return r.map(function (k) { return String(k); }).sort().join("|"); })
        .sort().join("\n");
    };
    return a.values.length === b.values.length &&
           a.columns.length === b.columns.length &&
           norm(a) === norm(b);
  }

  /* ════════════════════ tryb MariaDB — polecenia struktury ════════════════════
   *
   * Dział V uczy CREATE TABLE, kluczy i ALTER TABLE w składni MariaDB (tak jak
   * na egzaminie INF.03), a silnikiem trenera jest SQLite. SQLite nie zna
   * AUTO_INCREMENT w tej postaci, UNSIGNED po nawiasie, ENGINE=…, MODIFY ani
   * ADD FOREIGN KEY, a klucza obcego do nieistniejącej tabeli w ogóle nie
   * sprawdza. Ten blok tłumaczy polecenia struktury na SQLite i odtwarza błędy,
   * które w tej sytuacji zgłosiłaby MariaDB (#1005 errno 150, #1217, #1451,
   * #1452, #1050, #1060, #1064, #1068, #1075 …).
   *
   * Prawdziwy typ kolumny w składni MariaDB (np. „INT UNSIGNED”) i znacznik
   * AUTO_INCREMENT zapisujemy w komentarzu przy kolumnie: SQLite przechowuje
   * treść CREATE TABLE razem z komentarzami, więc ta wiedza przeżywa zapis
   * bazy w przeglądarce i każdą przebudowę tabeli.
   *
   * Włącza się atrybutem data-dialekt="mariadb". Strony bez tego atrybutu
   * działają po staremu — zapytania idą do SQLite bez zmian.
   */
  var MDB = (function () {
    var ID = "(?:`[^`]+`|\"[^\"]+\"|[A-Za-z_\\u00C0-\\u024F][\\w$\\u00C0-\\u024F]*)";
    var TYPY_CALK = ["TINYINT", "SMALLINT", "MEDIUMINT", "INT", "BIGINT"];
    var TYPY = TYPY_CALK.concat(["INTEGER", "DECIMAL", "DEC", "NUMERIC", "FLOAT", "DOUBLE",
      "REAL", "BIT", "BOOL", "BOOLEAN", "CHAR", "VARCHAR", "TINYTEXT", "TEXT", "MEDIUMTEXT",
      "LONGTEXT", "BINARY", "VARBINARY", "TINYBLOB", "BLOB", "MEDIUMBLOB", "LONGBLOB", "DATE",
      "TIME", "DATETIME", "TIMESTAMP", "YEAR", "ENUM", "SET", "JSON"]);

    function Blad(kod, tekst, rada) { this.kod = kod; this.tekst = tekst; this.rada = rada || ""; }

    var RADA_150 = "Klucz obcy nie powstał. MariaDB nie mówi dlaczego — sprawdź po kolei: " +
      "<br>1) czy tabela, na którą wskazuje klucz, <strong>już istnieje</strong> (kolejność poleceń w skrypcie); " +
      "<br>2) czy obie kolumny mają <strong>ten sam typ</strong> — przy liczbach także <code>UNSIGNED</code>; " +
      "<br>3) czy kolumna w tabeli nadrzędnej jest <strong>kluczem głównym</strong> albo ma indeks; " +
      "<br>4) czy przy <code>ON DELETE SET NULL</code> kolumna nie jest <code>NOT NULL</code>.";

    function b1064(przy, rada) {
      return new Blad("#1064", "You have an error in your SQL syntax; check the manual that " +
        "corresponds to your MariaDB server version for the right syntax to use near '" +
        String(przy).slice(0, 60) + "'", rada ||
        "Błąd składni. Sprawdź przecinki (po ostatniej kolumnie przed nawiasem nie ma przecinka), " +
        "nawiasy, średniki i pisownię słów kluczowych.");
    }
    function b150(tabela) {
      return new Blad("#1005", "Can't create table `" + tabela +
        "` (errno: 150 \"Foreign key constraint is incorrectly formed\")", RADA_150);
    }

    function nazwa(s) {
      s = String(s).trim();
      var p = s[0];
      if ((p === "`" || p === '"') && s[s.length - 1] === p) return s.slice(1, -1);
      return s;
    }
    function q(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }
    function rowne(a, b) { return String(a).toLowerCase() === String(b).toLowerCase(); }

    function koniecCytatu(s, i) {
      var c = s[i], j = i + 1;
      while (j < s.length) {
        if (s[j] === "\\" && c === "'") { j += 2; continue; }
        if (s[j] === c) { if (s[j + 1] === c) { j += 2; continue; } return j; }
        j++;
      }
      return s.length - 1;
    }

    // Dzieli skrypt na polecenia po średnikach poza cudzysłowami; usuwa komentarze.
    function podziel(sql) {
      var wynik = [], cur = "", i = 0, n = sql.length;
      while (i < n) {
        var c = sql[i], d = sql[i + 1];
        if (c === "'" || c === '"' || c === "`") {
          var j = koniecCytatu(sql, i);
          cur += sql.slice(i, j + 1); i = j + 1; continue;
        }
        if ((c === "-" && d === "-" && /\s/.test(sql[i + 2] || " ")) || c === "#") {
          while (i < n && sql[i] !== "\n") i++;
          cur += " "; continue;
        }
        if (c === "/" && d === "*") {
          var k = sql.indexOf("*/", i + 2);
          i = k < 0 ? n : k + 2; cur += " "; continue;
        }
        if (c === ";") { if (cur.trim()) wynik.push(cur.trim()); cur = ""; i++; continue; }
        cur += c; i++;
      }
      if (cur.trim()) wynik.push(cur.trim());
      return wynik;
    }

    // Indeks nawiasu zamykającego dla nawiasu otwierającego na pozycji i.
    function zamykajacy(s, i) {
      var gl = 0;
      for (var j = i; j < s.length; j++) {
        var c = s[j];
        if (c === "'" || c === '"' || c === "`") { j = koniecCytatu(s, j); continue; }
        if (c === "/" && s[j + 1] === "*") { var k = s.indexOf("*/", j + 2); j = k < 0 ? s.length : k + 1; continue; }
        if (c === "(") gl++;
        else if (c === ")") { gl--; if (gl === 0) return j; }
      }
      return -1;
    }

    // Dzieli treść nawiasu (definicje kolumn) po przecinkach najwyższego poziomu.
    function elementy(s) {
      var out = [], cur = "", gl = 0, i = 0;
      while (i < s.length) {
        var c = s[i];
        if (c === "'" || c === '"' || c === "`") {
          var j = koniecCytatu(s, i); cur += s.slice(i, j + 1); i = j + 1; continue;
        }
        if (c === "/" && s[i + 1] === "*") {
          var k = s.indexOf("*/", i + 2); k = k < 0 ? s.length : k + 2;
          cur += s.slice(i, k); i = k; continue;
        }
        if (c === "(") gl++;
        else if (c === ")") gl--;
        if (c === "," && gl === 0) { out.push(cur.trim()); cur = ""; } else cur += c;
        i++;
      }
      if (cur.trim()) out.push(cur.trim());
      return out;
    }

    function listaKolumn(s) {
      return elementy(s).map(function (k) {
        return nazwa(k.replace(/\s*\(\d+\)\s*/, " ").replace(/\s+(ASC|DESC)\s*$/i, "").trim());
      });
    }

    /* ── kolumna: MariaDB → SQLite ── */
    function kolumna(def, tabela) {
      var m = new RegExp("^(" + ID + ")\\s+([A-Za-z]+)\\s*").exec(def);
      if (!m) throw b1064(def);
      var kol = nazwa(m[1]), typ = m[2].toUpperCase(), pos = m[0].length, arg = "";
      if (TYPY.indexOf(typ) < 0) {
        throw b1064(def.slice(m[1].length).trim(), "Nieznany typ danych <code>" + esc(m[2]) +
          "</code> w kolumnie <code>" + esc(kol) + "</code>. Sprawdź pisownię (INT, VARCHAR(50), DATE, DECIMAL(8,2)…).");
      }
      if (def[pos] === "(") {
        var z = zamykajacy(def, pos);
        if (z < 0) throw b1064(def.slice(pos));
        arg = def.slice(pos, z + 1).replace(/\s+/g, "");
        pos = z + 1;
      }
      if ((typ === "VARCHAR" || typ === "VARBINARY" || typ === "ENUM" || typ === "SET") && !arg) {
        throw b1064(def.slice(m[1].length).trim(), "Typ <code>" + typ + "</code> wymaga podania w nawiasie " +
          (typ === "ENUM" || typ === "SET" ? "listy wartości." : "długości, np. <code>" + typ + "(50)</code>."));
      }
      var reszta = def.slice(pos), unsigned = false;
      reszta = reszta.replace(/^\s*(?:(?:UNSIGNED|SIGNED|ZEROFILL)\b\s*)+/i, function (x) {
        unsigned = /UNSIGNED|ZEROFILL/i.test(x); return " ";
      });
      if (typ === "INTEGER") typ = "INT";
      if (typ === "DEC") typ = "DECIMAL";
      var calk = TYPY_CALK.indexOf(typ) >= 0;
      var typM;
      if (typ === "BOOL" || typ === "BOOLEAN") typM = "TINYINT(1)";
      else if (calk) typM = typ;
      else typM = typ + arg;
      if (unsigned) typM += " UNSIGNED";

      reszta = reszta
        .replace(/\bCOMMENT\s+'(?:[^'\\]|\\.|'')*'/gi, " ")
        .replace(/\b(?:CHARACTER\s+SET|CHARSET)\s+\w+/gi, " ")
        .replace(/\bCOLLATE\s+\w+/gi, " ")
        .replace(/\bON\s+UPDATE\s+CURRENT_TIMESTAMP(?:\s*\(\s*\))?/gi, " ")
        .replace(/\bCURRENT_TIMESTAMP\s*\(\s*\)/gi, "CURRENT_TIMESTAMP")
        .replace(/\bUNIQUE\s+KEY\b/gi, "UNIQUE");
      var ai = false;
      reszta = reszta.replace(/\bAUTO_INCREMENT\b/gi, function () { ai = true; return " "; });
      var ref = null;
      var mr = /\bREFERENCES\b([\s\S]*)$/i.exec(reszta);
      if (mr) { ref = "FOREIGN KEY (" + q(kol) + ") REFERENCES" + mr[1]; reszta = reszta.slice(0, mr.index); }
      if (ai && !calk) {
        throw new Blad("#1063", "Incorrect column specifier for column '" + kol + "'",
          "<code>AUTO_INCREMENT</code> działa tylko z liczbą całkowitą (np. <code>INT UNSIGNED</code>).");
      }
      var typS = ai ? "INTEGER" : (typ === "ENUM" || typ === "SET" || typ === "JSON") ? "TEXT"
        : (typ === "BOOL" || typ === "BOOLEAN") ? "INTEGER" : calk ? typ : typ + arg;
      reszta = reszta.replace(/\s+/g, " ").trim();
      return {
        nazwa: kol, typM: typM, ai: ai, ref: ref,
        sql: q(kol) + " " + typS + " /*@m=" + typM + (ai ? ";ai" : "") + "*/" + (reszta ? " " + reszta : ""),
        pk: /\bPRIMARY\s+KEY\b/i.test(reszta),
      };
    }

    /* ── ograniczenie (PRIMARY KEY, FOREIGN KEY, UNIQUE, KEY, CHECK) ── */
    var RE_OGR = /^(?:CONSTRAINT\b|PRIMARY\s+KEY\b|FOREIGN\s+KEY\b|UNIQUE\b|KEY\b|INDEX\b|FULLTEXT\b|SPATIAL\b|CHECK\b)/i;

    function akcja(s) {
      var a = s.replace(/\s+/g, " ").toUpperCase();
      return ["RESTRICT", "CASCADE", "SET NULL", "NO ACTION", "SET DEFAULT"].indexOf(a) >= 0 ? a : null;
    }

    function ograniczenie(tekst, tabela, licznik) {
      var t = tekst.replace(/\s+/g, " ").trim(), m;
      m = new RegExp("^(?:CONSTRAINT\\s*(" + ID + ")?\\s*)?PRIMARY KEY\\s*(?:USING \\w+\\s*)?\\((.*)\\)$", "i").exec(t);
      if (m) {
        var kp = listaKolumn(m[2]);
        return { rodzaj: "pk", nazwa: "PRIMARY", kolumny: kp,
          sql: "PRIMARY KEY (" + kp.map(q).join(", ") + ")" };
      }
      m = new RegExp("^(?:CONSTRAINT\\s*(" + ID + ")?\\s*)?FOREIGN KEY\\s*(?:" + ID + "\\s*)?\\(([^)]*)\\)\\s*" +
        "REFERENCES\\s*(" + ID + ")\\s*(?:\\(([^)]*)\\))?\\s*(.*)$", "i").exec(t);
      if (m) {
        var reszta = m[5], usun = "RESTRICT", zmien = "RESTRICT", mm;
        var re = /^ON (DELETE|UPDATE) (RESTRICT|CASCADE|SET NULL|NO ACTION|SET DEFAULT)\s*/i;
        while ((mm = re.exec(reszta))) {
          if (/DELETE/i.test(mm[1])) usun = akcja(mm[2]); else zmien = akcja(mm[2]);
          reszta = reszta.slice(mm[0].length);
        }
        if (reszta.trim()) throw b1064(reszta.trim());
        licznik.n++;
        var nz = m[1] ? nazwa(m[1]) : tabela + "_ibfk_" + licznik.n;
        var kol = listaKolumn(m[2]), cel = nazwa(m[3]), celKol = m[4] ? listaKolumn(m[4]) : [];
        return { rodzaj: "fk", nazwa: nz, kolumny: kol, cel: cel, celKol: celKol, usun: usun, zmien: zmien,
          sql: "CONSTRAINT " + q(nz) + " FOREIGN KEY (" + kol.map(q).join(", ") + ") REFERENCES " + q(cel) +
            (celKol.length ? " (" + celKol.map(q).join(", ") + ")" : "") +
            " ON DELETE " + usun + " ON UPDATE " + zmien };
      }
      m = new RegExp("^(?:CONSTRAINT\\s*(" + ID + ")?\\s*)?UNIQUE\\s*(?:KEY|INDEX)?\\s*(" + ID + ")?\\s*\\((.*)\\)$", "i").exec(t);
      if (m) {
        var ku = listaKolumn(m[3]);
        var nu = m[2] ? nazwa(m[2]) : m[1] ? nazwa(m[1]) : ku[0];
        return { rodzaj: "uniq", nazwa: nu, kolumny: ku,
          sql: "CONSTRAINT " + q(nu) + " UNIQUE (" + ku.map(q).join(", ") + ")" };
      }
      m = new RegExp("^(?:KEY|INDEX)\\s*(" + ID + ")?\\s*(?:USING \\w+\\s*)?\\((.*)\\)$", "i").exec(t);
      if (m) {
        var ki = listaKolumn(m[2]);
        return { rodzaj: "indeks", nazwa: m[1] ? nazwa(m[1]) : ki[0], kolumny: ki };
      }
      if (/^(FULLTEXT|SPATIAL)\b/i.test(t)) return { rodzaj: "pomin" };
      m = new RegExp("^(?:CONSTRAINT\\s*(" + ID + ")?\\s*)?CHECK\\s*\\(", "i").exec(t);
      if (m) return { rodzaj: "check", nazwa: m[1] ? nazwa(m[1]) : "", kolumny: [], sql: t };
      throw b1064(t);
    }

    /* ── model tabeli: kolumny, ograniczenia, indeksy ── */
    function istnieje(db, t) {
      var r = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND lower(name)=lower(" +
        "'" + String(t).replace(/'/g, "''") + "')");
      return r.length ? r[0].values[0][0] : null;
    }

    function tabele(db) {
      var r = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid");
      return r.length ? r[0].values.map(function (w) { return w[0]; }) : [];
    }

    function model(db, t) {
      var prawdziwa = istnieje(db, t);
      if (!prawdziwa) return null;
      var sql = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='" +
        prawdziwa.replace(/'/g, "''") + "'")[0].values[0][0];
      var p = sql.indexOf("("), z = zamykajacy(sql, p);
      var md = { nazwa: prawdziwa, kolumny: [], ogr: [], indeksy: [] };
      var licz = { n: 0 };
      elementy(sql.slice(p + 1, z)).forEach(function (el) {
        if (RE_OGR.test(el)) {
          var o = ograniczenie(el.replace(/\/\*[\s\S]*?\*\//g, " "), prawdziwa, licz);
          if (o.rodzaj !== "pomin") md.ogr.push(o);
          return;
        }
        var mk = new RegExp("^(" + ID + ")").exec(el);
        var kom = /\/\*@m=([^;*]*)(;ai)?\*\//.exec(el);
        var typS = (/^\S+\s+([A-Za-z]+(?:\([^)]*\))?)/.exec(el.replace(/\/\*[\s\S]*?\*\//g, " ")) || [])[1] || "";
        md.kolumny.push({ nazwa: nazwa(mk[1]), sql: el, typM: kom ? kom[1] : typS.toUpperCase(), ai: !!(kom && kom[2]) });
      });
      var ix = db.exec("SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL AND tbl_name='" +
        prawdziwa.replace(/'/g, "''") + "'");
      if (ix.length) ix[0].values.forEach(function (w) {
        var mi = /\((.*)\)\s*$/.exec(w[1]);
        md.indeksy.push({ nazwa: w[0].replace(/^.*?__/, ""), pelna: w[0],
          unikalny: /^CREATE\s+UNIQUE/i.test(w[1]), kolumny: mi ? listaKolumn(mi[1]) : [] });
      });
      return md;
    }

    function kol(md, n) {
      for (var i = 0; i < md.kolumny.length; i++) if (rowne(md.kolumny[i].nazwa, n)) return md.kolumny[i];
      return null;
    }
    function pkKolumny(md) {
      for (var i = 0; i < md.ogr.length; i++) if (md.ogr[i].rodzaj === "pk") return md.ogr[i].kolumny;
      for (var j = 0; j < md.kolumny.length; j++) {
        if (/\bPRIMARY\s+KEY\b/i.test(md.kolumny[j].sql.replace(/\/\*[\s\S]*?\*\//g, ""))) return [md.kolumny[j].nazwa];
      }
      return [];
    }
    function niepusta(md, n) {
      var k = kol(md, n);
      if (!k) return false;
      if (pkKolumny(md).some(function (x) { return rowne(x, n); })) return true;
      return /\bNOT\s+NULL\b/i.test(k.sql);
    }
    function unikalna(md, n) {
      var bez = function (s) { return s.replace(/\/\*[\s\S]*?\*\//g, ""); };
      var k = kol(md, n);
      if (k && /\bUNIQUE\b/i.test(bez(k.sql))) return true;
      return md.ogr.some(function (o) { return o.rodzaj === "uniq" && o.kolumny.length === 1 && rowne(o.kolumny[0], n); }) ||
        md.indeksy.some(function (o) { return o.unikalny && o.kolumny.length === 1 && rowne(o.kolumny[0], n); });
    }
    // Czy kolumna jest pierwsza w jakimś indeksie — warunek MariaDB dla kolumny, na którą wskazuje klucz obcy.
    function zIndeksem(md, n) {
      var pk = pkKolumny(md);
      if (pk.length && rowne(pk[0], n)) return true;
      if (unikalna(md, n)) return true;
      return md.ogr.concat(md.indeksy).some(function (o) {
        return (o.rodzaj === "uniq" || o.rodzaj === "fk" || o.rodzaj === "indeks" || o.rodzaj === undefined) && o.kolumny.length && rowne(o.kolumny[0], n);
      });
    }

    function zgodneTypy(a, b) {
      var pa = /^([A-Z]+)/.exec(a)[1], pb = /^([A-Z]+)/.exec(b)[1];
      var ua = /UNSIGNED/.test(a), ub = /UNSIGNED/.test(b);
      if (TYPY_CALK.indexOf(pa) >= 0 || TYPY_CALK.indexOf(pb) >= 0) return pa === pb && ua === ub;
      var tekst = ["CHAR", "VARCHAR"];
      if (tekst.indexOf(pa) >= 0 && tekst.indexOf(pb) >= 0) return true;
      return a.replace(/\s+/g, "") === b.replace(/\s+/g, "");
    }

    // Klucze obce tabeli md (albo tylko te wskazujące na tabelę naTabele) — reguły MariaDB/InnoDB.
    function walidujObce(db, md, nazwaWBledzie) {
      md.ogr.forEach(function (fk) {
        if (fk.rodzaj !== "fk") return;
        var rodzic = rowne(fk.cel, md.nazwa) ? md : model(db, fk.cel);
        if (!rodzic) throw b150(nazwaWBledzie || md.nazwa);
        var celKol = fk.celKol.length ? fk.celKol : pkKolumny(rodzic);
        if (celKol.length !== fk.kolumny.length) throw b150(nazwaWBledzie || md.nazwa);
        for (var i = 0; i < celKol.length; i++) {
          var kd = kol(md, fk.kolumny[i]), kr = kol(rodzic, celKol[i]);
          if (!kd) throw new Blad("#1072", "Key column '" + fk.kolumny[i] + "' doesn't exist in table",
            "W kluczu obcym jest kolumna <code>" + esc(fk.kolumny[i]) + "</code>, której nie ma w tabeli <code>" +
            esc(md.nazwa) + "</code>. Najpierw ją zdefiniuj, potem wskaż w <code>FOREIGN KEY</code>.");
          if (!kr || !zIndeksem(rodzic, celKol[i]) || !zgodneTypy(kd.typM, kr.typM)) throw b150(nazwaWBledzie || md.nazwa);
          if ((fk.usun === "SET NULL" || fk.zmien === "SET NULL") && niepusta(md, kd.nazwa)) throw b150(nazwaWBledzie || md.nazwa);
        }
      });
    }

    function tworzSQL(md, jakoNazwa) {
      var el = md.kolumny.map(function (k) { return k.sql; })
        .concat(md.ogr.map(function (o) { return o.sql; }));
      return "CREATE TABLE " + q(jakoNazwa || md.nazwa) + " (\n  " + el.join(",\n  ") + "\n)";
    }
    function tworzIndeksy(db, md) {
      md.indeksy.forEach(function (ix) {
        db.run("CREATE " + (ix.unikalny ? "UNIQUE " : "") + "INDEX " + q(md.nazwa + "__" + ix.nazwa) +
          " ON " + q(md.nazwa) + " (" + ix.kolumny.map(q).join(", ") + ")");
      });
    }
    function sprawdzAuto(md) {
      var ai = md.kolumny.filter(function (k) { return k.ai; });
      if (!ai.length) return;
      var pk = pkKolumny(md);
      if (ai.length > 1 || !((pk.length && rowne(pk[0], ai[0].nazwa)) || unikalna(md, ai[0].nazwa))) {
        throw new Blad("#1075", "Incorrect table definition; there can be only one auto column and it must be defined as a key",
          "Kolumna z <code>AUTO_INCREMENT</code> musi być kluczem — najczęściej brakuje " +
          "<code>PRIMARY KEY</code> przy tej kolumnie albo na końcu definicji tabeli. Może też być tylko jedna taka kolumna.");
      }
    }
    function sprawdzPK(md) {
      var ile = md.ogr.filter(function (o) { return o.rodzaj === "pk"; }).length +
        md.kolumny.filter(function (k) { return /\bPRIMARY\s+KEY\b/i.test(k.sql.replace(/\/\*[\s\S]*?\*\//g, "")); }).length;
      if (ile > 1) throw new Blad("#1068", "Multiple primary key defined",
        "Tabela może mieć tylko jeden klucz główny. Jeśli ma się składać z kilku kolumn, zapisz je razem: " +
        "<code>PRIMARY KEY (a, b)</code>.");
      var znane = md.kolumny.map(function (k) { return k.nazwa.toLowerCase(); });
      md.ogr.concat(md.indeksy).forEach(function (o) {
        (o.rodzaj === "fk" ? o.kolumny : o.kolumny || []).forEach(function (k) {
          if (znane.indexOf(k.toLowerCase()) < 0) throw new Blad("#1072", "Key column '" + k + "' doesn't exist in table",
            "Klucz albo indeks wskazuje kolumnę <code>" + esc(k) + "</code>, której nie ma w tej tabeli. Sprawdź pisownię.");
        });
      });
      var widziane = {};
      md.kolumny.forEach(function (k) {
        var n = k.nazwa.toLowerCase();
        if (widziane[n]) throw new Blad("#1060", "Duplicate column name '" + k.nazwa + "'",
          "Kolumna <code>" + esc(k.nazwa) + "</code> występuje w tabeli dwa razy.");
        widziane[n] = 1;
      });
    }

    function odwolania(db, t, pomin) {
      // Tabele (poza pominiętymi), których klucze obce wskazują na t.
      var out = [];
      tabele(db).forEach(function (n) {
        if (rowne(n, t) || (pomin || []).some(function (p) { return rowne(p, n); })) return;
        var md = model(db, n);
        md.ogr.forEach(function (o) { if (o.rodzaj === "fk" && rowne(o.cel, t)) out.push({ tabela: n, fk: o }); });
      });
      return out;
    }

    /* ── CREATE TABLE ── */
    function utworz(db, s, stan) {
      var m = new RegExp("^CREATE\\s+(OR\\s+REPLACE\\s+)?(?:TEMPORARY\\s+)?TABLE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?(" +
        ID + "(?:\\." + ID + ")?)\\s*", "i").exec(s);
      if (!m) throw b1064(s.slice(0, 40));
      var t = nazwa(m[3].split(".").pop());
      var p = m[0].length;
      if (s[p] !== "(") {
        if (/^(LIKE|AS|SELECT)\b/i.test(s.slice(p))) { db.run(s); return { tekst: "Utworzono tabelę <code>" + esc(t) + "</code>." }; }
        throw b1064(s.slice(p));
      }
      var z = zamykajacy(s, p);
      if (z < 0) throw b1064(s.slice(-30), "Brakuje nawiasu zamykającego listę kolumn.");
      var opcje = s.slice(z + 1).trim();
      if (opcje && !/^((ENGINE|AUTO_INCREMENT|(DEFAULT\s+)?(CHARSET|CHARACTER\s+SET|COLLATE)|COMMENT|ROW_FORMAT)\b[\s\S]*)$/i.test(opcje)) {
        throw b1064(opcje);
      }
      if (istnieje(db, t)) {
        if (m[2]) return { tekst: "Tabela <code>" + esc(t) + "</code> już istnieje — pominięto (IF NOT EXISTS).", uwaga: true };
        if (m[1]) usun(db, "DROP TABLE " + q(t), stan);
        else throw new Blad("#1050", "Table '" + t + "' already exists",
          "Tabela o tej nazwie już jest w bazie. Jeśli chcesz ją utworzyć od nowa, najpierw <code>DROP TABLE " +
          esc(t) + ";</code> — albo zacznij skrypt od <code>DROP TABLE IF EXISTS</code>.");
      }
      var md = { nazwa: t, kolumny: [], ogr: [], indeksy: [] }, licz = { n: 0 }, uwagi = [];
      var cialo = s.slice(p + 1, z);
      if (/,\s*$/.test(cialo)) throw b1064(")", "Przecinek po ostatniej kolumnie (albo ostatnim kluczu) przed nawiasem " +
        "zamykającym. Usuń go — przecinek oddziela elementy, nie kończy listy.");
      var el = elementy(cialo);
      if (!el.length) throw b1064(")");
      el.forEach(function (e) {
        if (!e) throw b1064(")", "Pusty element listy — najczęściej przecinek po ostatniej kolumnie przed nawiasem.");
        if (RE_OGR.test(e)) {
          var o = ograniczenie(e, t, licz);
          if (o.rodzaj === "indeks") md.indeksy.push(o);
          else if (o.rodzaj !== "pomin") md.ogr.push(o);
        } else {
          var k = kolumna(e, t);
          md.kolumny.push({ nazwa: k.nazwa, sql: k.sql, typM: k.typM, ai: k.ai });
          if (k.ref) {
            md.ogr.push(ograniczenie(k.ref, t, licz));
            uwagi.push("Klucz obcy zapisany przy kolumnie <code>" + esc(k.nazwa) + "</code> (<code>REFERENCES</code> bez " +
              "<code>FOREIGN KEY</code>). MariaDB starsza niż 10.5 — np. ta z pakietu XAMPP 8.x — " +
              "<strong>po cichu go pominie</strong>. Bezpieczniej: osobny wiersz <code>FOREIGN KEY (…) REFERENCES …</code>.");
          }
        }
      });
      if (!md.kolumny.length) throw b1064(")", "Tabela musi mieć co najmniej jedną kolumnę.");
      sprawdzPK(md);
      sprawdzAuto(md);
      if (stan.fk) walidujObce(db, md, t);
      db.run(tworzSQL(md));
      tworzIndeksy(db, md);
      return { tekst: "Utworzono tabelę <code>" + esc(t) + "</code>.", uwagi: uwagi };
    }

    /* ── DROP TABLE ── */
    function usun(db, s, stan) {
      var m = /^DROP\s+(?:TEMPORARY\s+)?TABLES?\s+(IF\s+EXISTS\s+)?([\s\S]+?)(?:\s+(?:RESTRICT|CASCADE))?$/i.exec(s);
      if (!m) throw b1064(s.slice(0, 40));
      var lista = elementy(m[2]).map(function (x) { return nazwa(x.split(".").pop()); });
      var teksty = [], uwagi = [];
      lista.forEach(function (t, i) {
        var prawdziwa = istnieje(db, t);
        if (!prawdziwa) {
          if (m[1]) { uwagi.push("Tabeli <code>" + esc(t) + "</code> nie było — pominięto (IF EXISTS)."); return; }
          throw new Blad("#1051", "Unknown table '" + t + "'", "Nie ma takiej tabeli. Sprawdź nazwę w „Strukturze bazy”.");
        }
        if (stan.fk) {
          var od = odwolania(db, prawdziwa, lista.slice(0, i));
          if (od.length) throw new Blad("#1217", "Cannot delete or update a parent row: a foreign key constraint fails",
            "Na tabelę <code>" + esc(prawdziwa) + "</code> wskazuje klucz obcy z tabeli <code>" + esc(od[0].tabela) +
            "</code>. Usuń najpierw tabelę podrzędną — tabele usuwa się w kolejności odwrotnej do tworzenia.");
        }
        db.run("PRAGMA foreign_keys=OFF");
        try { db.run("DROP TABLE " + q(prawdziwa)); } finally { db.run("PRAGMA foreign_keys=" + (stan.fk ? "ON" : "OFF")); }
        teksty.push("<code>" + esc(prawdziwa) + "</code>");
      });
      return { tekst: teksty.length ? "Usunięto: " + teksty.join(", ") + "." : "Nic nie usunięto.", uwagi: uwagi };
    }

    /* ── ALTER TABLE: przebudowa tabeli ze zmienioną definicją ── */
    function przebuduj(db, md, mapa, stan, sprawdzCudze) {
      var t = md.nazwa, tmp = t + "__nowa";
      db.run("PRAGMA foreign_keys=OFF");
      db.run("SAVEPOINT przebudowa");
      try {
        db.run(tworzSQL(md, tmp));
        var cele = [], zrodla = [];
        md.kolumny.forEach(function (k) {
          if (mapa[k.nazwa.toLowerCase()] !== undefined) { cele.push(q(k.nazwa)); zrodla.push(mapa[k.nazwa.toLowerCase()]); }
        });
        if (cele.length) db.run("INSERT INTO " + q(tmp) + " (" + cele.join(", ") + ") SELECT " + zrodla.join(", ") + " FROM " + q(t));
        db.run("DROP TABLE " + q(t));
        db.run("ALTER TABLE " + q(tmp) + " RENAME TO " + q(t));
        tworzIndeksy(db, md);
        if (stan.fk) {
          walidujObce(db, md, t);
          (sprawdzCudze || []).forEach(function (n) { walidujObce(db, model(db, n), n); });
          var nar = db.exec("PRAGMA foreign_key_check(" + q(t) + ")");
          if (nar.length && nar[0].values.length) throw new Blad("#1452",
            "Cannot add or update a child row: a foreign key constraint fails",
            "W tabeli są już wiersze, które wskazują na nieistniejące wiersze tabeli nadrzędnej — klucz obcy nie może powstać, " +
            "dopóki ich nie poprawisz albo nie usuniesz.");
        }
        db.run("RELEASE przebudowa");
      } catch (e) {
        db.run("ROLLBACK TO przebudowa");
        db.run("RELEASE przebudowa");
        throw e;
      } finally {
        db.run("PRAGMA foreign_keys=" + (stan.fk ? "ON" : "OFF"));
      }
    }

    function domyslnaDla(k) {
      var bez = k.sql.replace(/\/\*[\s\S]*?\*\//g, "");
      var md = /\bDEFAULT\s+('(?:[^']|'')*'|[^\s,]+)/i.exec(bez);
      if (md) return md[1];
      if (/\bNOT\s+NULL\b/i.test(bez)) return /INT|DEC|NUM|FLOAT|DOUBLE|REAL|BIT|YEAR/i.test(k.typM) ? "0" : "''";
      return "NULL";
    }

    function zmien(db, s, stan) {
      var m = new RegExp("^ALTER\\s+(?:ONLINE\\s+|IGNORE\\s+)*TABLE\\s+(" + ID + "(?:\\." + ID + ")?)\\s+([\\s\\S]+)$", "i").exec(s);
      if (!m) throw b1064(s.slice(0, 40));
      var t = nazwa(m[1].split(".").pop());
      var md = model(db, t);
      if (!md) throw new Blad("#1146", "Table '" + t + "' doesn't exist",
        "Nie ma takiej tabeli. Zmieniać można tylko tabelę, która już istnieje — sprawdź nazwę w „Strukturze bazy”.");
      t = md.nazwa;
      var mapa = {};
      md.kolumny.forEach(function (k) { mapa[k.nazwa.toLowerCase()] = q(k.nazwa); });
      var licz = { n: md.ogr.filter(function (o) { return o.rodzaj === "fk" && /_ibfk_\d+$/.test(o.nazwa); })
        .reduce(function (a, o) { return Math.max(a, +o.nazwa.split("_ibfk_")[1]); }, 0) };
      var przebudowa = false, cudze = [], opisy = [], uwagi = [], natychmiast = [];
      var bez = function (x) { return x.replace(/\/\*[\s\S]*?\*\//g, ""); };

      function wstaw(k, poz) {
        if (!poz) { md.kolumny.push(k); return; }
        if (/^FIRST$/i.test(poz.trim())) { md.kolumny.unshift(k); return; }
        var po = nazwa(poz.replace(/^\s*AFTER\s+/i, ""));
        var i = md.kolumny.findIndex(function (x) { return rowne(x.nazwa, po); });
        if (i < 0) throw new Blad("#1054", "Unknown column '" + po + "' in '" + t + "'", "Nie ma kolumny <code>" + esc(po) + "</code>, po której miała stanąć nowa.");
        md.kolumny.splice(i + 1, 0, k);
      }
      function indeksKol(n) {
        var i = md.kolumny.findIndex(function (x) { return rowne(x.nazwa, n); });
        if (i < 0) throw new Blad("#1054", "Unknown column '" + n + "' in '" + t + "'",
          "W tabeli <code>" + esc(t) + "</code> nie ma kolumny <code>" + esc(n) + "</code>.");
        return i;
      }
      function rozdzielPozycje(def) {
        var mp = new RegExp("\\s+(FIRST|AFTER\\s+" + ID + ")\\s*$", "i").exec(def);
        return mp ? [def.slice(0, mp.index), mp[1]] : [def, null];
      }
      function dodajKolumne(def, poz) {
        var k = kolumna(def, t);
        if (kol(md, k.nazwa)) throw new Blad("#1060", "Duplicate column name '" + k.nazwa + "'",
          "Kolumna <code>" + esc(k.nazwa) + "</code> już jest w tej tabeli. Do zmiany istniejącej kolumny służy <code>MODIFY</code>.");
        var nowa = { nazwa: k.nazwa, sql: k.sql, typM: k.typM, ai: k.ai };
        wstaw(nowa, poz);
        mapa[k.nazwa.toLowerCase()] = domyslnaDla(nowa);
        if (k.ref) { md.ogr.push(ograniczenie(k.ref, t, licz)); uwagi.push("Klucz obcy zapisany przy kolumnie (<code>REFERENCES</code> bez <code>FOREIGN KEY</code>) — starsza MariaDB go pominie."); }
        opisy.push("dodano kolumnę <code>" + esc(k.nazwa) + "</code>");
      }

      elementy(m[2]).forEach(function (op) {
        var o = op.replace(/\s+/g, " ").trim(), mo;
        if (/^(ENGINE|AUTO_INCREMENT|(DEFAULT )?(CHARSET|CHARACTER SET|COLLATE)|CONVERT TO|COMMENT|ROW_FORMAT)\b/i.test(o)) {
          uwagi.push("Opcja tabeli <code>" + esc(o.slice(0, 30)) + "</code> nie ma znaczenia w trenerze — pominięto."); return;
        }
        if ((mo = new RegExp("^RENAME (?:TO |AS )?(" + ID + ")$", "i").exec(o)) && !/^RENAME (COLUMN|INDEX|KEY)\b/i.test(o)) {
          natychmiast.push("ALTER TABLE " + q(t) + " RENAME TO " + q(nazwa(mo[1])));
          opisy.push("zmieniono nazwę tabeli na <code>" + esc(nazwa(mo[1])) + "</code>"); return;
        }
        if ((mo = new RegExp("^RENAME COLUMN (" + ID + ") TO (" + ID + ")$", "i").exec(o))) {
          indeksKol(nazwa(mo[1]));
          natychmiast.push("ALTER TABLE " + q(t) + " RENAME COLUMN " + q(nazwa(mo[1])) + " TO " + q(nazwa(mo[2])));
          opisy.push("zmieniono nazwę kolumny <code>" + esc(nazwa(mo[1])) + "</code>"); return;
        }
        if (/^ADD (CONSTRAINT\b|PRIMARY KEY|FOREIGN KEY|UNIQUE|KEY\b|INDEX\b|FULLTEXT|SPATIAL|CHECK)/i.test(o)) {
          var og = ograniczenie(o.replace(/^ADD /i, ""), t, licz);
          if (og.rodzaj === "indeks") {
            if (md.indeksy.some(function (x) { return rowne(x.nazwa, og.nazwa); })) throw new Blad("#1061", "Duplicate key name '" + og.nazwa + "'", "Indeks o tej nazwie już istnieje.");
            md.indeksy.push(og); opisy.push("dodano indeks <code>" + esc(og.nazwa) + "</code>");
          } else if (og.rodzaj !== "pomin") {
            if (og.rodzaj === "pk" && pkKolumny(md).length) throw new Blad("#1068", "Multiple primary key defined",
              "Ta tabela ma już klucz główny. Żeby go zmienić: <code>DROP PRIMARY KEY, ADD PRIMARY KEY (…)</code>.");
            if (og.rodzaj !== "check" && og.rodzaj !== "pk" && md.ogr.some(function (x) { return rowne(x.nazwa, og.nazwa); })) {
              throw new Blad("#1061", "Duplicate key name '" + og.nazwa + "'", "Ograniczenie o tej nazwie już istnieje w tej tabeli.");
            }
            md.ogr.push(og);
            opisy.push({ pk: "dodano klucz główny", fk: "dodano klucz obcy <code>" + esc(og.nazwa) + "</code>",
              uniq: "dodano indeks unikalny <code>" + esc(og.nazwa) + "</code>", check: "dodano warunek CHECK" }[og.rodzaj]);
          }
          przebudowa = true; return;
        }
        if ((mo = /^ADD (?:COLUMN )?(?:IF NOT EXISTS )?([\s\S]+)$/i.exec(o))) {
          if (/^\(/.test(mo[1])) throw b1064(mo[1], "Dodawaj kolumny pojedynczo: <code>ADD a INT, ADD b INT</code>.");
          var r = rozdzielPozycje(mo[1]); dodajKolumne(r[0], r[1]); przebudowa = true; return;
        }
        if ((mo = new RegExp("^DROP FOREIGN KEY (?:IF EXISTS )?(" + ID + ")$", "i").exec(o))) {
          var i1 = md.ogr.findIndex(function (x) { return x.rodzaj === "fk" && rowne(x.nazwa, nazwa(mo[1])); });
          if (i1 < 0) throw new Blad("#1091", "Can't DROP FOREIGN KEY `" + nazwa(mo[1]) + "`; check that it exists",
            "Nie ma klucza obcego o tej nazwie. Nazwy kluczy obcych pokazuje „Struktura bazy” (np. <code>" + esc(t) + "_ibfk_1</code>).");
          md.ogr.splice(i1, 1); opisy.push("usunięto klucz obcy <code>" + esc(nazwa(mo[1])) + "</code>"); przebudowa = true; return;
        }
        if (/^DROP PRIMARY KEY$/i.test(o)) {
          var i2 = md.ogr.findIndex(function (x) { return x.rodzaj === "pk"; });
          if (i2 >= 0) md.ogr.splice(i2, 1);
          else {
            var kp = md.kolumny.find(function (k) { return /\bPRIMARY\s+KEY\b/i.test(bez(k.sql)); });
            if (!kp) throw new Blad("#1091", "Can't DROP INDEX `PRIMARY`; check that it exists", "Ta tabela nie ma klucza głównego.");
            kp.sql = kp.sql.replace(/\bPRIMARY\s+KEY\b/i, "");
          }
          if (md.kolumny.some(function (k) { return k.ai; })) {
            try { sprawdzAuto(md); } catch (e) { throw e; }
          }
          opisy.push("usunięto klucz główny"); przebudowa = true; return;
        }
        if ((mo = new RegExp("^DROP (?:INDEX|KEY) (?:IF EXISTS )?(" + ID + ")$", "i").exec(o))) {
          var n3 = nazwa(mo[1]);
          var i3 = md.indeksy.findIndex(function (x) { return rowne(x.nazwa, n3); });
          var i4 = md.ogr.findIndex(function (x) { return x.rodzaj === "uniq" && rowne(x.nazwa, n3); });
          if (i3 >= 0) md.indeksy.splice(i3, 1);
          else if (i4 >= 0) md.ogr.splice(i4, 1);
          else throw new Blad("#1091", "Can't DROP INDEX `" + n3 + "`; check that it exists", "Nie ma indeksu o tej nazwie.");
          opisy.push("usunięto indeks <code>" + esc(n3) + "</code>"); przebudowa = true; return;
        }
        if ((mo = new RegExp("^DROP (?:COLUMN )?(?:IF EXISTS )?(" + ID + ")$", "i").exec(o))) {
          var n5 = nazwa(mo[1]);
          if (!kol(md, n5)) throw new Blad("#1091", "Can't DROP COLUMN `" + n5 + "`; check that it exists",
            "W tabeli <code>" + esc(t) + "</code> nie ma kolumny <code>" + esc(n5) + "</code>.");
          var fk5 = md.ogr.find(function (x) { return x.rodzaj === "fk" && x.kolumny.some(function (k) { return rowne(k, n5); }); });
          if (fk5) throw new Blad("#1828", "Cannot drop column '" + n5 + "': needed in a foreign key constraint '" + fk5.nazwa + "'",
            "Na tej kolumnie opiera się klucz obcy. Najpierw usuń go: <code>ALTER TABLE " + esc(t) + " DROP FOREIGN KEY " +
            esc(fk5.nazwa) + ";</code>");
          var od5 = odwolania(db, t).filter(function (x) {
            var ck = x.fk.celKol.length ? x.fk.celKol : pkKolumny(md);
            return ck.some(function (k) { return rowne(k, n5); });
          });
          if (od5.length && stan.fk) throw new Blad("#1829", "Cannot drop column '" + n5 + "': needed in a foreign key constraint '" +
            od5[0].fk.nazwa + "' of table '" + od5[0].tabela + "'",
            "Na tę kolumnę wskazuje klucz obcy z tabeli <code>" + esc(od5[0].tabela) + "</code>.");
          md.kolumny.splice(indeksKol(n5), 1);
          delete mapa[n5.toLowerCase()];
          md.ogr = md.ogr.map(function (x) {
            if (x.rodzaj !== "pk" && x.rodzaj !== "uniq") return x;
            var reszta = x.kolumny.filter(function (k) { return !rowne(k, n5); });
            if (!reszta.length) return null;
            if (reszta.length === x.kolumny.length) return x;
            return ograniczenie((x.rodzaj === "pk" ? "PRIMARY KEY (" : "CONSTRAINT " + q(x.nazwa) + " UNIQUE (") +
              reszta.map(q).join(", ") + ")", t, { n: 0 });
          }).filter(Boolean);
          md.indeksy = md.indeksy.filter(function (x) { return !x.kolumny.some(function (k) { return rowne(k, n5); }); });
          opisy.push("usunięto kolumnę <code>" + esc(n5) + "</code>"); przebudowa = true; return;
        }
        if ((mo = new RegExp("^(MODIFY|CHANGE) (?:COLUMN )?(?:IF EXISTS )?([\\s\\S]+)$", "i").exec(o))) {
          var def = mo[2], stara;
          if (/^CHANGE$/i.test(mo[1])) {
            var ms = new RegExp("^(" + ID + ")\\s+").exec(def);
            if (!ms) throw b1064(def);
            stara = nazwa(ms[1]); def = def.slice(ms[0].length);
          }
          var r2 = rozdzielPozycje(def);
          var k2 = kolumna(r2[0], t);
          stara = stara || k2.nazwa;
          var i6 = indeksKol(stara);
          if (!rowne(stara, k2.nazwa)) {
            if (kol(md, k2.nazwa)) throw new Blad("#1060", "Duplicate column name '" + k2.nazwa + "'", "Kolumna o nowej nazwie już istnieje.");
            if (odwolania(db, t).length) throw new Blad("—", "Trener nie zmienia nazwy kolumny w tabeli, na którą wskazują klucze obce innych tabel.",
              "W tej sytuacji użyj <code>RENAME COLUMN stara TO nowa</code> — albo wykonaj <code>CHANGE</code> w phpMyAdminie.");
            md.ogr.forEach(function (x) {
              x.kolumny = x.kolumny.map(function (k) { return rowne(k, stara) ? k2.nazwa : k; });
              if (x.rodzaj === "pk") x.sql = "PRIMARY KEY (" + x.kolumny.map(q).join(", ") + ")";
              if (x.rodzaj === "uniq") x.sql = "CONSTRAINT " + q(x.nazwa) + " UNIQUE (" + x.kolumny.map(q).join(", ") + ")";
              if (x.rodzaj === "fk") x.sql = "CONSTRAINT " + q(x.nazwa) + " FOREIGN KEY (" + x.kolumny.map(q).join(", ") +
                ") REFERENCES " + q(x.cel) + (x.celKol.length ? " (" + x.celKol.map(q).join(", ") + ")" : "") +
                " ON DELETE " + x.usun + " ON UPDATE " + x.zmien;
            });
            md.indeksy.forEach(function (x) { x.kolumny = x.kolumny.map(function (k) { return rowne(k, stara) ? k2.nazwa : k; }); });
          }
          var nowa2 = { nazwa: k2.nazwa, sql: k2.sql, typM: k2.typM, ai: k2.ai };
          var zrodlo = mapa[stara.toLowerCase()];
          delete mapa[stara.toLowerCase()];
          md.kolumny.splice(i6, 1);
          if (r2[1]) wstaw(nowa2, r2[1]); else md.kolumny.splice(i6, 0, nowa2);
          // MODIFY bez NOT NULL zdejmuje NOT NULL — tak samo jak w MariaDB.
          mapa[k2.nazwa.toLowerCase()] = /\bNOT\s+NULL\b/i.test(bez(k2.sql)) ? "COALESCE(" + zrodlo + ", " + domyslnaDla(nowa2) + ")" : zrodlo;
          if (k2.ref) md.ogr.push(ograniczenie(k2.ref, t, licz));
          cudze = cudze.concat(odwolania(db, t).map(function (x) { return x.tabela; }));
          opisy.push((/^CHANGE$/i.test(mo[1]) ? "zmieniono kolumnę " : "zmieniono definicję kolumny ") + "<code>" + esc(k2.nazwa) + "</code>");
          przebudowa = true; return;
        }
        if ((mo = new RegExp("^ALTER (?:COLUMN )?(" + ID + ") (SET DEFAULT (.+)|DROP DEFAULT)$", "i").exec(o))) {
          var k7 = md.kolumny[indeksKol(nazwa(mo[1]))];
          k7.sql = k7.sql.replace(/\s+DEFAULT\s+('(?:[^']|'')*'|[^\s,]+)/i, "");
          if (mo[3]) k7.sql += " DEFAULT " + mo[3];
          opisy.push("zmieniono wartość domyślną kolumny <code>" + esc(k7.nazwa) + "</code>"); przebudowa = true; return;
        }
        throw b1064(o);
      });

      if (przebudowa) {
        sprawdzPK(md);
        sprawdzAuto(md);
        przebuduj(db, md, mapa, stan, cudze);
      }
      natychmiast.forEach(function (x) { db.run(x); });
      return { tekst: "Zmieniono tabelę <code>" + esc(t) + "</code>: " + (opisy.join(", ") || "bez zmian") + ".", uwagi: uwagi };
    }

    /* ── opis struktury (jak DESCRIBE / SHOW CREATE TABLE w MariaDB) ── */
    function opisz(db, t) {
      var md = model(db, t);
      if (!md) throw new Blad("#1146", "Table '" + t + "' doesn't exist", "Nie ma takiej tabeli.");
      var pk = pkKolumny(md);
      var info = db.exec("PRAGMA table_info(" + q(md.nazwa) + ")")[0].values;
      var wiersze = md.kolumny.map(function (k) {
        var p = info.find(function (w) { return rowne(w[1], k.nazwa); }) || [];
        var wPk = pk.some(function (x) { return rowne(x, k.nazwa); });
        var klucz = wPk ? "PRI" : unikalna(md, k.nazwa) ? "UNI" : zIndeksem(md, k.nazwa) ? "MUL" : "";
        return [k.nazwa, k.typM.toLowerCase(), wPk || niepusta(md, k.nazwa) ? "NO" : "YES", klucz,
          p[4] === undefined ? null : p[4], k.ai ? "auto_increment" : ""];
      });
      return { md: md, wynik: { columns: ["Field", "Type", "Null", "Key", "Default", "Extra"], values: wiersze } };
    }

    function pokazCreate(db, t) {
      var md = model(db, t);
      if (!md) throw new Blad("#1146", "Table '" + t + "' doesn't exist", "Nie ma takiej tabeli.");
      var bez = function (x) { return x.replace(/\/\*[\s\S]*?\*\//g, ""); };
      var pk = pkKolumny(md);
      var linie = md.kolumny.map(function (k) {
        var reszta = bez(k.sql).replace(/^\S+\s+[A-Za-z]+(\([^)]*\))?/, "").replace(/\bPRIMARY\s+KEY\b/i, "")
          .replace(/\bNOT\s+NULL\b/i, "").replace(/\s+/g, " ").trim();
        var nn = niepusta(md, k.nazwa);
        return "  `" + k.nazwa + "` " + k.typM.toLowerCase() + (nn ? " NOT NULL" : "") + (reszta ? " " + reszta : "") +
          (k.ai ? " AUTO_INCREMENT" : "");
      });
      if (pk.length) linie.push("  PRIMARY KEY (" + pk.map(function (k) { return "`" + k + "`"; }).join(",") + ")");
      md.ogr.forEach(function (o) {
        if (o.rodzaj === "uniq") linie.push("  UNIQUE KEY `" + o.nazwa + "` (" + o.kolumny.map(function (k) { return "`" + k + "`"; }).join(",") + ")");
      });
      md.indeksy.forEach(function (o) {
        linie.push("  " + (o.unikalny ? "UNIQUE " : "") + "KEY `" + o.nazwa + "` (" + o.kolumny.map(function (k) { return "`" + k + "`"; }).join(",") + ")");
      });
      md.ogr.forEach(function (o) {
        if (o.rodzaj === "fk") linie.push("  CONSTRAINT `" + o.nazwa + "` FOREIGN KEY (" +
          o.kolumny.map(function (k) { return "`" + k + "`"; }).join(",") + ") REFERENCES `" + o.cel + "` (" +
          (o.celKol.length ? o.celKol : []).map(function (k) { return "`" + k + "`"; }).join(",") + ")" +
          (o.usun !== "RESTRICT" ? " ON DELETE " + o.usun : "") + (o.zmien !== "RESTRICT" ? " ON UPDATE " + o.zmien : ""));
        if (o.rodzaj === "check") linie.push("  " + o.sql);
      });
      return "CREATE TABLE `" + md.nazwa + "` (\n" + linie.join(",\n") + "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    }

    /* ── błędy SQLite → komunikaty w stylu MariaDB ── */
    function mapuj(e, s, db) {
      var msg = String(e && e.message || e), m;
      var rodzaj = (/^\s*(\w+)/.exec(s) || [])[1] || "";
      if (/FOREIGN KEY constraint failed/i.test(msg)) {
        var mt = /^\s*(?:UPDATE|INSERT\s+(?:IGNORE\s+)?INTO|REPLACE\s+INTO)\s+(`[^`]+`|"[^"]+"|\S+)/i.exec(s);
        var dziecko = /^INSERT|^REPLACE/i.test(rodzaj);
        if (/^UPDATE/i.test(rodzaj) && mt) {
          var md = model(db, nazwa(mt[1]));
          dziecko = !!(md && md.ogr.some(function (o) { return o.rodzaj === "fk"; }));
        }
        return dziecko
          ? new Blad("#1452", "Cannot add or update a child row: a foreign key constraint fails",
            "Klucz obcy działa: w tabeli nadrzędnej <strong>nie ma wiersza</strong> o takim identyfikatorze. " +
            "Najpierw dodaj wiersz do tabeli nadrzędnej albo wpisz istniejący identyfikator.")
          : new Blad("#1451", "Cannot delete or update a parent row: a foreign key constraint fails",
            "Na ten wiersz wskazują wiersze z innej tabeli, a klucz obcy ma zachowanie <code>RESTRICT</code> — " +
            "baza nie pozwoli zostawić ich bez rodzica.");
      }
      if ((m = /NOT NULL constraint failed: \w+\.(\w+)/i.exec(msg))) return new Blad("#1048",
        "Column '" + m[1] + "' cannot be null",
        "Kolumna <code>" + esc(m[1]) + "</code> jest <code>NOT NULL</code> — musi dostać wartość. " +
        "Gdy pominiesz ją w <code>INSERT</code>, MariaDB zgłosi #1364 „Field doesn't have a default value”.");
      if ((m = /UNIQUE constraint failed: ([\w.]+)/i.exec(msg))) return new Blad("#1062",
        "Duplicate entry for key '" + m[1].split(".").pop() + "'",
        "Taka wartość już jest w tej kolumnie, a kolumna jest kluczem głównym albo ma indeks unikalny.");
      if ((m = /no such table: (\S+)/i.exec(msg))) return new Blad("#1146", "Table '" + m[1] + "' doesn't exist",
        "Nie ma takiej tabeli. Sprawdź nazwę w „Strukturze bazy” — może jeszcze jej nie utworzyłeś?");
      if ((m = /no such column: (\S+)/i.exec(msg))) return new Blad("#1054", "Unknown column '" + m[1] + "' in 'field list'",
        "Nie ma takiej kolumny. Sprawdź pisownię w „Strukturze bazy”.");
      if ((m = /near "([^"]*)": syntax error/i.exec(msg))) return b1064(m[1]);
      if (/incomplete input/i.test(msg)) return b1064("", "Polecenie urywa się w połowie — brakuje nawiasu albo apostrofu.");
      return new Blad("SQLite", msg, "Komunikat silnika SQLite — w MariaDB brzmiałby inaczej.");
    }

    function jedno(db, s, stan) {
      var m;
      if (/^CREATE\s+(OR\s+REPLACE\s+)?(TEMPORARY\s+)?TABLE\b/i.test(s)) return utworz(db, s, stan);
      if (/^ALTER\s+(ONLINE\s+|IGNORE\s+)*TABLE\b/i.test(s)) return zmien(db, s, stan);
      if (/^DROP\s+(TEMPORARY\s+)?TABLES?\b/i.test(s)) return usun(db, s, stan);
      if (/^(CREATE|DROP)\s+(DATABASE|SCHEMA)\b|^USE\s/i.test(s)) {
        return { tekst: "<code>" + esc(s.slice(0, 40)) + "</code> — pominięto: w trenerze jest jedna baza. W phpMyAdminie to polecenie zadziała.", uwaga: true };
      }
      if ((m = /^SET\s+(?:@@(?:SESSION\.|GLOBAL\.)?)?FOREIGN_KEY_CHECKS\s*=\s*(\d)/i.exec(s))) {
        stan.fk = m[1] !== "0";
        db.run("PRAGMA foreign_keys=" + (stan.fk ? "ON" : "OFF"));
        return { tekst: "Sprawdzanie kluczy obcych " + (stan.fk ? "włączone." : "<strong>wyłączone</strong> — do końca tego uruchomienia."), uwaga: !stan.fk };
      }
      if (/^(SET|LOCK\s+TABLES|UNLOCK\s+TABLES)\b/i.test(s)) return { tekst: "<code>" + esc(s.slice(0, 40)) + "</code> — pominięto.", uwaga: true };
      if (/^START\s+TRANSACTION|^BEGIN\b/i.test(s)) { db.run("BEGIN"); return { tekst: "Rozpoczęto transakcję." }; }
      if (/^SHOW\s+(FULL\s+)?TABLES\b/i.test(s)) {
        return { tekst: "Lista tabel.", wynik: { columns: ["Tables_in_baza"], values: tabele(db).map(function (n) { return [n]; }) } };
      }
      if ((m = new RegExp("^(?:DESCRIBE|DESC|EXPLAIN)\\s+(" + ID + ")\\s*$", "i").exec(s)) ||
          (m = new RegExp("^SHOW\\s+(?:FULL\\s+)?(?:COLUMNS|FIELDS)\\s+(?:FROM|IN)\\s+(" + ID + ")", "i").exec(s))) {
        return { tekst: "Struktura tabeli <code>" + esc(nazwa(m[1])) + "</code>.", wynik: opisz(db, nazwa(m[1])).wynik };
      }
      if ((m = new RegExp("^SHOW\\s+CREATE\\s+TABLE\\s+(" + ID + ")", "i").exec(s))) {
        return { tekst: "Definicja tabeli.", wynik: { columns: ["Table", "Create Table"], values: [[nazwa(m[1]), pokazCreate(db, nazwa(m[1]))]] }, pre: true };
      }
      if ((m = new RegExp("^CREATE\\s+(UNIQUE\\s+)?INDEX\\s+(" + ID + ")\\s+ON\\s+(" + ID + ")\\s*(\\([\\s\\S]*\\))$", "i").exec(s))) {
        return zmien(db, "ALTER TABLE " + m[3] + " ADD " + (m[1] ? "UNIQUE " : "") + "INDEX " + m[2] + " " + m[4], stan);
      }
      if ((m = new RegExp("^DROP\\s+INDEX\\s+(" + ID + ")\\s+ON\\s+(" + ID + ")$", "i").exec(s))) {
        return zmien(db, "ALTER TABLE " + m[2] + " DROP INDEX " + m[1], stan);
      }
      if ((m = new RegExp("^RENAME\\s+TABLE\\s+(" + ID + ")\\s+TO\\s+(" + ID + ")$", "i").exec(s))) {
        return zmien(db, "ALTER TABLE " + m[1] + " RENAME TO " + m[2], stan);
      }
      var w = db.exec(s);
      var zm = db.getRowsModified ? db.getRowsModified() : 0;
      var rodzaj = ((/^\s*(\w+)/.exec(s) || ["", ""])[1]).toUpperCase();
      var tekst = { INSERT: "Wstawiono: " + odmien(zm) + ".", UPDATE: "Zmieniono: " + odmien(zm) + ".",
        DELETE: "Usunięto: " + odmien(zm) + "." }[rodzaj] ||
        (w.length ? "Zapytanie zwróciło " + odmien(w[w.length - 1].values.length) + "." : "Wykonano.");
      return { tekst: tekst, wynik: w.length ? w[w.length - 1] : null };
    }

    // Wykonuje skrypt polecenie po poleceniu; zatrzymuje się na pierwszym błędzie (jak phpMyAdmin).
    function wykonaj(db, tekst, stan) {
      var pol = podziel(tekst), log = [], wynik = null;
      for (var i = 0; i < pol.length; i++) {
        try {
          var r = jedno(db, pol[i], stan);
          log.push({ tekst: r.tekst, uwaga: !!r.uwaga });
          (r.uwagi || []).forEach(function (u) { log.push({ tekst: u, uwaga: true }); });
          if (r.wynik) wynik = r;
        } catch (e) {
          var b = e instanceof Blad ? e : mapuj(e, pol[i], db);
          b.nr = i + 1; b.polecenie = pol[i];
          return { log: log, wynik: wynik, blad: b, ile: pol.length };
        }
      }
      return { log: log, wynik: wynik, ile: pol.length };
    }

    /* ── sprawdzanie zadań ── */
    function normTyp(t) { return String(t || "").toUpperCase().replace(/\s+/g, " ").replace(/\s*\(\s*/g, "(").replace(/\s*,\s*/g, ",").trim(); }

    function sprawdz(db, SQL, s) {
      var md = s.tabela ? model(db, s.tabela) : null;
      var brakTabeli = { ok: false, rada: "Nie ma tabeli <code>" + esc(s.tabela) + "</code>." };
      var ok = false;
      switch (s.co) {
        case "tabela": return { ok: !!md, rada: md ? "" : brakTabeli.rada };
        case "brak_tabeli": return { ok: !md };
        case "kolumny": {
          if (!md) return brakTabeli;
          var ma = md.kolumny.map(function (k) { return k.nazwa.toLowerCase(); });
          var chce = s.kolumny.map(function (k) { return k.toLowerCase(); });
          ok = chce.every(function (k) { return ma.indexOf(k) >= 0; }) && (!s.dokladnie || ma.length === chce.length);
          return { ok: ok };
        }
        case "brak_kolumny": return md ? { ok: !kol(md, s.kolumna) } : brakTabeli;
        case "typ": {
          if (!md) return brakTabeli;
          var k = kol(md, s.kolumna);
          return { ok: !!k && new RegExp(s.wzor, "i").test(normTyp(k.typM)), rada: k ? "Teraz: <code>" + esc(k.typM) + "</code>." : "Brak kolumny." };
        }
        case "klucz": {
          if (!md) return brakTabeli;
          var pk = pkKolumny(md).map(function (x) { return x.toLowerCase(); }).sort().join(",");
          return { ok: pk === s.kolumny.map(function (x) { return x.toLowerCase(); }).sort().join(",") };
        }
        case "auto": { if (!md) return brakTabeli; var ka = kol(md, s.kolumna); return { ok: !!ka && ka.ai }; }
        case "wymagane": {
          if (!md) return brakTabeli;
          ok = (s.nie_null || []).every(function (n) { return kol(md, n) && niepusta(md, n); }) &&
               (s.null || []).every(function (n) { return kol(md, n) && !niepusta(md, n); });
          return { ok: ok };
        }
        case "unikalne": return md ? { ok: !!kol(md, s.kolumna) && unikalna(md, s.kolumna) } : brakTabeli;
        case "obcy": {
          if (!md) return brakTabeli;
          var fk = md.ogr.find(function (o) {
            return o.rodzaj === "fk" && o.kolumny.length === 1 && rowne(o.kolumny[0], s.kolumna) && rowne(o.cel, s.cel);
          });
          if (!fk) return { ok: false };
          var rw = function (a) { return a === "NO ACTION" ? "RESTRICT" : a; };
          ok = (!s.usun || rw(fk.usun) === rw(s.usun)) && (!s.zmien || rw(fk.zmien) === rw(s.zmien));
          return { ok: ok, rada: ok ? "" : "Teraz: <code>ON DELETE " + fk.usun + "</code>." };
        }
        case "odrzuca":
        case "przyjmuje": {
          var kopia = new SQL.Database(db.export());
          db.run("PRAGMA foreign_keys=ON");
          kopia.run("PRAGMA foreign_keys=ON");
          var st = { fk: true };
          try {
            if (s.przed) {
              var p = wykonaj(kopia, s.przed, st);
              if (p.blad) return { ok: false, rada: "Nie udało się przygotować danych testowych (" + esc(p.blad.kod) + " " + esc(p.blad.tekst) + ")." };
            }
            var r = wykonaj(kopia, s.polecenie, st);
            if (s.co === "przyjmuje") return { ok: !r.blad, rada: r.blad ? esc(r.blad.kod + " " + r.blad.tekst) : "" };
            ok = !!r.blad && (!s.kod || r.blad.kod === s.kod);
            return { ok: ok, rada: r.blad ? "" : "Baza przyjęła to polecenie bez sprzeciwu." };
          } finally { kopia.close(); }
        }
        case "wynik": {
          var kop = new SQL.Database(db.export());
          db.run("PRAGMA foreign_keys=ON");
          kop.run("PRAGMA foreign_keys=ON");
          try {
            var rw2 = wykonaj(kop, (s.przed || "") + ";\n" + s.polecenie, { fk: true });
            if (rw2.blad) return { ok: false, rada: esc(rw2.blad.kod + " " + rw2.blad.tekst) };
            var otrz = rw2.wynik ? rw2.wynik.wynik.values : [];
            return { ok: JSON.stringify(otrz) === JSON.stringify(s.wynik) };
          } finally { kop.close(); }
        }
        case "zapytanie": {
          try {
            var w = db.exec(s.sql);
            var wart = w.length ? w[w.length - 1].values : [];
            return { ok: JSON.stringify(wart) === JSON.stringify(s.wynik) };
          } catch (e) { return { ok: false, rada: esc(e.message) }; }
        }
      }
      return { ok: false, rada: "Nieznany rodzaj sprawdzenia." };
    }

    return { wykonaj: wykonaj, sprawdz: sprawdz, opisz: opisz, pokazCreate: pokazCreate, tabele: tabele,
      model: model, podziel: podziel, Blad: Blad };
  })();
  window.SqlTrenerMariaDB = MDB; // do testów automatycznych

  /* ─────────────────────────────── pamięć bazy ────────────────────────────── */
  function doBase64(bajty) {
    var s = "";
    for (var i = 0; i < bajty.length; i += 0x8000) s += String.fromCharCode.apply(null, bajty.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function zBase64(t) {
    var s = atob(t), b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }
  function pamiecCzytaj(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function pamiecPisz(k, v) {
    try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; }
  }

  // Przycisk, który wymaga drugiego kliknięcia (zamiast okna confirm, które blokuje stronę).
  function potwierdz(btn, pytanie, akcja) {
    if (btn.dataset.czeka) {
      clearTimeout(+btn.dataset.czeka);
      delete btn.dataset.czeka;
      btn.textContent = btn.dataset.etykieta; btn.classList.remove("uwaga");
      akcja(); return;
    }
    btn.dataset.etykieta = btn.textContent;
    btn.textContent = pytanie; btn.classList.add("uwaga");
    btn.dataset.czeka = String(setTimeout(function () {
      delete btn.dataset.czeka; btn.textContent = btn.dataset.etykieta; btn.classList.remove("uwaga");
    }, 4000));
  }

  /* ─────────────────────────────────── widżet ─────────────────────────────── */
  var SKRYPT = document.currentScript && document.currentScript.src;
  var KATALOG_ZADAN = SKRYPT ? new URL("../trener/", SKRYPT).href : null;
  var zadaniaCache = {};

  function zaladujZadania(n) {
    if (!zadaniaCache[n]) {
      zadaniaCache[n] = fetch(new URL(n + ".json", KATALOG_ZADAN).href)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    }
    return zadaniaCache[n];
  }

  // Trenery z panelem zadań — kliknięcie w polu karty pracy przełącza je na to zadanie.
  var zKarta = [];
  document.addEventListener("focusin", function (e) {
    var z = e.target && e.target.closest && e.target.closest(".kp-zadanie[id^='zadanie-']");
    if (!z) return;
    var nr = z.id.replace("zadanie-", "");
    zKarta = zKarta.filter(function (t) { return t.host.isConnected; });
    zKarta.forEach(function (t) { t.wybierz(nr); });
  });

  function zbuduj(host) {
    var nazwaBazy = host.dataset.baza || "obuwie";
    var schemat = BAZY[nazwaBazy];
    var mariadb = host.dataset.dialekt === "mariadb";
    var kluczPamieci = host.dataset.pamiec ? "sql-trener:" + host.dataset.pamiec : null;
    if (schemat === undefined) {
      host.textContent = "Trener SQL: nie znam zestawu danych „" + nazwaBazy + "”.";
      return;
    }

    host.innerHTML =
      '<div class="sql-trener__pasek"><strong>Trener SQL</strong>' +
      '<span class="sql-trener__info">baza <code>' + esc(nazwaBazy) + "</code> · " +
      (mariadb ? "składnia MariaDB" : "silnik SQLite w przeglądarce") +
      (kluczPamieci ? " · baza zostaje w tej przeglądarce" : " · nic nie wychodzi na serwer") + "</span></div>" +
      (host.dataset.zadania ? '<div class="sql-trener__zadania" hidden>' +
        '<label>Zadanie <select aria-label="Wybór zadania"></select></label>' +
        '<button type="button" data-akcja="sprawdz" class="glowny">Sprawdź zadanie</button>' +
        '<button type="button" data-akcja="podpowiedz">Podpowiedź</button>' +
        '<button type="button" data-akcja="wstaw" hidden>Wstaw kod z zadania</button></div>' : "") +
      '<textarea spellcheck="false" aria-label="Miejsce na polecenia SQL"></textarea>' +
      '<div class="sql-trener__przyciski">' +
      '<button type="button" class="glowny" data-akcja="wykonaj">Wykonaj (Ctrl+Enter)</button>' +
      '<button type="button" data-akcja="schemat">' + (mariadb ? "Struktura bazy" : "Pokaż strukturę") + "</button>" +
      '<button type="button" data-akcja="projekt" hidden>Projekt bazy</button>' +
      '<button type="button" data-akcja="reset">' + (kluczPamieci ? "Wyczyść bazę" : "Przywróć bazę") + "</button>" +
      "</div>" +
      '<div class="sql-trener__wynik sql-trener__info" aria-live="polite">Ładuję silnik SQL…</div>';

    var pole = host.querySelector("textarea");
    var wynikEl = host.querySelector(".sql-trener__wynik");
    var zadaniaEl = host.querySelector(".sql-trener__zadania");
    var wybor = host.querySelector(".sql-trener__zadania select");
    pole.value = host.dataset.start || "";
    if (kluczPamieci) {
      var tekst = pamiecCzytaj(kluczPamieci + ":pole");
      if (tekst !== null) pole.value = tekst;
      pole.addEventListener("input", function () { pamiecPisz(kluczPamieci + ":pole", pole.value); });
    }

    var db = null;
    var silnikSQL = null;
    var stan = { fk: true };
    var zestaw = null;          // zadania z pliku JSON
    var podpowiedzi = {};       // ile podpowiedzi odkryto w każdym zadaniu

    function ustawFk() { if (mariadb) db.run("PRAGMA foreign_keys=" + (stan.fk ? "ON" : "OFF")); }

    function odswiezBaze(SQL, zPamieci) {
      if (db) db.close();
      var zapis = zPamieci && kluczPamieci ? pamiecCzytaj(kluczPamieci) : null;
      db = null;
      if (zapis) { try { db = new SQL.Database(zBase64(zapis)); } catch (e) { db = null; } }
      if (!db) { db = new SQL.Database(); if (schemat) db.run(schemat); }
      stan.fk = true;
      ustawFk();
      return !!zapis;
    }

    function zapamietaj() {
      if (!kluczPamieci || !db) return;
      var b = db.export();      // export() zamyka i otwiera bazę — pragma wraca do domyślnej
      ustawFk();
      if (!pamiecPisz(kluczPamieci, doBase64(b))) {
        wynikEl.insertAdjacentHTML("beforeend", '<p class="sql-trener__ostrzezenie">Przeglądarka nie zapisała bazy ' +
          "(tryb prywatny?). Po odświeżeniu strony trzeba będzie uruchomić skrypty jeszcze raz.</p>");
      }
    }

    function pisz(html, klasa) {
      wynikEl.className = "sql-trener__wynik" + (klasa ? " " + klasa : "");
      wynikEl.innerHTML = html;
      wynikEl.scrollTop = 0;
    }

    function wykonajMariaDB(zapytanie) {
      var r = MDB.wykonaj(db, zapytanie, stan);
      stan.fk = true; ustawFk();     // SET FOREIGN_KEY_CHECKS działa tylko do końca uruchomienia
      var h = "";
      if (r.log.length && (r.ile > 1 || !r.wynik || r.blad)) {
        h += '<ul class="sql-trener__log">' + r.log.map(function (l) {
          return "<li" + (l.uwaga ? ' class="sql-trener__ostrzezenie">⚠ ' : ' class="sql-trener__ok">✔ ') + l.tekst + "</li>";
        }).join("") + "</ul>";
      }
      if (r.blad) {
        var b = r.blad;
        h += '<p class="sql-trener__blad">✘ ' + (r.ile > 1 ? "Polecenie nr " + b.nr + " z " + r.ile + ": " : "") +
          esc(b.kod) + " – " + esc(b.tekst) + "</p>" +
          (b.rada ? '<div class="sql-trener__rada">' + b.rada + "</div>" : "") +
          (r.ile > 1 ? "<pre>" + esc(b.polecenie.slice(0, 400)) + "</pre>" : "") +
          (r.ile > 1 && b.nr > 1 ? '<p class="sql-trener__info">Polecenia przed błędem zostały wykonane — tak jak w phpMyAdminie.</p>' : "");
      } else if (r.wynik) {
        var w = r.wynik.wynik;
        h += r.wynik.pre ? "<pre>" + esc(w.values[0][1]) + "</pre>" :
          tabela(w) + '<p class="sql-trener__info">' + odmien(w.values.length) + "</p>";
      }
      pisz(h || '<p class="sql-trener__info">Nic do wykonania.</p>');
      zapamietaj();
    }

    function wykonaj() {
      var zapytanie = pole.value.trim();
      if (!zapytanie) { pisz("Wpisz polecenie i kliknij <strong>Wykonaj</strong>.", "sql-trener__info"); return; }
      if (mariadb) { wykonajMariaDB(zapytanie); return; }
      var wyniki;
      try {
        wyniki = db.exec(zapytanie);
      } catch (e) {
        pisz("Błąd: " + esc(e.message), "sql-trener__blad");
        return;
      }
      if (!wyniki.length) {
        pisz("Zapytanie wykonane. Nie zwróciło żadnych wierszy — tak zachowują się " +
             "polecenia <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> " +
             "i <code>CREATE</code>.", "sql-trener__info");
        return;
      }
      var ostatni = wyniki[wyniki.length - 1];
      var html = tabela(ostatni) +
        '<p class="sql-trener__info">' + odmien(ostatni.values.length) + "</p>";

      var wzorzec = host.dataset.wzorzec;
      if (wzorzec) {
        // Wzorzec liczymy na świeżej kopii bazy, żeby ewentualne UPDATE-y ucznia
        // nie wpłynęły na to, co uznajemy za poprawny wynik.
        var oczekiwany = null;
        try {
          var czysta = new silnikSQL.Database();
          czysta.run(schemat);
          var w = czysta.exec(wzorzec);
          oczekiwany = w.length ? w[w.length - 1] : null;
          czysta.close();
        } catch (e) { oczekiwany = null; }
        if (oczekiwany) {
          html += taSama(ostatni, oczekiwany)
            ? '<p class="sql-trener__ok">Wynik zgadza się z oczekiwanym. ✔</p>'
            : '<p class="sql-trener__blad">Wynik różni się od oczekiwanego — ' +
              "sprawdź warunek, wybrane kolumny i sposób połączenia tabel.</p>";
        }
      }
      pisz(html);
    }

    function pokazStrukture() {
      if (!mariadb) {
        var s = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table';");
        pisz(s.length ? tabela(s[0]) : "Brak tabel.");
        return;
      }
      var lista = MDB.tabele(db);
      if (!lista.length) { pisz('<p class="sql-trener__info">Baza jest pusta — nie ma jeszcze żadnej tabeli.</p>'); return; }
      pisz(lista.map(function (t) {
        var o = MDB.opisz(db, t);
        var fk = o.md.ogr.filter(function (x) { return x.rodzaj === "fk"; }).map(function (x) {
          return "<li>klucz obcy <code>" + esc(x.nazwa) + "</code>: <code>" + esc(x.kolumny.join(", ")) + "</code> → <code>" +
            esc(x.cel) + "(" + esc((x.celKol.length ? x.celKol : ["klucz główny"]).join(", ")) + ")</code>" +
            (x.usun !== "RESTRICT" ? " · ON DELETE " + esc(x.usun) : "") +
            (x.zmien !== "RESTRICT" ? " · ON UPDATE " + esc(x.zmien) : "") + "</li>";
        }).join("");
        return "<h4>" + esc(t) + "</h4>" + tabela(o.wynik) + (fk ? '<ul class="sql-trener__log">' + fk + "</ul>" : "");
      }).join("") + '<p class="sql-trener__info">Tak samo pokazuje strukturę polecenie <code>DESCRIBE nazwa_tabeli;</code></p>');
    }

    /* ── panel zadań ── */
    function zadanie(nr) {
      if (!zestaw) return null;
      for (var i = 0; i < zestaw.zadania.length; i++) if (String(zestaw.zadania[i].nr) === String(nr)) return zestaw.zadania[i];
      return null;
    }
    function odswiezPanel() {
      var z = zadanie(wybor.value);
      var ile = z && z.podpowiedzi ? z.podpowiedzi.length : 0, odkryte = podpowiedzi[wybor.value] || 0;
      var bp = host.querySelector('[data-akcja="podpowiedz"]');
      bp.hidden = !ile;
      bp.textContent = odkryte >= ile ? "Podpowiedzi (" + ile + "/" + ile + ")" : "Podpowiedź " + (odkryte + 1) + "/" + ile;
      host.querySelector('[data-akcja="wstaw"]').hidden = !(z && z.start);
      host.querySelector('[data-akcja="sprawdz"]').hidden = !(z && z.sprawdzenia && z.sprawdzenia.length);
    }
    function wybierz(nr) {
      if (!zadanie(nr) || wybor.value === String(nr)) return;
      wybor.value = String(nr);
      odswiezPanel();
      pokazZadanie();
    }
    function pokazZadanie() {
      var z = zadanie(wybor.value);
      if (z) {
        pisz('<p class="sql-trener__info">Zadanie ' + esc(z.nr) + ": <strong>" + esc(z.tytul) + "</strong>" +
          (z.sprawdzenia && z.sprawdzenia.length ? " · gdy skończysz, kliknij <strong>Sprawdź zadanie</strong>." : "") + "</p>" +
          (z.uwaga ? '<div class="sql-trener__rada">' + z.uwaga + "</div>" : ""));
      }
    }
    function pokazPodpowiedzi(nastepna) {
      var z = zadanie(wybor.value);
      if (!z || !z.podpowiedzi) return;
      var n = podpowiedzi[z.nr] || 0;
      if (nastepna && n < z.podpowiedzi.length) n++;
      podpowiedzi[z.nr] = n;
      odswiezPanel();
      pisz("<h4>Zadanie " + esc(z.nr) + " — podpowiedzi</h4>" + z.podpowiedzi.slice(0, n).map(function (p, i) {
        return '<div class="sql-trener__podp"><strong>Podpowiedź ' + (i + 1) + ".</strong> " + p + "</div>";
      }).join("") + (n < z.podpowiedzi.length ? '<p class="sql-trener__info">Następna podpowiedź jest bardziej szczegółowa. ' +
        "Najpierw spróbuj z tą.</p>" : ""));
    }
    function sprawdzZadanie() {
      var z = zadanie(wybor.value);
      if (!z) return;
      var cel = db, wstep = "";
      if (z.skrypt) {
        // Zadanie o skrypcie: uruchamiamy treść pola dwa razy na czystej, pustej
        // bazie — drugi przebieg sprawdza, czy DROP TABLE IF EXISTS stoją dobrze.
        if (!pole.value.trim()) { pisz('<p class="sql-trener__info">Wklej do pola cały skrypt i kliknij <strong>Sprawdź zadanie</strong> jeszcze raz.</p>'); return; }
        cel = new silnikSQL.Database();
        cel.run("PRAGMA foreign_keys=ON");
        for (var przebieg = 1; przebieg <= 2; przebieg++) {
          var rs = MDB.wykonaj(cel, pole.value, { fk: true });
          cel.run("PRAGMA foreign_keys=ON");
          if (rs.blad) {
            cel.close();
            pisz("<h4>Zadanie " + esc(z.nr) + " — skrypt z pola na czystej bazie</h4>" +
              '<p class="sql-trener__blad">✘ ' + (przebieg === 1 ? "Pierwsze" : "Drugie") + " uruchomienie, polecenie nr " +
              rs.blad.nr + ": " + esc(rs.blad.kod) + " – " + esc(rs.blad.tekst) + "</p>" +
              (rs.blad.rada ? '<div class="sql-trener__rada">' + rs.blad.rada + "</div>" : "") +
              "<pre>" + esc(rs.blad.polecenie.slice(0, 400)) + "</pre>" +
              (przebieg === 2 ? '<p class="sql-trener__info">Za pierwszym razem skrypt przeszedł, za drugim nie — ' +
                "na początku skryptu brakuje <code>DROP TABLE IF EXISTS</code> albo tabele są usuwane w złej kolejności.</p>" : ""));
            return;
          }
        }
        wstep = '<p class="sql-trener__ok">✔ Skrypt z pola wykonał się dwa razy pod rząd na czystej bazie.</p>';
      }
      var wyniki = z.sprawdzenia.map(function (s) {
        var r;
        try { r = MDB.sprawdz(cel, silnikSQL, s); } catch (e) { r = { ok: false, rada: esc(e.message || e) }; }
        return { s: s, r: r };
      });
      if (cel !== db) cel.close();
      ustawFk();
      var dobre = wyniki.filter(function (w) { return w.r.ok; }).length;
      pisz("<h4>Zadanie " + esc(z.nr) + (z.skrypt ? " — skrypt z pola na czystej bazie" : " — sprawdzenie bazy") + "</h4>" + wstep +
        '<ul class="sql-trener__log">' + wyniki.map(function (w) {
          return "<li class=\"" + (w.r.ok ? "sql-trener__ok\">✔ " : "sql-trener__blad\">✘ ") + w.s.opis +
            (!w.r.ok && (w.s.rada || w.r.rada) ? '<br><span class="sql-trener__info">' + (w.s.rada || "") + " " + (w.r.rada || "") + "</span>" : "") + "</li>";
        }).join("") + "</ul>" +
        (dobre === wyniki.length
          ? '<p class="sql-trener__ok">Zgadza się ' + dobre + " z " + wyniki.length + ' — wszystko. Wpisz ten wynik i swój kod do karty pracy.</p>'
          : '<p class="sql-trener__info">Zgadza się ' + dobre + " z " + wyniki.length + ". Popraw bazę i sprawdź jeszcze raz" +
            (z.podpowiedzi ? " — albo weź podpowiedź." : ".") + "</p>") +
        (z.dopisek ? '<p class="sql-trener__info">' + z.dopisek + "</p>" : ""));
    }

    if (host.dataset.zadania && KATALOG_ZADAN) {
      zaladujZadania(host.dataset.zadania).then(function (dane) {
        zestaw = dane;
        wybor.innerHTML = dane.zadania.map(function (z) {
          return '<option value="' + esc(z.nr) + '">' + esc(z.nr) + ". " + esc(z.tytul) + "</option>";
        }).join("");
        zadaniaEl.hidden = false;
        if (dane.projekt) host.querySelector('[data-akcja="projekt"]').hidden = false;
        odswiezPanel();
        wybor.addEventListener("change", function () { odswiezPanel(); pokazZadanie(); });
        zKarta.push({ host: host, wybierz: function (nr) { wybierz(nr); } });
      }).catch(function () {
        zadaniaEl.hidden = false;
        zadaniaEl.textContent = "Nie udało się wczytać listy zadań — trener działa, ale bez sprawdzania.";
      });
    }

    zaladujSilnik().then(
      function (SQL) {
        silnikSQL = SQL;
        var odtworzona = odswiezBaze(SQL, true);
        pisz(odtworzona
          ? "Baza odtworzona z tej przeglądarki — tabele z poprzedniej pracy są na miejscu. Kliknij <strong>Struktura bazy</strong>, żeby je zobaczyć."
          : schemat ? "Baza gotowa. Wpisz zapytanie i kliknij <strong>Wykonaj</strong>."
          : "Baza jest pusta. Wpisz polecenie <code>CREATE TABLE</code> i kliknij <strong>Wykonaj</strong>.", "sql-trener__info");

        host.addEventListener("click", function (e) {
          var b = e.target.closest("button[data-akcja]");
          if (!b) return;
          var a = b.dataset.akcja;
          if (a === "wykonaj") wykonaj();
          if (a === "schemat") pokazStrukture();
          if (a === "projekt" && zestaw) pisz("<h4>Projekt bazy</h4><pre>" + esc(zestaw.projekt) + "</pre>");
          if (a === "sprawdz") sprawdzZadanie();
          if (a === "podpowiedz") pokazPodpowiedzi(true);
          if (a === "wstaw") {
            var z = zadanie(wybor.value);
            var wstaw = function () {
              pole.value = z.start; if (kluczPamieci) pamiecPisz(kluczPamieci + ":pole", pole.value); pole.focus();
            };
            if (pole.value.trim() && pole.value.trim() !== z.start.trim()) potwierdz(b, "Zastąpić treść pola? Kliknij jeszcze raz", wstaw);
            else wstaw();
          }
          if (a === "reset") {
            var zrob = function () {
              odswiezBaze(SQL, false);
              if (kluczPamieci) pamiecPisz(kluczPamieci, null);
              pisz(kluczPamieci ? "Baza wyczyszczona — nie ma w niej żadnej tabeli. Treść pola zostaje." :
                "Baza przywrócona do stanu wyjściowego.", "sql-trener__info");
            };
            if (kluczPamieci && MDB.tabele(db).length) potwierdz(b, "Usunąć wszystkie tabele? Kliknij jeszcze raz", zrob);
            else zrob();
          }
        });

        pole.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); wykonaj(); }
        });
      },
      function () {
        pisz("Nie udało się wczytać silnika SQL. Zapytania z tej strony wykonaj " +
             "w phpMyAdminie — działają tak samo.", "sql-trener__blad");
      }
    );
  }

  function start() {
    var hosty = document.querySelectorAll(".sql-trener:not([data-gotowe])");
    if (!hosty.length) return;
    wstawStyl();
    hosty.forEach(function (h) { h.dataset.gotowe = "1"; zbuduj(h); });
  }

  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(start); // Material z navigation.instant
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
})();
