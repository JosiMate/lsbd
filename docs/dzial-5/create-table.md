# CREATE TABLE — tworzenie tabel z projektu
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

Przez ostatnie działy projektowaliśmy bazy „na papierze” — tworzyliśmy encje i relacje w diagramach E/R. Teraz nadszedł czas, aby przenieść te projekty do rzeczywistego systemu SZBD. Służy do tego polecenie `CREATE TABLE`, które jest fundamentem budowania struktury bazy danych.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. napisać poprawne polecenie `CREATE TABLE` zgodnie ze składnią SQL
    2. przyporządkować odpowiednie typy danych do kolumn na podstawie projektu
    3. zastosować ograniczenia (constraints), takie jak `NOT NULL` i `PRIMARY KEY`
    4. zaplanować kolejność tworzenia tabel w bazie, aby uniknąć błędów relacji

## 1. Podstawowa składnia CREATE TABLE

Tworzenie tabeli polega na zdefiniowaniu jej nazwy oraz listy kolumn wraz z ich typami danych. 

**Ogólny wzór:**
```sql
CREATE TABLE nazwa_tabeli (
    kolumna1 typ_danych ograniczenia,
    kolumna2 typ_danych ograniczenia,
    ...
    PRIMARY KEY (kolumna_klucza)
);
```

**Przykład praktyczny:** Tworzymy tabelę `kategoria` dla sklepu z obuwiem.
```sql
CREATE TABLE kategoria (
    id_kategorii INT UNSIGNED AUTO_INCREMENT,
    nazwa VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_kategorii)
);
```

### Rozbiór polecenia na części:
*   `INT UNSIGNED AUTO_INCREMENT` $\rightarrow$ liczba całkowita, tylko dodatnia, która sama rośnie o 1 przy każdym nowym rekordzie.
*   `VARCHAR(50) NOT NULL` $\rightarrow$ tekst do 50 znaków, który musi zostać podany (nie może być pusty/NULL).
*   `PRIMARY KEY (id_kategorii)` $\rightarrow$ informacja dla bazy, że ta kolumna jest unikatowym identyfikatorem każdego wiersza.

## 2. Kolejność tworzenia tabel — zasada zależności

To najważniejszy punkt przy budowaniu bazy z projektu. W relacyjnych bazach danych tabele są od siebie zależne za pomocą kluczy obcych.

**Zasada jest prosta:** Najpierw tworzysz tabele, które nie mają kluczy obcych (tzw. tabele nadrzędne/rodzice), a dopiero potem te, które się do nich odwołują (tabele podrzędne/dzieci).

**Przykład:**
Mamy tabelę `kategoria` i tabelę `produkt`. Tabela `produkt` zawiera klucz obcy `id_kategorii`.
1. **BŁĄD:** Jeśli najpierw spróbujesz stworzyć tabelę `produkt`, baza zgłosi błąd, bo nie wie, czym jest `id_kategorii` z tabeli `kategoria` (której jeszcze nie ma).
2. **POPRAWNIE:** 
    *   Krok 1: `CREATE TABLE kategoria ...`
    *   Krok 2: `CREATE TABLE produkt ...`

## 3. Najczęstsze błędy przy CREATE TABLE

1.  **Przecinek na końcu:** W SQL oddzielamy kolumny przecinkami, ale **ostatnia kolumna przed nawiasem zamykającym nie może mieć przecinka**.
2.  **Błędny typ danych:** Próba przypisania tekstu do kolumny `INT`.
3.  **Brak PRIMARY KEY:** Każda tabela powinna mieć klucz główny, aby zapewnić spójność i szybkość działania.
4.  **Pomylenie nazw:** Użycie `id_kategorii` w definicji, a w zapytaniu `kategoria_id`.

## 4. Co z tego jest na egzaminie

W części praktycznej egzaminu **INF.03** tworzenie tabel jest zazwyczaj pierwszym etapem zadania.

