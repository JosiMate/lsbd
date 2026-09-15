# Spójność bazy i diagnostyka
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VII**

Ostatnia lekcja w tym dziale poświęcona jest temu, jak sprawdzić, czy nasza baza danych jest „zdrowa”. Baza danych, w której brakuje powiązań, pojawiają się duplikaty, a zapytania trwają wieczność, jest bezużyteczna, nawet jeśli technicznie „działa”. Jako administrator musisz potrafić zdiagnozować problem i zadbać o spójność danych.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić pojęcie spójności danych i roli więzów integralności
    2. korzystać z narzędzi diagnostycznych serwera (np. `SHOW PROCESSLIST`)
    3. identyfikować i naprawiać najczęstsze przyczyny spowolnienia bazy
    4. interpretować podstawowe komunikaty błędów MariaDB/MySQL

## 1. Spójność danych i więzy integralności

Spójność (consistency) oznacza, że dane w bazie są logicznie poprawne. Najważniejszym narzędziem dbającym o spójność są **więzy integralności (Constraints)**.

**Kluczowe mechanizmy:**
- **Klucz główny (Primary Key):** Gwarantuje, że każdy rekord jest unikatowy. Nie może być dwóch produktów o tym samym ID.
- **Klucz obcy (Foreign Key):** Gwarantuje, że powiązania między tabelami są prawdziwe. Nie można dodać produktu do kategorii, która nie istnieje.
- **NOT NULL:** Gwarantuje, że krytyczne informacje (np. cena produktu) zawsze zostaną wpisane.

**Co się dzieje, gdy więzy zostaną naruszone?**
Baza danych wyrzuci błąd i **zablokuje operację**. To jest pożądane zachowanie — lepiej, żeby program zgłosił błąd, niż żeby w bazie pojawiły się „sieroce rekordy” (np. zamówienie bez klienta).

## 2. Diagnostyka: Co się dzieje z moją bazą?

Czasami baza zaczyna działać wolno lub przestaje odpowiadać. Administrator nie zgaduje, lecz sprawdza fakty.

**Narzędzie 1: SHOW PROCESSLIST**
To polecenie pokazuje wszystkie aktualnie wykonywane zapytania na serwerze.

```sql
SHOW PROCESSLIST;
```
**Na co patrzeć w wynikach?**
- **Time:** Jeśli zapytanie wisi od 300 sekund, prawdopodobnie jest błędnie napisane lub blokuje inne zapytania.
- **State:** Statusy takie jak `Locked` oznaczają, że jedno zapytanie czeka, aż inne zwolni tabelę.
- **Info:** Treść zapytania. Możemy sprawdzić, kto i co aktualnie „męczy” serwer.

**Narzędzie 2: Analiza zapytania (EXPLAIN)**
Jeśli pojedyncze zapytanie działa zbyt wolko, dopisz przed nim słowo `EXPLAIN`.

```sql
EXPLAIN SELECT * FROM produkt WHERE nazwa = 'Nike';
```
Baza nie wykona zapytania, ale powie Ci, **jak zamierza to zrobić**. Jeśli w kolumnie `type` widzisz `ALL`, oznacza to „Full Table Scan” — baza musi przeczytać każdy wiersz z dysku, co przy milionach rekordów trwa wieki. Rozwiązaniem jest wtedy dodanie **indeksu**.

## 3. Typowe problemy i rozwiązania

| Objaw | Przyczyna | Rozwiązanie |
| :--- | :--- | :--- |
| Błąd `Foreign key constraint fails` | Próba dodania rekordu z nieistniejącym ID rodzica lub usunięcia rodzica, który ma dzieci | Najpierw dodaj rodzica, lub usuń dzieci przed usunięciem rodzica |
| Zapytania trwają zbyt długo | Brak indeksów na kolumnach używanych w `WHERE` | Dodaj indeks: `CREATE INDEX idx_nazwa ON produkt(nazwa)` |
| Baza jest „zamrożona” (`Locked`) | Długo trwająca operacja `UPDATE` lub `DELETE` na dużej tabeli | Zoptymalizuj zapytanie lub podziel operację na mniejsze partie |
| Błąd `Duplicate entry` | Próba wstawienia tej samej wartości do kolumny z kluczem głównym | Sprawdź, czy rekord już nie istnieje, lub użyj `AUTO_INCREMENT` |

## 4. Co z tego jest na egzaminie

