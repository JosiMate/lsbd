---
hide:
  - navigation
  - toc
---

# Biblioteka szkolna — karta pracy działu V

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

!!! abstract "O tym temacie"

    **2 godziny lekcyjne** · praca obowiązkowa · cały dział V w jednym zadaniu

    Biblioteka szkolna przechodzi z zeszytu na komputer. Zbudujesz jej bazę
    od pustej kartki: tabele, klucze główne, klucze obce, zmiany w gotowych
    tabelach i skrypt, który stawia całą bazę od zera. Na końcu naprawisz
    cudzy skrypt, który nie chce się wykonać — tak jak na egzaminie, gdy
    phpMyAdmin pokazuje „errno: 150”.

    **Karta pracy i trener SQL są obok siebie** — nie trzeba przewijać strony
    między poleceniem a miejscem na zapytanie. Wyniki zapisujesz w karcie, to ona
    jest oceniana.

    ??? abstract "Plan dwóch lekcji"

        | Lekcja | Zadania | Co ma być w karcie na koniec lekcji |
        | :---: | --- | --- |
        | 1 | 1–6: gotowy skrypt, `CREATE TABLE`, `ALTER TABLE`, klucz obcy | zadania 1–6 |
        | 2 | 7–9: skrypt od zera, wypożyczenia z `ON DELETE`, skrypt z błędami, phpMyAdmin | zadania 7–9 i samoocena |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz. Odpowiedzi rozwiń dopiero wtedy,
    gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Tabela `ksiazka` ma klucz obcy do `autor`. W jakiej kolejności je utworzysz, a w jakiej usuniesz?
    2. **Sprzed kilku tygodni.** Kiedy zamiast `JOIN` piszesz `LEFT JOIN`?
    3. **Z dawniejszych tematów.** Dlaczego numer telefonu przechowuje się jako tekst, a nie jako liczbę?

    ??? success "Odpowiedzi"

        1. Tworzysz `autor`, potem `ksiazka`. Usuwasz odwrotnie: `ksiazka`, potem `autor` — tabeli, na którą wskazuje klucz obcy, nie da się usunąć pierwszej.
        2. Gdy w wyniku mają zostać także wiersze **bez pary** w drugiej tabeli, np. klienci bez zamówień.
        3. Z numerem nikt nie liczy, a zapis liczbowy zgubiłby zero na początku i plus przed numerem kierunkowym. Liczba służy do liczenia, nie do identyfikowania.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tych dwóch lekcjach:

    1. Odczytam gotowy skrypt `CREATE TABLE`: wskażę kolumny, ich typy i klucz główny.
    2. Utworzę tabelę z kluczem głównym `AUTO_INCREMENT`, dobiorę typy kolumn i `NOT NULL`.
    3. Dodam, zmienię i usunę kolumnę oraz ograniczenie poleceniem `ALTER TABLE`.
    4. Zadeklaruję klucz obcy i pokażę, że baza odrzuca wiersz bez rodzica.
    5. Napiszę skrypt, który buduje bazę od zera i da się go uruchomić dwa razy pod rząd.
    6. Dobiorę zachowanie klucza obcego przy usuwaniu (`CASCADE`, `RESTRICT`) i uzasadnię wybór.
    7. Znajdę i usunę przyczynę błędu „errno: 150” przy zakładaniu klucza obcego.

!!! note "Jak pracujesz na tej stronie"

    - **Po lewej karta, po prawej trener SQL.** Trener zostaje na ekranie, gdy
      przewijasz kartę. Kliknięcie w pole karty przełącza trener na to samo zadanie.
    - **Piszesz w składni MariaDB** — tak jak w phpMyAdminie na egzaminie
      (`INT UNSIGNED`, `AUTO_INCREMENT`, `ALTER TABLE … MODIFY`). Trener tłumaczy
      ją na swój silnik i pokazuje błędy z takim numerem, jaki zgłosiłaby MariaDB.
    - **Baza zostaje w tej przeglądarce.** Tabele z pierwszej lekcji będą czekać
      na drugiej — o ile siedzisz przy tym samym komputerze. Przy innym uruchom
      ponownie swoje polecenia z karty (od tego jest zadanie 7).
    - **Sprawdź zadanie** porównuje Twoją bazę z poleceniem. Wynik (np. „7 z 7”)
      wpisujesz do karty. **Podpowiedź** odsłania po jednej wskazówce.
    - **Struktura bazy** pokazuje tabele tak jak `DESCRIBE` w MariaDB — z kluczami
      i nazwami kluczy obcych.

