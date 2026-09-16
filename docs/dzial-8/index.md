# Dział VIII. Baza w aplikacji
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

Sama baza danych, choć potężna, jest tylko magazynem. Prawdziwa wartość pojawia się wtedy, gdy połączymy ją z aplikacją — programem, który pozwala użytkownikowi w łatwy sposób przeglądać, dodawać i modyfikować dane bez wpisywania ręcznie komend SQL. W tym dziale nauczysz się, jak wygląda most między kodem programu a serwerem bazy danych.

Dowiesz się, dlaczego nigdy nie powinno się wpisywać haseł bezpośrednio w kodzie i jak chronić aplikację przed jednym z najgroźniejszych ataków w sieci — SQL Injection.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Połączenie aplikacji z bazą | [Materiał i ćwiczenia](polaczenie-aplikacja.md) |
| Operacje CRUD w kodzie aplikacji | [Materiał i ćwiczenia](operacje-crud.md) |
| Bezpieczeństwo — SQL Injection i Prepared Statements | [Materiał i ćwiczenia](sql-injection.md) |
| Zarządzanie połączeniami i błędy | [Materiał i ćwiczenia](zarzadzanie-polaczeniami.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział VIII"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - wyjaśnia rolę sterownika (drivera) w połączeniu z bazą danych
    - wskazuje elementy ciągu połączenia (connection string)
    - rozumie, że aplikacja musi przejść proces autoryzacji przed dostępem do danych

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - dopasowuje operacje SQL (SELECT, INSERT, UPDATE, DELETE) do funkcji w aplikacji (CRUD)
    - potrafi wskazać w kodzie miejsce, w którym zapytanie SQL jest wysyłane do bazy
    - rozumie konieczność zamykania połączenia z bazą danych po zakończeniu pracy

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - wyjaśnia mechanizm ataku SQL Injection na przykładzie prostego formularza logowania
    - proponuje zastosowanie tzw. zapytań parametryzowanych (Prepared Statements) jako metodę ochrony
    - różnicuje dostęp do bazy dla użytkownika końcowego i administratora w kontekście aplikacji

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - porównuje podejście bezpośrednie (pisanie zapytań w kodzie) z podejściem obiektowym (ORM)
    - wyjaśnia pojęcie puli połączeń (connection pool) i jej wpływ na wydajność aplikacji
    - projektuje prosty schemat przepływu danych między interfejsem użytkownika a bazą

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zadania egzaminacyjne INF.03 z obszaru integracji aplikacji z bazą danych bez błędów
    - analizuje logi błędów połączenia i proponuje poprawki w konfiguracji sieciowej lub uprawnieniach użytkownika
    - implementuje (konceptualnie) mechanizm walidacji danych wejściowych przed wysłaniem ich do bazy

## Karta pracy działu

Dziennik wdrożenia prowadzisz **przez cały dział**, uzupełniając go po każdej
lekcji. Odpowiedzi zostają w Twojej przeglądarce, więc możesz wracać do karty
wielokrotnie. Na koniec działu pobierasz gotowy dokument Worda i oddajesz go
przez **Zadania domowe w dzienniku VULCAN**.

!!! info "Po co prowadzić dziennik"

    Dokumentacja wykonanej konfiguracji jest jedną z form ocenianych na tym
    przedmiocie — i jedną z umiejętności sprawdzanych na egzaminie zawodowym.
    Kryterium jest proste: czy **ktoś inny** odtworzy Twoją pracę na podstawie
    tego, co zapisałeś.

!!! warning "Chcesz dokończyć w domu — zapisz postęp do pliku"

    Odpowiedzi zostają w **tej przeglądarce, na tym komputerze**. Komputer
    w pracowni o nich nie powie komputerowi w domu, a konto szkolne bywa
    czyszczone przy wylogowaniu.

    Zanim wyjdziesz z pracowni, kliknij pod kartą **Zapisz postęp do pliku**.
    Dostaniesz jeden plik `postep_dzial-8.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-8"></div>
