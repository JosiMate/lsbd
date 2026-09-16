# Kodowanie znaków — skąd biorą się „krzaczki"
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

Zdarzyło Ci się kiedyś otworzyć plik tekstowy lub stronę internetową i zamiast polskich liter zobaczyć dziwne znaki, takie jak `Ã³`, `Ĺś` lub `�`? W świecie IT nazywamy to potocznie **„krzaczkami"**, a fachowo: błędami kodowania znaków. To jeden z najczęstszych problemów przy imporcie baz danych i połączeniach aplikacji z serwerem.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić, czym jest kodowanie znaków i dlaczego jest niezbędne
    2. odróżnić kodowanie ASCII od Unicode (UTF-8)
    3. wyjaśnić mechanizm powstawania „krzaczków" (mojibake)
    4. dobrać właściwe kodowanie przy imporcie bazy danych w phpMyAdminie

## 1. Jak komputer „widzi” tekst?

Komputer nie rozumie liter, przecinków ani spacji. Rozumie tylko liczby (a dokładniej bity: 0 i 1). Aby można było zapisać tekst, musimy stworzyć **tabelę mapowania**, w której każdej literze przypisana jest konkretna liczba.

Taka tabela to właśnie **kodowanie znaków** (character encoding).

**Przykład:**
Jeśli ustalimy, że liczba `65` to litera `A`, liczba `66` to `B` itd., to zapisując w pliku ciąg liczb `65, 66, 67`, komputer wyświetli nam `ABC`.

## 2. Od ASCII do Unicode

### ASCII — fundament (ale zbyt mały)
Pierwszy standard, ASCII, używał tylko 7 bitów. Pozwalało to zapisać 128 znaków (angielski alfabet, cyfry i podstawowe symbole). Dla kogoś, kto pisał tylko po angielsku, wystarczyło to w zupełności. Ale co z polskim `ą`, `ć` czy `ó`?

### Era „dzikiego zachodu” (Kodowania 8-bitowe)
Aby dodać znaki narodowe, rozszerzono tabele do 8 bitów (256 znaków). Niestety, każdy region świata zaczął tworzyć **własne tabele**:
- W Polsce popularny był standard **ISO-8859-2**.
- Microsoft stworzył własną wersję: **Windows-1250**.

**Problem pojawił się wtedy, gdy plik zapisany w jednej tabeli otwierało się za pomocą drugiej.** Jeśli w tabeli Windows-1250 liczba `243` oznaczała `ó`, a w innej tabeli ta sama liczba oznaczała coś zupełnie innego, komputer wyświetlał błędny znak.

### Unicode i UTF-8 — globalny standard
Aby raz na zawsze rozwiązać ten problem, stworzono **Unicode**. To gigantyczna tabela, w której każdy znak z każdego języka świata (a nawet emoji 🚀) ma swój unikalny numer.

Najpopularniejszym sposobem zapisu Unicode jest **UTF-8**. Jest on genialny, ponieważ:
1. **Jest kompatybilny z ASCII** — pierwsze 128 znaków wygląda identycznie.
2. **Jest zmienny** — proste litery zajmują 1 bajt, a polskie znaki czy emoji 2-4 bajty.
3. **Jest uniwersalny** — ten sam plik UTF-8 wyświetli się identycznie w każdym nowoczesnym systemie i przeglądarce.

## 3. Skąd biorą się „krzaczki" w praktyce?

„Krzaczki" (tzw. *mojibake*) powstają, gdy **interpretujemy bajty za pomocą niewłaściwej tabeli**.

**Scenariusz:**
1. Masz plik SQL z bazą danych zapisany w kodowaniu **Windows-1250** (częste w starszych systemach).
2. Importujesz go do bazy MariaDB, która oczekuje **UTF-8**.
3. Serwer próbuje odczytać bajty Windows-1250 jako UTF-8. Ponieważ struktura tych kodowań jest różna, zamiast `ó` pojawia się np. `Ã³`.

| Co mamy w pliku (bajty) | Interpretacja jako UTF-8 | Wynik |
| :--- | :--- | :--- |
| `0xF3` (ó w Win-1250) | Nieprawidłowy start sekwencji UTF-8 | `�` lub `Ã³` |

## 4. Kodowanie w bazach danych (MariaDB / phpMyAdmin)

W bazach danych kodowanie występuje na kilku poziomach. Jeśli któryś z nich jest błędny, dane zostaną uszkodzone.

**Gdzie szukać ustawień?**
- **Serwer:** Globalne ustawienie domyślne.
- **Baza danych:** Ustawienie dla konkretnej bazy (np. `utf8mb4_general_ci`).
- **Tabela/Kolumna:** Można ustawić inne kodowanie dla konkretnej kolumny.
- **Połączenie (Connection):** To, jak aplikacja „rozmawia” z serwerem.

