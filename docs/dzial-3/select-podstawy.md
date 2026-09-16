# SELECT, kolumny i aliasy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział III**

Umiejętność wyciągania konkretnych informacji z bazy danych to najważniejsza część pracy z SQL. Zapytanie `SELECT` to fundament, na którym opiera się każdy raport, każda lista produktów w sklepie i każde zestawienie ocen w szkole. W tej lekcji nauczysz się, jak pobierać dane z jednej tabeli, jak wybierać tylko te kolumny, których naprawdę potrzebujesz i jak nadawać im czytelne nazwy.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. napisać najprostsze zapytanie `SELECT` pobierające wszystkie dane z tabeli
    2. wybrać z tabeli tylko określone kolumny
    3. użyć aliasu (`AS`), aby zmienić nazwę kolumny w wyniku zapytania
    4. unikać pobierania niepotrzebnych danych w celu optymalizacji pracy bazy

## 1. Podstawowa konstrukcja SELECT

Zapytanie `SELECT` służy do odczytu danych z bazy. Nie zmienia ono treści tabeli, a jedynie wyświetla jej fragment zgodnie z naszymi wymaganiami.

Najprostszą formą zapytania jest pobranie wszystkich kolumn z danej tabeli za pomocą gwiazdki (`*`):

```sql
SELECT * FROM produkt;
```

To polecenie mówi bazie: „pokaż mi absolutnie wszystko, co masz w tabeli produkt”. 

### Dlaczego używanie `*` to zły nawyk?

W małych bazach szkolnych `SELECT *` działa błyskawicznie. Jednak w rzeczywistych systemach, gdzie tabela może mieć 50 kolumn i miliony wierszy, pobieranie wszystkich danych:
*   **Nadmiernie obciąża serwer** (musi przeczytać z dysku więcej danych).
*   **Zatruwa sieć** (przesyła ogromne ilości niepotrzebnych informacji).
*   **Utrudnia czytanie wyniku** (wynik zapytania staje się nieprzejrzystą tabelą).

## 2. Wybór konkretnych kolumn

Profesjonalista pisze zapytania, w których wymienia dokładnie te kolumny, których potrzebuje. Kolumny wymieniamy po przecinku, zaraz po słowie `SELECT`.

**Przykład:** Chcemy wyświetlić tylko nazwy butów i ich ceny.

```sql
SELECT nazwa, cena FROM produkt;
```

Dzięki temu wynik zapytania będzie zawierał tylko dwie kolumny, co czyni go czytelnym i szybkim.

## 3. Aliasy — nadawanie czytelnych nazw (AS)

Czasami nazwy kolumn w bazie są techniczne i brzmią nieatrakcyjnie dla użytkownika końcowego (np. `id_prod_cat` zamiast `Kategoria`). Aby to naprawić, używamy słowa kluczowego `AS`.

Alias to tymczasowa nazwa nadana kolumnie tylko na czas wyświetlenia wyniku zapytania. Nie zmienia ona nazwy kolumny w samej tabeli.

**Przykład:**

```sql
SELECT nazwa AS "Nazwa Produktu", cena AS "Cena netto" FROM produkt;
```

### Ważne uwagi o aliasach:
*   **Cudzysłowy:** Jeśli nazwa aliasu zawiera spacje lub polskie znaki, musi być zamknięta w cudzysłowie (`" "`).
*   **Opcjonalność:** Słowo `AS` jest opcjonalne. Można napisać `SELECT nazwa "Nazwa Produktu"`, ale użycie `AS` jest dobrą praktyką, bo sprawia, że zapytanie jest bardziej czytelne.

## 4. Co z tego jest na egzaminie

W części praktycznej egzaminu **INF.03**, pierwsze zapytania zazwyczaj wymagają wybrania konkretnych pól. 

**Typowy błąd:** Uczeń wpisuje `SELECT *`, mimo że polecenie brzmi: „wyświetl nazwy i ceny produktów”. Choć wynik będzie zawierał te dane, egzaminator może odjąć punkty za brak precyzji w zapytaniu.

Pamiętaj: czytaj polecenie dokładnie i wybieraj tylko te kolumny, o które prosi arkusz.

