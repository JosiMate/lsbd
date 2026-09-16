# Dział V. Struktura bazy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

Do tej pory pracowałeś na bazie, którą ktoś przygotował. Teraz budujesz ją sam: zamieniasz diagram z działu II na polecenia `CREATE TABLE`, deklarujesz klucze i zapisujesz całość w jednym skrypcie, który da się uruchomić od zera.

Kolejność ma tu znaczenie dosłownie — tabela z kluczem obcym nie powstanie, zanim nie istnieje tabela, na którą ten klucz wskazuje. To najczęstsza przyczyna błędu przy uruchamianiu cudzego skryptu.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| CREATE TABLE — tworzenie tabel z projektu | [Materiał i ćwiczenia](create-table.md) |
| Klucze główne i obce w SQL-u | [Materiał i ćwiczenia](klucze-sql.md) |
| ALTER TABLE — rozbudowa istniejącej bazy | [Materiał i ćwiczenia](alter-table.md) |
| Skrypty tworzące strukturę | [Materiał i ćwiczenia](skrypty-struktura.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział V"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - odczytuje gotowy skrypt `CREATE TABLE` i wskazuje w nim nazwy kolumn oraz ich typy
    - tworzy tabelę o dwóch lub trzech kolumnach według podanego wzoru
    - wskazuje w skrypcie deklarację klucza głównego

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - tworzy tabelę z kluczem głównym i automatyczną numeracją (`AUTO_INCREMENT`)
    - dobiera typ danych do kolumny i stosuje ograniczenie `NOT NULL`
    - dodaje kolumnę do istniejącej tabeli poleceniem `ALTER TABLE`

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - deklaruje klucz obcy i wskazuje tabelę oraz kolumnę, do której się odwołuje
    - zmienia i usuwa kolumny oraz ograniczenia poleceniem `ALTER TABLE`
    - zapisuje komplet poleceń w jednym skrypcie i wykonuje go w całości

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - przekłada diagram E/R na komplet poleceń `CREATE TABLE`, zachowując kolejność — najpierw tabele, na które wskazują klucze obce
    - dobiera zachowanie klucza obcego przy usuwaniu i zmianie danych i uzasadnia wybór
    - rozpoznaje i usuwa przyczynę błędu przy zakładaniu klucza obcego: niezgodny typ kolumn, brak indeksu, zła kolejność tabel

    **Ocena celująca (6)** — *wymagania wykraczające*

    - odtwarza strukturę bazy z arkusza INF.03 samodzielnie, bez błędów i razem z relacjami

## Karta pracy działu

Dziennik wdrożenia prowadzisz **przez cały dział**, uzupełniając go po każdej
lekcji. Odpowiedzi zostają w Twojej przeglądarce, więc możesz wracać do karty
wielokrotnie. Na koniec działu pobierasz gotowy dokument Worda i oddajesz go
przez **Zadania domowe w dzienniku VULCAN**.

!!! info "Po co prowadzić dziennik"

    Dokumentacja wykonanej pracy jest jedną z form ocenianych na tym
    przedmiocie — i jedną z umiejętności sprawdzanych na egzaminie zawodowym.
    Kryterium jest proste: czy **ktoś inny** odtworzy Twoją pracę na podstawie
    tego, co zapisałeś.

!!! warning "Chcesz dokończyć w domu — zapisz postęp do pliku"

    Odpowiedzi zostają w **tej przeglądarce, na tym komputerze**. Komputer
    w pracowni o nich nie powie komputerowi w domu, a konto szkolne bywa
    czyszczone przy wylogowaniu.

    Zanim wyjdziesz z pracowni, kliknij pod kartą **Zapisz postęp do pliku**.
    Dostaniesz jeden plik `postep_dzial-5.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-5"></div>
