# Dział III. SELECT — jedna tabela
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział III**

Tu zaczyna się właściwy SQL. Cztery tematy tego działu to cztery klauzule — `SELECT`, `WHERE`, `ORDER BY` z `LIMIT` oraz obsługa wartości `NULL` — i razem wystarczają, żeby odpowiedzieć na większość pytań zadawanych pojedynczej tabeli.

Na egzaminie te zapytania są najprostsze i dlatego najbardziej opłacalne: idą szybko i dają pewne punkty. Warunek jest jeden — polecenie trzeba przeczytać dosłownie, bo „wyświetl nazwy i ceny” to nie to samo co `SELECT *`.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| SELECT, kolumny i aliasy | [Materiał i ćwiczenia](select-podstawy.md) |
| WHERE — warunki, operatory, LIKE, BETWEEN, IN | [Materiał i ćwiczenia](filtrowanie-warunki.md) |
| ORDER BY i LIMIT | [Materiał i ćwiczenia](sortowanie-limit.md) |
| Wartości NULL — pułapka, na której traci się punkty | [Materiał i ćwiczenia](obsluga-null.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział III"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - wykonuje zapytanie `SELECT` pobierające wszystkie dane z tabeli
    - wybiera z tabeli wskazane kolumny
    - odczytuje z wyniku zapytania liczbę zwróconych wierszy

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - filtruje wiersze klauzulą `WHERE` z operatorami porównania
    - nadaje kolumnom aliasy słowem `AS`
    - sortuje wynik klauzulą `ORDER BY` rosnąco i malejąco
    - ogranicza liczbę wierszy klauzulą `LIMIT`

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - łączy warunki operatorami `AND`, `OR` i `NOT`, stosując nawiasy tam, gdzie zmieniają wynik
    - wyszukuje teksty operatorem `LIKE` ze znakami `%` i `_`
    - stosuje `BETWEEN` i `IN` zamiast długich łańcuchów warunków
    - buduje zestawienia typu „trzy najdroższe”, łącząc `ORDER BY` z `LIMIT`

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - stosuje `IS NULL` i `IS NOT NULL` i wyjaśnia, dlaczego zapis `= NULL` nigdy nie zwraca wierszy
    - przewiduje, które wiersze wypadną z wyniku przez wartość `NULL` w kolumnie użytej w warunku
    - sortuje według wielu kolumn i uzasadnia ich kolejność

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zapytania jednotabelowe z arkuszy INF.03 bez błędów i w czasie przewidzianym na egzaminie

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
    Dostaniesz jeden plik `postep_dzial-3.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-3"></div>
