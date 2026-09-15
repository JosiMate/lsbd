# Encje, atrybuty, klucze — pojęcia, które trzeba nazywać poprawnie
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

W relacyjnych bazach danych poprawne nazewnictwo to podstawa komunikacji z innymi specjalistami oraz gwarancja zrozumienia pytań na egzaminie zawodowym INF.03. W tym rozdziale omówimy kluczowe pojęcia, które pozwalają przekształcić obiekty ze świata rzeczywistego w struktury zrozumiałe dla systemu bazodanowego.

Opanowanie terminów takich jak encja, atrybut, klucz główny czy obcy jest absolutnie konieczne nie tylko do rozwiązywania części pisemnej egzaminu, ale także do prawidłowego projektowania relacyjnych baz danych w praktyce.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. Wyjaśnić różnicę między encją a atrybutem oraz podać ich przykłady.
    2. Wskazać rolę i cechy klucza głównego w tabeli.
    3. Zdefiniować mechanizm klucza obcego i jego wpływ na integralność relacyjną.
    4. Rozróżniać, czym jest wartość `NULL` i kiedy należy jej używać.
    5. Rozwiązywać typowe zadania egzaminacyjne INF.03 związane z budową relacyjnej bazy danych.

## 1. Czym jest encja

**Encja** to wyodrębniony obiekt świata rzeczywistego (rzecz, osoba, zdarzenie, pojęcie), o którym informacje chcemy przechowywać w bazie danych. Na etapie projektowania mówimy o encjach, natomiast w fizycznej relacyjnej bazie danych encja zostaje odwzorowana jako **tabela**.

Przykłady encji dla systemu sklepu:
* produkt
* kategoria
* klient
* zamówienie

W praktyce bazy danych nazwy encji (tabel) przyjmują zazwyczaj formę rzeczownika w liczbie pojedynczej (np. `produkt`, `klient`) – taka konwencja sprawia, że kod SQL jest bardzo czytelny. Niektórzy programiści preferują jednak liczbę mnogą (`produkty`, `klienci`). Egzamin INF.03 dopuszcza oba te standardy, choć ważniejsze jest zachowanie spójności w całym projekcie bazy.

## 2. Atrybuty — właściwości encji

Jeśli encja to obiekt, to **atrybut** to pojedyncza właściwość tego obiektu. W tabeli bazy danych atrybut jest odzwierciedlany jako **kolumna**.

Każdy atrybut posiada swoją nazwę (najlepiej pisemną małymi literami, bez polskich znaków i spacji) oraz typ danych (np. tekst, liczba całkowita, data). Dobrą praktyką projektową jest dbanie o to, by atrybuty były **atomowe**, czyli niepodzielne (np. zamiast jednego atrybutu "imie_i_nazwisko" używamy dwóch: "imie", "nazwisko").

Przyjrzyjmy się tabeli `produkt` w naszej przykładowej bazie `obuwie`:
* `nazwa` — przechowuje nazwę buta (np. typu VARCHAR),
* `cena` — to wartość liczbowa (np. typu DECIMAL lub FLOAT),
* `kolor` — określa barwę buta (np. VARCHAR),
* `wysokosc` — informacja o wysokości buta,
* `id_kategorii` — atrybut przechowujący identyfikator kategorii, do której należy produkt.

## 3. Klucz główny (PRIMARY KEY)

**Klucz główny** (ang. Primary Key, w skrócie PK) to wybrany atrybut (lub grupa atrybutów), który jednoznacznie, bez pomyłek i duplikatów, identyfikuje każdy wiersz w tabeli.

Cechy klucza głównego:
* **Musi być unikatowy** (UNIQUE) – nie mogą istnieć dwa rekordy z taką samą wartością klucza głównego.
* **Nie może być pusty** (NOT NULL) – każdy wiersz musi mieć podany klucz główny.

Zazwyczaj klucz główny jest polem numerycznym z ustawioną właściwością **autoinkrementacji** (np. `AUTO_INCREMENT` w MariaDB/MySQL). Baza danych sama dba o nadawanie kolejnych numerów: 1, 2, 3...
Większość tabel ma klucz główny nazwany po prostu `id` lub `id_tabeli` (np. `id_produktu`). W tabeli `produkt` bazy `obuwie` takim atrybutem jest `id_produktu`.

### Klucze złożone
Czasami zdarza się, że jeden atrybut nie jest w stanie jednoznacznie zidentyfikować wiersza. Wtedy tworzymy **klucz złożony**, który składa się z dwóch lub więcej kolumn. 
*   **Przykład:** W tabeli `pozycja_zamowienia` kluczem głównym może być para `(id_zamowienia, id_produktu)`. Żaden z tych elementów z osobna nie jest unikatowy, ale ich kombinacja już tak – w jednym zamówieniu dany produkt może pojawić się tylko raz.

