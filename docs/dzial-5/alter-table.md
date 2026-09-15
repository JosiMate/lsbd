# ALTER TABLE — rozbudowa istniejącej bazy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

W świecie rzeczywistym wymagania klienta zmieniają się często. Może się okazać, że po miesiącu działania sklepu musimy dodać do tabeli `klient` pole na numer telefonu, albo zmienić długość nazwy kategorii. Nie musimy wtedy usuwać całej tabeli i tworzyć jej od nowa (co oznaczałoby utratę wszystkich danych!). Służy do tego polecenie `ALTER TABLE`.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. dodawać nowe kolumny do istniejących tabel
    2. zmieniać typy danych i ograniczenia istniejących kolumn
    3. usuwać niepotrzebne kolumny z bazy danych
    4. bezpiecznie modyfikować strukturę tabel bez utraty danych

## 1. Dodawanie nowej kolumny (ADD)

Gdy musimy rozszerzyć tabelę o nowy atrybut, używamy słowa kluczowego `ADD`.

**Ogólny wzór:**
```sql
ALTER TABLE nazwa_tabeli ADD nazwa_kolumny typ_danych [ograniczenia];
```

**Przykład praktyczny:** Do tabeli `klient` chcemy dodać pole `telefon`.
```sql
ALTER TABLE klient ADD telefon VARCHAR(20);
```
Po wykonaniu tego polecenia, każdy istniejący klient w bazie otrzyma wartość `NULL` w nowej kolumnie `telefon`.

## 2. Modyfikacja istniejącej kolumny (MODIFY / CHANGE)

Czasami musimy zmienić typ danych (np. z `VARCHAR(50)` na `VARCHAR(100)`) lub dodać ograniczenie `NOT NULL`. W MariaDB używamy do tego `MODIFY`.

**Przykład:** Zwiększamy limit znaków dla nazwy kategorii.
```sql
ALTER TABLE kategoria MODIFY nazwa VARCHAR(100) NOT NULL;
```

Jeśli chcemy zmienić nie tylko typ, ale i **nazwę** kolumny, używamy `CHANGE`:
```sql
ALTER TABLE produkt CHANGE nazwa nazwa_produktu VARCHAR(100);
```
*Słowniczek:* `CHANGE stara_nazwa nowa_nazwa typ_danych;`

## 3. Usuwanie kolumny (DROP)

Jeśli jakaś informacja stała się zbędna, możemy ją usunąć za pomocą `DROP COLUMN`. 

!!! warning "Uwaga: Operacja nieodwracalna!"
    Usunięcie kolumny trwale kasuje wszystkie dane, które w niej były. Nie ma przycisku „cofnij”. Zawsze wykonaj kopię zapasową bazy przed użyciem `DROP`.

**Przykład:** Usuwamy kolumnę `wysokosc` z tabeli `produkt`.
```sql
ALTER TABLE produkt DROP COLUMN wysokosc;
```

## 4. Co z tego jest na egzaminie

W zadaniach praktycznych INF.03 `ALTER TABLE` pojawia się rzadziej niż `CREATE TABLE`, ale bywa elementem zadań z modyfikacji bazy.

**Najważniejsze zasady:**
*   **Dopasowanie typów:** Przy zmianie typu danych (np. z `VARCHAR` na `INT`), upewnij się, że dane w kolumnie można bezpiecznie przekonwertować. Jeśli w kolumnie są litery, a zmienisz ją na `INT`, baza może zgłosić błąd lub zastąpić dane zerami.
*   **Szybki start:** Pamiętaj o strukturze: `ALTER TABLE [nazwa] [akcja] [kolumna] [typ]`.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Rozbudowa profilu klienta"
    Do tabeli `klient` dodaj kolumnę `miasto` (tekst, do 50 znaków, opcjonalne) oraz kolumnę `pesel` (tekst, dokładnie 11 znaków, obowiązkowe).

??? success "Rozwiązanie 1"
    ```sql
    ALTER TABLE klient ADD miasto VARCHAR(50);
    ALTER TABLE klient ADD pesel CHAR(11) NOT NULL;
    ```

!!! question "Ćwiczenie 2. Korekta błędów"
    W tabeli `produkt` kolumna `nazwa` ma limit 100 znaków. Zmień go na 255 znaków i upewnij się, że pole to nie może być puste (`NOT NULL`).

??? success "Rozwiązanie 2"
    ```sql
    ALTER TABLE produkt MODIFY nazwa VARCHAR(255) NOT NULL;
    ```

!!! question "Ćwiczenie 3. Sprzątanie bazy"
    W tabeli `kategoria` znajduje się zbędna kolumna `opis_stary`. Usuń ją z bazy danych.

??? success "Rozwiązanie 3"
    ```sql
    ALTER TABLE kategoria DROP COLUMN opis_stary;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Które polecenie służy do dodania nowej kolumny do istniejącej tabeli?",
    "opcje": [
      "UPDATE TABLE ADD",
      "ALTER TABLE ADD",
      "CREATE COLUMN",
      "INSERT INTO COLUMN"
    ],
    "poprawna": 1,
    "wyjasnienie": "Do modyfikacji struktury tabeli (dodawanie, zmienianie, usuwanie kolumn) służy instrukcja ALTER TABLE."
  },
  {
    "pytanie": "Czym różni się MODIFY od CHANGE w MariaDB?",
    "opcje": [
      "MODIFY służy do usuwania, a CHANGE do dodawania",
      "MODIFY zmienia tylko typ/ograniczenia, a CHANGE może zmienić również nazwę kolumny",
      "Są to synonimy i działają identycznie",
      "CHANGE działa szybciej niż MODIFY"
    ],
    "poprawna": 1,
    "wyjasnienie": "MODIFY używamy, gdy chcemy zmienić np. typ danych. CHANGE wymaga podania starej i nowej nazwy kolumny."
  },
  {
    "pytanie": "Co się stanie z danymi w kolumnie po wykonaniu polecenia DROP COLUMN?",
    "opcje": [
      "Zostaną przeniesione do tabeli kopii zapasowej",
      "Zostaną zastąpione wartością NULL",
      "Zostaną trwale usunięte z bazy danych",
      "Zostaną ukryte, ale pozostaną w systemie"
    ],
    "poprawna": 2,
    "wyjasnienie": "DROP COLUMN całkowicie usuwa kolumnę wraz z całą zawartością ze wszystkich wierszy tabeli."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="alter-table"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