## Projekt bazy

Stan docelowy — po zadaniu 8. Ten sam opis pokazuje w trenerze przycisk **Projekt bazy**.

```text
autor        (id_autora PK, imie, nazwisko)
czytelnik    (id_czytelnika PK, imie, nazwisko, email)
ksiazka      (id_ksiazki PK, tytul, isbn UNIQUE, rok_wydania, id_autora FK → autor)
wypozyczenie (id_wypozyczenia PK, id_czytelnika FK → czytelnik, id_ksiazki FK → ksiazka,
              data_wypozyczenia, data_zwrotu)

autor 1 ──< ksiazka 1 ──< wypozyczenie >── 1 czytelnik
```

??? warning "Najczęstsze błędy w tym temacie — zajrzyj, gdy trener pokaże błąd"

    | Komunikat | Przyczyna | Co zrobić |
    | --- | --- | --- |
    | `#1064 … near ')'` | przecinek po ostatniej kolumnie przed nawiasem | usuń ostatni przecinek |
    | `#1064` przy `VARCHAR` | brak długości: `VARCHAR` zamiast `VARCHAR(40)` | dopisz długość w nawiasie |
    | `#1075 Incorrect table definition` | `AUTO_INCREMENT` przy kolumnie, która nie jest kluczem | dopisz `PRIMARY KEY` |
    | `#1050 Table … already exists` | tabela już powstała przy poprzednim uruchomieniu | `DROP TABLE` albo `DROP TABLE IF EXISTS` na początku skryptu |
    | `#1005 … errno: 150` | tabela nadrzędna jeszcze nie istnieje, różne typy kolumn (`INT` i `INT UNSIGNED`) albo klucz wskazuje kolumnę bez indeksu | sprawdź kolejność, typy i to, na co wskazuje `REFERENCES` |
    | `#1217` przy `DROP TABLE` | na tabelę wskazuje klucz obcy innej tabeli | usuwaj najpierw tabele podrzędne |
    | `#1452 Cannot add or update a child row` | wiersz wskazuje na nieistniejący wiersz tabeli nadrzędnej | to znaczy, że klucz obcy **działa** |
    | kolumna przestała być obowiązkowa | `MODIFY` bez `NOT NULL` — zastępuje całą definicję kolumny | w `MODIFY` powtórz wszystkie ograniczenia |

## Karta pracy i trener SQL { #stanowisko }

To jest **praca obowiązkowa**. Wypełnij kartę w trakcie obu lekcji, pobierz
gotowy dokument Worda i oddaj go przez **Zadania domowe w Dzienniku VULCAN**
(albo kliknij **Wyślij do nauczyciela**, jeśli przycisk jest pod kartą).
Termin: **najbliższa lekcja po drugiej lekcji tego tematu**; zasady terminu
dodatkowego opisuje strona [wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).
Ocena wynika z tego, **dokąd doszedłeś samodzielnie** — na ocenę wyższą muszą
być zrobione także zadania niższych poziomów. Na koniec pierwszej lekcji kliknij
pod kartą **Zapisz** → **Zapisz (JSON)**, jeśli następną lekcję spędzisz przy innym komputerze.

