# Zamówienia w sklepie — karta pracy działu IV

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

!!! abstract "O tym temacie"

    **2 godziny lekcyjne** · praca obowiązkowa · cały dział IV w jednym zadaniu

    Sklep z butami, który znasz z poprzednich tematów, zaczął sprzedawać.
    Do kategorii i produktów doszli **klienci**, ich **zamówienia** i **pozycje
    zamówień** — razem pięć tabel. Na tej bazie przejdziesz po kolei wszystko,
    czego uczył dział IV: złączenie, złączenie zewnętrzne, liczenie na grupach,
    `HAVING` i podzapytania. Zadania są ułożone od wymagań koniecznych do
    dopełniających — tak jak w arkuszu INF.03, każde kolejne trochę trudniejsze.

    Wyniki zapisujesz w **karcie pracy na dole strony**. To ona jest oceniana.

    ??? abstract "Plan dwóch lekcji"

        | Lekcja | Sekcje i ćwiczenia | Co ma być w karcie na koniec lekcji |
        | :---: | --- | --- |
        | 1 | sekcje 1–2, ćwiczenia 1–4: struktura bazy, złączenie z warunkiem, `LEFT JOIN` | zadania 1–4 |
        | 2 | sekcje 3–4, ćwiczenia 5–9: grupowanie, trzy tabele, `HAVING`, podzapytania, zadanie w phpMyAdminie | zadania 5–9 i samoocena |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz. Odpowiedzi rozwiń dopiero wtedy,
    gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Kiedy przy podzapytaniu piszesz `IN`, a nie znak `=`?
    2. **Sprzed kilku tygodni.** Dlaczego `WHERE kolor = NULL` nie zwraca żadnego wiersza, nawet gdy w tabeli są buty bez koloru?
    3. **Z dawniejszych tematów.** Czym różni się klucz główny od klucza obcego?

    ??? success "Odpowiedzi"

        1. Gdy podzapytanie może zwrócić **więcej niż jedną wartość**. Znak `=` przyjmuje dokładnie jedną.
        2. Porównanie czegokolwiek z `NULL` nie daje prawdy, tylko „nie wiadomo”. Brak wartości sprawdza się warunkiem `IS NULL`.
        3. Klucz główny jednoznacznie wskazuje wiersz **w swojej tabeli**. Klucz obcy to kolumna, która **wskazuje wiersz w innej tabeli** — po niej łączy się tabele.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tych dwóch lekcjach:

    1. Odczytam ze struktury bazy klucze główne i obce i powiem, które kolumny łączą dwie tabele.
    2. Połączę dwie tabele złączeniem z aliasami i dołożę do niego warunek i sortowanie.
    3. Użyję `LEFT JOIN`, gdy w wyniku mają być także wiersze bez pary, i znajdę je warunkiem `IS NULL`.
    4. Policzę na grupach (`COUNT`, `SUM`) z `GROUP BY` i odfiltruję grupy przez `HAVING`.
    5. Połączę trzy tabele i wyjaśnię, przez którą tabelę idzie połączenie.
    6. Rozwiążę to samo zadanie złączeniem zewnętrznym i podzapytaniem z `NOT IN`.

!!! note "Gdzie pracujesz"

    Ćwiczenia 1–8 robisz w trenerze SQL pod każdym poleceniem — przycisk
    **Wykonaj** pokaże wynik i powie, czy zgadza się z oczekiwanym. Ćwiczenie 9
    robisz tak jak na egzaminie: w **phpMyAdminie**, na bazie zaimportowanej
    z pliku [obuwie-zamowienia.sql](../pliki/obuwie-zamowienia.sql).
    Trener to SQLite, nie MariaDB — w tych zapytaniach składnia jest ta sama.

---

## 1. Baza sklepu — pięć tabel

Kategorie i produkty są **dokładnie te same** co w bazie `obuwie`. Nowe są trzy tabele:

=== "`klient`"

    | kolumna | opis |
    | --- | --- |
    | `id_klienta` | **klucz główny** |
    | `imie`, `nazwisko`, `miasto` | dane klienta |