## 5. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Poniżej działa prawdziwy silnik SQL z bazą `obuwie` — tą samą, którą
importujesz w ćwiczeniach z działu I. Wpisz zapytanie i naciśnij
**Wykonaj** albo ++ctrl+enter++. Przycisk **Przywróć bazę** cofa wszystko
do stanu wyjściowego, więc nie da się tu niczego zepsuć.

<div class="sql-trener" data-baza="obuwie" data-start="SELECT nazwa, cena FROM produkt;"></div>

!!! info "To SQLite, nie MariaDB"

    Trener liczy w przeglądarce, na silniku SQLite. Składnia `SELECT`,
    `WHERE`, `ORDER BY`, `LIMIT`, `JOIN`, `GROUP BY` i `HAVING` jest ta sama
    co w phpMyAdminie, ale poleceń administracyjnych (`CREATE USER`,
    `GRANT`) ten silnik nie zna — te ćwiczysz w phpMyAdminie.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Lista produktów"
    Otwórz phpMyAdmina i bazę `obuwie`. Napisz zapytanie, które wyświetli nazwy
    wszystkich produktów oraz ich wysokość. Sprawdź się w trenerze — wynik ma
    mieć 10 wierszy.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa, wysokosc FROM produkt;"></div>

??? success "Rozwiązanie 1"
    ```sql
    SELECT nazwa, wysokosc FROM produkt;
    ```

!!! question "Ćwiczenie 2. Profesjonalna tabela"
    Napisz zapytanie, które wyświetli nazwę produktu i jego cenę. Użyj aliasów,
    aby kolumny w wyniku nazywały się odpowiednio: `Model` oraz `Cena (zł)`.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa AS &quot;Model&quot;, cena AS &quot;Cena (zł)&quot; FROM produkt;"></div>

    Trener porównuje **wartości** w wyniku, a nie nagłówki kolumn — alias
    sprawdź okiem na wyświetlonej tabelce.

??? success "Rozwiązanie 2"
    ```sql
    SELECT nazwa AS "Model", cena AS "Cena (zł)" FROM produkt;
    ```

!!! question "Ćwiczenie 3. Analiza struktury"
    Przejrzyj strukturę tabeli `kategoria`. Napisz zapytanie, które pobierze
    tylko nazwy kategorii.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT nazwa FROM kategoria;"></div>

??? success "Rozwiązanie 3"
    ```sql
    SELECT nazwa FROM kategoria;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Do czego służy symbol gwiazdki (*) w zapytaniu SELECT?",
    "opcje": [
      "Do mnożenia wartości w kolumnach liczbowych",
      "Do pobrania wszystkich kolumn z danej tabeli",
      "Do zaznaczenia tylko unikatowych rekordów",
      "Do wyszukiwania tekstów zawierających gwiazdkę"
    ],
    "poprawna": 1,
    "wyjasnienie": "SELECT * to skrócona forma, która mówi bazie danych: 'wyświetl mi wszystkie dostępne kolumny w tej tabeli'."
  },
  {
    "pytanie": "Która z poniższych instrukcji jest poprawnym sposobem nadania aliasu kolumnie?",
    "opcje": [
      "SELECT nazwa NAME produkt",
      "SELECT nazwa AS \"Nazwa Produktu\" FROM produkt",
      "RENAME nazwa TO \"Nazwa Produktu\"",
      "SELECT nazwa {alias: \"Nazwa Produktu\"} FROM produkt"
    ],
    "poprawna": 1,
    "wyjasnienie": "Słowo kluczowe AS służy do nadawania tymczasowych nazw kolumnom w wyniku zapytania. Jeśli nazwa zawiera spacje, musi być w cudzysłowie."
  },
  {
    "pytanie": "Dlaczego w dużych bazach danych unika się stosowania SELECT * ?",
    "opcje": [
      "Ponieważ powoduje to błędy w składni SQL",
      "Ponieważ baza danych automatycznie usuwa rekordy przy takim zapytaniu",
      "Ponieważ nadmiernie obciąża to serwer i sieć, przesyłając niepotrzebne dane",
      "Ponieważ gwiazdka działa tylko w tabelach z kluczem głównym"
    ],
    "poprawna": 2,
    "wyjasnienie": "Pobieranie wszystkich kolumn, gdy potrzebujemy tylko jednej lub dwóch, marnuje zasoby serwera i pasmo sieciowe, co spowalnia aplikację."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="select-podstawy"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
