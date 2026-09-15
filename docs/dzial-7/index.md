# Dział VII. Administrowanie
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VII**

Umiejętność pisania zapytań to jedna rzecz, ale utrzymanie bazy w działaniu, bezpiecznej i wydajnej to zupełnie inna dyscyplina. To zadania administratora bazy danych (DBA). W tym dziale nauczysz się, jak zarządzać dostępem do danych, jak chronić je przed utratą i jak diagnozować problemy, gdy system zaczyna zwalniać.

Dowiesz się, dlaczego nadawanie każdemu uprawnień `ALL PRIVILEGES` to proszenie się o kłopoty i jak sprawić, by Twoja baza była odporna na awarie.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Konta użytkowników — `CREATE USER` | [Materiał i ćwiczenia](create-user.md) |
| Uprawnienia — `GRANT` i `REVOKE` | [Materiał i ćwiczenia](grant-revoke.md) |
| Kopia zapasowa i przywracanie bazy | [Materiał i ćwiczenia](backup-recovery.md) |
| Spójność bazy i diagnostyka | [Materiał i ćwiczenia](diagnostics.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział VII"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - tworzy nowego użytkownika i nadaje mu hasło
    - wykonuje prosty eksport i import bazy danych
    - potrafi wskazać w strukturze bazy klucz główny i obcy

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - nadaje i odbiera podstawowe uprawnienia za pomocą `GRANT` i `REVOKE`
    - przeprowadza pełną procedurę przywracania bazy z pliku zrzutu
    - rozpoznaje podstawowe komunikaty błędów MariaDB dotyczące spójności

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - różnicuje uprawnienia na poziomie bazy i konkretnych tabel
    - stosuje zasadę 3-2-1 przy planowaniu kopii zapasowych
    - diagnozuje powody powolnego działania zapytania za pomocą `SHOW PROCESSLIST`

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - dobiera optymalną strategię backupu (pełny vs przyrostowy) w zależności od potrzeb firmy
    - analizuje plan wykonania zapytania za pomocą `EXPLAIN` i proponuje optymalizację (np. indeksy)
    - konfiguruje bezpieczny dostęp do bazy z różnych hostów

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zadania egzaminacyjne INF.03 z obszaru administracji bazami danych bez błędów
    - potrafi zdiagnozować i usunąć przyczynę blokady tabel (`Locked`) w środowisku wielodostępowym

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
    Dostaniesz jeden plik `postep_dzial-7.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-7"></div>
