# Pełne zadanie praktyczne — przebieg i samoocena
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · trening egzaminacyjny**

Teoria i pojedyncze ćwiczenia są ważne, ale dopiero praca z pełnym arkuszem pozwala sprawdzić, czy potrafisz połączyć wszystkie umiejętności w jedną całość pod presją czasu.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. przejść przez cały proces realizacji zadania egzaminacyjnego (od importu do zrzutów)
    2. samodzielnie ocenić poprawność swoich rozwiązań na podstawie klucza
    3. zidentyfikować obszary, które wymagają dodatkowych ćwiczeń przed egzaminem

## 1. Jak pracować z zadaniem treningowym?

Aby trening był skuteczny, musisz go przeprowadzić w warunkach zbliżonych do egzaminacyjnych:
- **Wyłącz telefon** i powiadomienia w komputerze.
- **Nie zaglądaj do notatek** ani do internetu.
- **Ustaw stoper** na 150 minut (lub krócej, np. 90 min, aby zwiększyć dyscyplinę).
- **Dokumentuj wszystko** — zapisuj kwerendy w pliku i rób zrzuty ekranu.

## 2. Scenariusz zadania (Przykład)

W zadaniach treningowych zazwyczaj otrzymujesz:
1. **Plik `.sql`** (np. `sklep_elektronika.sql`) do importu.
2. **Opis bazy** (co oznaczają tabele).
3. **Zestaw 4-6 poleceń**, np.:
    - Wyświetl wszystkich klientów z miasta Kraków, którzy dokonali zakupu w ostatnim miesiącu.
    - Wyświetl nazwę produktu oraz nazwę kategorii dla wszystkich produktów, których cena jest wyższa niż 500 zł.
    - Wyświetl listę kategorii, w których znajduje się więcej niż 10 produktów.
    - Stwórz użytkownika `admin_sklep` i nadaj mu uprawnienia do wszystkich operacji na bazie.

## 3. Proces samooceny (Klucz)

Po zakończeniu pracy nie sprawdzaj tylko, czy „wynik wygląda ok”. Sprawdź swoje rozwiązanie pod kątem technicznym:

### Czy zapytania są poprawne?
- **Słowa kluczowe:** Czy użyłeś właściwego typu złączenia (`JOIN` vs `LEFT JOIN`)?
- **Warunki:** Czy `WHERE` filtruje dokładnie to, o co prosił arkusz?
- **Agregacja:** Jeśli w poleceniu jest słowo „liczba”, „suma” lub „średnia”, czy użyłeś funkcji agregującej i `GROUP BY`?
- **Składnia:** Czy każda instrukcja kończy się średnikiem `;`?

### Czy dokumentacja jest kompletna?
- **Zrzuty:** Czy każdy zrzut zawiera pasek zadań? Czy wynik zapytania jest czytelny?
- **Plik tekstowy:** Czy kwerendy w pliku są identyczne z tymi, które uruchomiłeś w phpMyAdminie?

## 4. Analiza błędów

Jeśli Twoje zapytanie nie działało, nie ograniczaj się do znalezienia poprawnej odpowiedzi. Zadaj sobie pytania:
- *Dlaczego myślałem, że to zadziała?*
- *Gdzie popełniłem błąd w logice (np. źle połączyłem tabele)?*
- *Jakiego elementu składni nie pamiętałem?*

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza polecenia"
Polecenie brzmi: „Wyświetl nazwę klienta oraz datę zamówienia dla wszystkich klientów, którzy NIE złożyli żadnego zamówienia”.
Jakiego typu złączenia (JOIN) musisz użyć i na jaką wartość w kolumnie klucza obcego musisz sprawdzić warunek w `WHERE`?

??? success "Rozwiązanie 1"
    Należy użyć **LEFT JOIN** (z tabeli klienci do zamówień). W sekcji `WHERE` należy szukać rekordów, w których identyfikator zamówienia (klucz obcy w tabeli zamówień) jest **NULL** (`WHERE zamowienia.id IS NULL`).

!!! question "Ćwiczenie 2. Pułapka zrzutów"
Zrobiłeś zrzut ekranu, na którym widać tabelę z wynikami, ale nie widać treści zapytania SQL, które do tego doprowadziło. Czy taki zrzut zostanie uznany przez egzaminatora?

??? success "Rozwiązanie 2"
    **Nie.** Zrzut ekranu musi udowodnić, że wynik został osiągnięty za pomocą konkretnego zapytania. Egzaminator musi widzieć zarówno wpisany kod SQL, jak i zwrócony wynik w jednej ramce.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaka jest najważniejsza zasada podczas wykonywania zadania treningowego?",
    "opcje": [
      "Wykorzystanie wszystkich dostępnych notatek i internetu",
      "Szybkie ukończenie zadania, bez względu na zrzuty ekranu",
      "Praca w warunkach izolacji i z limitem czasu",
      "Zrobienie zrzutów ekranu dopiero po zakończeniu wszystkich kwerend"
    ],
    "poprawna": 2,
    "wyjasnienie": "Tylko trening w warunkach zbliżonych do egzaminacyjnych pozwala wypracować odporność na stres i nawyk poprawnego dokumentowania pracy."
  },
  {
    "pytanie": "Co zrobić, gdy podczas treningu utkniesz przy jednym zapytaniu na ponad 20 minut?",
    "opcje": [
      "Przerwać cały trening i przejrzeć notatki",
      "Zostawić to zadanie, przejść do kolejnych, a na koniec wrócić do problemu",
      "Ciągle próbować do skutku, ignorując pozostałe zadania",
      "Zmienić bazę danych na inną"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zgodnie z planem na 150 minut, priorytetem jest zabezpieczenie punktów z łatwiejszych zadań."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="zadanie-praktyczne"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
