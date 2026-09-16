# Dział IV. Relacje i agregacja
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

Dane rozłożone na kilka tabel trzeba umieć z powrotem połączyć. Ten dział jest o złączeniach — wewnętrznym i zewnętrznym — oraz o liczeniu na grupach wierszy: ile, ile łącznie, ile średnio.

To jest najczęściej punktowana część arkusza INF.03 i jednocześnie ta, w której najłatwiej stracić punkty. Zapomniany warunek złączenia daje wynik, który wygląda poważnie, a jest iloczynem wszystkich wierszy z wszystkimi.

## Tematy działu

| Temat | Materiały |
| --- | --- |
| Zapytania z relacją (JOIN) | [Materiał i ćwiczenia](select-relacje.md) |
| Złączenia zewnętrzne — LEFT JOIN i po co on jest | [Materiał i ćwiczenia](zlaczenia-zewnetrzne.md) |
| Funkcje agregujące i GROUP BY | [Materiał i ćwiczenia](agregacja-groupby.md) |
| HAVING kontra WHERE | [Materiał i ćwiczenia](having-where.md) |
| Podzapytania | [Materiał i ćwiczenia](podzapytania.md) |

## Wymagania na oceny w tym dziale

Wymagania są kumulatywne — na ocenę wyższą trzeba spełniać także wszystkie
niższe. Pełna lista dla całego przedmiotu jest na stronie
[wymagań edukacyjnych](../dzial-1/wymagania-i-bhp.md).

??? abstract "Rozwiń wymagania — dział IV"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - wskazuje w strukturze bazy klucz główny i klucz obcy
    - odczytuje, które kolumny łączą dwie tabele

    **Ocena dostateczna (3)** — *wymagania podstawowe*

    - pisze zapytanie łączące dwie tabele i wybierające z nich wskazane kolumny
    - stosuje aliasy tabel, żeby skrócić zapis

    **Ocena dobra (4)** — *wymagania rozszerzające*

    - rozróżnia złączenie wewnętrzne i zewnętrzne i wskazuje, kiedy które daje inny wynik
    - łączy zapytanie z warunkiem i sortowaniem
    - stosuje funkcje agregujące z grupowaniem

    **Ocena bardzo dobra (5)** — *wymagania dopełniające*

    - łączy trzy tabele i uzasadnia kolejność złączeń
    - stosuje `HAVING` i rozróżnia je od `WHERE`
    - buduje podzapytania

    **Ocena celująca (6)** — *wymagania wykraczające*

    - rozwiązuje zadania z arkuszy egzaminacyjnych INF.03 dotyczące zapytań złożonych

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
    Dostaniesz jeden plik `postep_dzial-4.json` — przenieś go pendrive'em,
    OneDrive'em albo mailem do siebie, a w domu otwórz tę samą stronę
    i kliknij **Wczytaj postęp z pliku**. Ten sam plik działa w obie strony,
    więc wracając do pracowni robisz to samo.

    Plik zawiera także wklejone zrzuty ekranu, więc bywa spory. Nigdzie się
    nie wysyła — zostaje u Ciebie.

<div class="karta-pracy" data-karta="dzial-4"></div>
