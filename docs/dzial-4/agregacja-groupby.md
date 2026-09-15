# Funkcje agregujące i GROUP BY
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

Do tej pory nasze zapytania zwracały pojedyncze wiersze danych. Jednak w raportach biznesowych rzadko interesują nas pojedyncze ceny butów – częściej chcemy wiedzieć: „ile mamy produktów w sumie?”, „jaka jest średnia cena w kategorii sportowej?” lub „który produkt jest najdroższy?”. Do takich obliczeń służą **funkcje agregujące** oraz klauzula **`GROUP BY`**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. stosować podstawowe funkcje agregujące: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
    2. grupować dane za pomocą `GROUP BY`, aby tworzyć zestawienia podsumowujące
    3. rozumieć zależność między kolumnami w SELECT a klauzulą GROUP BY
    4. tworzyć proste raporty statystyczne z bazy danych

## 1. Funkcje agregujące — obliczenia na kolumnach

Funkcja agregująca to taka, która przyjmuje wiele wartości z kolumny i zwraca **tylko jedną, zbiorczą wartość**.

Najważniejsze funkcje:
*   **`COUNT(*)`** — zlicza wszystkie wiersze w tabeli (lub grupie).
*   **`SUM(kolumna)`** — sumuje wartości liczbowe.
*   **`AVG(kolumna)`** — oblicza średnią arytmetyczną.
*   **`MIN(kolumna)`** — znajduje najmniejszą wartość.
*   **`MAX(kolumna)`** — znajduje największą wartość.

**Przykłady:**
```sql
SELECT COUNT(*) FROM produkt;               -- Ile mamy wszystkich butów?
SELECT MAX(cena) FROM produkt;              -- Jaka jest najwyższa cena?
SELECT AVG(cena) FROM produkt;              -- Jaka jest średnia cena butów?
```

## 2. Grupowanie danych: GROUP BY

Funkcje agregujące są super, gdy chcemy jednego wyniku dla całej tabeli. Ale co, jeśli chcemy średniej ceny **dla każdej kategorii osobno**?

Wtedy używamy `GROUP BY`. Ta klauzula mówi bazie: „podziel wiersze na grupy na podstawie wartości w wybranej kolumnie, a potem dla każdej grupy wykonaj obliczenie”.

**Przykład:** Chcemy wiedzieć, ile produktów jest w każdej kategorii.
```sql
SELECT id_kategorii, COUNT(*) 
FROM produkt 
GROUP BY id_kategorii;
```
*Jak to działa?*
1. Baza patrzy na kolumnę `id_kategorii`.
2. Tworzy osobny „koszyk” dla każdego unikatowego ID kategorii.
3. Do każdego koszyka wrzuca odpowiednie buty.
4. Na koniec dla każdego koszyka liczy `COUNT(*)`.

## 3. Złota zasada GROUP BY (Kwestia poprawności zapytania)

To miejsce, w którym najwięcej osób popełnia błędy. W zapytaniu z `GROUP BY` obowiązuje żelazna zasada:

**Każda kolumna wymieniona w SELECT, która NIE jest częścią funkcji agregującej, MUSI znaleźć się w klauzuli GROUP BY.**

**BŁĘDNE zapytanie:**
```sql
SELECT nazwa, COUNT(*) 
FROM produkt 
GROUP BY id_kategorii;
```
*Dlaczego to błąd?* Baza grupuje po kategoriach (np. mamy 3 grupy). Ale w każdej grupie jest wiele różnych nazw produktów. Baza nie wie, którą jedną nazwę wyświetlić obok sumy dla całej grupy.

**POPRAWNE zapytanie:**
```sql
SELECT id_kategorii, COUNT(*) 
FROM produkt 
GROUP BY id_kategorii;
```
LUB (jeśli chcemy nazwy kategorii, musimy dołączyć tabelę `kategoria` i grupować po niej):
```sql
SELECT k.nazwa, COUNT(*) 
FROM kategoria k 
JOIN produkt p ON k.id_kategorii = p.id_kategorii
GROUP BY k.nazwa;
```

