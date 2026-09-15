# Skrypty tworzące strukturę
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

W codziennej pracy administratora bazy danych nie wpisuje się każdego polecenia `CREATE TABLE` pojedynczo w konsoli. Zamiast tego tworzy się **skrypt SQL** — jeden plik tekstowy z rozszerzeniem `.sql`, który zawiera całą sekwencję poleceń niezbędnych do zbudowania bazy od zera. Dzięki temu strukturę bazy można w kilka sekund odtworzyć na innym komputerze lub udostępnić ją innym programistom.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. stworzyć poprawny skrypt SQL budujący strukturę bazy danych
    2. zastosować odpowiednią kolejność poleceń w skrypcie, aby uniknąć błędów kluczy obcych
    3. zaimportować skrypt struktury do bazy danych przez phpMyAdmin
    4. stosować polecenie `DROP TABLE` do bezpiecznego resetowania bazy

## 1. Budowa skryptu struktury

Skrypt struktury to po prostu lista poleceń SQL oddzielonych średnikami. Najważniejszą zasadą jest **logiczna kolejność**.

**Struktura poprawnego skryptu:**
1. (Opcjonalnie) Polecenia usuwania istniejących tabel (`DROP TABLE`), aby skrypt można było uruchomić wielokrotnie bez błędów.
2. Polecenia tworzenia tabel nadrzędnych (bez kluczy obcych).
3. Polecenia tworzenia tabel podrzędnych (z kluczami obcymi).

**Przykład skryptu dla bazy `obuwie`:**
```sql
-- 1. Czyszczenie bazy (kolejność odwrotna do tworzenia!)
DROP TABLE IF EXISTS produkt;
DROP TABLE IF EXISTS kategoria;

-- 2. Tworzenie tabel nadrzędnych
CREATE TABLE kategoria (
    id_kategorii INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(50) NOT NULL
);

-- 3. Tworzenie tabel podrzędnych
CREATE TABLE produkt (
    id_produktu INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100) NOT NULL,
    cena DECIMAL(10,2),
    id_kategorii INT,
    FOREIGN KEY (id_//kategorii) REFERENCES kategoria(id_kategorii)
);
```

## 2. Resetowanie bazy: DROP TABLE

Aby skrypt był "idempotentny" (czyli można go uruchamiać wiele razy, a efekt zawsze był ten sam), stosujemy `DROP TABLE IF EXISTS`.

**Dlaczego kolejność usuwania jest odwrotna?**
Ponieważ nie można usunąć tabeli, do której odwołuje się klucz obcy w innej tabeli. 
*   Najpierw usuwamy `produkt` (bo on zależy od kategorii).
*   Potem usuwamy `kategoria` (bo ona już nikogo nie blokuje).

## 3. Import skryptu w phpMyAdmin

Zamiast wpisywać kod w zakładce SQL, możemy zaimportować gotowy plik `.sql`.

**Kroki importu:**
1. Wybierz bazę danych z listy po lewej.
2. Kliknij zakładkę **Importuj** w górnym menu.
3. Przeglądaj $\rightarrow$ wybierz plik `.sql` z dysku.
4. Kliknij przycisk **Idź** na dole strony.

Jeśli skrypt jest poprawny, phpMyAdmin wyświetli zielony komunikat o sukcesie, a w lewej kolumnie pojawią się wszystkie zdefiniowane tabele.

## 4. Co z tego jest na egzaminie

Na egzaminie praktycznym INF.03 import bazy z pliku `.sql` jest pierwszym punktem każdego zadania.

**Zadania z treści poleceń często brzmią:**
*   „Zaimportuj strukturę bazy danych z dostarczonego pliku `.sql`”.
*   „Stwórz skrypt tworzący strukturę bazy zgodnie z załączonym schematem”.

**Pamiętaj:** Jeśli musisz sam napisać skrypt, najpierw narysuj sobie na kartce zależności między tabelami, aby nie pomylić kolejności `CREATE TABLE`. Błąd w kolejności to najszybszy sposób na utratę punktów za „nieuruchomienie bazy”.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Projektowanie kolejności"
    Masz do stworzenia trzy tabele: `autor`, `ksiazka` oraz `egzemplarz`.
    - `ksiazka` odwołuje się do `autor`.
    - `egzemplarz` odwołuje się do `ksiazka`.
    
    Wypisz poprawną kolejność poleceń `CREATE TABLE` oraz poprawną kolejność poleceń `DROP TABLE`.

