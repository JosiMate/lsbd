# Podzapytania
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

Czasami jedno zapytanie SQL nie wystarcza, aby odpowiedzieć na pytanie biznesowe. Pojawiają się sytuacje, w których musimy najpierw coś obliczyć lub znaleźć, a dopiero potem użyć tego wyniku do głównego zapytania. To właśnie są **podzapytania (subqueries)** — zapytania wewnątrz innych zapytań.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić, czym jest podzapytanie i jak działa jego kolejność wykonywania
    2. tworzyć podzapytania w klauzuli `WHERE` przy użyciu operatora `IN`
    3. stosować podzapytania do wyznaczania wartości ekstremalnych (np. najdroższego produktu)
    4. rozróżniać zapytania jednowartościowe od wielowartościowych

## 1. Idea podzapytania

Podzapytanie to zapytanie `SELECT` zamknięte w nawiasach, które jest częścią innego zapytania. Można je porównać do funkcji w programowaniu: najpierw wykonuje się to, co jest w środku, a wynik jest przekazywany „na zewnątrz”.

**Kolejność działania:**
1. Baza danych najpierw wykonuje zapytanie w nawiasach (podzapytanie).
2. Wynik podzapytania zostaje wstawiony w miejsce nawiasów.
3. Baza wykonuje zapytanie zewnętrzne, korzystając z otrzymanego wyniku.

## 2. Podzapytania w klauzuli WHERE

Najczęściej podzapytania stosujemy w filtrach, aby dynamicznie określić warunek.

### Przykład 1: Podzapytanie jednowartościowe (skalarne)
Chcemy wyświetlić wszystkie produkty, których cena jest **wyższa niż średnia cena** wszystkich butów w sklepie. Nie wiemy, jaka jest ta średnia, więc musimy ją najpierw obliczyć.

```sql
SELECT nazwa, cena 
FROM produkt 
WHERE cena > (SELECT AVG(cena) FROM produkt);
```
*Jak to działa?*
1. Baza wykonuje `(SELECT AVG(cena) FROM produkt)` $\rightarrow$ np. wynik to `250.00`.
2. Zapytanie zmienia się w: `SELECT nazwa, cena FROM produkt WHERE cena > 250.00`.

### Przykład 2: Podzapytania wielowartościowe (z operatorem IN)
Chcemy wyświetlić produkty, które należą do kategorii o nazwie „Buty sportowe”. Zamiast najpierw szukać ID kategorii, a potem wpisywać je ręcznie, robimy to w jednym kroku.

```sql
SELECT nazwa 
FROM produkt 
WHERE id_kategorii IN (SELECT id_kategorii FROM kategoria WHERE nazwa = 'Buty sportowe');
```
*Jak to działa?*
1. Podzapytanie znajduje wszystkie ID dla kategorii o nazwie „Buty sportowe” $\rightarrow$ np. `(1, 5)`.
2. Zapytanie główne szuka produktów, których `id_kategorii` znajduje się na tej liście.

## 3. Podzapytania a JOIN — co wybrać?

Wiele zadań można rozwiązać na dwa sposoby: za pomocą `JOIN` lub podzapytania.

*   **Kiedy użyć JOIN?** Gdy chcesz wyświetlić dane z obu tabel jednocześnie (np. nazwę produktu ORAZ nazwę kategorii).
*   **Kiedy użyć podzapytania?** Gdy chcesz odfiltrować dane z jednej tabeli na podstawie informacji z drugiej, ale w wyniku końcowym interesują Cię tylko dane z tej pierwszej tabeli.

Podzapytania są często bardziej intuicyjne dla ludzi („znajdź mi produkty z tych kategorii, które...”), ale przy bardzo dużych zbiorach danych `JOIN` jest zazwyczaj szybszy.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 podzapytania pojawiają się w zadaniach o wyższym poziomie trudności.

**Najczęstsze wzorce:**
*   „Wyświetl produkty, których cena jest wyższa niż najdroższy but z kategorii X” $\rightarrow$ podzapytanie z `MAX(cena)`.
*   „Wyświetl klientów, którzy nie złożyli żadnego zamówienia” $\rightarrow$ podzapytanie z `NOT IN`.

**Pułapka:** Pamiętaj o nawiasach! Podzapytanie bez nawiasów spowoduje błąd składni.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Powyżej średniej"
    Napisz zapytanie, które wyświetli nazwy produktów, których cena jest niższa niż średnia cena produktów w całej bazie.

??? success "Rozwiązanie 1"
    ```sql
    SELECT nazwa FROM produkt WHERE cena < (SELECT AVG(cena) FROM produkt);
    ```

!!! question "Ćwiczenie 2. Dynamiczny filtr kategorii"
    Napisz zapytanie, które wyświetli nazwy produktów należących do kategorii, której nazwa zaczyna się od litery „S”. Użyj podzapytania i operatora `IN`.

??? success "Rozwiązanie 2"
    ```sql
    SELECT nazwa FROM produkt 
    WHERE id_kategorii IN (SELECT id_kategorii FROM kategoria WHERE nazwa LIKE 'S%');
    ```

!!! question "Ćwiczenie 3. Najdroższy z najdroższych"
    Wyświetl wszystkie dane produktu, który ma najwyższą cenę w całej bazie. (Spróbuj zrobić to za pomocą podzapytania w WHERE, a nie przez ORDER BY i LIMIT).

??? success "Rozwiązanie 3"
    ```sql
    SELECT * FROM produkt WHERE cena = (SELECT MAX(cena) FROM produkt);
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "W jakiej kolejności baza danych wykonuje zapytanie z podzapytaniem?",
    "opcje": [
      "Najpierw zapytanie zewnętrzne, potem podzapytanie",
      "Oba zapytania są wykonywane jednocześnie",
      "Najpierw podzapytanie (w nawiasach), a potem zapytanie zewnętrzne",
      "Kolejność zależy od tego, czy użyto JOIN"
    ],
    "poprawna": 2,
    "wyjasnienie": "Podzapytanie musi dostarczyć wynik (wartość lub listę), aby zapytanie zewnętrzne mogło go użyć do filtrowania."
  },
  {
    "pytanie": "Kiedy należy użyć operatora IN zamiast zwykłego znaku równości (=) przy podzapytaniu?",
    "opcje": [
      "Zawsze, gdy używamy podzapytania",
      "Gdy podzapytanie może zwrócić więcej niż jedną wartość",
      "Gdy chcemy połączyć dwie tabele",
      "Kiedy podzapytanie zwraca wartość typu NULL"
    ],
    "poprawna": 1,
    "wyjasnienie": "Znak równości (=) działa tylko, gdy podzapytanie zwraca dokładnie jedną wartość (skalar). Jeśli podzapytanie zwraca listę wartości, musimy użyć IN."
  },
  {
    "pytanie": "Która z poniższych instrukcji jest poprawnym zapytaniem z podzapytaniem?",
    "opcje": [
      "SELECT nazwa FROM produkt WHERE cena > SELECT AVG(cena) FROM produkt",
      "SELECT nazwa FROM produkt WHERE cena > (SELECT AVG(cena) FROM produkt)",
      "SELECT nazwa FROM produkt WHERE (SELECT AVG(cena) FROM produkt) > cena",
      "Są poprawne tylko opcje 2 i 3"
    ],
    "poprawna": 1,
    "wyjasnienie": "Podzapytanie musi być zawsze zamknięte w nawiasach. Opcja 3 jest poprawna składniowo, ale logicznie robi to samo co opcja 2 (porównuje cenę ze średnią)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="podzapytania"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