## 4. Co z tego jest na egzaminie

Zapytania agregujące często pojawiają się w zadaniach z „podsumowaniem danych”.

**Typowe polecenia:**
*   „Oblicz sumę cen produktów w każdej kategorii” $\rightarrow$ `SUM(cena)` + `GROUP BY`.
*   „Wyświetl liczbę produktów dla każdej kategorii” $\rightarrow$ `COUNT(*)` + `GROUP BY`.

**Pułapka:** Pamiętaj o kolejności klauzul:
`SELECT` $\rightarrow$ `FROM` $\rightarrow$ `JOIN` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `ORDER BY`.
Wstawienie `WHERE` po `GROUP BY` spowoduje błąd składni.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Proste statystyki"
    Napisz trzy oddzielne zapytania do tabeli `produkt`:
    1. Ile jest wszystkich produktów w bazie?
    2. Jaka jest najniższa cena buta?
    3. Jaka jest średnia cena wszystkich produktów?

??? success "Rozwiązanie 1"
    1. `SELECT COUNT(*) FROM produkt;`
    2. `SELECT MIN(cena) FROM produkt;`
    3. `SELECT AVG(cena) FROM produkt;`

!!! question "Ćwiczenie 2. Liczenie produktów w kategoriach"
    Napisz zapytanie, które wyświetli identyfikator kategorii oraz liczbę produktów przypisanych do tej kategorii.

??? success "Rozwiązanie 2"
    ```sql
    SELECT id_kategorii, COUNT(*) 
    FROM produkt 
    GROUP BY id_//kategorii;
    ```

!!! question "Ćwiczenie 3. Sumy i nazwy"
    Połącz tabele `kategoria` i `produkt`. Wyświetl nazwę każdej kategorii oraz sumę cen wszystkich produktów w tej kategorii.

??? success "Rozwiązanie 3"
    ```sql
    SELECT k.nazwa, SUM(p.cena) 
    FROM kategoria k 
    JOIN produkt p ON k.id_kategorii = p.id_kategorii
    GROUP BY k.nazwa;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Która z funkcji agregujących najlepiej nadaje się do obliczenia całkowitej wartości towarów w magazynie?",
    "opcje": [
      "COUNT()",
      "AVG()",
      "SUM()",
      "MAX()"
    ],
    "poprawna": 2,
    "wyjasnienie": "Funkcja SUM() dodaje do siebie wszystkie wartości w danej kolumnie, co pozwala obliczyć sumę całkowitą."
  },
  {
    "pytanie": "Co się stanie, jeśli w zapytaniu z GROUP BY zapomnisz dodać jednej z kolumn z SELECT do klauzuli GROUP BY?",
    "opcje": [
      "Baza danych wybierze losową wartość z grupy",
      "Zapytanie zwróci błąd składni",
      "Baza danych automatycznie pogrupuje dane po tej kolumnie",
      "Wynik zapytania będzie pusty"
    ],
    "poprawna": 1,
    "wyjasnienie": "To fundamentalna zasada SQL: każda kolumna w SELECT, która nie jest zagregowana, musi znaleźć się w GROUP BY."
  },
  {
    "pytanie": "Jaka jest poprawna kolejność klauzul w zapytaniu z grupowaniem?",
    "opcje": [
      "SELECT $\rightarrow$ GROUP BY $\rightarrow$ FROM",
      "SELECT $\rightarrow$ FROM $\rightarrow$ GROUP BY",
      "GROUP BY $\rightarrow$ SELECT $\rightarrow$ FROM",
      "FROM $\rightarrow$ SELECT $\rightarrow$ GROUP BY"
    ],
    "poprawna": 1,
    "wyjasnienie": "Standardowa kolejność to: wybór pól (SELECT), określenie tabeli (FROM), a następnie grupowanie (GROUP BY)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="agregacja-groupby"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
