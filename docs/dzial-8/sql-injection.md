# Bezpieczeństwo — SQL Injection i Prepared Statements
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

Wyobraź sobie, że budujesz system logowania. Programista tworzy zapytanie, łącząc tekst z pola formularza z komendą SQL. Wydaje się to logiczne, ale właśnie w tym miejscu otwiera się jedna z największych luk w bezpieczeństwie aplikacji internetowych: **SQL Injection** (wstrzykiwanie SQL).

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić mechanizm ataku SQL Injection na przykładzie
    2. wskazać błąd w kodzie aplikacji prowadzący do podatności na wstrzykiwanie SQL
    3. wyjaśnić zasadę działania zapytań parametryzowanych (Prepared Statements)
    4. uzasadnić, dlaczego Prepared Statements eliminują ryzyko SQL Injection

## 1. Czym jest SQL Injection?

SQL Injection występuje wtedy, gdy aplikacja ufa danym wpisanym przez użytkownika i wstawia je bezpośrednio do zapytania SQL za pomocą tzw. **konkatenacji** (łączenia ciągów znaków).

**Przykład niebezpiecznego kodu (pseudo-kod):**
`sql = "SELECT * FROM uzytkownicy WHERE login = '" + pole_login + "' AND haslo = '" + pole_haslo + "';"`

Jeśli uczciwy użytkownik wpisze `jan` i `haslo123`, zapytanie będzie brzmieć:
`SELECT * FROM uzytkownicy WHERE login = 'jan' AND haslo = 'haslo123';` $\rightarrow$ **Wszystko OK.**

Ale jeśli haker w polu login wpisze: `' OR '1'='1`, a pole hasła zostawi puste, zapytanie zmieni się w:
`SELECT * FROM uzytkownicy WHERE login = '' OR '1'='1' AND haslo = '';`

Ponieważ warunek `'1'='1'` jest **zawsze prawdziwy**, baza danych zwróci pierwszy rekord z tabeli (zazwyczaj administratora) i haker zostanie zalogowany bez znajomości hasła!

## 2. Rozwiązanie: Prepared Statements (Zapytania parametryzowane)

Aby zapobiec temu atakowi, programiści stosują **Prepared Statements**. Zamiast łączyć teksty, tworzy się „szablon” zapytania z tzw. placeholderami (zastępnikami), zazwyczaj oznaczonymi znakiem zapytania `?`.

**Jak to działa?**
1. **Przygotowanie:** Aplikacja wysyła do bazy sam szablon:
   `SELECT * FROM uzytkownicy WHERE login = ? AND haslo = ?;`
   Serwer bazy danych analizuje to zapytanie i kompiluje je (ustala plan wykonania).
2. **Przesłanie danych:** Aplikacja wysyła wartości dla parametrów oddzielnie:
   `Parametr 1: 'jan'`, `Parametr 2: 'haslo123'`
3. **Wykonanie:** Serwer wstawia dane w miejsce znaków zapytania, traktując je **wyłącznie jako tekst**, a nie jako część komendy SQL.

Nawet jeśli haker wpisze `' OR '1'='1`, baza danych będzie szukać użytkownika, którego login brzmi dokładnie `' OR '1'='1`. Taki użytkownik nie istnieje, więc atak zostaje zablokowany.

## 3. Porównanie metod

| Cecha | Łączenie tekstów (Konkatenacja) | Prepared Statements |
| :--- | :--- | :--- |
| **Bezpieczeństwo** | Bardzo niskie (podatne na SQL Injection) | Bardzo wysokie |
| **Sposób działania** | Dynamiczne budowanie tekstu zapytania | Statyczny szablon + oddzielne dane |
| **Wydajność** | Każde zapytanie musi być analizowane od nowa | Zapytanie jest kompilowane raz, wykonywane wielokrotnie |
| **Czytelność kodu** | Często nieczytelne (dużo cudzysłowów) | Czysty kod z jasnym podziałem na logikę i dane |

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 możesz otrzymać fragment kodu aplikacji i pytanie: „Czy powyższy kod jest podatny na ataki typu SQL Injection? Uzasadnij odpowiedź i zaproponuj poprawkę”.

