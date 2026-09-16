# Dział IX. Zaawansowane programowanie w bazie
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IX**

Do tej pory traktowaliśmy bazę danych głównie jako pasywny magazyn, do którego wysyłaliśmy zapytania z zewnątrz. W rzeczywistości nowoczesne systemy DBMS (jak MariaDB czy PostgreSQL) to potężne platformy, które pozwalają na implementację logiki biznesowej bezpośrednio „wewnątrz” silnika bazy.

W tym dziale nauczysz się, jak tworzyć wirtualne tabele, jak gwarantować absolutną spójność danych za pomocą transakcji oraz jak automatyzować działania bazy za pomocą procedur i wyzwalaczy.

Dowiesz się, dlaczego transakcja to „wszystko albo nic” i jak sprawić, by baza danych sama pilnowała reguł, których nie da się wymusić za pomocą prostych kluczy.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Widoki — wirtualne tabele | [Materiał i ćwiczenia](widoki.md) |
| Transakcje — spójność i ACID | [Materiał i ćwiczenia](transakcje.md) |
| Procedury i funkcje | [Materiał i ćwiczenia](procedury-funkcje.md) |
| Wyzwalacze (Triggers) | [Materiał i ćwiczenia](wyzwalacze.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział IX"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - wyjaśnia pojęcie widoku i potrafi go stworzyć na podstawie prostego zapytania SELECT
    - rozumie podstawową ideę transakcji (COMMIT i ROLLBACK)
    - odróżnia procedurę od zwykłego zapytania SQL

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - tworzy widoki łączące dane z wielu tabel
    - przeprowadza prostą transakcję obejmującą dwa powiązane zapisy (np. przelew między kontami)
    - tworzy prostą procedurę z jednym parametrem wejściowym

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - wyjaśnia zasady ACID w kontekście transakcji
    - tworzy funkcje zwracające wartość, którą można wykorzystać w zapytaniach SELECT
    - projektuje prosty wyzwalacz (trigger) reagujący na operację INSERT lub UPDATE

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - analizuje wpływ użycia widoków na bezpieczeństwo danych (ograniczanie dostępu do kolumn)
    - rozwiązuje problemy z blokadami (deadlocki) w środowisku transakcyjnym
    - implementuje złożoną logikę w procedurach (instrukcje warunkowe IF i pętle)

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zadania egzaminacyjne INF.03 z obszaru zaawansowanego programowania baz danych bez błędów
    - projektuje system automatycznego logowania zmian w tabelach (audit trail) za pomocą wyzwalaczy
    - optymalizuje procedury pod kątem wydajności i zużycia zasobów

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
    Dostaniesz jeden plik `postep_dzial-9.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-9"></div>
