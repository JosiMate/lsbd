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
 *   data-baza     — nazwa zestawu danych z obiektu BAZY (niżej)
 *   data-start    — treść wpisana do pola na starcie (opcjonalnie)
 *   data-wzorzec  — poprawne zapytanie; jeśli podane, trener porówna wynik
 *                   ucznia z wynikiem wzorca i powie, czy się zgadza
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
    ".sql-trener__wynik{padding:.6rem;font-size:.72rem;border-top:1px solid var(--md-default-fg-color--lightest);overflow-x:auto}",
    ".sql-trener__wynik table{width:auto;min-width:60%;font-size:.7rem}",
    ".sql-trener__wynik th{text-align:left;white-space:nowrap}",
    ".sql-trener__blad{color:#c62828;font-weight:600}",
    "[data-md-color-scheme=slate] .sql-trener__blad{color:#ef9a9a}",
    ".sql-trener__ok{color:#2e7d32;font-weight:600}",
    "[data-md-color-scheme=slate] .sql-trener__ok{color:#a5d6a7}",
    ".sql-trener__info{color:var(--md-default-fg-color--light)}",
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

  /* ─────────────────────────────────── widżet ─────────────────────────────── */
  function zbuduj(host) {
    var nazwaBazy = host.dataset.baza || "obuwie";
    var schemat = BAZY[nazwaBazy];
    if (!schemat) {
      host.textContent = "Trener SQL: nie znam zestawu danych „" + nazwaBazy + "”.";
      return;
    }

    host.innerHTML =
      '<div class="sql-trener__pasek"><strong>Trener SQL</strong>' +
      '<span class="sql-trener__info">baza <code>' + esc(nazwaBazy) +
      '</code> · silnik SQLite w przeglądarce · nic nie wychodzi na serwer</span></div>' +
      '<textarea spellcheck="false" aria-label="Miejsce na zapytanie SQL"></textarea>' +
      '<div class="sql-trener__przyciski">' +
      '<button type="button" class="glowny" data-akcja="wykonaj">Wykonaj (Ctrl+Enter)</button>' +
      '<button type="button" data-akcja="schemat">Pokaż strukturę</button>' +
      '<button type="button" data-akcja="reset">Przywróć bazę</button>' +
      "</div>" +
      '<div class="sql-trener__wynik sql-trener__info">Ładuję silnik SQL…</div>';

    var pole = host.querySelector("textarea");
    var wynikEl = host.querySelector(".sql-trener__wynik");
    pole.value = host.dataset.start || "";

    var db = null;
    var silnikSQL = null;

    function odswiezBaze(SQL) {
      if (db) db.close();
      db = new SQL.Database();
      db.run(schemat);
    }

    function pisz(html, klasa) {
      wynikEl.className = "sql-trener__wynik" + (klasa ? " " + klasa : "");
      wynikEl.innerHTML = html;
    }

    function wykonaj() {
      var zapytanie = pole.value.trim();
      if (!zapytanie) { pisz("Wpisz zapytanie i kliknij <strong>Wykonaj</strong>.", "sql-trener__info"); return; }
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

    zaladujSilnik().then(
      function (SQL) {
        silnikSQL = SQL;
        odswiezBaze(SQL);
        pisz("Baza gotowa. Wpisz zapytanie i kliknij <strong>Wykonaj</strong>.", "sql-trener__info");

        host.addEventListener("click", function (e) {
          var b = e.target.closest("button[data-akcja]");
          if (!b) return;
          if (b.dataset.akcja === "wykonaj") wykonaj();
          if (b.dataset.akcja === "reset") {
            odswiezBaze(SQL);
            pisz("Baza przywrócona do stanu wyjściowego.", "sql-trener__info");
          }
          if (b.dataset.akcja === "schemat") {
            var s = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table';");
            pisz(s.length ? tabela(s[0]) : "Brak tabel.");
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
