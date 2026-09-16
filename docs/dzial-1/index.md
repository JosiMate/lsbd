# Dział I. Środowisko pracy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział I**

Zanim napiszesz pierwsze zapytanie, musisz mieć gdzie je napisać. Ten dział jest o warsztacie: o serwerze bazy danych, o phpMyAdminie, o tym, jak wciągnąć do bazy plik `.sql` z arkusza egzaminacyjnego i jak zapisać kwerendy tak, żeby egzaminator uznał je za dowód Twojej pracy.

Dowiesz się też, na jakich zasadach będziesz oceniany przez cały rok i czym różnią się od siebie systemy zarządzania bazami danych, z których jeden — MariaDB — towarzyszy Ci na każdej kolejnej lekcji.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Wymagania edukacyjne i bhp | [Materiał i ćwiczenia](wymagania-i-bhp.md) |
| Środowisko, import bazy i plik kwerend | [Materiał i ćwiczenia](srodowisko-import.md) |
| Systemy zarządzania bazami danych — przegląd i dobór | [Materiał i ćwiczenia](szbd-przeglad.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział I"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - uruchamia serwer bazy danych i otwiera phpMyAdmina
    - odnajduje bazę i tabelę na liście
    - odczytuje nazwy kolumn i typy danych w widoku struktury

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - zakłada bazę danych i nadaje jej właściwe kodowanie
    - importuje bazę z pliku `.sql` i sprawdza, czy import się powiódł
    - zapisuje treść zapytania do pliku tekstowego zgodnie z poleceniem

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - rozpoznaje przyczynę nieudanego importu i usuwa ją
    - wyjaśnia, czym jest kodowanie znaków i skąd biorą się „krzaczki”
    - wykonuje eksport bazy do pliku i sprawdza zawartość pliku

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - dobiera system zarządzania bazą danych do zastosowania i uzasadnia wybór
    - konfiguruje serwer do pracy wielu użytkowników
    - przygotowuje stanowisko do pracy egzaminacyjnej bez podpowiedzi

    **Ocena celująca (6)** — *wymagania wykraczające*

    - podejmuje zadania dodatkowe, w tym przygotowanie do części praktycznej egzaminu INF.03

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
    Dostaniesz jeden plik `postep_dzial-1.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-1"></div>