**Wskazówki:**
*   Zawsze najpierw stwórz tabele słownikowe (te najprostsze, np. `Kategorie`, `Klienci`).
*   Zwróć uwagę na wymagania z arkusza dotyczące typów danych (np. jeśli proszą o „nazwisko do 50 znaków”, użyj `VARCHAR(50)`).
*   Nie zapomnij o `AUTO_INCREMENT` dla kluczy głównych – to standard w MariaDB.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Tworzenie tabeli klienta"
    Zaprojektuj i napisz polecenie `CREATE TABLE` dla encji `klient`. Tabela powinna zawierać:
    - `id_klienta` (klucz główny, automatyczny wzrost)
    - `imie` (tekst, obowiązkowe)
    - `nazwisko` (tekst, obowiązkowe)
    - `email` (tekst, opcjonalne)

??? success "Rozwiązanie 1"
    ```sql
    CREATE TABLE klient (
        id_klienta INT UNSIGNED AUTO_INCREMENT,
        imie VARCHAR(50) NOT NULL,
        nazwisko VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        PRIMARY KEY (id_klienta)
    );
    ```

!!! question "Ćwiczenie 2. Kolejność tworzenia"
    Mamy trzy tabele: `zamowienie`, `klient` oraz `pozycja_zamowienia`.
    - `zamowienie` odwołuje się do `klient`.
    - `pozycja_zamowienia` odwołuje się do `zamowienie` oraz `produkt`.
    - `produkt` nie odwołuje się do nikogo.
    
    Wypisz poprawną kolejność tworzenia tych tabel, aby baza nie zgłosiła błędów.

??? success "Rozwiązanie 2"
    1. `klient` (nie ma kluczy obcych)
    2. `produkt` (nie ma kluczy obcych)
    3. `zamowienie` (zależy od klienta)
    4. `pozycja_zamowienia` (zależy od zamówienia i produktu)

!!! question "Ćwiczenie 3. Wykrywanie błędów"
    Znajdź błędy w poniższym zapytaniu:
    ```sql
    CREATE TABLE miasto (
        id_miasta INT PRIMARY KEY,
        nazwa VARCHAR(50) NOT NULL,
        kod_pocztowy CHAR(6),
    );
    ```

??? success "Rozwiązanie 3"
    Błąd: Nadmiarowy przecinek po ostatniej kolumnie (`kod_pocztowy CHAR(6),`). W SQL ostatnia kolumna w liście nie może mieć przecinka przed zamknięciem nawiasu.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Dlaczego w bazie danych tworzymy najpierw tabele nadrzędne (rodziców), a dopiero potem podrzędne?",
    "opcje": [
      "Bo tabele podrzędne są zawsze większe",
      "Aby uniknąć błędów przy definiowaniu kluczy obcych, które muszą odwoływać się do istniejących tabel",
      "Bo tak wymaga standard SQL",
      "Aby przyspieszyć działanie bazy danych"
    ],
    "poprawna": 1,
    "wyjasnienie": "Klucz obcy nie może wskazywać na tabelę, która jeszcze nie została utworzona."
  },
  {
    "pytanie": "Co robi właściwość AUTO_INCREMENT w definicji kolumny?",
    "opcje": [
      "Automatycznie zwiększa wartość liczbową przy dodawaniu nowego rekordu",
      "Sprawia, że kolumna staje się kluczem głównym",
      "Zabrania wpisywania liczb ujemnych",
      "Automatycznie aktualizuje datę modyfikacji wiersza"
    ],
    "poprawna": 0,
    "wyjasnienie": "AUTO_INCREMENT pozwala bazie danych samodzielnie nadawać unikatowe identyfikatory (1, 2, 3...), co jest idealne dla kluczy głównych."
  },
  {
    "pytanie": "Który z poniższych zapisów jest poprawnym sposobem zdefiniowania kolumny, która MUSI posiadać wartość?",
    "opcje": [
      "nazwa VARCHAR(50) MUST",
      "nazwa VARCHAR(50) REQUIRED",
      "nazwa VARCHAR(50) NOT NULL",
      "nazwa VARCHAR(50) UNIQUE"
    ],
    "poprawna": 2,
    "wyjasnienie": "NOT NULL to ograniczenie, które zabrania zapisania pustej wartości (NULL) w danej kolumnie."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="create-table"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