### Klucz naturalny a zastępczy
W projektowaniu wyróżniamy dwa podejścia do wyboru klucza głównego:
1.  **Klucz naturalny** — atrybut, który z natury jest unikatowy (np. PESEL, numer VIN samochodu, kod ISBN książki).
2.  **Klucz zastępczy (surogat)** — sztucznie stworzony identyfikator (zazwyczaj numeryczny `id` z autoinkrementacją), który nie ma żadnego znaczenia w świecie rzeczywistym, a służy tylko do technicznego powiązania tabel.

!!! tip "Dlaczego używamy kluczy zastępczych?"
    W praktyce prawie zawsze wybieramy klucze zastępcze (`id`), ponieważ:
    - Są mniejsze i szybsze w indeksowaniu przez SZBD niż długie teksty.
    - Są niezmienne. Jeśli klient zmieni numer telefonu, a numer ten byłby kluczem głównym, musielibyśmy aktualizować go we wszystkich tabelach z kluczem obcym.
    - Nie zawierają danych wrażliwych (np. nie eksponujemy PESEL-u w adresach URL aplikacji).

## 4. Klucz obcy (FOREIGN KEY)

Aby bazy danych nie składały się z izolowanych wysp, tworzymy między nimi relacje. **Klucz obcy** (ang. Foreign Key, w skrócie FK) to kolumna, której zadaniem jest odwoływanie się do klucza głównego znajdującego się w innej tabeli. 

Dzięki kluczom obcym budujemy logiczne połączenia. Na przykład, w tabeli `produkt` (w bazie `obuwie`) atrybut `id_kategorii` pełni rolę klucza obcego. Jego wartość wskazuje na konkretną kategorię w tabeli `kategoria` (gdzie `id_kategorii` jest kluczem głównym).

!!! warning "Ochrona integralności relacyjnej"
    System Zarządzania Bazą Danych (SZBD), taki jak MariaDB, dzięki kluczom obcym dba o spójność danych. Nie pozwoli np. usunąć kategorii z tabeli `kategoria`, jeśli przypisano do niej buty w tabeli `produkt`. Tak samo nie pozwoli dodać buta z nieistniejącym numerem `id_kategorii`.

!!! tip "Co zrobić z danymi po usunięciu rodzica?"
    W zaawansowanych projektach możemy zdefiniować reguły usuwania (np. `ON DELETE CASCADE`). Jeśli usuniemy kategorię "Buty biegowe", system automatycznie usunie wszystkie produkty przypisane do tej kategorii. Inna opcja to `SET NULL`, która sprawi, że produkty zostaną w bazie, ale ich pole `id_kategorii` stanie się puste.

## 5. NULL — brak wartości

Wartość **NULL** to w bazach danych specjalny znacznik, który oznacza "brak wartości", "wartość nieznana" lub "wartość w tym przypadku nie ma zastosowania".

Bardzo ważna uwaga egzaminacyjna: **NULL to nie jest to samo co zero (0) ani pusty ciąg znaków ("")!** 
Zero to konkretna wartość liczbowa (np. ktoś ma 0 zł na koncie), a NULL oznacza, że po prostu nie wiemy, ile ktoś ma pieniędzy, lub jeszcze tego nie sprawdziliśmy. Z tego powodu operacje logiczne z NULL działają nieco inaczej – zapytanie `NULL = NULL` nigdy nie zwróci prawdy (wynikiem jest również wartość nieznana), używamy wtedy składni `IS NULL`.

Większość atrybutów definiujemy z ograniczeniem `NOT NULL` (wymagamy ich podania, np. nazwa produktu), ale jeśli niektóre informacje są opcjonalne (np. dodatkowy opis produktu), pozwalamy atrybutowi przyjmować wartość `NULL`.

## 6. Dobre praktyki nazewnictwa

Aby baza była czytelna dla każdego informatyka, stosuje się żelazne zasady nazywania obiektów:

1.  **Małe litery i brak spacji** — zamiast `Imię Klienta` używamy `imie_klienta` (tzw. snake_case).
2.  **Brak polskich znaków** — zamiast `id_kategorii` nie piszemy `id_kategorii` z "ó" czy "ą". To zapobiega błędom kodowania znaków w różnych systemach.
3.  **Rzeczowniki w liczbie pojedynczej** — tabele nazywamy `produkt`, `klient`, a nie `produkty`, `klienci`. Dzięki temu zapytania SQL brzmią naturalniej: `SELECT nazwa FROM produkt WHERE id = 1`.
4.  **Jednolity schemat kluczy** — jeśli w jednej tabeli klucz główny nazywa się `id_produktu`, nie nazywaj go w drugiej tabeli `produkt_id`. Wybierz jeden standard i trzymaj się go w całej bazie.

## 7. Co z tego jest na egzaminie