??? success "Rozwiązanie 1"
    Tworzenie: `autor` $\rightarrow$ `ksiazka` $\rightarrow$ `egzemplarz`
    Usuwanie: `egzemplarz` $\rightarrow$ `ksiazka` $\rightarrow$ `autor`

!!! question "Ćwiczenie 2. Pisanie skryptu"
    Napisz kompletny skrypt SQL (zawierający `DROP TABLE` oraz `CREATE TABLE`) dla dwóch tabel: `klient` (id, imie) oraz `zamowienie` (id, data, id_klienta). Pamiętaj o kluczach głównych i obcym.

??? success "Rozwiązanie 2"
    ```sql
    DROP TABLE IF EXISTS zamowienie;
    DROP TABLE IF EXISTS klient;

    CREATE TABLE klient (
        id_klienta INT PRIMARY KEY AUTO_INCREMENT,
        imie VARCHAR(50) NOT NULL
    );

    CREATE TABLE zamowienie (
        id_zamowienia INT PRIMARY KEY AUTO_INCREMENT,
        data_zamowienia DATE NOT NULL,
        id_klienta INT,
        FOREIGN KEY (id_klienta) REFERENCES klient(id_klienta)
    );
    ```

!!! question "Ćwiczenie 3. Analiza błędu"
    Uczeń uruchomił poniższy skrypt i otrzymał błąd:
    ```sql
    CREATE TABLE produkt (id INT PRIMARY KEY, id_kat INT, FOREIGN KEY (id_kat) REFERENCES kategoria(id));
    CREATE TABLE kategoria (id INT PRIMARY KEY, nazwa VARCHAR(50));
    ```
    Wyjaśnij, dlaczego wystąpił błąd i jak go naprawić.

??? success "Rozwiązanie 3"
    Błąd wynika z błędnej kolejności tworzenia tabel. Tabela `produkt` odwołuje się do tabeli `kategoria`, która w momencie tworzenia produktu jeszcze nie istnieje. Rozwiązanie: należy zamienić kolejność poleceń `CREATE TABLE` miejscami.

!!! note "Co oddajesz"
    Wynki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Dlaczego w skrypcie SQL polecenia DROP TABLE zapisujemy w kolejności odwrotnej do CREATE TABLE?",
    "opcje": [
      "Aby przyspieszyć działanie serwera",
      "Ponieważ nie można usunąć tabeli, do której odwołuje się klucz obcy w innej istniejącej tabeli",
      "Bo tak wynika z zasad składni języka SQL",
      "Aby zachować alfabetyczną kolejność nazw"
    ],
    "poprawna": 1,
    "wyjasnienie": "Integrity constraints (ograniczenia spójności) blokują usunięcie tabeli 'rodzica', dopóki istnieją tabele 'dzieci' wskazujące na nią kluczem obcym."
  },
  {
    "pytanie": "Do czego służy dopisek IF EXISTS w poleceniu DROP TABLE IF EXISTS ?",
    "opcje": [
      "Do sprawdzenia, czy tabela zawiera dane",
      "Aby zapobiec wystąpieniu błędu, gdy próbujemy usunąć tabelę, która nie istnieje w bazie",
      "Do automatycznego tworzenia kopii zapasowej przed usunięciem",
      "Aby usunąć tylko wybrane wiersze z tabeli"
    ],
    "poprawna": 1,
    "wyjasnienie": "Bez tego dopisku, próba usunięcia nieistniejącej tabeli spowodowałaby przerwanie działania całego skryptu."
  },
  {
    "pytanie": "Który z poniższych elementów jest niezbędny w skrypcie, aby można go było uruchomić wielokrotnie bez ręcznego usuwania tabel?",
    "opcje": [
      "Zastosowanie AUTO_INCREMENT",
      "Użycie klauzuli IF EXISTS przy usuwaniu tabel",
      "Zapisywanie skryptu w formacie .txt",
      "Użycie zapytania SELECT na początku skryptu"
    ],
    "//poprawna": 1,
    "poprawna": 1,
    "wyjasnienie": "Użycie DROP TABLE IF EXISTS na początku skryptu czyści bazę z poprzednich wersji struktury, pozwalając na świeży start przy każdym uruchomieniu."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="skrypty-struktura"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
