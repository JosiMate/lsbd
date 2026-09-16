# Transakcje — spójność i ACID
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IX**

Wyobraź sobie system bankowy. Chcesz przelać 100 zł z konta A na konto B. W bazie danych są to dwie operacje:
1. Odejmij 100 zł z konta A.
2. Dodaj 100 zł do konta B.

Co się stanie, jeśli po pierwszym kroku nastąpi awaria prądu lub zawiesi się serwer? Pieniądze znikną z konta A, ale nigdy nie pojawią się na koncie B. To katastrofa. Rozwiązaniem tego problemu są **transakcje**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić pojęcie transakcji i zasadę „wszystko albo nic”
    2. poprawnie stosować instrukcje COMMIT i ROLLBACK
    3. wyjaśnić znaczenie akronimu ACID
    4. zidentyfikować sytuacje, w których użycie transakcji jest niezbędne

## 1. Czym jest transakcja?

Transakcja to **grupa operacji SQL, które są traktowane jako jedna, niepodzielna całość**. 

Głównym celem transakcji jest zapewnienie, że baza danych zawsze pozostanie w stanie spójnym. Jeśli choć jedna operacja wewnątrz transakcji zakończy się błędem, wszystkie poprzednie zmiany w tej transakcji zostaną cofnięte.

**Kluczowe instrukcje:**
- `START TRANSACTION` (lub `BEGIN`) $\rightarrow$ Informuje bazę, że zaczynamy grupować operacje.
- `COMMIT` $\rightarrow$ Zatwierdza wszystkie zmiany wprowadzone w transakcji. Po tym poleceniu zmiany stają się trwałe i widoczne dla innych użytkowników.
- `ROLLBACK` $\rightarrow$ Anuluje wszystkie zmiany wprowadzone od momentu `START TRANSACTION`. Baza wraca do stanu sprzed rozpoczęcia transakcji.

**Przykład przelewu bankowego:**
```sql
START TRANSACTION;

UPDATE konta SET saldo = saldo - 100 WHERE id = 'Konto_A';
-- Tutaj system sprawdza, czy konto A miało wystarczające środki.
-- Jeśli tak, kontynuuje. Jeśli nie, wykonuje ROLLBACK.

UPDATE konta SET saldo = saldo + 100 WHERE id = 'Konto_B';

COMMIT; -- Dopiero teraz pieniądze faktycznie „przepływają”
```

## 2. Zasady ACID

Aby system bazodanowy uznano za bezpieczny w kontekście transakcji, musi on spełniać cztery zasady **ACID**:

- **A (Atomicity — Atomowość):** Transakcja jest niepodzielna. Albo wszystkie jej operacje zostaną wykonane, albo żadna z nich. Nie ma stanu „pół-wykonania”.
- **C (Consistency — Spójność):** Transakcja przenosi bazę z jednego poprawnego stanu w inny. Nie może naruszyć reguł bazy (np. kluczy obcych czy więzów spójności).
- **I (Isolation — Izolacja):** Operacje wewnątrz jednej transakcji są niewidoczne dla innych użytkowników, dopóki nie zostaną zatwierdzone (`COMMIT`). Zapobiega to odczytywaniu danych, które mogą zostać zaraz cofnięte.
- **D (Durability — Trwałość):** Raz zatwierdzone zmiany (`COMMIT`) są trwałe, nawet jeśli sekundę później dojdzie do awarii serwera.

## 3. Kiedy stosować transakcje?

Transakcje są niezbędne wszędzie tam, gdzie jedna zmiana zależy od drugiej:
- **Przelewy i płatności:** Odejmij z jednego miejsca, dodaj w drugim.
- **Zamówienia w sklepie:** Zmniejsz ilość towaru w magazynie $\rightarrow$ Stwórz rekord zamówienia $\rightarrow$ Dodaj pozycje do zamówienia.
- **Masowe aktualizacje:** Gdy zmieniasz cennik w 10 tabelach jednocześnie i chcesz mieć pewność, że albo wszystkie ceny zostaną zaktualizowane, albo żadna (aby nie mieć niespójnego cennika).

## 4. Co z tego jest na egzaminie

W zadaniach INF.03 często pojawia się pytanie o mechanizm zapewnienia spójności danych.

**Klucz do odpowiedzi:**
Wymień pojęcie **transakcji**, zasadę **atomowości** oraz instrukcje **COMMIT** i **ROLLBACK**.