=== "`zamowienie`"

    | kolumna | opis |
    | --- | --- |
    | `id_zamowienia` | **klucz główny** |
    | `id_klienta` | **klucz obcy** — kto złożył zamówienie |
    | `data_zamowienia` | data w formacie `RRRR-MM-DD` |

=== "`pozycja`"

    | kolumna | opis |
    | --- | --- |
    | `id_pozycji` | **klucz główny** |
    | `id_zamowienia` | **klucz obcy** — w którym zamówieniu |
    | `id_produktu` | **klucz obcy** — jaki but |
    | `ilosc` | ile par |

Jedno zamówienie może mieć **kilka pozycji**, a ten sam but może się znaleźć
w wielu zamówieniach. Tabela `pozycja` stoi **pomiędzy** zamówieniem
a produktem — żeby dowiedzieć się, jakie buty kupił klient, trzeba przejść
przez nią.

```text
klient ──< zamowienie ──< pozycja >── produkt >── kategoria
```

Kliknij w trenerze **Pokaż strukturę**, żeby zobaczyć wszystkie kolumny.

<div class="sql-trener" data-baza="zamowienia" data-start="SELECT * FROM zamowienie;"></div>

!!! question "Ćwiczenie 1. Czytanie struktury"

    Bez pisania zapytań: wpisz do karty, po których kolumnach łączy się
    `zamowienie` z `klient` oraz `pozycja` z `produkt`, i wskaż wszystkie
    klucze obce tabeli `pozycja`.

!!! example "Przewiduj"

    Sklep ma **6 klientów** i **7 zamówień**. Ile wierszy zwróci zapytanie
    bez warunku złączenia: `SELECT * FROM klient, zamowienie;`? Policz,
    zanim wykonasz je w trenerze wyżej.

    ??? success "Przewiduj, potem sprawdź wynik"

        **42 wiersze** — 6 × 7. Każdy klient zostaje sklejony z każdym
        zamówieniem, także z cudzym. To **iloczyn kartezjański**: wynik wygląda
        poważnie, a jest bezużyteczny. Warunek `ON` zostawia tylko te pary,
        w których `id_klienta` się zgadza — czyli 7.

## 2. Złączenie i złączenie zewnętrzne

!!! question "Ćwiczenie 2. Kto złożył zamówienie · wymagania podstawowe"

    Wyświetl **datę każdego zamówienia** oraz **imię i nazwisko** klienta,
    który je złożył. Użyj aliasów tabel: `z` dla zamówienia, `k` dla klienta.
    Wynik ma 7 wierszy.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT z.data_zamowienia, k.imie, k.nazwisko FROM zamowienie z JOIN klient k ON z.id_klienta = k.id_klienta;"></div>

!!! question "Ćwiczenie 3. Zamówienia z Tarnowa · wymagania rozszerzające"

    Wyświetl **numer zamówienia, datę i nazwisko klienta** dla zamówień
    złożonych przez klientów z **Tarnowa**, od najnowszego do najstarszego.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT z.id_zamowienia, z.data_zamowienia, k.nazwisko FROM zamowienie z JOIN klient k ON z.id_klienta = k.id_klienta WHERE k.miasto = 'Tarnów' ORDER BY z.data_zamowienia DESC;"></div>

!!! question "Ćwiczenie 4. Klienci, którzy nic nie kupili · wymagania rozszerzające"

    a) Wyświetl **imię i nazwisko każdego klienta** i **numery jego zamówień** —
    także klientów, którzy nie złożyli żadnego zamówienia.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT k.imie, k.nazwisko, z.id_zamowienia FROM klient k LEFT JOIN zamowienie z ON k.id_klienta = z.id_klienta;"></div>

    b) Zmień zapytanie tak, żeby zostali **tylko klienci bez zamówień**
    (imię i nazwisko).

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT k.imie, k.nazwisko FROM klient k LEFT JOIN zamowienie z ON k.id_klienta = z.id_klienta WHERE z.id_zamowienia IS NULL;"></div>

    ??? tip "Podpowiedź 1"

        W treści stoi „także klientów, którzy…”. Takie sformułowanie to sygnał
        złączenia zewnętrznego: klienci mają zostać w wyniku, nawet bez pary.

    ??? tip "Podpowiedź 2"

        Tabela, która ma zostać w całości, stoi **po lewej**:
        `FROM klient k LEFT JOIN zamowienie z ON …`.

    ??? tip "Podpowiedź 3"

        Klient bez zamówienia ma w kolumnach z tabeli `zamowienie` wartość
        `NULL`. Część b) to część a) z warunkiem
        `WHERE z.id_zamowienia IS NULL`.

