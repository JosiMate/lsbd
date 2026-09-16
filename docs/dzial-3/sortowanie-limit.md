# ORDER BY i LIMIT
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział III**

Samo wyfiltrowanie danych to pierwszy krok. Aby jednak wynik był użyteczny – np. aby najdroższe buty były na górze listy lub aby wyświetlić tylko pięć pierwszych rekordów – musimy kontrolować sposób prezentacji wyników. Służą do tego klauzule `ORDER BY` oraz `LIMIT`.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. sortować wyniki zapytania w kolejności rosnącej i malejącej
    2. sortować dane według wielu kolumn jednocześnie
    3. ograniczać liczbę zwracanych wierszy za pomocą `LIMIT`
    4. tworzyć proste zestawienia typu „TOP N” (np. 3 najtańsze produkty)

## 1. Sortowanie danych: ORDER BY

Domyślnie baza danych zwraca wiersze w kolejności, w jakiej zostały zapisane na dysku (co często wygląda na chaos). Aby nad tym zapanować, używamy `ORDER BY`.

Podstawowa składnia:
```sql
SELECT kolumny FROM tabela ORDER BY nazwa_kolumny [ASC | DESC];
```

### Kierunek sortowania:
*   **ASC** (Ascending) — kolejność rosnąca. Jest to ustawienie domyślne (jeśli nic nie dopiszemy, baza sortuje rosnąco).
    *   Liczby: od najmniejszej do największej (1, 2, 3...).
    *   Teksty: alfabetycznie od A do Z.
    *   Daty: od najstarszej do najnowszej.
*   **DESC** (Descending) — kolejność malejąca.
    *   Liczby: od największej do najmniejszej (100, 99, 98...).
    *   Teksty: odwrotnie alfabetycznie od Z do A.
    *   Daty: od najnowszej do najstarszej.

**Przykład:** Wyświetl produkty od najdroższego do najtańszego.
```sql
SELECT nazwa, cena FROM produkt ORDER BY cena DESC;
```

## 2. Sortowanie wielokolumnowe

Co jeśli mamy kilka produktów o tej samej cenie? Możemy wtedy dodać drugi poziom sortowania. Baza najpierw posortuje dane według pierwszej kolumny, a wiersze, które mają identyczną wartość, posortuje według drugiej.

**Przykład:** Wyświetl produkty posortowane najpierw według koloru (alfabetycznie), a w obrębie każdego koloru – od najtańszego do najdroższego.

```sql
SELECT kolor, nazwa, cena FROM produkt ORDER BY kolor ASC, cena ASC;
```

## 3. Ograniczanie wyników: LIMIT

W wielkich bazach danych nie chcemy wyświetlać tysięcy rekordów na jednej stronie. Klauzula `LIMIT` pozwala określić maksymalną liczbę wierszy, które ma zwrócić baza.

**Sytuacja:** Chcemy zobaczyć tylko 5 pierwszych produktów z bazy.
```sql
SELECT nazwa FROM produkt LIMIT 5;
```

### Połączenie ORDER BY i LIMIT (Zestawienia TOP N)

To najpotężniejsza kombinacja w podstawowym SQL. Pozwala ona na tworzenie rankingów.

**Przykład:** Wyświetl 3 najtańsze buty w sklepie.
```sql
SELECT nazwa, cena FROM produkt ORDER BY cena ASC LIMIT 3;
```
*Jak to działa?* Baza najpierw sortuje wszystkie produkty od najtańszego (`ORDER BY cena ASC`), a następnie „odcina” z góry tylko pierwsze trzy rekordy (`LIMIT 3`).

## 4. Co z tego jest na egzaminie

W zadaniach praktycznych INF.03 często pojawiają się polecenia typu: „wyświetl trzy najdroższe produkty” lub „wyświetl produkty w kolejności alfabetycznej”.

**Typowe błędy:**
*   **Pomylenie ASC z DESC:** Jeśli polecenie brzmi „od najdroższego”, musisz użyć `DESC`.
*   **Kolejność klauzul:** Pamiętaj o poprawnej kolejności w zapytaniu:
    1. `SELECT` $\rightarrow$ 2. `FROM` $\rightarrow$ 3. `WHERE` $\rightarrow$ 4. `ORDER BY` $\rightarrow$ 5. `LIMIT`.
    Wpisanie `LIMIT` przed `WHERE` spowoduje błąd składni.

