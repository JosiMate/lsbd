# Wartości NULL — pułapka, na której traci się punkty
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział III**

Większość początkujących użytkowników SQL zakłada, że „pustka” w tabeli to albo zero, albo pusty napis. W rzeczywistości relacyjne bazy danych mają specjalny stan zwany **NULL**. Jest on jednym z najczęstszych powodów błędów w zapytaniach na egzaminie INF.03, ponieważ nie działa on tak, jak zwykłe dane.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić różnicę między wartością NULL, zerem a pustym ciągiem znaków
    2. poprawnie filtrować dane za pomocą operatorów `IS NULL` oraz `IS NOT NULL`
    3. unikać błędów przy porównywaniu wartości NULL z innymi danymi
    4. rozpoznać sytuacje, w których NULL wpływa na wynik zapytania

## 1. Czym jest NULL?

**NULL** to nie jest wartość. To **znacznik**, który mówi bazie danych: „tu nie ma żadnych informacji” lub „informacja jest nieznana”.

Wyobraźmy sobie tabelę `produkt`. Mamy trzy buty:
1. But A: ma cenę 100 zł.
2. But B: ma cenę 0 zł (np. darmowy prezent).
3. But C: nie ma przypisanej ceny (pole jest puste).

W bazie danych:
*   But A: `cena = 100`
*   But B: `cena = 0`
*   But C: `cena = NULL`

Dla człowieka But B i But C są „tanie” lub „za darmo”. Dla bazy danych to dwa zupełnie różne stany. Zero to konkretna liczba. NULL to brak informacji.

## 2. Wielka pułapka: Dlaczego `=` nie działa z NULL?

To najważniejszy punkt tej lekcji. W SQL nie można użyć operatora równości (`=`) do sprawdzenia, czy w kolumnie jest NULL.

**BŁĘDNE zapytanie:**
```sql
SELECT nazwa FROM produkt WHERE kolor = NULL;
```
To zapytanie **zawsze zwróci pusty wynik**, nawet jeśli w bazie jest tysiąc produktów z pustym kolorem. Dlaczego? Ponieważ w logice SQL `NULL` nie jest równy niczemu – nawet samemu sobie. Wynikiem porównania `NULL = NULL` jest kolejna wartość nieznana.

### Jak robić to poprawnie?
Do sprawdzania pustek używamy specjalnych operatorów:
*   **`IS NULL`** — sprawdza, czy wartość jest pusta.
*   **`IS NOT NULL`** — sprawdza, czy wartość jest podana.

**POPRAWNE zapytania:**
```sql
-- Znajdź buty, które nie mają przypisanej kategorii
SELECT nazwa FROM produkt WHERE id_kategorii IS NULL;

-- Znajdź buty, które mają podaną cenę
SELECT nazwa FROM produkt WHERE cena IS NOT NULL;
```

## 3. Wpływ NULL na filtrowanie (WHERE)

Kiedy używamy operatorów takich jak `>`, `<`, `BETWEEN` czy `LIKE` na kolumnie, która zawiera wartości NULL, te wiersze są **automatycznie pomijane**.

**Przykład:**
Mamy produkty o cenach: `100`, `200`, `NULL`.
Zapytanie: `SELECT nazwa FROM produkt WHERE cena < 500;`
**Wynik:** Zobaczymy tylko produkty za 100 i 200. Produkt z ceną `NULL` zostanie pominięty, mimo że logicznie „nie jest droższy niż 500”. Dla bazy danych `NULL < 500` nie jest prawdą – jest nieznane.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 pułapka z NULL pojawia się często w zapytaniach typu „wyświetl produkty, które nie mają przypisanej marki/koloru”.

**Pamiętaj:**
1. Widzisz w poleceniu „nie ma przypisanej...”, „brak informacji o...” $\rightarrow$ użyj `IS NULL`.
2. Nigdy nie pisz `WHERE kolumna = NULL` ani `WHERE kolumna != NULL`.
3. Jeśli musisz wybrać rekordy, które mają jakąkolwiek wartość (niezależnie od tego, jaka), użyj `IS NOT NULL`.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Poszukiwanie pustek"
    Napisz zapytanie, które wyświetli nazwy produktów, które nie mają przypisanej wysokości (pole `wysokosc` jest puste).

??? success "Rozwiązanie 1"
    ```sql
    SELECT nazwa FROM produkt WHERE wysokosc IS NULL;
    ```

!!! question "Ćwiczenie 2. Tylko kompletne dane"
    Wyświetl wszystkie dane produktów, które mają podaną cenę ORAZ podany kolor.

??? success "Rozwiązanie 2"
    ```sql
    SELECT * FROM produkt WHERE cena IS NOT NULL AND kolor IS NOT NULL;
    ```

!!! question "Ćwiczenie 3. Pułapka z zerem"
    W tabeli `produkt` mamy buty o cenie 0 zł oraz buty z ceną `NULL`. Napisz dwa oddzielne zapytania:
    1. Znajdź buty, które są darmowe (cena wynosi 0).
    2. Znajdź buty, których cena nie została jeszcze określona.

??? success "Rozwiązanie 3"
    1. `SELECT nazwa FROM produkt WHERE cena = 0;`
    2. `SELECT nazwa FROM produkt WHERE cena IS NULL;`

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym różni się wartość NULL od wartości 0 w bazie danych?",
    "opcje": [
      "Niczym, oba zapisy oznaczają brak danych",
      "0 to konkretna wartość liczbowa, a NULL to znacznik braku informacji",
      "NULL jest używany do liczb, a 0 do tekstów",
      "0 jest wartością nieznaną, a NULL jest wartością domyślną"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zero jest liczbą. NULL to stan, w którym informacja w ogóle nie została podana lub jest nieznana."
  },
  {
    "pytanie": "Które z poniższych zapytań poprawnie zwróci wiersze, w których kolumna 'opis' jest pusta?",
    "opcje": [
      "SELECT * FROM produkt WHERE opis = NULL",
      "SELECT * FROM produkt WHERE opis == NULL",
      "SELECT * FROM produkt WHERE opis IS NULL",
      "SELECT * FROM produkt WHERE opis NOT NULL"
    ],
    "poprawna": 2,
    "wyjasnienie": "W SQL do sprawdzania pustych wartości używamy operatora IS NULL. Operator = nie działa z wartościami NULL."
  },
  {
    "pytanie": "Co się stanie z wierszami zawierającymi NULL podczas wykonywania zapytania z warunkiem 'WHERE cena < 100'?",
    "opcje": [
      "Zostaną wyświetlone jako najtańsze",
      "Zostaną pominięte (nie trafią do wyniku)",
      "Wywołają błąd krytyczny bazy danych",
      "Zostaną potraktowane tak, jakby cena wynosiła 0"
    ],
    "poprawna": 1,
    "wyjasnienie": "Operacje porównania na wartościach NULL zwracają wynik 'nieznany', co w klauzuli WHERE jest traktowane jak fałsz, więc wiersze te są pomijane."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="obsluga-null"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