Diagnostyka pojawia się głównie w pytaniach teoretycznych oraz w zadaniach, gdzie musisz naprawić błąd w zapytaniu, który powoduje naruszenie spójności.

**Pamiętaj:** Na egzaminie najczęstszym błędem związanym ze spójnością jest próba usunięcia danych z tabeli „rodzica” (np. Kategorii), podczas gdy w tabeli „dziecka” (np. Produktów) istnieją rekordy z tym ID.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Detektyw bazy danych"
Uruchom polecenie `SHOW PROCESSLIST`. Jeśli nie widzisz żadnych długo działających zapytań, spróbuj w nowej karcie phpMyAdmin otworzyć bardzo dużą tabelę lub wykonać skomplikowane zapytanie i szybko wróć do `SHOW PROCESSLIST`. Opisz, co widzisz w kolumnach `Time` i `State`.

??? success "Rozwiązanie 1"
    W kolumnie `Time` widzimy liczbę sekund, od których trwa operacja. W `State` widzimy status (np. `Sending data` — serwer wysyła wyniki do przeglądarki). Pozwala to nam namierzyć zapytania, które „zawieszają” system.

!!! question "Ćwiczenie 2. Walka ze spójnością"
Spróbuj usunąć z tabeli `kategoria` kategorię, która posiada przypisane produkty. Zobacz komunikat błędu. Wyjaśnij, dlaczego baza nie pozwoliła na tę operację.

??? success "Rozwiązanie 2"
    Baza wyrzuca błąd `Foreign key constraint fails`. Dzieje się tak, ponieważ w tabeli `produkt` istnieją wiersze, których `id_kategorii` wskazuje na usuwaną kategorię. Gdyby baza pozwoliła na usunięcie, produkty zostałyby przypisane do nieistniejącej kategorii (powstałyby tzw. sieroce rekordy), co naruszyłoby spójność bazy.

!!! question "Ćwiczenie 3. Analiza wydajności"
Wybierz dowolne zapytanie `SELECT` z warunkiem `WHERE` i wykonaj je z przedrostkiem `EXPLAIN`. Sprawdź wartość w kolumnie `type`. Jeśli widzisz `ALL`, zastanów się, jak można przyspieszyć to zapytanie.

??? success "Rozwiązanie 3"
    `type: ALL` oznacza skanowanie całej tabeli. Aby to przyspieszyć, należy dodać indeks na kolumnę używaną w warunku `WHERE`. Dzięki indeksowi baza działa jak z indeksem w książce — od razu przechodzi do właściwej strony, zamiast czytać całą książkę od początku.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co oznacza status 'Locked' w wynikach polecenia SHOW PROCESSLIST?",
    "opcje": [
      "Baza danych została trwale zablokowana i wymaga restartu",
      "Zapytanie czeka, aż inny proces zwolni dostęp do tabeli",
      "Użytkownik nie ma uprawnień do wykonania zapytania",
      "Serwer bazy danych przeszedł w tryb tylko do odczytu"
    ],
    "poprawna": 1,
    "wyjasnienie": "Blokowanie (locking) występuje, gdy dwa procesy próbują modyfikować te same dane w tym samym czasie. MariaDB kolejkuje zapytania, by zapobiec konfliktom."
  },
  {
    "pytanie": "Jaki jest główny cel stosowania kluczy obcych (Foreign Keys)?",
    "opcje": [
      "Szyfrowanie danych w tabelach",
      "Zwiększenie prędkości wyszukiwania danych",
      "Zapewnienie spójności relacji między tabelami",
      "Automatyczne tworzenie kopii zapasowych"
    ],
    "poprawna": 2,
    "wyjasnienie": "Klucze obce gwarantują, że powiązania między tabelami są poprawne i zapobiegają powstawaniu rekordów bez właścicieli (sierocych)."
  },
  {
    "pytanie": "Do czego służy polecenie EXPLAIN przed zapytaniem SELECT?",
    "opcje": [
      "Do automatycznej naprawy błędów w zapytaniu",
      "Do wyświetlenia wyników zapytania w formie graficznej",
      "Do analizy planu wykonania zapytania przez serwer i optymalizacji wydajności",
      "Do wyjaśnienia znaczenia poszczególnych kolumn w tabeli"
    ],
    "poprawna": 2,
    "wyjasnienie": "EXPLAIN pokazuje, jak serwer planuje odnaleźć dane (np. czy użyje indeksu, czy przeszuka całą tabelę), co pozwala administratorowi zoptymalizować wolno działające zapytania."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="diagnostics"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
