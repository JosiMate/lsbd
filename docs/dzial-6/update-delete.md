# UPDATE i DELETE — i dlaczego zawsze z WHERE
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VI**

Umiejętność dodawania danych to tylko połowa sukcesu. W realnych systemach dane ewoluują: klient zmienia adres, cena produktu rośnie, a błędnie wpisany rekord musi zostać usunięty. Do tych operacji służą polecenia `UPDATE` oraz `DELETE`. Są one niezwykle potężne, ale i niebezpieczne – jeden błąd w zapytaniu może doprowadzić do utraty wszystkich danych w tabeli.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. modyfikować istniejące dane za pomocą polecenia `UPDATE`
    2. usuwać konkretne rekordy z bazy danych za pomocą `DELETE`
    3. stosować klauzulę `WHERE` do precyzyjnego wskazywania modyfikowanych wierszy
    4. unikać katastrofalnych błędów polegających na modyfikacji całej tabeli

## 1. Aktualizacja danych: UPDATE

Polecenie `UPDATE` pozwala zmienić wartości w istniejących wierszach.

**Ogólny wzór:**
```sql
UPDATE nazwa_tabeli 
SET kolumna1 = nowa_wartosc1, kolumna2 = nowa_wartosc2
WHERE warunek;
```

**Przykład praktyczny:** Chcemy zmienić cenę konkretnego buta (o id = 5) na 299.00 zł.
```sql
UPDATE produkt 
SET cena = 299.00 
WHERE id_produktu = 5;
```

### Co się stanie, jeśli pominiesz WHERE?
To najczęstszy i najgroźniejszy błąd w SQL. Jeśli napiszesz:
`UPDATE produkt SET cena = 299.00;`
$\rightarrow$ **Baza zmieni cenę WSZYSTKICH produktów w sklepie na 299.00 zł.** Bez klauzuli `WHERE` polecenie `UPDATE` działa globalnie na całej tabeli.

## 2. Usuwanie danych: DELETE

Polecenie `DELETE` służy do trwałego usunięcia wierszy z tabeli.

**Ogólny wzór:**
```sql
DELETE FROM nazwa_tabeli 
WHERE warunek;
```

**Przykład praktyczny:** Chcemy usunąć z bazy produkt o id = 12.
```sql
DELETE FROM produkt 
WHERE id_produktu = 12;
```

### Katastrofa: DELETE bez WHERE
Podobnie jak w przypadku `UPDATE`, pominięcie `WHERE` w poleceniu `DELETE` ma opłakane skutki:
`DELETE FROM produkt;`
$\rightarrow$ **Baza usunie wszystkie rekordy z tabeli produkt.** Tabela pozostanie w bazie (jej struktura zostanie), ale będzie całkowicie pusta.

## 3. Strategie bezpiecznej modyfikacji

Aby nie stać się „legendą” firmy z powodu usunięcia całej bazy, stosuj te zasady:

1.  **Najpierw SELECT, potem UPDATE/DELETE.**
    Zanim uruchomisz modyfikację, napisz zapytanie `SELECT` z tym samym warunkiem `WHERE`. Jeśli `SELECT` wyświetli dokładnie te wiersze, które chcesz zmienić $\rightarrow$ zamień `SELECT *` na `UPDATE` lub `DELETE`.
2.  **Używaj klucza głównego.**
    Zawsze staraj się modyfikować dane po `id`. Warunki typu `WHERE nazwa = 'Nike'` mogą objąć więcej produktów, niż zamierzałeś.
3.  **Kopia zapasowa.**
    Przed masowymi zmianami w bazie zawsze wykonuj eksport danych.

## 4. Co z tego jest na egzaminie

W zadaniach praktycznych INF.03 modyfikacja danych pojawia się często jako element zarządzania bazą.

**Typowe polecenia:**
*   „Zmień cenę produktów z kategorii X o 10%” $\rightarrow$ `UPDATE` z obliczeniem `cena * 1.1`.
*   „Usuń wszystkich klientów, którzy nie mają podanego adresu e-mail” $\rightarrow$ `DELETE` z `WHERE email IS NULL`.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Podwyżka cen"
    Wszystkie produkty w kategorii nr 2 podlegają podwyżce. Zmień ich ceny na wartość o 20 zł wyższą niż obecna.

??? success "Rozwiązanie 1"
    ```sql
    UPDATE produkt 
    SET cena = cena + 20 
    WHERE id_kategorii = 2;
    ```

!!! question "Ćwiczenie 2. Korekta błędu"
    W tabeli `klient` odkryto, że klient o id = 7 ma błędne nazwisko. Zmień je na „Kowalski”.

??? success "Rozwiązanie 2"
    ```sql
    UPDATE klient 
    SET nazwisko = 'Kowalski' 
    WHERE id_klienta = 7;
    ```

!!! question "Ćwiczenie 3. Usuwanie niepotrzebnych danych"
    Usuń z tabeli `produkt` wszystkie buty, których cena przekracza 1000 zł (uznajemy je za zbyt drogie dla naszych klientów).

??? success "Rozwiązanie 3"
    ```sql
    DELETE FROM produkt 
    WHERE cena > 1000;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co się stanie, jeśli wykonasz polecenie 'DELETE FROM klient' bez klauzuli WHERE?",
    "opcje": [
      "Baza danych zgłosi błąd i nie usunie nic",
      "Zostaną usunięte tylko niekompletne rekordy",
      "Wszystkie wiersze z tabeli zostaną trwale usunięte",
      "Tabela zostanie usunięta wraz ze swoją strukturą"
    ],
    "poprawna": 2,
    "wyjasnienie": "Brak klauzuli WHERE w poleceniu DELETE sprawia, że operacja zostaje wykonana na wszystkich rekordach w tabeli."
  },
  {
    "pytanie": "Która z poniższych instrukcji poprawnie zwiększa cenę wszystkich produktów o 10 zł?",
    "opcje": [
      "UPDATE produkt SET cena = cena + 10",
      "INSERT INTO produkt (cena) VALUES (cena + 10)",
      "MODIFY produkt SET cena = cena + 10",
      "UPDATE produkt WHERE cena = cena + 10"
    ],
    "poprawna": 0,
    "wyjasnienie": "Słowo kluczowe SET służy do określenia nowych wartości kolumn, a operacja cena = cena + 10 zwiększa obecną wartość o wskazaną kwotę."
  },
  {
    "pytanie": "Jaki jest najbezpieczniejszy sposób na upewnienie się, że UPDATE zmodyfikuje tylko jeden konkretny wiersz?",
    "opcje": [
      "Użycie operatora LIKE",
      "Użycie klauzuli WHERE z kluczem głównym (np. id_produktu = 5)",
      "Użycie sortowania ORDER BY przed UPDATE",
      "Ograniczenie wyniku za pomocą LIMIT 1"
    ],
    "poprawna": 1,
    "wyjasnienie": "Ponieważ klucz główny jest unikatowy, filtr po id gwarantuje, że modyfikacja dotyczy dokładnie jednego, konkretnego rekordu."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="update-delete"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
