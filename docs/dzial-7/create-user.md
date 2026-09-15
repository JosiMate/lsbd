# Konta użytkowników — CREATE USER
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VII**

Do tej pory pracowaliśmy na koncie administratora (`root`), który ma nieograniczoną władzę nad wszystkimi bazami danych. W realnych systemach jest to ogromne ryzyko bezpieczeństwa. Jeśli aplikacja internetowa zostanie zhakowana, a będzie łączyć się z bazą jako `root`, haker zyska dostęp do wszystkiego. Dlatego kluczową umiejętnością administratora jest tworzenie kont użytkowników z ograniczonymi uprawnieniami.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. tworzyć nowych użytkowników w systemie MariaDB/MySQL
    2. nadawać użytkownikom hasła i określać sposób łączenia się z serwerem
    3. usuwać niepotrzebne konta z systemu
    4. wyjaśnić różnicę między kontem root a kontem aplikacyjnym

## 1. Kto jest użytkownikiem bazy danych?

W systemach SQL użytkownik nie jest po prostu imieniem. Jest on zdefiniowany jako para: **'nazwa_użytkownika'@'host'**.

- **host** określa, z jakiego komputera użytkownik może się połączyć.
- `'user'@'localhost'` $\rightarrow$ użytkownik może się połączyć tylko z tego samego komputera, na którym działa serwer.
- `'user'@'%'` $\rightarrow$ użytkownik może się połączyć z dowolnego adresu IP w sieci.
- `'user'@'192.168.1.15'` $\rightarrow$ użytkownik może się połączyć tylko z konkretnej stacji roboczej.

To dodatkowa warstwa bezpieczeństwa — nawet jeśli haker pozna hasło, nie wejdzie do bazy, jeśli nie łączy się z autoryzowanego hosta.

## 2. Tworzenie użytkownika: CREATE USER

Aby dodać nowego użytkownika, używamy polecenia `CREATE USER`.

**Ogólny wzór:**
```sql
CREATE USER 'nazwa'@'host' IDENTIFIED BY 'haslo';
```

**Przykład praktyczny:** Tworzymy użytkownika dla aplikacji sklepowej, który może łączyć się tylko lokalnie.
```sql
CREATE USER 'sklep_app'@'localhost' IDENTIFIED BY 'SilezneHaslo123!';
```

## 3. Usuwanie użytkownika: DROP USER

Jeśli projekt zostaje zamknięty lub pracownik odchodzi z firmy, należy niezwłocznie usunąć jego konto.

**Ogólny wzór:**
```sql
DROP USER 'nazwa'@'host';
```

**Przykład:**
```sql
DROP USER 'stary_pracownik'@'localhost';
```

## 4. Co z tego jest na egzaminie

Zarządzanie użytkownikami pojawia się w zadaniach z obszaru administracyjnego. Często polecenie brzmi: „Utwórz użytkownika o nazwie X, z hasłem Y, który może łączyć się z serwerem z dowolnego hosta”.

**Pułapki egzaminacyjne:**
- **Zapomnienie o hostcie:** Jeśli napiszesz tylko `CREATE USER 'user' IDENTIFIED BY 'pass'`, baza może przyjąć domyślny host, co nie zawsze jest tym, czego wymaga polecenie.
- **Literówki w hasłach:** W zapytaniach SQL hasło musi być zawsze w pojedynczych cudzysłowach.
- **Brak uprawnień:** Sam fakt stworzenia użytkownika nie daje mu żadnych praw. Nowy użytkownik po zalogowaniu zobaczy pustą listę baz. Aby mógł coś zrobić, musimy przejść do tematu uprawnień (`GRANT`).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Tworzenie konta lokalnego"
Utwórz użytkownika o nazwie `tester_lokalny`, który ma łączyć się z serwerem tylko z `localhost`. Hasło powinno brzmieć: `test1234`.

??? success "Rozwiązanie 1"
    ```sql
    CREATE USER 'tester_lokalny'@'localhost' IDENTIFIED BY 'test1234';
    ```

!!! question "Ćwiczenie 2. Użytkownik sieciowy"
Utwórz użytkownika `admin_sieciowy`, który może łączyć się z dowolnego komputera w sieci. Hasło: `SecureNet2026`.

??? success "Rozwiązanie 2"
    ```sql
    CREATE USER 'admin_sieciowy'@'%' IDENTIFIED BY 'SecureNet2026';
    ```

!!! question "Ćwiczenie 3. Porządkowanie kont"
Usuń z systemu użytkownika `tester_lokalny`, którego stworzyłeś w pierwszym ćwiczeniu.

??? success "Rozwiązanie 3"
    ```sql
    DROP USER 'tester_lokalny'@'localhost';
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co oznacza zapis 'użytkownik'@'%' w konfiguracji MariaDB?",
    "opcje": [
      "Użytkownik ma uprawnienia administratora",
      "Użytkownik może łączyć się z serwerem z dowolnego adresu IP",
      "Użytkownik może łączyć się tylko z lokalnego komputera",
      "Użytkownik nie posiada hasła"
    ],
    "poprawna": 1,
    "wyjasnienie": "Znak procenta (%) w SQL jest tzw. wildkardem, który w kontekście hosta oznacza 'wszystkie możliwe adresy'."
  },
  {
    "pytanie": "Która instrukcja poprawnie tworzy użytkownika z hasłem?",
    "opcje": [
      "MAKE USER 'jan'@'localhost' PASSWORD '123'",
      "CREATE USER 'jan'@'localhost' IDENTIFIED BY '123'",
      "ADD USER 'jan'@'localhost' WITH '123'",
      "CREATE ACCOUNT 'jan'@'localhost' SET '123'"
    ],
    "poprawna": 1,
    "wyjasnienie": "Standardowa składnia w MariaDB/MySQL to CREATE USER ... IDENTIFIED BY ..."
  },
  {
    "pytanie": "Czy nowo utworzony użytkownik może od razu modyfikować dane w tabelach?",
    "opcje": [
      "Tak, domyślnie ma uprawnienia do wszystkich baz",
      "Tak, ale tylko do bazy, którą sam stworzył",
      "Nie, nowy użytkownik nie ma żadnych uprawnień, dopóki nie zostaną mu nadane poleceniem GRANT",
      "Nie, musi najpierw zostać zatwierdzony przez administratora w panelu sterowania"
    ],
    "poprawna": 2,
    "wyjasnienie": "Zasada minimalnych uprawnień mówi, że każdy nowy użytkownik startuje z zerowym dostępem. Administrator musi mu jawnie nadać prawa do konkretnych baz lub tabel."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="create-user"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