## 5. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Poniżej działa prawdziwy silnik SQL z bazą `obuwie` — tą samą, którą
importujesz w ćwiczeniach z działu I. Wpisz zapytanie i naciśnij
**Wykonaj** albo ++ctrl+enter++. Przycisk **Przywróć bazę** cofa wszystko
do stanu wyjściowego, więc nie da się tu niczego zepsuć.

<div class="sql-trener" data-baza="obuwie" data-start="SELECT nazwa, cena FROM produkt ORDER BY cena DESC LIMIT 3;"></div>

!!! info "To SQLite, nie MariaDB"

    Trener liczy w przeglądarce, na silniku SQLite. Składnia `SELECT`,
    `WHERE`, `ORDER BY`, `LIMIT`, `JOIN`, `GROUP BY` i `HAVING` jest ta sama
    co w phpMyAdminie, ale poleceń administracyjnych (`CREATE USER`,
    `GRANT`) ten silnik nie zna — te ćwiczysz w phpMyAdminie.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Alfabetyczna lista"
    Wypisz nazwy wszystkich produktów w kolejności alfabetycznej.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa FROM produkt ORDER BY nazwa ASC;"></div>

??? success "Rozwiązanie 1"
    ```sql
    SELECT nazwa FROM produkt ORDER BY nazwa ASC;
    ```

!!! question "Ćwiczenie 2. Najtańsza piątka"
    Wyświetl nazwy i ceny 5 najtańszych produktów w sklepie.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa, cena FROM produkt ORDER BY cena ASC LIMIT 5;"></div>

??? success "Rozwiązanie 2"
    ```sql
    SELECT nazwa, cena FROM produkt ORDER BY cena ASC LIMIT 5;
    ```

!!! question "Ćwiczenie 3. Najdroższy but każdego koloru"
    Wyświetl nazwę, kolor i cenę produktów, sortując je najpierw według koloru
    (rosnąco), a potem według ceny (malejąco).

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa, kolor, cena FROM produkt ORDER BY kolor ASC, cena DESC;"></div>

??? success "Rozwiązanie 3"
    ```sql
    SELECT nazwa, kolor, cena FROM produkt ORDER BY kolor ASC, cena DESC;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Które słowo kluczowe służy do sortowania danych w kolejności malejącej?",
    "opcje": [
      "ASC",
      "DESC",
      "DOWN",
      "MINUS"
    ],
    "poprawna": 1,
    "wyjasnienie": "DESC (Descending) oznacza kolejność malejącą – od największej wartości do najmniejszej."
  },
  {
    "pytanie": "W jakiej kolejności powinny występować klauzule w poprawnym zapytaniu SQL?",
    "opcje": [
      "SELECT $\rightarrow$ ORDER BY $\rightarrow$ FROM $\rightarrow$ LIMIT",
      "SELECT $\rightarrow$ FROM $\rightarrow$ LIMIT $\rightarrow$ ORDER BY",
      "SELECT $\rightarrow$ FROM $\rightarrow$ WHERE $\rightarrow$ ORDER BY $\rightarrow$ LIMIT",
      "LIMIT $\rightarrow$ SELECT $\rightarrow$ FROM $\rightarrow$ WHERE"
    ],
    "poprawna": 2,
    "wyjasnienie": "Standardowa kolejność to: wybór kolumn (SELECT), tabela (FROM), filtrowanie (WHERE), sortowanie (ORDER BY) i na końcu ograniczenie liczby wierszy (LIMIT)."
  },
  {
    "pytanie": "Co zrobi zapytanie: SELECT nazwa FROM produkt ORDER BY nazwa LIMIT 1 ?",
    "opcje": [
      "Wyświetli pierwszy produkt, jaki został dodany do bazy",
      "Wyświetli produkt z najkrótszą nazwą",
      "Wyświetli produkt, który jest pierwszy w kolejności alfabetycznej",
      "Wyświetli losowy produkt z bazy"
    ],
    "poprawna": 2,
    "wyjasnienie": "Domyślne sortowanie (bez dopisku ASC/DESC) jest rosnące. Dla tekstu oznacza to kolejność alfabetyczną. LIMIT 1 ogranicza wynik do jednego, pierwszego wiersza."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="sortowanie-limit"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
