# Zarządzanie połączeniami i błędy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

Połączenie z bazą danych nie jest „darmowe”. Każda otwarta sesja zajmuje pamięć RAM na serwerze i utylizuje jeden z dostępnych slotów połączeń. Jeśli aplikacja otwiera połączenia i nigdy ich nie zamyka, serwer w pewnym momencie przestanie przyjmować nowych użytkowników, mimo że proces bazy wciąż działa. To zjawisko nazywamy **wyciekiem zasobów**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. uzasadnić konieczność zamykania połączeń z bazą danych
    2. wyjaśnić zasadę działania puli połączeń (Connection Pool)
    3. odróżnić błędy połączenia od błędów wykonania zapytania
    4. zaplanować prosty mechanizm obsługi błędów w aplikacji (try-catch)

## 1. Zamykanie połączeń: Dlaczego to ważne?

Każde połączenie to tzw. „ciężki zasób”. Serwer MariaDB ma zdefiniowany limit maksymalnych jednoczesnych połączeń (parametr `max_connections`).

Jeśli Twoja aplikacja robi tak:
`Otwórz połączenie` $\rightarrow$ `Wykonaj SELECT` $\rightarrow$ `Zapomnij o zamknięciu`

To przy każdym odświeżeniu strony przez użytkownika, jeden slot na serwerze zostaje zajęty „na zawsze” (aż do restartu serwera lub timeoutu). Szybko dojdziesz do błędu:
`Too many connections`

**Złota zasada programisty:**
Każde połączenie otwarte w bloku `try` musi zostać zamknięte w bloku `finally` (który wykona się zawsze, nawet jeśli wystąpił błąd).

## 2. Pula połączeń (Connection Pool)

Ustanowienie połączenia (TCP handshake, autoryzacja) trwa stosunkowo długo. Gdyby aplikacja otwierała i zamykała połączenie przy każdym pojedynczym zapytaniu, system działałby bardzo wolno.

Rozwiązaniem jest **Pula Połączeń (Connection Pool)**. Działa ona jak „parking” dla otwartych sesji:

1. **Start:** Przy uruchomieniu aplikacji pula tworzy np. 10 otwartych połączeń i trzyma je w gotowości.
2. **Zapytanie:** Gdy aplikacja potrzebuje bazy, nie tworzy nowego połączenia, lecz „pożycza” wolne z puli.
3. **Wykonanie:** Zapytanie zostaje wykonane.
4. **Zwrot:** Zamiast zamykać połączenie, aplikacja „zwraca” je do puli, by mógł z niego skorzystać inny wątek programu.

**Zalety puli:**
- Błyskawiczny dostęp do bazy (brak narzutu na autoryzację).
- Kontrola nad maksymalną liczbą połączeń do serwera.

## 3. Obsługa błędów w aplikacji

W świecie rzeczywistym połączenie z bazą prawie zawsze w końcu zawiedzie. Kluczowe jest to, jak aplikacja na to zareaguje.

**Rodzaje błędów:**
- **Błędy łączności (Connectivity Errors):** `Unknown host`, `Connection refused`, `Connection timeout`. Oznaczają one, że aplikacja w ogóle nie dotarła do serwera.
- **Błędy autoryzacji (Auth Errors):** `Access denied for user...`. Oznaczają, że serwer odpowiedział, ale nie zaakceptował danych logowania.
- **Błędy wykonania (Execution Errors):** `Table doesn't exist`, `Duplicate entry for key 'PRIMARY'`. Oznaczają, że połączenie działa, ale samo zapytanie SQL jest błędne lub łamie reguły bazy.

**Jak to obsłużyć w kodzie?**
Programiści używają bloków `try-catch`:
- `try { ... }` $\rightarrow$ Próbuj wykonać zapytanie.
- `catch (ConnectionException e) { ... }` $\rightarrow$ Jeśli nie ma sieci, wyświetl: „Brak połączenia z serwerem”.
- `catch (SQLException e) { ... }` $\rightarrow$ Jeśli zapytanie jest błędne, zapisz błąd do logów i wyświetl: „Wystąpił błąd podczas zapisu danych”.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 możesz być poproszony o analizę komunikatu błędu i wskazanie przyczyny.

