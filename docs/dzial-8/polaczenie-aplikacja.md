# Połączenie aplikacji z bazą
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

Zastanawiałeś się kiedyś, jak to się dzieje, że kiedy klikasz „Zaloguj” w aplikacji, ona „wie”, czy Twoje hasło jest poprawne? Aplikacja nie „widzi” bazy danych tak jak Ty przez konsolę MariaDB. Program musi użyć specjalnego narzędzia, które pozwoli mu wysłać zapytanie SQL do serwera i odebrać odpowiedź.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić rolę sterownika (drivera) w komunikacji aplikacji z bazą danych
    2. zidentyfikować i poprawnie sformułować elementy ciągu połączenia (connection string)
    3. opisać kolejność zdarzeń podczas nawiązywania sesji z serwerem SQL
    4. wskazać różnicę między połączeniem lokalnym a zdalnym

## 1. Sterownik (Driver) — Tłumacz aplikacji

Aplikacje piszemy w wielu językach (Java, Python, C#, PHP), a baza danych „mówi” w protokole sieciowym MariaDB/MySQL. Aby programista nie musiał pisać własnego protokołu sieciowego, korzysta ze **sterownika (drivera)**.

Sterownik to biblioteka, którą dołącza się do projektu. Działa ona jak tłumacz:
- Aplikacja mówi: `połącz się z bazą o nazwie 'sklep'`.
- Sterownik zamienia to na konkretne pakiety danych wysyłane przez sieć do portu 3306.

**Przykłady popularnych sterowników:**
- Java $\rightarrow$ JDBC (Java Database Connectivity)
- Python $\rightarrow$ `mysql-connector-python` lub `PyMySQL`
- PHP $\rightarrow$ `mysqli` lub `PDO`

## 2. Ciąg połączenia (Connection String)

Aby sterownik wiedział, gdzie szukać bazy i jak się do niej dostać, przekazuje mu się tzw. **ciąg połączenia**. Jest to specjalnie sformatowany tekst, który zawiera wszystkie niezbędne dane adresowe.

**Kluczowe elementy ciągu połączenia:**
- **Host (Serwer):** adres IP lub nazwa komputera (np. `localhost`, `192.168.1.10`, `db.firma.pl`).
- **Port:** numer „drzwi” do serwera (domyślnie dla MariaDB/MySQL jest to `3306`).
- **Użytkownik (User):** nazwa konta z uprawnieniami (np. `app_user`).
- **Hasło (Password):** tajny klucz do konta.
- **Baza danych (Database):** nazwa konkretnej bazy, do której chcemy wejść.

**Przykład (konceptualny):**
`Server=localhost; Port=3306; User=sklep_app; Password=SilezneHaslo123!; Database=sklep_db;`

## 3. Jak wygląda proces łączenia?

Nawiązanie połączenia to proces kilku kroków, który dzieje się w ułamku sekundy:

1. **Inicjalizacja:** Aplikacja ładuje sterownik i przekazuje mu ciąg połączenia.
2. **Ustanowienie połączenia:** Sterownik próbuje nawiązać połączenie TCP/IP z serwerem pod wskazanym adresem i portem.
3. **Autoryzacja:** Serwer pyta: „Kto to? Podaj hasło”. Sterownik wysyła login i hasło.
4. **Weryfikacja uprawnień:** Serwer sprawdza w swojej tabeli użytkowników, czy dany host ma prawo wejść do tej bazy.
5. **Sesja:** Jeśli wszystko jest OK, serwer otwiera **sesję**. Aplikacja może teraz wysyłać zapytania SQL.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 możesz spotkać się z zadaniem, w którym musisz wskazać błąd w konfiguracji połączenia aplikacji z bazą.

**Typowe pułapki:**
- **Błędny host:** Aplikacja próbuje łączyć się z `localhost`, podczas gdy baza jest na innym serwerze w sieci.
- **Zablokowany port:** Firewall blokuje port 3306, przez co aplikacja „wisi” i wyrzuca błąd `Connection Timeout`.
- **Brak uprawnień dla hosta:** Użytkownik został stworzony jako `'app_user'@'localhost'`, a aplikacja łączy się z innego komputera (powinno być `'app_user'@'%'`).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza ciągu połączenia"
Przeanalizuj poniższy ciąg połączenia i wypisz jego elementy:
`Server=192.168.0.50; Port=3306; Database=hr_system; User=hr_app; Password=AdminPassword2026;`

??? success "Rozwiązanie 1"
    - Host: `192.168.0.50`
    - Port: `3306`
    - Baza danych: `hr_system`
    - Użytkownik: `hr_app`
    - Hasło: `AdminPassword2026`

!!! question "Ćwiczenie 2. Wybór hosta"
Aplikacja działa na tym samym komputerze, na którym zainstalowany jest serwer MariaDB. Jaką wartość należy wpisać w polu `Server`/`Host` w ustawieniach aplikacji?

??? success "Rozwiązanie 2"
    Należy wpisać `localhost` (lub adres pętli zwrotnej `127.0.0.1`).

!!! question "Ćwiczenie 3. Diagnoza błędu"
Programista otrzymuje błąd `Access denied for user 'web_user'@'10.0.0.5'`. Wiemy, że hasło jest poprawne. Co prawdopodobnie jest przyczyną problemu w konfiguracji bazy danych?

??? success "Rozwiązanie 3"
    Użytkownik `web_user` prawdopodobnie został utworzony tylko dla hosta `localhost` (lub innego konkretnego adresu), a nie dla adresu `10.0.0.5` (z którego łączy się aplikacja). Należy zaktualizować uprawnienia użytkownika w bazie danych.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym jest sterownik (driver) bazy danych?",
    "opcje": [
      "Programem do zarządzania dyskami twardymi",
      "Biblioteką umożliwiającą aplikacji komunikację z serwerem bazy danych",
      "Sposobem na przyspieszenie zapytań SELECT",
      "Rodzajem zapytania SQL służącego do tworzenia tabel"
    ],
    "poprawna": 1,
    "wyjasnienie": "Sterownik działa jako pośrednik/tłumacz między kodem aplikacji a protokołem sieciowym bazy danych."
  },
  {
    "pytanie": "Który z poniższych elementów jest niezbędny w ciągu połączenia, aby serwer wiedział, do której bazy danych ma udzielić dostępu?",
    "opcje": [
      "Port",
      "Host",
      "Database (Nazwa bazy)",
      "Driver Version"
    ],
    "poprawna": 2,
    "wyjasnienie": "W jednym systemie może być wiele baz danych. Parametr 'Database' wskazuje, z którą z nich aplikacja chce pracować."
  },
  {
    "pytanie": "Co oznacza błąd 'Connection Timeout' podczas próby połączenia aplikacji z bazą?",
    "opcje": [
      "Hasło do użytkownika jest niepoprawne",
      "Nazwa bazy danych nie istnieje",
      "Aplikacja nie może nawiązać kontaktu z serwerem (np. przez firewall lub błędny adres IP)",
      "Użytkownik nie ma uprawnień do danej tabeli"
    ],
    "poprawna": 2,
    "wyjasnienie": "Timeout oznacza, że aplikacja wysłała zapytanie o połączenie, ale nie otrzymała żadnej odpowiedzi w określonym czasie."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="polaczenie-aplikacja"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
