# Złączenia zewnętrzne — LEFT JOIN i po co on jest
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

W poprzedniej lekcji poznaliśmy `INNER JOIN`. Był on idealny, gdy chcieliśmy zobaczyć tylko te produkty, które mają przypisaną kategorię. Ale co, jeśli chcemy wyświetlić listę WSZYSTKICH kategorii, w tym tych, które obecnie nie mają żadnego przypisanego produktu? Standardowy `JOIN` (czyli `INNER JOIN`) po prostu usunie takie kategorie z wyniku. Tutaj z pomocą przychodzi `LEFT JOIN`.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić różnicę między `INNER JOIN` a `LEFT JOIN`
    2. stosować `LEFT JOIN` do wyszukiwania braków w danych
    3. interpretować wartości `NULL` pojawiające się w wyniku złączeń zewnętrznych
    4. dobrać odpowiedni rodzaj złączenia do wymagań zadania egzaminacyjnego

## 1. Problem z INNER JOIN

Przypomnijmy: `INNER JOIN` działa jak filtr. Wyświetla tylko te wiersze, dla których znaleziono dopasowanie w obu tabelach.

Jeśli w bazie mamy:
*   kategorię **Sportowe** — ma trzy produkty,
*   kategorię **Kapcie** — nie ma jeszcze żadnego produktu,

Zapytanie:
```sql
SELECT k.nazwa, p.nazwa 
FROM kategoria k 
JOIN produkt p ON k.id_kategorii = p.id_kategorii;
```
**Wynik:** zobaczymy tylko **Sportowe**. Kategoria **Kapcie** całkowicie zniknie z listy, bo nie ma powiązanego produktu. W wielu sytuacjach to błąd — chcemy wiedzieć o wszystkich kategoriach, niezależnie od tego, czy są zapełnione.

## 2. Rozwiązanie: LEFT JOIN (Złączenie lewostronne)

`LEFT JOIN` mówi bazie: „pobierz WSZYSTKIE wiersze z tabeli lewej (tej wpisanej pierwszej po `FROM`), a jeśli znajdziesz dopasowanie w tabeli prawej – dopisz dane. Jeśli dopasowania nie ma – wpisz w tych miejscach `NULL`”.

**Przykład:**
```sql
SELECT k.nazwa AS "Kategoria", p.nazwa AS "Produkt"
FROM kategoria k 
LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;
```

**Co się stanie w wyniku?**
*   Dla "Butów sportowych" zobaczymy listę produktów.
*   Dla "Obuwia specjalistycznego" zobaczymy nazwę kategorii, a w kolumnie produkt pojawi się wartość **`NULL`**.

### Dlaczego to jest przydatne?
`LEFT JOIN` jest niezastąpiony w dwóch sytuacjach:
1.  **Raporty kompletności:** Chcemy zobaczyć pełną listę (np. wszystkich klientów), niezależnie od tego, czy złożyli zamówienie.
2.  **Wykrywanie braków:** Chcemy znaleźć rekordy, które NIE mają powiązań (np. „wyświetl wszystkie kategorie, które są puste”).

## 3. Wykrywanie braków (Trick z IS NULL)

To jedno z najpotężniejszych zastosowań `LEFT JOIN`. Jeśli połączymy go z klauzulą `WHERE ... IS NULL`, możemy precyzyjnie wskazać rekordy „osierocone”.

**Zadanie:** Wyświetl tylko te kategorie, w których nie ma żadnego produktu.

```sql
SELECT k.nazwa 
FROM kategoria k 
LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii
WHERE p.id_produktu IS NULL;
```
*Jak to działa?* `LEFT JOIN` tworzy wiersz dla pustej kategorii z `NULL` w polach produktu. `WHERE p.id_produktu IS NULL` odcina wszystkie wiersze, które miały przypisane produkty, zostawiając tylko te puste.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 `LEFT JOIN` pojawia się rzadziej niż `INNER JOIN`, ale gdy już jest, zazwyczaj dotyczy zadań typu „wyświetl wszystkie X, nawet jeśli nie mają przypisanych Y”.

**Słowa klucze w poleceniu:**
*   „wszystkie kategorie, niezależnie od tego czy mają produkty” $\rightarrow$ `LEFT JOIN`
*   „wyświetl kategorie, które nie posiadają żadnego produktu” → `LEFT JOIN` + `WHERE ... IS NULL`

**Pułapka:** nie pomyl kolejności tabel. `FROM kategoria LEFT JOIN produkt` daje wszystkie kategorie, a `FROM produkt LEFT JOIN kategoria` — wszystkie produkty. To dwa różne pytania i dwa różne wyniki.

## 5. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Trener niżej pracuje na wariancie bazy o nazwie `braki`: ten sam sklep, ale
z dziurami w danych — są produkty bez ceny, bez koloru i bez wysokości, dwa
produkty nie mają przypisanej kategorii, a kategoria **Kapcie** nie ma ani
jednego produktu. Na komplecie danych z bazy `obuwie` nie dałoby się tego
pokazać, bo tam żadne pole nie jest puste.

