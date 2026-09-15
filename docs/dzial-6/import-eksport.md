# Import i eksport danych
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VI**

Umiem pisać zapytania i tworzyć tabele, ale co zrobić, gdy muszę przenieść całą bazę na inny komputer? Albo gdy otrzymuję gotowy zestaw danych od klienta w pliku `.sql`? Do tego służą funkcje importu i eksportu. W środowisku phpMyAdmin są one zrealizowane za pomocą prostych zakładek, ale pod spodem kryje się proces generowania tzw. "zrzutu" (dump) bazy danych.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wykonywać pełny eksport bazy danych do pliku `.sql`
    2. importować strukturę i dane z pliku `.sql` do phpMyAdmina
    3. dobierać odpowiednie opcje eksportu dla różnych potrzeb (np. tylko dane lub tylko struktura)
    4. rozwiązywać problemy z importem dużych plików lub błędami kodowania

## 1. Eksport danych (zrzut bazy)

Eksport to proces zapisania całej bazy danych (lub jej części) do jednego pliku tekstowego. Ten plik zawiera zestaw instrukcji SQL (`CREATE TABLE`, `INSERT INTO`), które po uruchomieniu na innym serwerze odtworzą identyczną bazę.

**Jak wykonać eksport w phpMyAdmin:**
1. Wybierz bazę danych z listy po lewej stronie.
2. Kliknij zakładkę **Eksport** w górnym menu.
3. **Metoda eksportu:** 
   - *Szybka* — najczęstszy wybór; tworzy standardowy plik `.sql`.
   - *Niestandardowa* — pozwala wybrać konkretne tabele, zdecydować czy dodać instrukcje `DROP TABLE` (usuń tabelę przed utworzeniem) oraz wybrać format zapisu.
4. Kliknij przycisk **Eksportuj**.

**Kiedy stosujemy eksport?**
- Przed każdą większą zmianą w bazie (kopia zapasowa).
- Gdy chcemy przekazać bazę innemu programiście.
- Gdy przenosimy bazę z serwera lokalnego na serwer w internecie.

## 2. Import danych

Import to proces odczytania pliku `.sql` i wykonania zawartych w nim poleceń na serwerze.

**Jak wykonać import w phpMyAdmin:**
1. Jeśli baza jeszcze nie istnieje $\rightarrow$ utwórz ją (zakładka **Nowa**).
2. Wybierz docelową bazę z listy po lewej.
3. Kliknij zakładkę **Importuj**.
4. Kliknij **Wybierz plik** i wskaż plik `.sql` na dysku.
5. Sprawdź, czy kodowanie znaków to **UTF-8** (standard).
6. Kliknij przycisk **Importuj** (lub *Go*).

!!! warning "Najczęstszy błąd: Import do nieistniejącej bazy"
Jeśli plik `.sql` nie zawiera instrukcji `CREATE DATABASE`, a Ty nie wybrałeś żadnej bazy przed importem, phpMyAdmin zgłosi błąd. **Zawsze najpierw stwórz pustą bazę o właściwej nazwie, a potem w niej importuj.**

## 3. Co z tego jest na egzaminie

Import bazy danych to **pierwszy i najważniejszy krok** części praktycznej egzaminu INF.03.

**Scenariusz egzaminacyjny:**
Otrzymujesz plik `.sql` (np. `baza_obuwie.sql`). Twoim zadaniem jest:
1. Utworzyć bazę danych o nazwie wskazanej w poleceniu.
2. Zaimportować do niej plik `.sql`.
3. Sprawdzić, czy tabele pojawiły się na liście i czy zawierają dane.

Błąd na tym etapie uniemożliwia wykonanie reszty zadań (zapytań `SELECT`), dlatego warto przećwiczyć tę procedurę do automatyzmu.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Kopia zapasowa"
Wykonywanie kopii zapasowej to nawyk każdego administratora. Wyeksportuj całą swoją aktualną bazę danych do pliku o nazwie `backup_mojabaza.sql` za pomocą metody szybkiej.

??? success "Rozwiązanie 1"
    W phpMyAdmin: Wybierz bazę $\rightarrow$ Eksport $\rightarrow$ Metoda szybka $\rightarrow$ Eksportuj. Sprawdź, czy plik zapisał się na dysku i otwórz go w Notatniku, aby zobaczyć instrukcje SQL.

!!! question "Ćwiczenie 2. Czysta karta (Reimport)"
Wyobraź sobie, że podczas pracy przypadkowo usunąłeś ważne dane.
1. Usuń swoją bazę danych (operacja `DROP DATABASE`).
2. Utwórz ją ponownie z tą samą nazwą.
3. Zaimportuj plik `backup_mojabaza.sql` stworzony w poprzednim ćwiczeniu.

??? success "Rozwiązanie 2"
    W phpMyAdmin: Operacje $\rightarrow$ Usuń bazę $\rightarrow$ Nowa (nazwa) $\rightarrow$ Import $\rightarrow$ Wybierz plik $\rightarrow$ Importuj. Sprawdź, czy dane wróciły na miejsce.

!!! question "Ćwiczenie 3. Analiza zrzutu"
Otwórz plik `.sql` w dowolnym edytorze tekstu. Znajdź i wskaż:
1. Instrukcję, która tworzy strukturę tabeli.
2. Instrukcję, która wprowadza konkretne dane do wierszy.

??? success "Rozwiązanie 3"
    1. Instrukcja tworząca strukturę to `CREATE TABLE ... (...)`.
    2. Instrukcja wprowadzająca dane to `INSERT INTO ... VALUES (...)`.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym jest tzw. 'zrzut bazy danych' (SQL dump)?",
    "opcje": [
      "Skompresowanym plikiem binarnym nieczytelnym dla człowieka",
      "Plikiem tekstowym zawierającym zestaw instrukcji SQL do odtworzenia bazy",
      "Kopią zapasową, którą można przywrócić tylko za pomocą konsoli systemowej",
      "Listą wszystkich błędów w strukturze bazy"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zrzut bazy danych to plik tekstowy (.sql), który zawiera polecenia CREATE i INSERT, pozwalające na odtworzenie bazy na dowolnym serwerze obsługującym SQL."
  },
  {
    "pytanie": "Co należy zrobić w phpMyAdmin przed importem pliku .sql, jeśli plik nie zawiera polecenia tworzenia bazy?",
    "opcje": [
      "Zrestartować serwer MariaDB",
      "Zmienić kodowanie pliku na UTF-16",
      "Utworzyć nową, pustą bazę danych i wybrać ją z listy",
      "Zainstalować wtyczkę do obsługi plików .sql"
    ],
    "poprawna": 2,
    "wyjasnienie": "Importuje się dane DO konkretnej bazy. Jeśli nie wybrano bazy, phpMyAdmin nie wie, gdzie umieścić tabele z pliku."
  },
  {
    "pytanie": "Która opcja eksportu pozwala na wybranie tylko konkretnych tabel do zapisu?",
    "opcje": [
      "Szybka",
      "Niestandardowa",
      "Automatyczna",
      "Eksport binarny"
    ],
    "poprawna": 1,
    "wyjasnienie": "Metoda niestandardowa (Custom) daje pełną kontrolę nad tym, co trafia do pliku, w tym wybór konkretnych tabel lub wykluczenie niektórych z nich."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="import-eksport"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