Pojęcia omówione w tym rozdziale pojawiają się nagminnie na egzaminie teoretycznym INF.03:
* Należy umieć rozpoznać w diagramie ERD lub schemacie bazy klucz główny i klucze obce.
* Często padają pytania o to, jakie warunki musi spełniać klucz główny (unikalność, NOT NULL).
* Zdarzają się zadania polegające na wskazaniu relacji na podstawie instrukcji `FOREIGN KEY`.
* Testowana jest definicja "encji" i świadomość, że encja przekłada się na "tabelę" relacyjną.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Odkrywamy strukturę tabeli produkt"

    Otwórz bazę `obuwie` w phpMyAdminie. Przejdź do zakładki "Struktura" dla tabeli `produkt`. 
    
    **Zapisujesz:** 
    1. Wypisz nazwy wszystkich atrybutów wraz z ich dokładnymi typami (np. VARCHAR(50)).
    2. Który z tych atrybutów jest kluczem głównym, a który kluczem obcym?

??? success "Wskazówka do rozwiązania 1"

    Klucz główny zazwyczaj ma obok złotą ikonę kluczyka (PK), a klucz obcy srebrną. Zwróć uwagę na kolumnę z opisem typu dla każdego atrybutu.

!!! question "Ćwiczenie 2. Projektujemy klienta sklepu"

    Zaprojektuj nową encję `klient` dla naszego sklepu z obuwiem. 
    
    **Zapisujesz:** 
    1. Wymyśl 5-6 atrybutów dla tej encji (np. imię, nazwisko, miasto itp.).
    2. Wskaż, co mogłoby być dla niej kluczem głównym.
    3. Krótko uzasadnij wybór typów danych oraz wskaż, które z Twoich atrybutów mogłyby przyjmować wartość NULL (i dlaczego), a które stanowczo nie.

??? success "Wskazówka do rozwiązania 2"

    Zastanów się, czy pole `numer_telefonu` musi być zawsze podawane przez klienta (może dopuszczać NULL). Jako klucz główny najprościej przyjąć pole numeryczne `id_klienta`.

!!! question "Ćwiczenie 3. Refaktoryzacja bazy — osobna encja dla kolorów"

    W tabeli `produkt` znajduje się kolumna `kolor`, która obecnie przechowuje po prostu tekst z nazwą koloru (np. "czerwony", "czarny"). Pomyśl, jak wyglądałaby struktura, gdybyśmy wydzielili kolory do osobnej tabeli (podobnie jak wydzielone są kategorie w tabeli `kategoria`).
    
    **Zapisujesz:** 
    1. Narysuj/zapisz (wymień kolumny) obu tabel przed zmianą.
    2. Narysuj/zapisz (wymień kolumny) tabel nowej struktury: `produkt` i `kolor`.
    3. Wskaż, jaki nowy klucz obcy pojawi się w tej strukturze.
    4. Wyjaśnij w 1-2 zdaniach, co zyskujesz na takiej zmianie z punktu widzenia projektanta bazy (dlaczego tak jest lepiej?).

??? success "Wskazówka do rozwiązania 3"

    Dzięki wydzieleniu tabeli unikamy pomyłek, takich jak np. wpisywanie "czarny", "Czarny", "czorne" przez różnych użytkowników. Nowy klucz obcy to np. `id_koloru` w tabeli `produkt`.

!!! question "Ćwiczenie 4. Klucz złożony w praktyce"
    Wyobraź sobie tabelę `wyniki_egzaminu`, która przechowuje oceny uczniów z różnych przedmiotów. Tabela ma kolumny: `id_ucznia`, `id_przedmiotu`, `ocena` oraz `data_egzaminu`.
    
    **Zapisujesz:** 
    1. Wyjaśnij, dlaczego żaden z pojedynczych atrybutów (`id_ucznia` lub `id_przedmiotu`) nie może być samodzielnym kluczem głównym.
    2. Zaproponuj odpowiedni klucz główny dla tej tabeli.
    3. Wskaż, które z tych kolumn są kluczami obcymi i do jakich tabel powinny prowadzić.

