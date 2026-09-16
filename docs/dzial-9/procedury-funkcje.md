# Procedury i funkcje
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IX**

Do tej pory pisaliśmy zapytania SQL i wysyłaliśmy je do bazy za każdym razem z aplikacji. Ale co, jeśli pewna operacja (np. obliczanie rabatu dla klienta) jest bardzo skomplikowana i musi być wykonywana w wielu miejscach systemu?

Zamiast kopiować ten sam długi kod SQL do różnych aplikacji, możemy zapisać go bezpośrednio w bazie danych jako **Procedurę** lub **Funkcję**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. odróżnić procedurę od funkcji w systemie SQL
    2. tworzyć proste procedury z parametrami wejściowymi
    3. wywoływać zapisane procedury za pomocą komendy CALL
    4. wyjaśnić zalety przeniesienia logiki biznesowej do bazy danych

## 1. Procedury składowane (Stored Procedures)

Procedura to w uproszczeniu „funkcja wewnątrz bazy”. Jest to zestaw instrukcji SQL, którym nadajemy nazwę i który możemy uruchamiać wielokrotnie.

**Kluczowe cechy procedury:**
- Może przyjmować parametry (np. ID klienta).
- Może modyfikować dane w bazie (UPDATE, INSERT, DELETE).
- Nie musi zwracać wartości (choć może to robić za pomocą parametrów wyjściowych).

**Przykład: Procedura dodająca produkt do magazynu i aktualizująca statystyki.**
```sql
DELIMITER //

CREATE PROCEDURE DodajProdukt(IN p_nazwa VARCHAR(100), IN p_cena DECIMAL(10,2))
BEGIN
    INSERT INTO produkty (nazwa, cena) VALUES (p_nazwa, p_cena);
    UPDATE statystyki SET liczba_produktow = liczba_produktow + 1;
END //

DELIMITER ;
```
*Uwaga: `DELIMITER //` służy do tego, by baza nie uznała średnika wewnątrz procedury za koniec całej komendy.*

**Jak uruchomić procedurę?**
`CALL DodajProdukt('Myszka bezprzewodowa', 49.99);`

## 2. Funkcje (Stored Functions)

Funkcja jest podobna do procedury, ale ma jeden kluczowy cel: **zawsze musi zwrócić jedną konkretną wartość**. Dzięki temu możemy używać funkcji bezpośrednio w zapytaniach SELECT.

**Przykład: Funkcja obliczająca cenę z VAT (23%).**
```sql
DELIMITER //

CREATE FUNCTION ObliczVAT(cena_netto DECIMAL(10,2)) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN cena_netto * 1.23;
END //

DELIMITER ;
```

**Jak użyć funkcji?**
`SELECT nazwa, ObliczVAT(cena) AS cena_brutto FROM produkty;`

## 3. Porównanie: Procedura vs Funkcja

| Cecha | Procedura | Funkcja |
| :--- | :--- | :--- |
| **Cel** | Wykonanie serii działań (np. aktualizacja wielu tabel) | Obliczenie i zwrócenie konkretnej wartości |
| **Zwracanie wartości** | Opcjonalne (przez parametry OUT) | Obowiązkowe (instrukcja `RETURN`) |
| **Sposób wywołania** | Komenda `CALL nazwa()` | Wewnątrz zapytania (np. `SELECT funkcja()`) |
| **Modyfikacja danych** | Może swobodnie zmieniać dane w tabelach | Zazwyczaj służy tylko do odczytu i obliczeń |

## 4. Zalety programowania w bazie

Dlaczego nie pisać wszystkiego w aplikacji (np. w Pythonie czy Javie)?
1. **Wydajność:** Logika wykonuje się tuż obok danych. Nie trzeba przesyłać tysięcy wierszy przez sieć, by obliczyć jedną sumę.
2. **Spójność:** Niezależnie od tego, czy do bazy łączy się aplikacja mobilna, strona WWW czy skrypt administratora — wszyscy korzystają z tej samej, jednej logiki obliczeń.
3. **Bezpieczeństwo:** Możemy zabronić użytkownikowi edycji tabeli, a dać mu prawo do uruchamiania procedury, która robi to w kontrolowany sposób.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Tworzenie procedury"
Stwórz procedurę `ZmienCene(p_id INT, p_nowa_cena DECIMAL(10,2))`, która aktualizuje cenę produktu o danym ID.

??? success "Rozwiązanie 1"
    ```sql
    DELIMITER //
    CREATE PROCEDURE ZmienCene(p_id INT, p_nowa_cena DECIMAL(10,2))
    BEGIN
        UPDATE produkty SET cena = p_nowa_cena WHERE id = p_id;
    END //
    DELIMITER ;
    ```

!!! question "Ćwiczenie 2. Projektowanie funkcji"
Zaprojektuj funkcję `SprawdzDostepnosc(p_id INT)`, która zwraca liczbę `1` jeśli ilość produktu w magazynie jest większa od 0, a w przeciwnym razie `0`.

??? success "Rozwiązanie 2"
    ```sql
    DELIMITER //
    CREATE FUNCTION SprawdzDostepnosc(p_id INT) 
    RETURNS INT
    DETERMINISTIC
    BEGIN
        DECLARE ilosc INT;
        SELECT magazyn_ilosc INTO ilosc FROM produkty WHERE id = p_id;
        IF ilosc > 0 THEN RETURN 1; ELSE RETURN 0; END IF;
    END //
    DELIMITER ;
    ```

!!! question "Ćwiczenie 3. Wywołanie"
Jaką komendą wywołasz procedurę `ZmienCene`, aby zmienić cenę produktu o ID 5 na 129.99 zł?

??? success "Rozwiązanie 3"
    `CALL ZmienCene(5, 129.99);`

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaka jest główna różnica między procedurą a funkcją w SQL?",
    "opcje": [
      "Procedura jest szybsza",
      "Funkcja musi zawsze zwracać wartość, procedura nie",
      "Procedury nie mogą przyjmować parametrów",
      "Funkcji nie można tworzyć w MariaDB"
    ],
    "poprawna": 1,
    "wyjasnienie": "Kluczową cechą funkcji jest obowiązek zwrócenia wyniku za pomocą RETURN, co pozwala na jej użycie w SELECT."
  },
  {
    "pytanie": "Do czego służy komenda DELIMITER w skryptach tworzących procedury?",
    "opcje": [
      "Do szyfrowania treści procedury",
      "Do zmiany znaków w danych wejściowych",
      "Do zmiany znaku końca instrukcji, aby średniki wewnątrz procedury nie przerywały jej tworzenia",
      "Do definiowania parametrów wejściowych"
    ],
    "poprawna": 2,
    "wyjasnienie": "Ponieważ procedura zawiera wiele instrukcji zakończonych średnikami, musimy tymczasowo zmienić znacznik końca całej komendy (np. na //), by baza wiedziała, gdzie kończy się definicja procedury."
  },
  {
    "pytanie": "W którym przypadku najlepiej zastosować funkcję zamiast procedury?",
    "opcje": [
      "Gdy chcemy usunąć 1000 wierszy z bazy",
      "Gdy chcemy obliczyć wartość podatku i wyświetlić ją w kolumnie zapytania SELECT",
      "Gdy chcemy stworzyć nową tabelę w bazie",
      "Gdy chcemy wysłać e-mail z powiadomieniem o nowym zamówieniu"
    ],
    "poprawna": 1,
    "wyjasnienie": "Funkcje idealnie nadają się do obliczeń, których wynik chcemy wpleść w wyniki zapytania SELECT."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="procedury-funkcje"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
