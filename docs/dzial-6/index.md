# Dział VI. Modyfikacja danych
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VI**

Stworzenie struktury bazy to dopiero początek. Prawdziwa wartość systemu tkwi w danych, które w nim mieszkają. W tym dziale nauczysz się, jak tchnąć życie w puste tabele, jak dbać o aktualność informacji oraz jak bezpiecznie zarządzać kopiami zapasowymi.

Dowiesz się, dlaczego zapomnienie o jednym słowie (`WHERE`) może być najdroższym błędem w karierze administratora i jak sprawić, by import bazy na egzaminie zajął Ci mniej niż 2 minuty.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| `INSERT` — wprowadzanie danych | [Materiał i ćwiczenia](insert.md) |
| `UPDATE` i `DELETE` — i dlaczego zawsze z `WHERE` | [Materiał i ćwiczenia](update-delete.md) |
| Import i eksport danych | [Materiał i ćwiczenia](import-eksport.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział VI"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - z pomocą nauczyciela importuje bazę z pliku `.sql`
    - dodaje rekord do tabeli za pomocą `INSERT`
    - modyfikuje lub usuwa dane w tabeli, stosując podane warunki

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - samodzielnie importuje bazę danych i wykonuje eksport do pliku `.sql`
    - poprawnie wprowadza dane do wybranych kolumn, dbając o formaty (tekst, liczby, daty)
    - modyfikuje i usuwa konkretne rekordy za pomocą `UPDATE` i `DELETE` z klauzulą `WHERE`

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - stosuje klucz główny w warunkach `WHERE` dla gwarancji precyzji modyfikacji
    - wykonuje aktualizacje danych z wykorzystaniem obliczeń (np. zmiana ceny o procent)
    - rozpoznaje i naprawia najczęstsze błędy przy wprowadzaniu danych (np. naruszenie `NOT NULL`)

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - analizuje zawartość pliku zrzutu bazy (`.sql`) i potrafi wskazać instrukcje tworzące strukturę oraz dane
    - dobiera odpowiednią metodę eksportu (Szybka vs Niestandardowa) w zależności od celu
    - wyjaśnia wpływ pominięcia klauzuli `WHERE` na spójność bazy danych

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zadania egzaminacyjne INF.03 dotyczące modyfikacji i importu danych bez błędów i w wyznaczonym czasie
    - potrafi zdiagnozować i usunąć przyczynę błędu podczas importu dużego pliku `.sql`

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
    Dostaniesz jeden plik `postep_dzial-6.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-6"></div>
