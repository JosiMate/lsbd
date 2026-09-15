# WHERE — warunki, operatory, LIKE, BETWEEN, IN
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział III**

Samo pobieranie danych to za mało. W prawdziwym systemie nigdy nie chcemy zobaczyć wszystkich produktów naraz, lecz np. tylko te, które są tańsze niż 100 zł, albo tylko te, które należą do kategorii „Buty sportowe”. Do tego służy klauzula `WHERE`, która działa jak filtr: przepuszcza tylko te wiersze, które spełniają określony warunek.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. stosować klauzulę `WHERE` do filtrowania wyników zapytania
    2. korzystać z operatorów porównania (`=`, `<>`, `>`, `<`, `>=`, `<=`)
    3. łączyć wiele warunków za pomocą operatorów logicznych `AND`, `OR` i `NOT`
    4. wyszukiwać teksty za pomocą operatora `LIKE` i znaków wieloznacznych (`%`, `_`)
    5. używać operatorów zakresu `BETWEEN` oraz listy wartości `IN`

## 1. Podstawy filtrowania: klauzula WHERE

Klauzula `WHERE` jest dopisywana po wskazaniu tabeli. Każdy wiersz tabeli jest sprawdzany pod kątem prawdy lub fałszu. Jeśli warunek jest prawdziwy $\rightarrow$ wiersz trafia do wyniku.

```sql
SELECT nazwa, cena FROM produkt WHERE cena < 200;
```
*Tłumaczenie:* „Pokaż mi nazwy i ceny produktów, ale tylko tych, których cena jest mniejsza niż 200”.

### Operatorzy porównania
W zapytaniach `WHERE` najczęściej używamy tych operatorów:
*   `=` : równe
*   `<>` lub `!=` : nierówne
*   `>` : większe
*   `<` : mniejsze
*   `>=` : większe lub równe
*   `<=` : mniejsze lub równe

## 2. Łączenie warunków (AND, OR, NOT)

Często jeden warunek to za mało. Możemy budować złożone filtry:

*   **AND** (I) — oba warunki muszą być spełnione jednocześnie.
    ```sql
    SELECT nazwa FROM produkt WHERE cena < 200 AND kolor = 'czarny';
    ```
*   **OR** (LUB) — wystarczy, że przynajmniej jeden z warunków jest spełniony.
    ```sql
    SELECT nazwa FROM produkt WHERE kolor = 'czerwony' OR kolor = 'niebieski';
    ```
*   **NOT** (NIE) — zaprzeczenie warunku (wykluczenie).
    ```sql
    SELECT nazwa FROM produkt WHERE NOT kolor = 'biały';
    ```

!!! warning "Kolejność działań"
    Podobnie jak w matematyce, `AND` ma pierwszeństwo przed `OR`. Aby zmienić tę kolejność lub pogrupować warunki, używamy nawiasów:
    `WHERE (kolor = 'czarny' OR kolor = 'biały') AND cena < 100`

## 3. Wyszukiwanie tekstowe z operatorem LIKE

Gdy nie znamy dokładnej nazwy produktu, ale chcemy znaleźć wszystkie buty danej marki, używamy operatora `LIKE`. Pozwala on na stosowanie tzw. **znaków wieloznacznych (wildcards)**:

*   `%` (procent) — zastępuje dowolną liczbę znaków (zero, jeden lub wiele).
*   `_` (podkreślnik) — zastępuje dokładnie jeden dowolny znak.

**Przykłady:**
*   `LIKE 'Nike%'` $\rightarrow$ wszystko, co zaczyna się od "Nike" (np. Nike Air, Nike Zoom).
*   `LIKE '%Sport%'` $\rightarrow$ wszystko, co zawiera słowo "Sport" w dowolnym miejscu.
*   `LIKE '%Sport'` $\rightarrow$ wszystko, co kończy się na "Sport".
*   `LIKE '_a%'` $\rightarrow$ wszystko, gdzie drugim znakiem jest litera 'a'.

```sql
SELECT nazwa FROM produkt WHERE nazwa LIKE 'Adidas%';
```

## 4. Operatory BETWEEN i IN

Aby zapisać zapytania krócej i czytelniej, SQL oferuje dwie specjalne funkcje:

### BETWEEN (Zakres)
Zamiast pisać `cena >= 100 AND cena <= 200`, piszemy:
```sql
SELECT nazwa, cena FROM produkt WHERE cena BETWEEN 100 AND 200;
```

### IN (Lista wartości)
Zamiast pisać `kolor = 'czerwony' OR kolor = 'niebieski' OR kolor = 'zielony'`, piszemy:
```sql
SELECT nazwa FROM produkt WHERE kolor IN ('czerwony', 'niebieski', 'zielony');
```