**Klucz do odpowiedzi:**
- **Diagnoza:** Szukaj łączenia zmiennych z tekstem zapytania (np. użycie znaku `+` lub interpolacji `f"..."` w Pythonie wewnątrz zapytania SQL).
- **Poprawka:** Zawsze rekomenduj zastosowanie **Prepared Statements** (zapytań parametryzowanych).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Identyfikacja luki"
Przyjrzyj się poniższemu fragmentowi kodu (Java/JDBC). Czy jest on bezpieczny? Uzasadnij odpowiedź.
```java
String query = "SELECT * FROM produkty WHERE nazwa = '" + userName + "'";
ResultSet rs = statement.executeQuery(query);
```

??? success "Rozwiązanie 1"
    **Nie jest bezpieczny.** Kod stosuje konkatenację (łączenie) zmiennej `userName` bezpośrednio z tekstem zapytania. Jest to klasyczna podatność na SQL Injection. Haker mógłby wpisać w `userName` np. `' OR 1=1 --`, co spowodowałoby wyświetlenie wszystkich produktów w bazie.

!!! question "Ćwiczenie 2. Projektowanie poprawki"
Jak powinno wyglądać zapytanie z poprzedniego ćwiczenia, aby było bezpieczne? (Zapisz je w formie szablonu z placeholderem).

??? success "Rozwiązanie 2"
    Należy zastosować Prepared Statement:
    `SELECT * FROM produkty WHERE nazwa = ?;`
    (W kodzie aplikacji wartość `userName` zostałaby przypisana do pierwszego parametru zapytania).

!!! question "Ćwiczenie 3. Analiza ataku"
Haker próbuje przejąć bazę danych, wpisując w polu wyszukiwania produktów: `'; DROP TABLE produkty; --`. Co się stanie, jeśli aplikacja używa zwykłego łączenia tekstów, a co jeśli używa Prepared Statements?

??? success "Rozwiązanie 3"
    - **Przy zwykłym łączeniu:** Baza wykona dwa zapytania: najpierw SELECT, a potem `DROP TABLE produkty;`, co doprowadzi do całkowitego usunięcia tabeli z produktami.
    - **Przy Prepared Statements:** Baza będzie szukać produktu, którego nazwa brzmi dokładnie `'; DROP TABLE produkty; --`. Nie znajdzie go i zwróci pusty wynik. Baza pozostanie bezpieczna.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co to jest SQL Injection?",
    "opcje": [
      "Sposób na szybkie importowanie danych do bazy",
      "Atak polegający na wstrzyknięciu złośliwego kodu SQL do zapytania poprzez dane wejściowe użytkownika",
      "Metoda optymalizacji indeksów w MariaDB",
      "Rodzaj błędu składniowego w instrukcji CREATE TABLE"
    ],
    "poprawna": 1,
    "wyjasnienie": "SQL Injection pozwala hakerowi 'oszukać' aplikację i zmusić ją do wykonania nieplanowanych komend SQL."
  },
  {
    "pytanie": "Dlaczego Prepared Statements chronią przed SQL Injection?",
    "opcje": [
      "Ponieważ szyfrują hasła użytkowników",
      "Ponieważ blokują dostęp do bazy dla osób spoza sieci lokalnej",
      "Ponieważ oddzielają strukturę zapytania od danych, traktując dane wyłącznie jako tekst",
      "Ponieważ automatycznie usuwają znaki specjalne z bazy danych"
    ],
    "poprawna": 2,
    "wyjasnienie": "Dzięki temu, że struktura zapytania jest ustalona przed podaniem danych, dane wejściowe nie mogą zmienić logiki działania zapytania."
  },
  {
    "pytanie": "Który z poniższych zapisów jest przykładem bezpiecznego podejścia do budowania zapytań?",
    "opcje": [
      "\"SELECT * FROM users WHERE id = \" + id",
      "\"SELECT * FROM users WHERE id = '\" + id + \"'\"",
      "\"SELECT * FROM users WHERE id = ?\"",
      "\"SELECT * FROM users WHERE id = \" + String.valueOf(id)"
    ],
    "poprawna": 2,
    "wyjasnienie": "Znak zapytania (?) jest placeholderem charakterystycznym dla zapytań parametryzowanych (Prepared Statements)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="sql-injection"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
