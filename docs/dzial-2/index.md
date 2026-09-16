# Dział II. Model danych
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

Najdroższe błędy w bazie danych nie powstają przy pisaniu zapytań, tylko wcześniej — przy projektowaniu. Źle rozpisane encje i pomylona liczebność związku dają strukturę, w której te same dane leżą w trzech miejscach i rozjeżdżają się po pierwszej poprawce.

W tym dziale uczysz się nazywać rzeczy poprawnie: encja, atrybut, klucz główny, klucz obcy, związek. Ta sama terminologia stoi w poleceniach egzaminacyjnych, więc czytanie arkusza zaczyna się właśnie tutaj.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Encje, atrybuty, klucze — pojęcia, które trzeba nazywać poprawnie | [Materiał i ćwiczenia](encje-atrybuty-klucze.md) |
| Związki między encjami i ich liczebność | [Materiał i ćwiczenia](zwiazki-liczebnosc.md) |
| Diagram E/R — od szkicu do struktury | [Materiał i ćwiczenia](diagram-er.md) |
| Postacie normalne w praktyce | [Materiał i ćwiczenia](postacie-normalne.md) |
| Typy danych i dobór ich do atrybutów | [Materiał i ćwiczenia](typy-danych.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział II"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - rozróżnia encję, atrybut i rekord i wskazuje je na gotowym diagramie
    - odczytuje z diagramu E/R, które encje są ze sobą powiązane
    - wskazuje klucz główny w podanej tabeli

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - dla opisanej słownie encji wypisuje jej atrybuty i wybiera klucz główny
    - rozpoznaje związek jeden-do-wielu i wskazuje, w której tabeli stanie klucz obcy
    - dobiera typ danych do atrybutu: tekst, liczba całkowita, liczba z częścią dziesiętną, data

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - rysuje diagram E/R dla opisu obejmującego dwie lub trzy encje
    - rozwiązuje związek wiele-do-wielu, wprowadzając tabelę łączącą
    - uzasadnia dobór typu i długości pola, na przykład `VARCHAR(50)` zamiast `TEXT`

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - doprowadza projekt do trzeciej postaci normalnej i wyjaśnia, co usunął na każdym etapie
    - wskazuje w cudzym projekcie powtarzające się dane i anomalie przy dopisywaniu oraz usuwaniu rekordów
    - wybiera klucz główny naturalny albo sztuczny i uzasadnia wybór

    **Ocena celująca (6)** — *wymagania wykraczające*

    - projektuje model danych do zadania z arkusza INF.03 i przekłada go bezbłędnie na strukturę tabel

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
    Dostaniesz jeden plik `postep_dzial-2.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-2"></div>