**Pułapka egzaminacyjna:**
Pamiętaj, że w wielu programach do zarządzania bazami (np. phpMyAdmin, MySQL Workbench) włączony jest tzw. **autocommit**. Oznacza to, że każde pojedyncze zapytanie jest automatycznie zatwierdzane. Aby testować transakcje, musisz jawnie wpisać `START TRANSACTION`.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Projektowanie transakcji"
Napisz sekwencję komend SQL, która przenosi produkt z kategorii „Nowości” do kategorii „Wyprzedaż”. Załóż, że musisz zaktualizować tabelę `produkty` oraz dodać wpis do tabeli `historia_zmian`. Całość musi być transakcją.

??? success "Rozwiązanie 1"
    ```sql
    START TRANSACTION;

    UPDATE produkty SET id_kategorii = 'WYPRZEDAZ' WHERE id_produktu = 123;
    INSERT INTO historia_zmian (id_produktu, opis, data) 
    VALUES (123, 'Przeniesienie do wyprzedaży', NOW());

    COMMIT;
    ```

!!! question "Ćwiczenie 2. Analiza awarii"
W trakcie wykonywania powyższej transakcji, po aktualizacji tabeli `produkty`, serwer zgłosił błąd braku miejsca na dysku podczas próby zapisu do `historia_zmian`. Co zrobi administrator, aby baza nie została w niespójnym stanie?

??? success "Rozwiązanie 2"
    Administrator (lub system automatycznie) musi wykonać instrukcję `ROLLBACK`. Dzięki temu zmiana w tabeli `produkty` zostanie cofnięta, a baza wróci do stanu, w którym produkt wciąż jest w kategorii „Nowości”.

!!! question "Ćwiczenie 3. Mapowanie ACID"
Dopasuj zasadę ACID do opisu:
1. „Zatwierdzone dane nie znikną po restartach serwera” $\rightarrow$ [ ]
2. „Użytkownik B nie widzi zmian użytkownika A, dopóki ten nie kliknie 'Zapisz'” $\rightarrow$ [ ]
3. „Jeśli zawiedzie zapis adresu, nie zapisujemy też numeru telefonu” $\rightarrow$ [ ]
4. „System nie pozwoli na przelew, który spowodowałby ujemny stan konta (naruszenie reguły)” $\rightarrow$ [ ]

??? success "Rozwiązanie 3"
    1 $\rightarrow$ **D** (Durability)
    2 $\rightarrow$ **I** (Isolation)
    3 $\rightarrow$ **A** (Atomicity)
    4 $\rightarrow$ **C** (Consistency)

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co sprawia, że transakcja jest 'atomowa'?",
    "opcje": [
      "Może być podzielona na mniejsze kawałki",
      "Jest wykonana w najszybszy możliwy sposób",
      "Zostaje wykonana w całości lub nie zostaje wykonana wcale",
      "Używa najmniejszej możliwej ilości pamięci RAM"
    ],
    "poprawna": 2,
    "wyjasnienie": "Atomowość oznacza, że nie ma stanu pośredniego — albo wszystkie kroki transakcji succeeded, albo wszystkie są cofnięte."
  },
  {
    "pytanie": "Która komenda służy do ostatecznego zatwierdzenia zmian w transakcji?",
    "opcje": [
      "SAVEPOINT",
      "COMMIT",
      "ROLLBACK",
      "START TRANSACTION"
    ],
    "poprawna": 1,
    "wyjasnienie": "COMMIT sprawia, że zmiany wprowadzone w trakcie transakcji stają się trwałe i widoczne dla wszystkich."
  },
  {
    "pytanie": "W jakiej sytuacji najbezpieczniej jest użyć instrukcji ROLLBACK?",
    "opcje": [
      "Gdy chcemy przyspieszyć działanie bazy danych",
      "Gdy po wykonaniu części operacji w transakcji wystąpił nieoczekiwany błąd",
      "Gdy chcemy usunąć wszystkie tabele z bazy",
      "Gdy chcemy utworzyć kopię zapasową danych"
    ],
    "poprawna": 1,
    "wyjasnienie": "ROLLBACK pozwala przywrócić stan bazy sprzed rozpoczęcia transakcji, co zapobiega pozostawieniu danych w niespójnym stanie."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="transakcje"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
