# Plan na 150 minut — kolejność pracy przy arkuszu
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · trening egzaminacyjny**

Czas to Twój najcenniejszy zasób podczas egzaminu praktycznego. Wiele osób traci punkty nie dlatego, że nie znają SQL-a, ale dlatego, że utknęły przy jednym trudnym zapytaniu i nie zdążyły zrobić pozostałych, prostszych zadań.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. zarządzać czasem podczas części praktycznej z bazy danych
    2. stosować optymalną kolejność wykonywania zadań
    3. unikać pułapek czasowych, które prowadzą do stresu i błędów

## 1. Złota zasada: Przegląd całości (5–10 min)

Nigdy nie zaczynaj pisać kodu w pierwszej sekundzie po otrzymaniu arkusza. Poświęć kilka minut na:
- **Przeczytanie wszystkich poleceń** związanych z bazą danych.
- **Zidentyfikowanie trudności** — zaznacz, które zapytania wydają się proste, a które mogą sprawić problem (np. złączenia trzech tabel).
- **Sprawdzenie pliku .sql** — upewnij się, że plik z bazą jest dostępny i poprawnie nazwany.

## 2. Optymalna ścieżka pracy (Workflow)

Zalecamy poniższą kolejność, aby „zaklepać” najłatwiejsze punkty na starcie:

### Krok 1: Import bazy i przygotowanie (10 min)
- Zaimportuj plik `.sql` do phpMyAdmina.
- Sprawdź, czy tabele się zaimportowały i czy widać w nich dane.
- Utwórz plik `kwerendy.txt` (lub inny wskazany w arkuszu).
- **Dlaczego?** Jeśli import nie zadziała, musisz natychmiast zgłosić to komisji. To fundament całej pracy.

### Krok 2: Proste zapytania SELECT (20–30 min)
- Wykonaj zapytania filtrujące (`WHERE`), sortujące (`ORDER BY`) i ograniczające wyniki (`LIMIT`).
- Zapisz kod do pliku i **od razu zrób zrzut ekranu**.
- **Dlaczego?** To są „pewne punkty”. Szybkie sukcesy budują pewność siebie.

### Krok 3: Zapytania z relacją JOIN (30–45 min)
- Wykonaj zapytania łączące dwie lub więcej tabel.
- Jeśli zapytanie nie działa, spróbuj najpierw połączyć tylko dwie tabele, sprawdź wynik, a potem dodawaj kolejne.
- Zapisz kod i zrób zrzut ekranu.

### Krok 4: Polecenia administracyjne (15–20 min)
- Stwórz użytkownika (`CREATE USER`).
- Nadaj uprawnienia (`GRANT`).
- Sprawdź, czy użytkownik może się zalogować (jeśli polecenie tego wymaga).
- **Dlaczego?** Te polecenia są schematyczne. Jeśli znasz składnię, wykonasz je w 5 minut.

### Krok 5: Weryfikacja i „doczyszczanie” (20 min)
- Wróć do zapytań, przy których utknąłeś.
- Sprawdź, czy wszystkie zrzuty ekranu są wyraźne i zawierają pasek zadań.
- Upewnij się, że w pliku `kwerendy.txt` nie ma literówek.

## 3. Jak nie utknąć? (Strategie ratunkowe)

| Sytuacja | Co zrobić? |
| :--- | :--- |
| **Zapytanie zwraca pusty wynik, a powinno coś zwrócić** | Sprawdź literówki w nazwach kolumn i wartościach w `WHERE`. Sprawdź, czy nie użyłeś `AND` zamiast `OR`. |
| **JOIN „wycina” wszystkie wiersze** | Sprawdź, czy klucze obce w obu tabelach mają ten sam typ danych i czy w ogóle istnieją pasujące rekordy. Spróbuj zamienić `JOIN` na `LEFT JOIN`. |
| **Zostało 20 minut, a brakuje jednego trudnego zapytania** | Zrób wszystko, co potrafisz. Napisz w pliku `kwerendy.txt` poprawną strukturę zapytania, nawet jeśli nie działa idealnie — możesz dostać część punktów za poprawną koncepcję. |

!!! warning "Pułapka zrzutów ekranu"
    Największy błąd to robienie wszystkich zrzutów na samym końcu. Jeśli komputer się zawiesi lub zrestartuje, stracisz dowody swojej pracy. **Zasada: jedno zapytanie $\rightarrow$ jeden zrzut $\rightarrow$ jeden zapis w pliku.**

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza czasu"
Masz do wykonania 4 zapytania i 2 polecenia administracyjne. Zapytania 1 i 2 zajmują Ci po 5 minut. Zapytanie 3 (z JOIN) nie działa od 20 minut. Co robisz?

??? success "Rozwiązanie 1"
    Zostawiam zapytanie 3 i przechodzę do zapytania 4 oraz poleceń administracyjnych. Zabezpieczam „łatwe punkty”. Wracam do zapytania 3 dopiero, gdy wszystko inne jest gotowe i zweryfikowane.

!!! question "Ćwiczenie 2. Checklisty"
Wymień trzy rzeczy, które muszą znaleźć się na zrzucie ekranu z wynikiem zapytania, aby nie został odrzucony przez egzaminatora.

??? success "Rozwiązanie 2"
    1. Wynik zapytania w phpMyAdminie (tabela z danymi).
    2. Treść wpisanego zapytania SQL.
    3. Pasek zadań systemu Windows (z datą i godziną).

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Kiedy najlepiej zrobić zrzut ekranu z wynikiem zapytania?",
    "opcje": [
      "Na samym końcu, gdy wszystkie zadania są gotowe",
      "Zaraz po każdym poprawnie wykonanym zapytaniu",
      "Tylko dla najtrudniejszych zadań",
      "Gdy komisja poprosi o pokazanie ekranu"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zasada 'jedno zapytanie $\rightarrow$ jeden zrzut' chroni przed utratą pracy w razie awarii sprzętu i pozwala lepiej zarządzać czasem."
  },
  {
    "pytanie": "Jaki jest pierwszy krok po otrzymaniu arkusza?",
    "opcje": [
      "Szybkie wpisanie pierwszego zapytania",
      "Zrobienie zrzutu ekranu pustej bazy",
      "Przejrzenie wszystkich zadań i ocena ich trudności",
      "Stworzenie konta użytkownika"
    ],
    "poprawna": 2,
    "wyjasnienie": "Przegląd całości pozwala zaplanować kolejność pracy i uniknąć stresu związanego z trudnym zadaniem na samym początku."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="plan-150min"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