W polu niżej stoi `LEFT JOIN` z tabeli `kategoria`. Wykonaj je — wyjdzie
**10 wierszy**, a w ostatnim zobaczysz `Kapcie` i `NULL`. Potem usuń słowo
`LEFT` i wykonaj jeszcze raz: zostanie **9 wierszy** i kategoria bez produktów
zniknie.

<div class="sql-trener" data-baza="braki" data-start="SELECT k.nazwa, p.nazwa FROM kategoria k
LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;"></div>

!!! info "To SQLite, nie MariaDB"

    Trener liczy w przeglądarce, na silniku SQLite. `JOIN`, `LEFT JOIN`,
    `GROUP BY` i `HAVING` działają identycznie jak w phpMyAdminie. Zapisu
    `RIGHT JOIN` starsze wersje SQLite nie znają — na egzaminie i tak
    wystarcza `LEFT JOIN` z zamienioną kolejnością tabel.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Pełna lista kategorii"
    Napisz zapytanie, które wyświetli nazwy wszystkich kategorii oraz nazwy
    przypisanych do nich produktów. Pamiętaj, aby kategorie bez produktów
    również znalazły się w wyniku — razem 10 wierszy.

    <div class="sql-trener" data-baza="braki" data-wzorzec="SELECT k.nazwa, p.nazwa FROM kategoria k LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;"></div>

??? success "Rozwiązanie 1"
    ```sql
    SELECT k.nazwa, p.nazwa 
    FROM kategoria k 
    LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;
    ```

!!! question "Ćwiczenie 2. Poszukiwanie pustych kategorii"
    Napisz zapytanie, które wyświetli tylko nazwy tych kategorii, które nie mają
    przypisanego ani jednego produktu. Wyjdzie jeden wiersz.

    <div class="sql-trener" data-baza="braki" data-wzorzec="SELECT k.nazwa FROM kategoria k LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii WHERE p.id_produktu IS NULL;"></div>

??? success "Rozwiązanie 2"
    ```sql
    SELECT k.nazwa 
    FROM kategoria k 
    LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii
    WHERE p.id_produktu IS NULL;
    ```

!!! question "Ćwiczenie 3. Analiza produktów"
    W bazie `braki` dwa produkty nie mają przypisanej kategorii
    (`id_kategorii IS NULL`). Napisz zapytanie, które wyświetli wszystkie
    produkty, w tym te dwa — razem 11 wierszy.

    <div class="sql-trener" data-baza="braki" data-wzorzec="SELECT p.nazwa, k.nazwa FROM produkt p LEFT JOIN kategoria k ON p.id_kategorii = k.id_kategorii;"></div>

??? success "Rozwiązanie 3"
    ```sql
    SELECT p.nazwa, k.nazwa 
    FROM produkt p 
    LEFT JOIN kategoria k ON p.id_kategorii = k.id_kategorii;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym różni się LEFT JOIN od INNER JOIN?",
    "opcje": [
      "LEFT JOIN jest znacznie szybszy",
      "LEFT JOIN zwraca tylko rekordy, które mają dopasowania w obu tabelach",
      "LEFT JOIN zwraca wszystkie rekordy z lewej tabeli, uzupełniając brakujące dane z prawej wartością NULL",
      "LEFT JOIN służy wyłącznie do łączenia trzech i więcej tabel"
    ],
    "poprawna": 2,
    "wyjasnienie": "INNER JOIN odfiltrowuje rekordy bez dopasowań. LEFT JOIN zachowuje wszystkie rekordy z pierwszej (lewej) tabeli."
  },
  {
    "pytanie": "W zapytaniu 'SELECT * FROM A LEFT JOIN B ON A.id = B.a_id', co stanie się z wierszem z tabeli A, który nie ma odpownika w tabeli B?",
    "opcje": [
      "Zostanie całkowicie pominięty w wyniku",
      "Wywoła błąd krytyczny bazy danych",
      "Pojawi się w wyniku, a kolumny pochodzące z tabeli B będą miały wartość NULL",
      "Baza danych automatycznie utworzy nowy rekord w tabeli B"
    ],
    "poprawna": 2,
    "wyjasnienie": "To jest właśnie definicja złączenia lewostronnego: zachowujemy lewą stronę, a braki z prawej strony wypełniamy NULL-ami."
  },
  {
    "pytanie": "Jak najskuteczniej znaleźć rekordy w tabeli A, które NIE posiadają powiązanych rekordów w tabeli B?",
    "opcje": [
      "Używając INNER JOIN",
      "Używając LEFT JOIN i filtrując w WHERE kolumnę z tabeli B na IS NULL",
      "Używając SELECT * FROM A WHERE id != B.id",
      "Używając operatora BETWEEN"
    ],
    "poprawna": 1,
    "wyjasnienie": "Kombinacja LEFT JOIN i IS NULL pozwala wyizolować rekordy, dla których złączenie nie znalazło żadnego dopasowania."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="zlaczenia-zewnetrzne"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
