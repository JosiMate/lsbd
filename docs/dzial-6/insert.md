# INSERT — wprowadzanie danych
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VI**

Po zaprojektowaniu struktury bazy danych i utworzeniu tabel, te są puste. Aby móc z nich korzystać, musimy wprowadzić do nich dane. Służy do tego polecenie `INSERT INTO`. W tej lekcji nauczysz się, jak poprawnie dodawać nowe rekordy, dbając o to, by nie naruszyć integralności bazy.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. stosować polecenie `INSERT INTO` do dodawania rekordów do tabeli
    2. wprowadzać dane do wybranych kolumn, pomijając te z autoinkrementacją
    3. dobierać odpowiednie formaty danych dla tekstów, liczb i dat
    4. unikać najczęstszych błędów przy wprowadzaniu danych (np. brakujące pola NOT NULL)

## 1. Podstawowa składnia INSERT INTO

Polecenie `INSERT` mówi bazie danych: „stwórz nowy wiersz w tej tabeli i wpisz w niego te wartości”.

**Wariant 1: Wprowadzanie danych do wszystkich kolumn**
Jeśli podajemy wartości dla każdej kolumny w dokładnie takiej kolejności, w jakiej są one zdefiniowane w tabeli, możemy pominąć listę kolumn.

```sql
INSERT INTO kategoria VALUES (NULL, 'Buty sportowe');
```
*Uwaga:* Ponieważ `id_kategorii` ma właściwość `AUTO_INCREMENT`, wpisujemy `NULL` (lub 0), a baza sama przypisze kolejny numer.

**Wariant 2: Wprowadzanie danych do wybranych kolumn (Zalecane)**
To znacznie bezpieczniejszy sposób. Wyraźnie wskazujemy, do których kolumn chcemy dodać dane. Wszystkie pozostałe kolumny przyjmą wartość domyślną lub `NULL`.

```sql
INSERT INTO kategoria (nazwa) VALUES ('Buty eleganckie');
```
W tym przypadku baza automatycznie obsłuży `id_kategorii`, a my podajemy tylko to, co jest niezbędne.

## 2. Formaty danych w INSERT

Baza danych jest rygorystyczna co do tego, co wpisujemy do kolumn. Błąd w formacie spowoduje przerwanie operacji.

*   **Teksty i Daty:** Muszą być zawsze zamknięte w pojedynczych cudzysłowach (`' '`).
    `'Nike Air'`, `'2026-09-15'`
*   **Liczby:** Wpisujemy bez cudzysłowów.
    `299.99`, `10`
*   **Wartości puste:** Jeśli kolumna dopuszcza `NULL` i nie chcemy podać danych, wpisujemy słowo `NULL` bez cudzysłowów.

**Przykład kompletnego zapytania:**
```sql
INSERT INTO produkt (nazwa, cena, kolor, id_kategorii) 
VALUES ('Adidas Stan Smith', 349.00, 'biały', 1);
```

## 3. Co z tego jest na egzaminie

W części praktycznej INF.03 wprowadzanie danych jest jednym z podstawowych zadań.

**Najczęstsze pułapki:**
*   **Kolejność wartości:** Jeśli używasz Wariantu 1 (bez listy kolumn), musisz podać wartości w identycznej kolejności, w jakiej kolumny są w tabeli. Pomylenie ceny z kolorem spowoduje błąd.
*   **Szybki błąd z cudzysłowami:** Próba wpisania liczby w cudzysłowach lub tekstu bez nich.
*   **Brak danych NOT NULL:** jeśli kolumna jest zdefiniowana jako `NOT NULL`, a Ty pominiesz ją w liście kolumn i nie podasz wartości — baza odrzuci rekord.

## 4. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Poniżej działa prawdziwy silnik SQL z bazą `obuwie`. Tu zmieniasz dane, więc
liczy się jedna rzecz: **po każdej modyfikacji sprawdź `SELECT`-em, co się
naprawdę stało**. Przycisk **Przywróć bazę** cofa wszystko do stanu
wyjściowego, więc możesz próbować bez obaw.

<div class="sql-trener" data-baza="obuwie" data-start="INSERT INTO kategoria (nazwa) VALUES ('Kapcie');
SELECT * FROM kategoria;"></div>

!!! warning "Trener ocenia wynik ostatniego polecenia"

    Samo `INSERT` nie zwraca wierszy — trener napisze tylko, że
    polecenie się wykonało. Żeby zobaczyć efekt i żeby trener mógł sprawdzić
    Twoją pracę, dopisz pod spodem `SELECT`, tak jak w polu wyżej.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Dodawanie kategorii"
    Dodaj do tabeli `kategoria` trzy nowe kategorie: „Kapcie”, „Trampki” oraz
    „Buty robocze”. Użyj bezpiecznego wariantu z listą kolumn, a na końcu
    dopisz `SELECT * FROM kategoria;` — tabela ma mieć 7 wierszy.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="INSERT INTO kategoria (nazwa) VALUES ('Kapcie'); INSERT INTO kategoria (nazwa) VALUES ('Trampki'); INSERT INTO kategoria (nazwa) VALUES ('Buty robocze'); SELECT * FROM kategoria;"></div>