### Jak poprawnie importować bazę w phpMyAdmin?
Kiedy importujesz plik `.sql`, w oknie importu zobaczysz opcję **„Kodowanie znaków pliku”**.
- Jeśli plik pochodzi z nowoczesnego systemu $\rightarrow$ wybierz **UTF-8**.
- Jeśli widzisz „krzaczki" po imporcie $\rightarrow$ spróbuj zaimportować ponownie, wybierając **Windows-1250** (lub `cp1250`).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza błędów"
Otrzymałeś plik tekstowy, w którym zamiast słowa „Zarządzanie” widzisz `Zarządzanie` lub `ZarzÅdzanie`. Co to za zapis i czy jest to błąd kodowania, czy celowy format?

??? success "Rozwiązanie 1"
    To nie są „krzaczki", lecz **sekwencje ucieczki Unicode** (Unicode escape sequences). Jest to sposób zapisu znaków specjalnych w kodzie programistycznym (np. w JSON lub Java), aby plik pozostał w czystym ASCII, ale zachował informacje o znakach narodowych.

!!! question "Ćwiczenie 2. Dobór kodowania"
Importujesz bazę danych do phpMyAdmina. Po zapytaniu `SELECT * FROM klienci` zauważasz, że nazwiska z literą `ą` wyświetlają się jako `Ä…`. Jakie kodowanie zostało prawdopodobnie użyte do zapisu pliku, a jakie jest ustawione w bazie?

??? success "Rozwiązanie 2"
    Plik był zapisany w **UTF-8**, ale baza danych (lub połączenie) interpretuje go jako **Windows-1250 / ISO-8859-2**. Wynik `Ä…` jest typowym objawem odczytywania wielobajtowego znaku UTF-8 jako pojedynczych znaków z tabeli 8-bitowej.

!!! question "Ćwiczenie 3. Strategia naprawy"
W bazie danych masz już tysiące rekordów z „krzaczkami". Czy zmiana kodowania całej bazy na `utf8mb4` za pomocą polecenia `ALTER DATABASE` naprawi już istniejące, błędnie zapisane dane? Uzasadnij odpowiedź.

??? success "Rozwiązanie 3"
    **Nie.** Zmiana kodowania bazy zmienia sposób, w jaki serwer będzie traktował *nowe* dane i jak będzie interpretował *stare* bajty. Jeśli dane zostały fizycznie zapisane jako błędne bajty (np. z powodu błędnego importu), sama zmiana ustawienia nie „odkręci” błędnego zapisu. Konieczne jest wyczyszczenie danych i ponowny import z poprawnie wskazanym kodowaniem źródłowym.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co to są tzw. „krzaczki” w tekście?",
    "opcje": [
      "Szyfrowanie danych w celu ich zabezpieczenia",
      "Błędy wyświetlania tekstu wynikające z użycia niewłaściwego kodowania znaków",
      "Specjalny rodzaj czcionki używany w bazach danych",
      "Błąd składniowy w zapytaniu SQL"
    ],
    "poprawna": 1,
    "wyjasnienie": "Krzaczki pojawiają się, gdy komputer interpretuje bajty tekstu za pomocą innej tabeli mapowania niż ta, w której tekst został zapisany."
  },
  {
    "pytanie": "Dlaczego standard UTF-8 jest obecnie najpopularniejszym kodowaniem?",
    "opcje": [
      "Ponieważ zajmuje najwięcej miejsca w pamięci",
      "Ponieważ obsługuje tylko alfabet angielski",
      "Ponieważ jest uniwersalny, kompatybilny z ASCII i obsługuje znaki wszystkich języków świata",
      "Ponieważ jest wymagany przez standard SQL-92"
    ],
    "poprawna": 2,
    "wyjasnienie": "UTF-8 pozwala na zapisanie każdego znaku Unicode, zachowując przy tym wysoką wydajność i kompatybilność ze starszymi systemami."
  },
  {
    "pytanie": "W phpMyAdminie importujesz plik SQL i widzisz błędne znaki polskie. Co powinieneś zrobić w pierwszej kolejności?",
    "opcje": [
      "Usunąć bazę danych i zainstalować MariaDB od nowa",
      "Zmienić kodowanie całej bazy na Latin1",
      "Spróbować zaimportować plik ponownie, zmieniając 'Kodowanie znaków pliku' na Windows-1250 lub UTF-8",
      "Zignorować błędy, bo nie wpływają one na działanie zapytań SELECT"
    ],
    "poprawna": 2,
    "wyjasnienie": "Kluczem do poprawnego importu jest dopasowanie kodowania źródłowego pliku do ustawień importu w phpMyAdminie."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="kodowanie-znakow"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
