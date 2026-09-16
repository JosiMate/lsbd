---
hide:
  - navigation
---

# Lokalne systemy baz danych

**Technik informatyk · kwalifikacja INF.03 · jednostka INF.03.4 · PCEiKZ Szczucin**

Materiały do przedmiotu ułożone pod **część praktyczną egzaminu INF.03** —
w kolejności, w jakiej te umiejętności są potrzebne przy arkuszu, a nie
w kolejności rozdziałów podręcznika. Pracujemy na **MariaDB przez phpMyAdmina**,
czyli dokładnie na tym, co stoi na stanowisku egzaminacyjnym.

!!! info "Co gdzie jest"

    Na tej stronie są **treści do nauki**, **ćwiczenia z działającym trenerem SQL**
    oraz **materiały do pobrania**. Oceny, terminy i odsyłanie wykonanych prac —
    to wszystko w **Dzienniku VULCAN**, który pozostaje kanałem obowiązującym.

[:material-clipboard-check: Wymagania edukacyjne i bhp](dzial-1/wymagania-i-bhp.md){ .md-button .md-button--primary }
[:material-database-search: Trener SQL](dzial-4/select-relacje.md#cwicz-na-zywej-bazie){ .md-button }

## Jak wygląda egzamin

Część praktyczna trwa **150 minut** i ma cztery obszary: bazę danych, grafikę,
witrynę w HTML i CSS oraz skrypt. Progiem zdawalności jest **75 %** punktów.

Baza danych jest pierwsza i najkrótsza — zwykle **25–45 minut**. Zadanie prawie
zawsze wygląda tak samo:

1. zaimportować bazę z pliku `.sql` do phpMyAdmina
2. wykonać **cztery zapytania** podane w poleceniu
3. zapisać treść każdego zapytania do pliku tekstowego (najczęściej `kwerendy.txt`)
4. wykonać zrzut ekranu z wynikiem każdego zapytania — **cały ekran, z paskiem zadań**

Czwórka zapytań jest przewidywalna: dwa `SELECT` (jeden prosty, jeden łączący
tabele relacją), a do tego dwa polecenia administracyjne — założenie konta
użytkownika i nadanie mu uprawnień.

## Spis tematów

Materiały pojawiają się w miarę realizacji programu, więc część tematów jest
jeszcze pusta. Zaznaczaj przerobione tematy — pasek postępu jest tylko dla
Ciebie i nie ma nic wspólnego z ocenami.

<div class="spis-tematow" data-postep="lsbd" markdown>

### Dział I. Środowisko pracy

| Temat | Materiały |
| --- | --- |
| **[Wymagania edukacyjne i bhp](dzial-1/wymagania-i-bhp.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Środowisko, import bazy i plik kwerend](dzial-1/srodowisko-import.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Systemy zarządzania bazami danych — przegląd i dobór](dzial-1/szbd-przeglad.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział II. Model danych

| Temat | Materiały |
| --- | --- |
| **[Encje, atrybuty, klucze — pojęcia, które trzeba nazywać poprawnie](dzial-2/encje-atrybuty-klucze.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Związki między encjami i ich liczebność](dzial-2/zwiazki-liczebnosc.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Diagram E/R — od szkicu do struktury](dzial-2/diagram-er.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Postacie normalne w praktyce](dzial-2/postacie-normalne.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Typy danych i dobór ich do atrybutów](dzial-2/typy-danych.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział III. SELECT — jedna tabela

| Temat | Materiały |
| --- | --- |
| **[SELECT, kolumny i aliasy](dzial-3/select-podstawy.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[WHERE — warunki, operatory, LIKE, BETWEEN, IN](dzial-3/filtrowanie-warunki.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[ORDER BY i LIMIT](dzial-3/sortowanie-limit.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Wartości NULL — pułapka, na której traci się punkty](dzial-3/obsluga-null.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział IV. Relacje i agregacja

| Temat | Materiały |
| --- | --- |
| **[Zapytania z relacją (JOIN)](dzial-4/select-relacje.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Złączenia zewnętrzne — LEFT JOIN i po co on jest](dzial-4/zlaczenia-zewnetrzne.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Funkcje agregujące i GROUP BY](dzial-4/agregacja-groupby.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[HAVING kontra WHERE](dzial-4/having-where.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Podzapytania](dzial-4/podzapytania.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział V. Struktura bazy

| Temat | Materiały |
| --- | --- |
| **[CREATE TABLE — tworzenie tabel z projektu](dzial-5/create-table.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Klucze główne i obce w SQL-u](dzial-5/klucze-sql.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[ALTER TABLE — rozbudowa istniejącej bazy](dzial-5/alter-table.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Skrypty tworzące strukturę](dzial-5/skrypty-struktura.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział VI. Modyfikacja danych

| Temat | Materiały |
| --- | --- |
| **[`INSERT` — wprowadzanie danych](dzial-6/insert.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[`UPDATE` i `DELETE` — i dlaczego zawsze z `WHERE`](dzial-6/update-delete.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Import i eksport danych](dzial-6/import-eksport.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział VII. Administrowanie

| Temat | Materiały |
| --- | --- |
| **[Konta użytkowników — `CREATE USER`](dzial-7/create-user.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Uprawnienia — `GRANT` i `REVOKE`](dzial-7/grant-revoke.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Kopia zapasowa i przywracanie bazy](dzial-7/backup-recovery.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Spójność bazy i diagnostyka](dzial-7/diagnostics.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział VIII. Baza w aplikacji

| Temat | Materiały |
| --- | --- |
| **[Połączenie aplikacji z bazą](dzial-8/polaczenie-aplikacja.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Operacje CRUD w kodzie aplikacji](dzial-8/operacje-crud.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Bezpieczeństwo — SQL Injection i Prepared Statements](dzial-8/sql-injection.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Zarządzanie połączeniami i błędy](dzial-8/zarzadzanie-polaczeniami.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Kodowanie znaków — skąd biorą się „krzaczki"](dzial-8/kodowanie-znakow.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Dział IX. Zaawansowane programowanie w bazie

| Temat | Materiały |
| --- | --- |
| **[Widoki — wirtualne tabele](dzial-9/widoki.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Transakcje — spójność i ACID](dzial-9/transakcje.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Procedury i funkcje](dzial-9/procedury-funkcje.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Wyzwalacze (Triggers)](dzial-9/wyzwalacze.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

### Trening egzaminacyjny

| Temat | Materiały |
| --- | --- |
| **[Plan na 150 minut — kolejność pracy przy arkuszu](trening/plan-150min.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Pełne zadanie praktyczne — przebieg i samoocena](trening/zadanie-praktyczne.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |
| **[Najczęstsze błędy i ile kosztują w punktach](trening/bledy-punkty.md)** | :material-check-circle:{ title="Materiał gotowy" } gotowe |

</div>


<!-- zadania6:start -->

## Zadania na ocenę celującą

Zadania na szóstkę są **działowe, nie tematyczne** — obejmują materiał całego
działu i wymagają czegoś więcej niż powtórzenia ćwiczenia z lekcji. Wybierasz
**jedno** z listy poniżej.

Pracę oddajesz w Dzienniku VULCAN, w zadaniu **„Zadanie na ocenę celującą:
Dział …”** założonym do tego działu, w ciągu **dwóch tygodni od zakończenia
działu**. Plik nazwij `nr<numer w dzienniku>-<litera zadania>`, a w treści
zadania dopisz 3–5 zdań o tym, co zrobiłeś i co z tego wyszło. Karty pracy
do tematów są od tego niezależne — tam zadań na szóstkę nie ma.

Cała lista jest widoczna **od początku działu**, żebyś miał czas wybrać
i popracować. Przy każdym zadaniu jest napisane, po którym temacie da się
je wykonać. Pełne zasady opisuje strona [wymagań edukacyjnych](dzial-1/wymagania-i-bhp.md).

??? example "Dział I. Środowisko pracy — 3 zadania do wyboru"

    **A. Instrukcja stanowiska dla kolegi z klasy**

    *Do wykonania po temacie „Środowisko, import bazy i plik kwerend”.*

    Napisz instrukcję, która przeprowadza kogoś od czystego komputera do zaimportowanej bazy: instalacja pakietu, uruchomienie usług, założenie bazy z właściwym kodowaniem, import, sprawdzenie wyniku. Każdy krok ze zrzutem ekranu.

    Instrukcja ma też zawierać **sekcję awaryjną**: trzy komunikaty błędu, które realnie zobaczyłeś, i co je usunęło. Na koniec daj ją komuś, kto jej nie pisał, i popraw to, co okazało się niejasne.

    **Oddajesz:** instrukcję w pliku PDF oraz akapit o tym, co zmieniłeś po teście na koledze

    ---

    **B. Trzy systemy zarządzania bazą, jedno porównanie**

    *Do wykonania po temacie „Środowisko, import bazy i plik kwerend”.*

    Zainstaluj i uruchom trzy różne rozwiązania: MariaDB z phpMyAdminem, SQLite z graficznym klientem oraz jeden do wyboru (PostgreSQL, MS Access, Firebird). Do każdego zaimportuj tę samą bazę `obuwie`.

    Porównaj je w tabeli: co trzeba zainstalować, gdzie fizycznie leżą dane, czy jest serwer i konta użytkowników, jak wygląda import, do czego to rozwiązanie się nadaje. Wskaż, które wybrałbyś do sklepu na 3 stanowiska i dlaczego.

    **Oddajesz:** tabelę porównawczą, zrzuty z trzech środowisk i jednoakapitową rekomendację

    ---

    **C. Ile naprawdę zajmuje przygotowanie stanowiska**

    *Do wykonania po całym dziale.*

    Zmierz stoperem pełną ścieżkę z checklisty pierwszych dziesięciu minut — pięć razy, w pięciu różnych dniach. Zapisuj czas każdego kroku osobno.

    Zestaw wyniki w tabeli i na wykresie. Odpowiedz: który krok zajmuje najwięcej czasu, o ile skrócił się łączny czas między pierwszym a piątym podejściem i co konkretnie tę różnicę zrobiło.

    **Oddajesz:** arkusz z pomiarami, wykres i wnioski — z wyraźnym wskazaniem kroku, który warto przećwiczyć jeszcze raz

??? example "Dział II. Model danych — 3 zadania do wyboru"

    **A. Projekt bazy dla lokalnej firmy**

    *Do wykonania po temacie „Diagram E/R — od szkicu do struktury”.*

    Wybierz małą, istniejącą firmę (np. fryzjer, warsztat, sklep osiedlowy). Przeprowadź krótki wywiad lub analizę ich potrzeb i zaprojektuj model danych.

    Stwórz kompletny diagram E/R, definiując encje, atrybuty oraz związki wraz z ich liczebnością. Uzasadnij wybór kluczy głównych dla każdej tabeli.

    **Oddajesz:** opis firmy, diagram E/R oraz uzasadnienie struktury

    ---

    **B. Laboratorium normalizacji**

    *Do wykonania po temacie „Postacie normalne w praktyce”.*

    Przygotuj arkusz kalkulacyjny z celowo źle zaprojektowaną tabelą (tzw. „tabelą potworem”), która zawiera redundantne dane i narusza 1., 2. i 3. postać normalną.

    Przeprowadź proces normalizacji krok po kroku, pokazując przekształcenia tabeli do każdej z postaci normalnych. Dla każdego etapu opisz, jaki problem (anomalia) został rozwiązany.

    **Oddajesz:** tabelę wyjściową oraz dokumentację procesu normalizacji z opisem zmian

    ---

    **C. Analiza standardów modelowania**

    *Do wykonania po całym dziale.*

    Porównaj dwie różne notacje diagramów E/R (np. notację Chena oraz notację Crow's Foot). Stwórz ten sam model danych w obu standardach.

    Wypisz w tabeli zalety i wady obu podejść z perspektywy osoby projektującej oraz osoby, która ma na podstawie diagramu wdrożyć bazę w SQL.

    **Oddajesz:** dwa warianty tego samego diagramu oraz tabelę porównawczą notacji

??? example "Dział III. SELECT — jedna tabela — 3 zadania do wyboru"

    **A. Wielki maraton filtrowania**

    *Do wykonania po temacie „WHERE — warunki, operatory, LIKE, BETWEEN, IN”.*

    Stwórz zestaw 15 zaawansowanych zapytań do bazy `obuwie`, które wymagają jednoczesnego użycia co najmniej trzech różnych operatorów w jednym `WHERE` (np. kombinacje `LIKE`, `BETWEEN` i `NOT IN`).

    Każde zapytanie musi mieć konkretny cel biznesowy (np. „Znajdź produkty marki X, których cena jest w przedziale Y, ale nazwa nie zawiera słowa Z”).

    **Oddajesz:** listę zapytań wraz z opisem celu każdego z nich i zrzutami wyników

    ---

    **B. Profilowanie danych w tabeli**

    *Do wykonania po temacie „ORDER BY i LIMIT”.*

    Wykorzystując jedynie instrukcje `SELECT` z sortowaniem i ograniczaniem, przeprowadź analizę statystyczną tabeli produkt.

    Znajdź: 5 najdroższych produktów, 5 najtańszych, 10 produktów z najkrótszą nazwą oraz sprawdź, czy w bazie istnieją rekordy z pustymi polami (NULL) w kluczowych kolumnach. Zestaw wyniki w raporcie.

    **Oddajesz:** raport z analizy danych zawierający kwerendy i wnioski

    ---

    **C. Podręcznik filtrowania dla początkujących**

    *Do wykonania po całym dziale.*

    Opracuj interaktywny poradnik w formie dokumentu, który tłumaczy logikę filtrowania w SQL. Dla każdego operatora (`=`, `<>`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`) stwórz przykład „Złe zapytanie $ightarrow$ Dlaczego nie działa $ightarrow$ Poprawne zapytanie”.

    Dodaj sekcję o kolejności wykonywania warunków w klauzuli `WHERE` i wpływie nawiasów na wynik.

    **Oddajesz:** kompletny poradnik z przykładami i wyjaśnieniami

??? example "Dział IV. Relacje i agregacja — 3 zadania do wyboru"

    **A. Zestaw dwudziestu zapytań z arkuszy**

    *Do wykonania po temacie „Zapytania z relacją (JOIN)”.*

    Przejrzyj arkusze egzaminacyjne INF.03 (dawniej EE.09 i E.14) z co najmniej pięciu sesji i wypisz **wszystkie** polecenia dotyczące zapytań z relacją. Uporządkuj je od najprostszego do najtrudniejszego.

    Do każdego napisz rozwiązanie i sprawdź je na bazie z tego arkusza. Przy każdym dopisz jedno zdanie: co w treści polecenia decydowało o tym, że trzeba użyć złączenia.

    **Oddajesz:** dokument z dwudziestoma parami polecenie–rozwiązanie, ze wskazaniem sesji, z której pochodzi każde zadanie

    ---

    **B. Własna baza i własne zadanie egzaminacyjne**

    *Do wykonania po temacie „Zapytania z relacją (JOIN)”.*

    Zaprojektuj bazę z **trzech** powiązanych tabel na temat, który Cię interesuje — wypożyczalnia, serwis, magazyn części. Wypełnij ją co najmniej trzydziestoma wierszami sensownych danych i wyeksportuj do pliku `.sql`.

    Do tej bazy ułóż zadanie w stylu arkusza: cztery polecenia, w tym co najmniej jedno wymagające złączenia trzech tabel. Napisz też **kryteria oceniania** — za co ile punktów.

    **Oddajesz:** plik `.sql` z bazą, treść zadania, wzorcowe rozwiązania i kryteria oceniania

    ---

    **C. Kiedy JOIN gubi wiersze — eksperyment**

    *Do wykonania po temacie o złączeniach zewnętrznych.*

    Przygotuj bazę, w której celowo występują trzy sytuacje: kategoria bez produktów, produkt z `NULL` w kluczu obcym oraz produkt wskazujący na nieistniejącą kategorię.

    Dla każdej z nich wykonaj to samo zapytanie w czterech wariantach: `JOIN`, `LEFT JOIN`, `RIGHT JOIN` i zapis z przecinkiem. Zestaw liczby zwróconych wierszy w tabeli i wyjaśnij każdą różnicę.

    **Oddajesz:** plik `.sql` z przygotowaną bazą, tabelę wyników dwanaście na raz i wyjaśnienia — z odpowiedzią, który wariant jest bezpieczny, gdy nie znasz danych

??? example "Dział V. Struktura bazy — 3 zadania do wyboru"

    **A. Budowa bazy z rozbudowanej specyfikacji**

    *Do wykonania po temacie „CREATE TABLE — tworzenie tabel z projektu”.*

    Otrzymasz opis systemu zarządzania biblioteką (książki, autorzy, wypożyczenia, czytelnicy, kary). Zaimplementuj tę bazę w SQL, dbając o poprawność typów danych i kluczy.

    Dodaj wszystkie niezbędne więzy spójności: klucze główne, obce oraz ograniczenia `NOT NULL` i `UNIQUE` tam, gdzie wymaga tego logika biznesowa.

    **Oddajesz:** skrypt `.sql` tworzący strukturę bazy oraz opis podjętych decyzji projektowych

    ---

    **B. Testowanie więzów spójności**

    *Do wykonania po temacie „Klucze główne i obce w SQL-u”.*

    Stwórz bazę danych i celowo spróbuj złamać każde z ograniczeń: spróbuj dodać duplikat do klucza głównego, wstawić `NULL` do kolumny `NOT NULL` oraz dodać rekord z nieistniejącym kluczem obcym.

    Dla każdej próby zapisz treść błędu zwróconego przez MariaDB i wyjaśnij, dlaczego system zablokował tę operację.

    **Oddajesz:** dokumentację prób (kwerenda $ightarrow$ błąd $ightarrow$ wyjaśnienie)

    ---

    **C. Analiza wpływu ALTER TABLE**

    *Do wykonania po całym dziale.*

    Zaimplementuj bazę z dużą ilością danych (np. 1000 rekordów). Wykonaj serię operacji `ALTER TABLE`: zmień typ kolumny, dodaj nowy klucz obcy do istniejącej tabeli i usuń kolumnę.

    Zbadaj i opisz, co dzieje się z istniejącymi danymi podczas tych zmian. Czy dane zostały utracone? Czy system wymusił spójność? Zaproponuj bezpieczną procedurę aktualizacji struktury bazy na działającym systemie.

    **Oddajesz:** raport z eksperymentu oraz propozycję bezpiecznego procesu aktualizacji

??? example "Dział VI. Modyfikacja danych — 3 zadania do wyboru"

    **A. Masowa migracja danych**

    *Do wykonania po temacie „Import i eksport danych”.*

    Przygotuj plik tekstowy (CSV) z danymi o produktach w nieprawidłowym formacie. Napisz skrypt lub użyj narzędzi phpMyAdmin, aby poprawnie zaimportować te dane do bazy.

    Zastosuj transformację danych podczas importu (np. zmiana formatu daty lub konwersja walut), aby dane w bazie były spójne.

    **Oddajesz:** plik CSV, skrypt/opis importu oraz zrzut końcowej tabeli

    ---

    **B. Projekt czyszczenia danych**

    *Do wykonania po temacie „UPDATE i DELETE — i dlaczego zawsze z WHERE”.*

    Otrzymasz bazę danych z „brudnymi” danymi: duplikaty nazw, błędne ceny (ujemne), niespójne nazwy miast. Zaprojektuj i wykonaj serię zapytań `UPDATE` i `DELETE`, aby oczyścić bazę.

    Stwórz raport „Przed i Po”, pokazujący liczbę naprawionych rekordów dla każdego rodzaju błędu.

    **Oddajesz:** listę wykonanych kwerend naprawczych oraz raport z efektami czyszczenia

    ---

    **C. Symulacja procesu biznesowego**

    *Do wykonania po całym dziale.*

    Zaprojektuj sekwencję operacji SQL, która realizuje proces zamówienia w sklepie: sprawdzenie stanu magazynowego $ightarrow$ dodanie zamówienia $ightarrow$ aktualizacja ilości produktów w magazynie $ightarrow$ dodanie wpisu do historii klienta.

    Opisz, jak zapewnić, aby w przypadku błędu w połowie procesu dane nie zostały pozostawione w stanie niepełnym (koncepcja atomowości).

    **Oddajesz:** dokumentację procesu z kwerendami i analizą ryzyka

??? example "Dział VII. Administrowanie — 3 zadania do wyboru"

    **A. Macierz uprawnień dla firmy**

    *Do wykonania po temacie „Uprawnienia — GRANT i REVOKE”.*

    Zaprojektuj system uprawnień dla firmy z trzema rolami: Administrator, Magazynier i Sprzedawca. Każda rola musi mieć inny zestaw uprawnień do konkretnych tabel (np. Sprzedawca może tylko czytać ceny i dodawać zamówienia).

    Zaimplementuj tę strukturę w SQL, tworząc użytkowników i nadając im precyzyjne uprawnienia.

    **Oddajesz:** tabelę uprawnień (macierz) oraz skrypt SQL tworzący użytkowników i nadając im role

    ---

    **B. Symulacja Disaster Recovery**

    *Do wykonania po temacie „Kopia zapasowa i przywracanie bazy”.*

    Przeprowadź pełny cykl zarządzania kopiami: wykonaj zrzut bazy, wprowadź celowe, krytyczne zmiany (np. usunięcie kluczowej tabeli), a następnie przywróć bazę do stanu pierwotnego.

    Przetestuj różne metody przywracania (cała baza vs pojedyncza tabela) i porównaj czas oraz łatwość wykonania każdej z nich.

    **Oddajesz:** dziennik działań z zrzutami ekranu i wnioskami z testów

    ---

    **C. Audyt wydajności administracyjnej**

    *Do wykonania po całym dziale.*

    Zbadaj wpływ różnych ustawień serwera MariaDB na szybkość działania prostych kwerend. Porównaj działanie bazy z włączoną i wyłączoną synchronizacją dyskową (innodb_flush_log_at_trx_commit).

    Opracuj rekomendacje konfiguracji dla dwóch scenariuszy: maksymalne bezpieczeństwo danych oraz maksymalna szybkość zapisu.

    **Oddajesz:** wyniki pomiarów i dokument z rekomendacjami ustawień

??? example "Dział VIII. Baza w aplikacji — 3 zadania do wyboru"

    **A. Budowa aplikacji CRUD**

    *Do wykonania po temacie „Operacje CRUD w kodzie aplikacji”.*

    Stwórz w wybranym języku (PHP/Python) prostą aplikację webową do zarządzania listą zadań (To-Do List) lub biblioteką gier. Aplikacja musi pozwalać na dodawanie, wyświetlanie, edycję i usuwanie rekordów z bazy danych.

    Zastosuj pełną separację logiki od danych, korzystając z plików konfiguracyjnych dla danych połączenia.

    **Oddajesz:** kod źródłowy aplikacji oraz instrukcję uruchomienia

    ---

    **B. Audyt bezpieczeństwa aplikacji**

    *Do wykonania po temacie „Bezpieczeństwo — SQL Injection i Prepared Statements”.*

    Znajdź w sieci prosty, podatny na ataki projekt aplikacji (np. w PHP). Przeprowadź na nim atak SQL Injection, aby przejąć dane administratora.

    Następnie przepisz cały kod aplikacji, stosując Prepared Statements, i udowodnij, że ten sam atak przestał działać.

    **Oddajesz:** dokumentację ataku (zrzuty ekranu) oraz poprawiony, bezpieczny kod

    ---

    **C. Analiza metod połączeń**

    *Do wykonania po całym dziale.*

    Przeprowadź badanie porównawcze trzech sposobów komunikacji z bazą danych (np. czysty SQL przez PDO, użycie biblioteki typu MySQLi oraz proste podejście z ORM).

    Porównaj je pod kątem: szybkości pisania kodu, bezpieczeństwa, wydajności oraz łatwości utrzymania. Wskaż, kiedy warto przejść z czystego SQL na ORM.

    **Oddajesz:** raport z analizy z przykładami kodu dla każdego podejścia

??? example "Dział IX. Zaawansowane programowanie w bazie — 3 zadania do wyboru"

    **A. Automatyzacja reguł biznesowych**

    *Do wykonania po temacie „Wyzwalacze (Triggers)”.*

    Zaimplementuj w bazie system automatycznego logowania zmian (audyt). Stwórz trigger, który przy każdej aktualizacji ceny produktu w tabeli `produkt` automatycznie zapisze starą cenę, nową cenę, datę zmiany i ID użytkownika w tabeli `historia_cen`.

    Udowodnij działanie triggera, wykonując serię zmian i pokazując wynik w tabeli historii.

    **Oddajesz:** skrypt tworzący trigger oraz raport z testów

    ---

    **B. System zarządzania bazą w procedurach**

    *Do wykonania po temacie „Procedury i funkcje”.*

    Zastąp standardowe zapytania CRUD zestawem procedur składowanych. Stwórz procedury do: bezpiecznego dodawania produktu, aktualizacji stanów magazynowych po zamówieniu oraz generowania raportu miesięcznej sprzedaży.

    Zaimplementuj w procedurach obsługę błędów i walidację danych wejściowych.

    **Oddajesz:** zbiór procedur SQL oraz instrukcję ich wywoływania

    ---

    **C. Wirtualny system raportowy**

    *Do wykonania po temacie „Widoki — wirtualne tabele”.*

    Zaprojektuj zestaw widoków, które ukrywają złożoność bazy przed użytkownikiem końcowym. Stwórz widoki dla: zestawienia sprzedaży dla managera, listy klientów z zaległościami dla księgowości oraz aktualnych promocji dla sprzedawcy.

    Zanalizuj wpływ użycia widoków na wydajność zapytania w porównaniu do bezpośredniego łączenia tabel w aplikacji.

    **Oddajesz:** skrypt tworzący widoki oraz analizę wydajnościową

<!-- zadania6:end -->
---

*Zakres przedmiotu odpowiada jednostce INF.03.4 „Projektowanie i administrowanie
bazami danych" podstawy programowej kształcenia w zawodzie technik informatyk
(rozporządzenie Ministra Edukacji Narodowej, Dz.U. 2019 poz. 991).*