??? success "Rozwiązanie 1"
    ```sql
    INSERT INTO kategoria (nazwa) VALUES ('Kapcie');
    INSERT INTO kategoria (nazwa) VALUES ('Trampki');
    INSERT INTO kategoria (nazwa) VALUES ('Buty robocze');
    SELECT * FROM kategoria;
    ```

    Kategorii „Sandały” nie dopisujemy — ona już w tej bazie jest. Tabela
    `kategoria` nie ma ograniczenia `UNIQUE` na nazwie, więc baza przyjęłaby
    duplikat bez słowa protestu. To jeden z powodów, dla których warto
    najpierw sprawdzić `SELECT`-em, co w tabeli już stoi.

!!! question "Ćwiczenie 2. Wprowadzanie produktów"
    Dodaj do tabeli `produkt` buta o następujących parametrach:
    - Nazwa: „Nike Zoom”
    - Cena: 450.00
    - Kolor: „pomarańczowy”
    - Kategoria: 1 (to kategoria „Trzewiki”, istnieje w bazie)

    Na końcu dopisz `SELECT nazwa, cena, kolor FROM produkt WHERE nazwa = 'Nike Zoom';`

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="INSERT INTO produkt (nazwa, cena, kolor, id_kategorii) VALUES ('Nike Zoom', 450.00, 'pomarańczowy', 1); SELECT nazwa, cena, kolor FROM produkt WHERE nazwa = 'Nike Zoom';"></div>

??? success "Rozwiązanie 2"
    ```sql
    INSERT INTO produkt (nazwa, cena, kolor, id_kategorii) 
    VALUES ('Nike Zoom', 450.00, 'pomarańczowy', 1);
    ```

!!! question "Ćwiczenie 3. Błąd w danych"
    Przeanalizuj poniższe zapytanie i wskaż, dlaczego baza danych może zgłosić błąd:
    `INSERT INTO kategoria VALUES ('Buty trekkingowe');`

??? success "Rozwiązanie 3"
    Błąd polega na tym, że zapytanie próbuje wstawić jedną wartość do tabeli, która posiada dwie kolumny (`id_kategorii` i `nazwa`). Ponieważ nie wskazano listy kolumn, baza spodziewa się wartości dla każdego pola. Poprawny zapis to: `INSERT INTO kategoria (nazwa) VALUES ('Buty trekkingowe');`

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Który z poniższych zapisów jest najbardziej zalecany przy wprowadzaniu danych do bazy?",
    "opcje": [
      "INSERT INTO tabela VALUES (walory...)",
      "INSERT INTO tabela (kolumna1, kolumna2) VALUES (walor1, walor2)",
      "ADD TO tabela VALUES (walory...)",
      "INSERT INTO tabela SET kolumna1 = walor1"
    ],
    "poprawna": 1,
    "wyjasnienie": "Wskazywanie konkretnych kolumn jest bezpieczniejsze, ponieważ nie zależy od kolejności pól w strukturze tabeli i pozwala pominąć kolumny z autoinkrementacją."
  },
  {
    "pytanie": "Jak należy zapisać w SQL datę '2026-09-15', aby była poprawnie zinterpretowana przez bazę danych?",
    "opcje": [
      "Bez cudzysłowów: 2026-09-15",
      "W cudzysłowach: '2026-09-15'",
      "W nawiasach: (2026-09-15)",
      "Z prefiksem: DATE 2026-09-15"
    ],
    "poprawna": 1,
    "wyjasnienie": "Wszystkie wartości tekstowe oraz daty w SQL muszą być zawsze ujęte w pojedyncze cudzysłowy."
  },
  {
    "pytanie": "Co się stanie, jeśli spróbujesz wstawić wartość NULL do kolumny zdefiniowanej jako NOT NULL?",
    "opcje": [
      "Baza automatycznie przypisze domyślną wartość",
      "Wiersz zostanie dodany, ale kolumna pozostanie pusta",
      "Baza danych zgłosi błąd i przerwie operację",
      "Wartość zostanie zamieniona na zero"
    ],
    "poprawna": 2,
    "wyjasnienie": "Ograniczenie NOT NULL jest rygorystyczne – jeśli nie podasz wartości dla takiej kolumny, rekord nie zostanie dodany."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="insert"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