??? success "Wskazówka do rozwiązania 4"
    Jeden uczeń ma wiele ocen (z różnych przedmiotów), a jeden przedmiot ma wiele ocen (od różnych uczniów). Dopiero para `(id_ucznia, id_przedmiotu)` jednoznacznie identyfikuje konkretną ocenę.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym w kontekście relacyjnych baz danych jest zazwyczaj encja?",
    "opcje": [
      "Tabelą",
      "Pojedynczym wierszem w tabeli",
      "Pojedynczą kolumną w tabeli",
      "Rodzajem ograniczenia integralności"
    ],
    "poprawna": 0,
    "wyjasnienie": "Na etapie projektowania mówimy o encjach (obiektach), natomiast fizycznie w relacyjnej bazie danych encja odwzorowywana jest najczęściej jako tabela."
  },
  {
    "pytanie": "Atrybut encji w fizycznej bazie danych odpowiada:",
    "opcje": [
      "Relacji",
      "Kolumnie w tabeli",
      "Wierszowi w tabeli",
      "Zapytaniu SQL"
    ],
    "poprawna": 1,
    "wyjasnienie": "Atrybuty to cechy encji, które w tabeli są reprezentowane przez kolumny."
  },
  {
    "pytanie": "Jakie dwa podstawowe warunki musi bezwzględnie spełniać klucz główny (PRIMARY KEY)?",
    "opcje": [
      "Musi być tekstem (VARCHAR) i nie może być pusty",
      "Musi się automatycznie powiększać (AUTO_INCREMENT) i dopuszczać puste wartości",
      "Musi być unikalny i nie może przyjmować wartości NULL",
      "Musi występować w każdej innej tabeli w bazie danych"
    ],
    "poprawna": 2,
    "wyjasnienie": "Klucz główny musi jednoznacznie identyfikować rekord, więc nie może się powtarzać (UNIQUE) ani być pusty (NOT NULL)."
  },
  {
    "pytanie": "Do czego służy klucz obcy (FOREIGN KEY) w relacyjnych bazach danych?",
    "opcje": [
      "Do zabezpieczania haseł użytkowników",
      "Do odwoływania się do klucza głównego innej tabeli i tworzenia relacji",
      "Do przyspieszania wykonywania wszystkich zapytań wyszukujących teksty",
      "Do automatycznego usuwania starych danych z bazy"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zadaniem klucza obcego jest budowanie relacji pomiędzy tabelami – np. przypisanie produktu do odpowiedniej kategorii z innej tabeli."
  },
  {
    "pytanie": "Co to jest klucz zastępczy (surogat) i dlaczego jest preferowany nad kluczem naturalnym?",
    "opcje": [
      "To klucz, który można zmienić w dowolnym momencie",
      "To sztucznie nadany identyfikator (np. autoinkrementacja), który jest stabilny i nie zawiera danych wrażliwych",
      "To klucz, który zastępuje klucz obcy w relacjach N:M",
      "To klucz, który pozwala na duplikaty w tabeli"
    ],
    "poprawna": 1,
    "wyjasnienie": "Klucze zastępcze (np. ID) są preferowane, ponieważ nie zmieniają się wraz z danymi użytkownika (np. zmiana nazwiska) i są wydajniejsze w obsłudze przez bazę danych."
  },
  {
    "pytanie": "W jakiej sytuacji musimy zastosować klucz złożony?",
    "opcje": [
      "Gdy tabela ma zbyt wiele kolumn",
      "Gdy żaden pojedynczy atrybut nie jest w stanie jednoznacznie zidentyfikować rekordu",
      "Gdy chcemy połączyć trzy tabele w jedną",
      "Gdy używamy typu danych TEXT jako klucza głównego"
    ],
    "poprawna": 1,
    "wyjasnienie": "Klucz złożony (composite key) składa się z dwóch lub więcej kolumn, których wspólna wartość jest unikatowa, nawet jeśli poszczególne kolumny dopuszczają duplikaty."
  },
  {
    "pytanie": "Co oznacza zasada nazewnictwa 'snake_case' w kontekście baz danych?",
    "opcje": [
      "Pisanie wielkimi literami z podkreślnikami",
      "Stosowanie wielkich liter na początku każdego słowa (np. ImieKlienta)",
      "Pisanie małymi literami z podkreślnikami zamiast spacji (np. imie_klienta)",
      "Używanie tylko cyfr w nazwach tabel"
    ],
    "poprawna": 2,
    "wyjasnienie": "snake_case to standard w SQL, który polega na używaniu małych liter i podkreślników, co czyni kod czytelnym i kompatybilnym z różnymi systemami operacyjnymi."
  },
  {
    "pytanie": "Co się stanie, gdy w bazie zdefiniowano relację z regułą ON DELETE CASCADE i usuniemy rekord z tabeli nadrzędnej?",
    "opcje": [
      "Baza zablokuje usuwanie i zgłosi błąd",
      "Rekordy w tabeli podrzędnej zostaną automatycznie usunięte",
      "Wartości klucza obcego w tabeli podrzędnej zostaną zmienione na NULL",
      "Baza danych automatycznie utworzy nową tabelę z kopią danych"
    ],
    "poprawna": 1,
    "wyjasnienie": "ON DELETE CASCADE to mechanizm, który automatycznie 'czyści' powiązane dane w tabelach zależnych, aby nie zostawić tzw. 'sierocych rekordów'."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="encje-atrybuty-klucze"></div>

---

*Materiały edukacyjne opracowane na potrzeby kursu zawodowego.*