<div class="stanowisko">
<div class="stanowisko__karta">
<div class="karta-pracy" data-karta="biblioteka-praktyka"></div>
</div>
<div class="stanowisko__trener">
<div class="sql-trener" data-baza="pusta" data-dialekt="mariadb" data-pamiec="lsbd-biblioteka" data-zadania="dzial-5"></div>
</div>
</div>

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Skrypt tworzy najpierw tabelę ksiazka z kluczem obcym do autor, a dopiero potem tabelę autor. Co zgłosi MariaDB?",
    "opcje": [
      "Nic — kolejność tabel w skrypcie nie ma znaczenia",
      "Ostrzeżenie, ale obie tabele powstaną",
      "Błąd #1005 (errno: 150) przy tworzeniu tabeli ksiazka",
      "Błąd #1050, bo tabela autor już istnieje"
    ],
    "poprawna": 2,
    "wyjasnienie": "Klucz obcy może wskazywać tylko na tabelę, która już istnieje. Najpierw tabele nadrzędne, potem podrzędne."
  },
  {
    "pytanie": "W tabeli autor klucz to id_autora INT UNSIGNED. Który zapis kolumny w tabeli ksiazka pozwoli założyć klucz obcy?",
    "opcje": [
      "id_autora INT UNSIGNED NOT NULL",
      "id_autora INT NOT NULL",
      "id_autora BIGINT UNSIGNED NOT NULL",
      "id_autora VARCHAR(10) NOT NULL"
    ],
    "poprawna": 0,
    "wyjasnienie": "Przy liczbach całkowitych typ i znak muszą być identyczne. INT i INT UNSIGNED to dla MariaDB różne typy — skończy się na errno: 150."
  },
  {
    "pytanie": "Jak zapiszesz numer ISBN-13 (13 cyfr bez kresek)?",
    "opcje": [
      "BIGINT",
      "INT UNSIGNED",
      "DECIMAL(13,0)",
      "CHAR(13)"
    ],
    "poprawna": 3,
    "wyjasnienie": "ISBN to identyfikator o stałej długości, a nie liczba do liczenia — tak jak PESEL czy numer telefonu."
  },
  {
    "pytanie": "Kolumna tytul ma definicję VARCHAR(100) NOT NULL. Co zrobi polecenie ALTER TABLE ksiazka MODIFY tytul VARCHAR(150);?",
    "opcje": [
      "Wydłuży kolumnę i zostawi NOT NULL",
      "Wydłuży kolumnę, ale tytuł przestanie być obowiązkowy",
      "Zgłosi błąd, bo brakuje NOT NULL",
      "Usunie dane z kolumny tytul"
    ],
    "poprawna": 1,
    "wyjasnienie": "MODIFY zastępuje całą definicję kolumny. Czego nie powtórzysz, tego nie będzie — także NOT NULL."
  },
  {
    "pytanie": "Którym poleceniem dodasz kolumnę telefon do istniejącej tabeli czytelnik?",
    "opcje": [
      "CREATE TABLE czytelnik (telefon VARCHAR(15));",
      "ALTER TABLE czytelnik ADD telefon VARCHAR(15);",
      "UPDATE czytelnik ADD telefon VARCHAR(15);",
      "INSERT INTO czytelnik (telefon) VALUES (VARCHAR(15));"
    ],
    "poprawna": 1,
    "wyjasnienie": "Strukturę istniejącej tabeli zmienia ALTER TABLE. UPDATE i INSERT zmieniają dane, nie strukturę."
  },
  {
    "pytanie": "Klucz obcy wypozyczenie.id_czytelnika ma ON DELETE CASCADE. Co się stanie po usunięciu czytelnika?",
    "opcje": [
      "Baza odmówi usunięcia czytelnika",
      "W jego wypożyczeniach id_czytelnika zmieni się na NULL",
      "Jego wypożyczenia zostaną usunięte razem z nim",
      "Wypożyczenia zostaną bez zmian i będą wskazywać na nieistniejącego czytelnika"
    ],
    "poprawna": 2,
    "wyjasnienie": "CASCADE przenosi usunięcie na wiersze podrzędne. Odmowa to RESTRICT, a NULL — SET NULL."
  },
  {
    "pytanie": "Skrypt zaczyna się od DROP TABLE IF EXISTS. Po co?",
    "opcje": [
      "Żeby skrypt dało się uruchomić ponownie bez błędu „Table already exists”",
      "Żeby baza działała szybciej",
      "Żeby tabele powstały w kolejności alfabetycznej",
      "Żeby zachować dane z poprzedniego uruchomienia"
    ],
    "poprawna": 0,
    "wyjasnienie": "IF EXISTS nie zgłasza błędu, gdy tabeli nie ma, więc skrypt działa na pustej bazie i na bazie z poprzedniego uruchomienia. Dane przy tym znikają."
  },
  {
    "pytanie": "W jakiej kolejności skrypt usunie tabele autor, ksiazka i wypozyczenie?",
    "opcje": [
      "autor, ksiazka, wypozyczenie",
      "ksiazka, autor, wypozyczenie",
      "w dowolnej — DROP TABLE nie sprawdza kluczy obcych",
      "wypozyczenie, ksiazka, autor"
    ],
    "poprawna": 3,
    "wyjasnienie": "Usuwa się w kolejności odwrotnej do tworzenia: najpierw tabela, na którą nikt nie wskazuje. Inaczej MariaDB zgłosi #1217."
  }
]
</script>
</div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03). Zadania i sprawdzenia trenera przetestowane na rozwiązaniach wzorcowych — listopad 2026.*
