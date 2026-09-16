# Najczęstsze błędy i ile kosztują w punktach
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · trening egzaminacyjny**

Na egzaminie praktycznym punkty zdobywa się nie tylko za to, co zrobiłeś dobrze, ale traci się je za konkretne uchybienia. Znajomość najczęstszych błędów pozwala na ich uniknięcie i „ratowanie” punktów tam, gdzie zapytanie nie jest idealne.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. zidentyfikować najczęstsze błędy w zapytaniach SQL i dokumentacji
    2. ocenić potencjalną stratę punktową za konkretne pomyłki
    3. stosować techniki minimalizowania strat w przypadku popełnienia błędu

## 1. Błędy w zapytaniach (Kryteria merytoryczne)

W większości arkuszy ocena zapytania jest binarna (jest/nie jest) lub punktowana cząstkowo.

| Typ błędu | Opis | Szacowany koszt |
| :--- | :--- | :--- |
| **Błąd składniowy** | Zapytanie nie uruchamia się (np. brak przecinka, literówka w `SELECT`) | **Całkowita utrata punktów** za to zapytanie |
| **Błędny typ złączenia** | Użycie `JOIN` zamiast `LEFT JOIN` (wynik jest niepełny) | **Utrata 50–100% punktów** (zależnie od arkusza) |
| **Błędny warunek** | Użycie `>` zamiast `>=` lub błędna kolumna w `WHERE` | **Utrata 20–50% punktów** |
| **Brak GROUP BY** | Użycie funkcji `SUM`/`COUNT` bez grupowania po pozostałych kolumnach | **Całkowita utrata punktów** (zapytanie zwraca błąd) |
| **Pominięcie kolumny** | Brak jednej z wymaganych kolumn w `SELECT` | **Utrata 10–30% punktów** |

## 2. Błędy w dokumentacji (Kryteria formalne)

Dokumentacja jest tak samo ważna jak kod. Błąd formalny może kosztować tyle samo, co błąd w SQL-u.

| Błąd formalny | Opis | Szacowany koszt |
| :--- | :--- | :--- |
| **Brak paska zadań** | Zrzut ekranu nie zawiera daty i godziny z systemu | **Utrata punktów za zrzut** (często całkowita) |
| **Nieczytelny zrzut** | Rozmyty obraz, ucięta tabela z wynikami | **Utrata punktów za zrzut** |
| **Brak zapytania na zrzucie** | Widać tylko wynik, ale nie widać kodu SQL w phpMyAdminie | **Utrata punktów za zrzut** |
| **Rozbieżność** | Kod w pliku `kwerendy.txt` różni się od tego na zrzucie ekranu | **Utrata punktów za oba elementy** |
| **Brak pliku z kwerendami** | Brak pliku tekstowego z zapisem zapytania | **Utrata wszystkich punktów za dokumentację** |

## 3. Jak ratować punkty? (Strategie przetrwania)

Jeśli widzisz, że popełniłeś błąd, ale nie masz już czasu na poprawkę:

1. **Zadbaj o formalności:** Nawet jeśli zapytanie jest błędne, zrób zrzut ekranu i zapisz je w pliku. Czasami egzaminator przyzna punkt za poprawny proces, mimo błędnego wyniku.
2. **Komentuj w pliku:** Jeśli wiesz, gdzie jest błąd, ale nie potrafisz go naprawić, dopisz w pliku `kwerendy.txt` krótką notatkę: *„Tu prawdopodobnie powinien być LEFT JOIN, ale nie udało mi się go poprawnie skonfigurować”*. Może to pomóc w ocenie Twojej wiedzy.
3. **Zabezpiecz administrację:** Polecenia `CREATE USER` i `GRANT` są najprostsze. Nie pozwól, aby błąd w jednym trudnym zapytaniu odciągnął Cię od tych pewnych punktów.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza zrzutu"
Uczeń przesłał zrzut ekranu, na którym widać idealnie poprawną tabelę z wynikami zapytania. Jednak zrzut obejmuje tylko środek ekranu — nie widać paska zadań ani treści zapytania SQL. Ile punktów za ten konkretny element prawdopodobnie otrzyma?

??? success "Rozwiązanie 1"
    **0 punktów.** Zrzut ekranu bez treści zapytania i paska zadań nie jest dowodem na to, że uczeń samodzielnie i poprawnie wykonał zadanie w wyznaczonym czasie.

!!! question "Ćwiczenie 2. Wybór mniejszego zła"
Zauważyłeś, że w zapytaniu z relacją zapomniałeś o jednej z trzech wymaganych kolumn w `SELECT`. Masz 2 minuty do końca egzaminu. Czy ryzykujesz zmianę kodu i ponowne uruchomienie zapytania?

??? success "Rozwiązanie 2"
    **Tak, jeśli jesteś pewny poprawki.** Dodanie jednej kolumny do `SELECT` jest szybkie i mało ryzykowne. Jeśli jednak nie masz pewności, bezpieczniej jest zostawić działające zapytanie z brakującą kolumną (stracisz kilka punktów) niż zepsuć je całkowicie (stracisz wszystkie punkty).

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Który z poniższych błędów jest najcięższy pod względem punktowym?",
    "opcje": [
      "Brak jednej kolumny w zapytaniu SELECT",
      "Użycie błędnego operatora porównania (np. > zamiast >=)",
      "Błąd składniowy uniemożliwiający uruchomienie zapytania",
      "Zrobienie zrzutu ekranu bez paska zadań"
    ],
    "poprawna": 2,
    "wyjasnienie": "Błąd składniowy sprawia, że zapytanie nie generuje żadnego wyniku, co zazwyczaj skutkuje całkowitą utratą punktów za to zadanie."
  },
  {
    "pytanie": "Co się stanie, jeśli kod zapytania w pliku kwerendy.txt będzie inny niż ten widoczny na zrzucie ekranu?",
    "opcje": [
      "Egzaminator przyjmie wersję z pliku tekstowego",
      "Egzaminator przyjmie wersję ze zrzutu ekranu",
      "Obie wersje zostaną odrzucone jako niespójne",
      "Nic się nie stanie, o ile wynik na zrzucie jest poprawny"
    ],
    "poprawna": 2,
    "wyjasnienie": "Rozbieżność sugeruje, że uczeń mógł modyfikować kod po zrobieniu zrzutu lub używać gotowych rozwiązań. Jest to traktowane jako poważny błąd formalny."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="bledy-punkty"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
