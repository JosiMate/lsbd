# lsbd — lokalne systemy baz danych

Serwis z materiałami do przedmiotu **lokalne systemy baz danych**, technik
informatyk, kwalifikacja **INF.03** (jednostka INF.03.4 „Projektowanie
i administrowanie bazami danych"). PCEiKZ Szczucin.

Układ działów idzie za **częścią praktyczną egzaminu**, a nie za kolejnością
rozdziałów w podręczniku. Pracujemy na **MariaDB przez phpMyAdmina** — tym,
co stoi na stanowisku egzaminacyjnym.

## Uruchomienie lokalne

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
mkdocs serve
```

Strona podniesie się pod `http://127.0.0.1:8000`.

## Publikacja

Wdrożenie na GitHub Pages robi workflow GitHub Actions.

**Do wykonania raz, ręcznie:**

1. skopiuj `narzedzia/deploy.yml` do `.github/workflows/deploy.yml`
2. w repozytorium wejdź w **Settings → Pages** i ustaw *Source* na **GitHub Actions**

Od tego momentu każdy `push` do gałęzi `main` przebudowuje i publikuje stronę.
Budowanie idzie z `--strict`, więc każde ostrzeżenie MkDocs zatrzymuje wdrożenie.

## Co jest w środku

| Katalog | Zawartość |
| --- | --- |
| `docs/` | treść serwisu — jeden katalog na dział |
| `docs/assets/js/` | `karta.js` (karty pracy + eksport do .docx), `quiz.js`, `postep.js`, `sql-trener.js` |
| `docs/assets/sqljs/` | silnik SQLite w WebAssembly — **wgrany do repozytorium**, nie z CDN |
| `docs/assets/karty/` | definicje kart pracy w JSON, po jednej na temat |
| `docs/pliki/` | materiały do pobrania, m.in. baza ćwiczeniowa `obuwie.sql` |
| `narzedzia/` | `zadania6.py` + `zadania6.json`, `deploy.yml` do skopiowania |

## Nawigacja

Lewą kolumnę składa wtyczka **awesome-nav** z plików `.nav.yml`: jeden leży
w `docs/` (kolejność działów), po jednym w katalogu każdego działu (tytuł działu
i kolejność tematów). W `mkdocs.yml` nie ma już klucza `nav`.

```yaml
# docs/dzial-4/.nav.yml
title: "Dział IV. Relacje i agregacja"
append_unmatched: true
nav:
  - "Zapytania z relacją (JOIN)": select-relacje.md
```

`append_unmatched: true` znaczy, że **plik bez wpisu nie znika ze strony** —
ląduje na końcu działu z tytułem wziętym z nagłówka pierwszego poziomu. Wcześniej
temat pominięty w `nav` był na stronie niewidoczny, a `--strict` tego nie
wychwytywał. Odwrotna pomyłka jest głośna: wpis wskazujący nieistniejący plik
zatrzymuje budowanie i pokazuje, w którym `.nav.yml` siedzi.

## Trener SQL

Na stronach z zapytaniami działa **trener SQL** — uczeń wpisuje zapytanie
i od razu widzi wynik. Silnikiem jest SQLite skompilowany do WebAssembly,
uruchamiany w przeglądarce: nic nie wychodzi na serwer i nie trzeba mieć
postawionej bazy.

Wstawienie w treści strony:

```html
<div class="sql-trener" data-baza="obuwie"
     data-start="SELECT * FROM produkt;"
     data-wzorzec="SELECT nazwa, cena FROM produkt WHERE cena > 300;"></div>
```

| Atrybut | Znaczenie |
| --- | --- |
| `data-baza` | nazwa zestawu danych; zestawy są zdefiniowane w `sql-trener.js` w obiekcie `BAZY` |
| `data-start` | treść wpisana do pola na starcie (opcjonalnie) |
| `data-wzorzec` | poprawne zapytanie — trener porówna z nim wynik ucznia i powie, czy się zgadza |

**Silnik leży w repozytorium** (`docs/assets/sqljs/`, sql.js 1.14.2, licencja MIT),
więc trener działa też wtedy, gdy sieć szkolna blokuje serwisy CDN albo gdy
nie ma internetu. Adres cdnjs został w kodzie jako zapas.

!!! Uwaga merytoryczna
    Trener to **SQLite, nie MariaDB**. `SELECT`, `WHERE`, `ORDER BY`, `JOIN`,
    `GROUP BY` i `HAVING` zachowują się identycznie. Poleceń administracyjnych
    (`CREATE USER`, `GRANT`) SQLite nie ma — te ćwiczy się w phpMyAdminie.
    Na stronie jest o tym wyraźna ramka.

## Zadania na ocenę celującą

Zadania są **działowe, nie tematyczne**. Treść trzyma `narzedzia/zadania6.json`
(kluczem jest nagłówek działu ze spisu tematów), a blok na stronie głównej
generuje skrypt:

```bash
python narzedzia/zadania6.py docs/index.md
```

Skrypt jest idempotentny — nadpisuje blok między znacznikami
`<!-- zadania6:start -->` i `<!-- zadania6:end -->`.

## Dodanie nowego tematu

1. utwórz `docs/dzial-N/nazwa-tematu.md`
2. dopisz go do tabeli w odpowiednim dziale w `docs/index.md`
3. dopisz go do `.nav.yml` w katalogu działu — tam ustawiasz kolejność
   i nazwę w lewej kolumnie
4. jeżeli ma kartę pracy — dodaj `docs/assets/karty/nazwa-tematu.json`
   i wstaw `<div class="karta-pracy" data-karta="nazwa-tematu"></div>`
5. uruchom `python narzedzia/zadania6.py docs/index.md`, jeżeli doszły zadania na 6
6. sprawdź `mkdocs build --strict`

**Identyfikator karty w JSON-ie musi mieć przedrostek `lsbd-`** — wszystkie
serwisy stoją na jednej domenie `josimate.github.io` i dzielą `localStorage`,
więc bez przedrostka karty z różnych przedmiotów nadpisywałyby się nawzajem.
