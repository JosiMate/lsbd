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
| Plan na 150 minut — kolejność pracy przy arkuszu | *w przygotowaniu* |
| Pełne zadanie praktyczne — przebieg i samoocena | *w przygotowaniu* |
| Najczęstsze błędy i ile kosztują w punktach | *w przygotowaniu* |

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

<!-- zadania6:end -->
---

*Zakres przedmiotu odpowiada jednostce INF.03.4 „Projektowanie i administrowanie
bazami danych" podstawy programowej kształcenia w zawodzie technik informatyk
(rozporządzenie Ministra Edukacji Narodowej, Dz.U. 2019 poz. 991).*