## 5. Co z tego jest na egzaminie

Na egzaminie INF.03 zapytania z filtrowaniem są standardem. Najczęstsze pułapki:
*   **Teksty w cudzysłowie:** Pamiętaj, że wartości tekstowe (np. `'czarny'`) oraz daty zawsze muszą być w pojedynczych cudzysłowach. Liczb (`200`) nie zamykamy w cudzysłowach.
*   **Błąd w LIKE:** Pomylenie `%` z `_`. Pamiętaj: `%` to "dowolna ilość", `_` to "dokładnie jeden znak".
*   **Słowo kluczowe NOT:** Używaj go, gdy polecenie brzmi: „wyświetl produkty, które NIE należą do...”.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Tanie i czarne buty"
    Napisz zapytanie, które wyświetli nazwy produktów, których cena jest mniejsza niż 150 zł ORAZ kolor jest czarny.

??? success "Rozwiązanie 1"
    ```sql
    SELECT nazwa FROM produkt WHERE cena < 150 AND kolor = 'czarny';
    ```

!!! question "Ćwiczenie 2. Markowe obuwie"
    Napisz zapytanie, które wyświetli wszystkie dane produktów, których nazwa zaczyna się od słowa "Nike" lub "Adidas".

??? success "Rozwiązanie 2"
    ```sql
    SELECT * FROM produkt WHERE nazwa LIKE 'Nike%' OR nazwa LIKE 'Adidas%';
    ```

!!! question "Ćwiczenie 3. Zakres cenowy"
    Napisz zapytanie, które wyświetli nazwy i ceny produktów, których cena mieści się w przedziale od 120 do 300 zł. Użyj operatora `BETWEEN`.

??? success "Rozwiązanie 3"
    ```sql
    SELECT nazwa, cena FROM produkt WHERE cena BETWEEN 120 AND 300;
    ```

!!! question "Ćwiczenie 4. Wybór kolorów"
    Napisz zapytanie, które wyświetli nazwy produktów, których kolor to: 'czerwony', 'żółty' lub 'pomarańczowy'. Użyj operatora `IN`.

??? success "Rozwiązanie 4"
    ```sql
    SELECT nazwa FROM produkt WHERE kolor IN ('czerwony', 'żółty', 'pomarańczowy');
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich czterech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Który operator należy zastosować, aby znaleźć rekordy, w których wartość kolumny NIE jest równa określonej wartości?",
    "opcje": [
      "NOT EQUAL",
      "<> lub !=",
      "DIFF",
      "IS NOT"
    ],
    "poprawna": 1,
    "wyjasnienie": "W SQL operatory <> oraz != służą do sprawdzania nierówności."
  },
  {
    "pytanie": "Co oznacza zapis LIKE 'A_b%' ?",
    "opcje": [
      "Tekst zaczyna się od litery 'A', kończy na 'b'",
      "Tekst zaczyna się od 'A', ma dowolny znak na drugiej pozycji i trzecia litera to 'b', a potem może być cokolwiek",
      "Tekst zawiera litery A i b w dowolnym miejscu",
      "Tekst ma dokładnie trzy znaki: A, dowolny, b"
    ],
    "poprawna": 1,
    "wyjasnienie": "Podkreślnik (_) zastępuje dokładnie jeden znak, a procent (%) zastępuje dowolną liczbę znaków."
  },
  {
    "pytanie": "Jaka jest różnica między operatorami AND a OR?",
    "opcje": [
      "AND wymaga spełnienia wszystkich warunków, OR wystarczy, że jeden jest spełniony",
      "AND jest szybszy niż OR",
      "OR wymaga spełnienia wszystkich warunków, AND tylko jednego",
      "Nie ma różnicy, można ich używać zamiennie"
    ],
    "poprawna": 0,
    "wyjasnienie": "AND to koniunkcja (wszystkie warunki muszą być prawdziwe), a OR to alternatywa (wystarczy jeden prawdziwy warunek)."
  },
  {
    "pytanie": "Która z poniższych instrukcji jest najkrótszym i najczytelniejszym sposobem na sprawdzenie, czy wartość kolumny mieści się w zbiorze {10, 20, 30}?",
    "opcje": [
      "WHERE kolumna = 10 OR kolumna = 20 OR kolumna = 30",
      "WHERE kolumna BETWEEN 10 AND 30",
      "WHERE kolumna IN (10, 20, 30)",
      "WHERE kolumna LIKE '10, 20, 30'"
    ],
    "poprawna": 2,
    "wyjasnienie": "Operator IN pozwala na sprawdzenie przynależności wartości do określonej listy, co jest znacznie czytelniejsze niż wiele instrukcji OR."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="filtrowanie-warunki"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