## 3. Liczenie na grupach

!!! example "Przewiduj"

    Oba zapytania liczą zamówienia każdego klienta złączeniem **zewnętrznym**.
    Różnią się tylko tym, co stoi w `COUNT`. Co pokaże każde z nich przy
    Ewie Kowalczyk, która nie złożyła żadnego zamówienia?

    ```sql
    -- A
    SELECT k.imie, k.nazwisko, COUNT(*) AS liczba
    FROM klient k LEFT JOIN zamowienie z ON k.id_klienta = z.id_klienta
    GROUP BY k.id_klienta, k.imie, k.nazwisko;

    -- B
    SELECT k.imie, k.nazwisko, COUNT(z.id_zamowienia) AS liczba
    FROM klient k LEFT JOIN zamowienie z ON k.id_klienta = z.id_klienta
    GROUP BY k.id_klienta, k.imie, k.nazwisko;
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        **A pokaże 1, B pokaże 0.** `LEFT JOIN` zostawia dla Ewy jeden wiersz
        z `NULL` w kolumnach zamówienia. `COUNT(*)` liczy wiersze — więc 1.
        `COUNT(z.id_zamowienia)` liczy tylko wartości różne od `NULL` — więc 0,
        i to jest prawdziwa liczba zamówień.

!!! question "Ćwiczenie 5. Ile zamówień złożył każdy klient · wymagania rozszerzające"

    Wyświetl **imię, nazwisko i liczbę zamówień** każdego klienta, który
    złożył **co najmniej jedno** zamówienie. Kolumnę z liczbą nazwij `liczba`.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT k.imie, k.nazwisko, COUNT(z.id_zamowienia) AS liczba FROM klient k JOIN zamowienie z ON k.id_klienta = z.id_klienta GROUP BY k.id_klienta, k.imie, k.nazwisko;"></div>

!!! question "Ćwiczenie 6. Co sprzedano w październiku · wymagania dopełniające"

    Wyświetl **datę zamówienia, nazwę produktu i ilość** dla wszystkich
    pozycji zamówień złożonych **od 1 października 2026** (data `'2026-10-01'`
    i późniejsze).

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT z.data_zamowienia, p.nazwa, po.ilosc FROM zamowienie z JOIN pozycja po ON z.id_zamowienia = po.id_zamowienia JOIN produkt p ON po.id_produktu = p.id_produktu WHERE z.data_zamowienia &gt;= '2026-10-01';"></div>

    ??? tip "Podpowiedź 1"

        Data jest w tabeli `zamowienie`, nazwa produktu w `produkt`, a ilość
        w `pozycja`. Potrzebne są trzy tabele.

    ??? tip "Podpowiedź 2"

        `zamowienie` i `produkt` nie mają wspólnej kolumny — łączy je dopiero
        `pozycja`. Kolejność: `zamowienie` → `pozycja` → `produkt`, dwa razy
        `JOIN … ON …`.

    ??? tip "Podpowiedź 3"

        `FROM zamowienie z JOIN pozycja po ON z.id_zamowienia = po.id_zamowienia JOIN produkt p ON …`,
        a na końcu `WHERE z.data_zamowienia >= '2026-10-01'`. Wynik: 5 wierszy.

!!! question "Ćwiczenie 7. Duże zamówienia · wymagania dopełniające"

    a) Policz **wartość każdego zamówienia**: suma `cena × ilosc` wszystkich
    jego pozycji. Wyświetl numer zamówienia i wartość (kolumna `wartosc`).

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT po.id_zamowienia, SUM(p.cena * po.ilosc) AS wartosc FROM pozycja po JOIN produkt p ON po.id_produktu = p.id_produktu GROUP BY po.id_zamowienia;"></div>

    b) Zostaw tylko zamówienia o wartości **powyżej 550 zł**.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT po.id_zamowienia, SUM(p.cena * po.ilosc) AS wartosc FROM pozycja po JOIN produkt p ON po.id_produktu = p.id_produktu GROUP BY po.id_zamowienia HAVING SUM(p.cena * po.ilosc) &gt; 550;"></div>

    ??? tip "Podpowiedź 1"

        Cena jest w `produkt`, ilość w `pozycja` — złącz te dwie tabele
        i grupuj po numerze zamówienia z tabeli `pozycja`.

    ??? tip "Podpowiedź 2"

        Funkcja agregująca może liczyć wyrażenie, nie tylko kolumnę:
        `SUM(p.cena * po.ilosc)`.

    ??? tip "Podpowiedź 3"

        Warunek na **wynik sumy** nie może stać w `WHERE` — `WHERE` działa,
        zanim powstaną grupy. Idzie do `HAVING SUM(p.cena * po.ilosc) > 550`.

## 4. Podzapytania i zadanie egzaminacyjne

!!! question "Ćwiczenie 8. Czego nikt nie kupił · wymagania dopełniające"

    a) Podzapytaniem z `NOT IN` wyświetl **nazwy produktów**, których nie ma
    w żadnej pozycji zamówienia.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT nazwa FROM produkt WHERE id_produktu NOT IN (SELECT id_produktu FROM pozycja);"></div>

    b) Tak samo — `NOT IN` — wyświetl **klientów bez zamówień** (imię
    i nazwisko). Porównaj wynik z ćwiczeniem 4b.

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT imie, nazwisko FROM klient WHERE id_klienta NOT IN (SELECT id_klienta FROM zamowienie);"></div>

!!! question "Ćwiczenie 9. Tak jak na egzaminie · wymagania dopełniające"

    1. Utwórz w phpMyAdminie bazę `sklep` (kodowanie `utf8mb4_general_ci`)
       i zaimportuj do niej plik
       [obuwie-zamowienia.sql](../pliki/obuwie-zamowienia.sql).
    2. Napisz zapytanie, które dla każdej **nazwy kategorii** wyświetli,
       **ile par butów** z tej kategorii sprzedano (kolumna `sprzedane_pary`),
       od kategorii, która sprzedała się najlepiej.
    3. Treść zapytania zapisz w karcie, a do karty wklej **zrzut całego
       ekranu** z wynikiem w phpMyAdminie — tak jak na egzaminie.

    Możesz najpierw sprawdzić zapytanie w trenerze:

    <div class="sql-trener" data-baza="zamowienia" data-wzorzec="SELECT kat.nazwa, SUM(po.ilosc) AS sprzedane_pary FROM kategoria kat JOIN produkt p ON p.id_kategorii = kat.id_kategorii JOIN pozycja po ON po.id_produktu = p.id_produktu GROUP BY kat.nazwa ORDER BY sprzedane_pary DESC;"></div>

!!! warning "Najczęstsze błędy w tym temacie"

    | Objaw | Przyczyna | Co zrobić |
    | --- | --- | --- |
    | wierszy jest kilkadziesiąt zamiast kilku | brak warunku `ON` — iloczyn kartezjański | do każdego `JOIN` dopisz `ON` z parą kluczy |
    | `ambiguous column name: id_klienta` | kolumna o tej nazwie jest w dwóch tabelach | poprzedź ją aliasem: `k.id_klienta` |
    | klientów bez zamówień nie ma w wyniku | zwykły `JOIN` zamiast `LEFT JOIN` | tabela, która ma zostać w całości, idzie po lewej |
    | klient bez zamówień ma liczbę 1 | `COUNT(*)` przy `LEFT JOIN` | licz kolumnę z prawej tabeli: `COUNT(z.id_zamowienia)` |
    | błąd przy `WHERE SUM(…) > 550` | warunek na wynik grupy w `WHERE` | przenieś go do `HAVING` |
    | `zamowienie` i `produkt` nie chcą się połączyć | nie mają wspólnej kolumny | połącz je przez tabelę `pozycja` |

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Tabela pozycja ma klucze obce id_zamowienia i id_produktu. Co z tego wynika?",
    "opcje": [
      "Zamówienie i produkt łączy się bezpośrednio, bez tabeli pozycja",
      "Jedno zamówienie może mieć wiele produktów, a jeden produkt może być w wielu zamówieniach",
      "Każdy produkt może trafić najwyżej do jednego zamówienia",
      "Tabela pozycja nie potrzebuje własnego klucza głównego"
    ],
    "poprawna": 1,
    "wyjasnienie": "Pozycja stoi pomiędzy zamówieniem a produktem i rozbija związek wiele do wielu na dwa związki jeden do wielu."
  },
  {
    "pytanie": "Sklep ma 6 klientów i 7 zamówień. Ile wierszy zwróci SELECT * FROM klient, zamowienie; bez żadnego warunku?",
    "opcje": [
      "7",
      "13",
      "42",
      "6"
    ],
    "poprawna": 2,
    "wyjasnienie": "Bez warunku złączenia każdy wiersz jednej tabeli łączy się z każdym wierszem drugiej: 6 × 7 = 42."
  },
  {
    "pytanie": "Polecenie brzmi: „wyświetl wszystkich klientów i liczbę ich zamówień, także klientów bez zamówień”. Czego użyjesz?",
    "opcje": [
      "LEFT JOIN i COUNT(z.id_zamowienia)",
      "JOIN i COUNT(*)",
      "LEFT JOIN i COUNT(*)",
      "JOIN i HAVING COUNT(*) = 0"
    ],
    "poprawna": 0,
    "wyjasnienie": "LEFT JOIN zostawia klientów bez pary, a COUNT kolumny z prawej tabeli nie liczy NULL — klient bez zamówień dostaje 0, a nie 1."
  },
  {
    "pytanie": "Gdzie postawisz warunek „tylko zamówienia o wartości powyżej 550 zł”, gdy wartość liczysz jako SUM(cena * ilosc) z GROUP BY?",
    "opcje": [
      "W WHERE, przed GROUP BY",
      "W ON przy złączeniu",
      "W ORDER BY",
      "W HAVING, po GROUP BY"
    ],
    "poprawna": 3,
    "wyjasnienie": "Suma istnieje dopiero po utworzeniu grup. WHERE filtruje pojedyncze wiersze przed grupowaniem, HAVING — gotowe grupy."
  },
  {
    "pytanie": "Które zapytanie wyświetli produkty, których nikt nie zamówił?",
    "opcje": [
      "SELECT nazwa FROM produkt WHERE id_produktu IN (SELECT id_produktu FROM pozycja);",
      "SELECT nazwa FROM produkt WHERE id_produktu NOT IN (SELECT id_produktu FROM pozycja);",
      "SELECT nazwa FROM produkt JOIN pozycja ON produkt.id_produktu = pozycja.id_produktu;",
      "SELECT nazwa FROM produkt WHERE id_produktu != (SELECT id_produktu FROM pozycja);"
    ],
    "poprawna": 1,
    "wyjasnienie": "NOT IN odrzuca produkty z listy zwróconej przez podzapytanie. Znak != wymaga jednej wartości, a podzapytanie zwraca wiele."
  }
]
</script>
</div>

---

## Karta pracy

To jest **praca obowiązkowa**. Wypełnij kartę w trakcie obu lekcji, pobierz
gotowy dokument Worda i oddaj go przez **Zadania domowe w Dzienniku VULCAN**
(albo kliknij **Wyślij do nauczyciela**, jeśli przycisk jest pod kartą).
Termin: **najbliższa lekcja po drugiej lekcji tego tematu**; zasady terminu
dodatkowego opisuje strona [wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

Zadania w karcie idą od wymagań koniecznych do dopełniających. Ocena wynika
z tego, **dokąd doszedłeś samodzielnie** — na ocenę wyższą muszą być zrobione
także zadania niższych poziomów.

!!! warning "Pracujesz na dwóch lekcjach — zapisz postęp do pliku"

    Odpowiedzi zostają w **tej przeglądarce, na tym komputerze**. Na koniec
    pierwszej lekcji kliknij pod kartą **Zapisz postęp do pliku**, a na
    drugiej — **Wczytaj postęp z pliku**, jeśli siedzisz przy innym komputerze.

<div class="karta-pracy" data-karta="zamowienia-praktyka"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03). Zapytania i liczby wierszy sprawdzone skryptem `narzedzia/sprawdz_zapytania.py` — 19 października 2026.*