**Klucz do diagnozy:**
- `Too many connections` $\rightarrow$ Wyciek zasobów w aplikacji lub zbyt mały limit na serwerze.
- `Connection refused` $\rightarrow$ Serwer bazy jest wyłączony lub port jest zablokowany przez firewall.
- `Duplicate entry` $\rightarrow$ Próba wstawienia wartości, która już istnieje w kolumnie z kluczem PRIMARY/UNIQUE.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza zasobów"
Programista zauważył, że aplikacja działa szybko przez pierwsze 15 minut po uruchomieniu, a potem nagle wszystkie zapytania do bazy zaczynają zwracać błąd `Too many connections`. Co najprawdopodobniej dzieje się w kodzie aplikacji?

??? success "Rozwiązanie 1"
    Aplikacja prawdopodobnie otwiera połączenia z bazą danych, ale nie zamyka ich po zakończeniu pracy (wyciek zasobów). Każde zapytanie zajmuje nowy slot, aż do wyczerpania limitu `max_connections` na serwerze.

!!! question "Ćwiczenie 2. Pula połączeń"
Porównaj czas odpowiedzi aplikacji przy każdym zapytaniu tworzącej nowe połączenie vs aplikacji korzystającej z puli połączeń. Która będzie szybsza i dlaczego?

??? success "Rozwiązanie 2"
    Szybsza będzie aplikacja z pulą połączeń, ponieważ eliminuje ona czasochłonny proces nawiązywania połączenia TCP oraz proces autoryzacji (logowania) przy każdym zapytaniu.

!!! question "Ćwiczenie 3. Mapowanie błędów"
Dopasuj komunikat błędu do jego prawdopodobnej przyczyny:
1. `Connection timeout` $\rightarrow$ [ ]
2. `Access denied for user 'app'@'localhost'` $\rightarrow$ [ ]
3. `Table 'sklep.produkty' doesn't exist` $\rightarrow$ [ ]

A. Błędne hasło lub brak uprawnień dla użytkownika.
B. Błąd w zapytaniu SQL (literówka w nazwie tabeli).
C. Serwer bazy nie odpowiada lub firewall blokuje port.

??? success "Rozwiązanie 3"
    1 $\rightarrow$ C
    2 $\rightarrow$ A
    3 $\rightarrow$ B

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co to jest 'Connection Pool' (pula połączeń)?",
    "opcje": [
      "Sposób na kopiowanie bazy danych na kilka serwerów",
      "Zbiór wcześniej otwartych połączeń z bazą, które są współdzielone przez aplikację",
      "Specjalny rodzaj indeksu przyspieszającego SELECT",
      "Błąd polegający na zbyt dużej liczbie rekordów w tabeli"
    ],
    "poprawna": 1,
    "wyjasnienie": "Pula połączeń pozwala unikać kosztownego procesu otwierania i zamykania sesji przy każdym zapytaniu."
  },
  {
    "pytanie": "Gdzie w kodzie aplikacji najlepiej umieścić instrukcję zamykania połączenia z bazą, aby mieć pewność, że zostanie wykonana nawet przy wystąpieniu błędu?",
    "opcje": [
      "W bloku try",
      "W bloku catch",
      "W bloku finally",
      "Na samym początku funkcji"
    ],
    "poprawna": 2,
    "wyjasnienie": "Blok finally jest gwarantowany do wykonania niezależnie od tego, czy w bloku try wystąpił wyjątek, czy nie."
  },
  {
    "pytanie": "Co oznacza błąd 'Too many connections'?",
    "opcje": [
      "W bazie jest zbyt wiele tabel",
      "Zbyt wielu użytkowników próbuje jednocześnie połączyć się z serwerem bazy danych",
      "Zapytanie SQL jest zbyt długie",
      "Użytkownik nie posiada hasła"
    ],
    "poprawna": 1,
    "wyjasnienie": "Serwer ma limit maksymalnych jednoczesnych połączeń. Błąd pojawia się, gdy wszystkie sloty są zajęte."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="zarzadzanie-polaczeniami"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
