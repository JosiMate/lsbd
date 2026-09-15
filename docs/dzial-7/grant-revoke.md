# Uprawnienia — GRANT i REVOKE
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VII**

W poprzedniej lekcji nauczyliśmy się tworzyć użytkowników. Jednak użytkownik bez uprawnień jest jak posiadacz klucza do budynku, w którym wszystkie drzwi są zamknięte na głucho. Aby użytkownik mógł odczytywać dane, dodawać nowe rekordy czy modyfikować strukturę tabel, musimy mu nadaj odpowiednie "uprawnienia" (privileges).

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. nadawać uprawnienia użytkownikom za pomocą polecenia `GRANT`
    2. odbierać uprawnienia za pomocą polecenia `REVOKE`
    3. rozróżniać poziomy uprawnień (globalne, baza, tabela)
    4. sprawdzać aktualne uprawnienia użytkownika za pomocą `SHOW GRANTS`

## 1. Poziomy uprawnień

W MariaDB nie nadajemy praw "do wszystkiego" (chyba że jesteśmy rootem). Uprawnienia mogą być nadawane na trzech poziomach:

1. **Poziom globalny** $\rightarrow$ dotyczy wszystkich baz na serwerze (np. prawo do zamykania serwera).
2. **Poziom bazy danych** $\rightarrow$ dotyczy wszystkich tabel w konkretnej bazie (najczęstszy wybór).
3. **Poziom tabeli** $\rightarrow$ dotyczy tylko jednej, konkretnej tabeli (maksymalne bezpieczeństwo).

## 2. Nadawanie uprawnień: GRANT

Polecenie `GRANT` pozwala określić, co użytkownik może robić i gdzie.

**Ogólny wzór (poziom bazy):**
```sql
GRANT typ_uprawnienia ON nazwa_bazy.* TO 'użytkownik'@'host';
```
*Wskazówka:* `nazwa_bazy.*` oznacza "wszystkie tabele w tej bazie".

**Najważniejsze typy uprawnień:**
- `ALL PRIVILEGES` $\rightarrow$ wszystkie prawa do danej bazy.
- `SELECT` $\rightarrow$ prawo do odczytu danych (najbezpieczniejsze).
- `INSERT` $\rightarrow$ prawo do dodawania nowych wierszy.
- `UPDATE` $\rightarrow$ prawo do modyfikacji istniejących danych.
- `DELETE` $\rightarrow$ prawo do usuwania wierszy.
- `CREATE` $\rightarrow$ prawo do tworzenia nowych tabel.
- `DROP` $\rightarrow$ prawo do usuwania całych tabel.

**Przykład praktyczny:** Chcemy, aby użytkownik `sklep_app` mógł tylko odczytywać i dodawać produkty do bazy `sklep_db`.
```sql
GRANT SELECT, INSERT ON sklep_db.* TO 'sklep_app'@'localhost';
```

## 3. Odbieranie uprawnień: REVOKE

Jeśli użytkownik nie powinien już mieć dostępu do danych, używamy polecenia `REVOKE`.

**Ogólny wzór:**
```sql
REVOKE typ_uprawnienia ON nazwa_bazy.* FROM 'użytkownik'@'host';
```

**Przykład:** Odbieramy prawo do usuwania danych z bazy `sklep_db` od użytkownika `sklep_app`.
```sql
REVOKE DELETE ON sklep_db.* FROM 'sklep_app'@'localhost';
```

## 4. Weryfikacja uprawnień: SHOW GRANTS

Aby sprawdzić, co dany użytkownik może aktualnie robić, używamy polecenia `SHOW GRANTS`.

```sql
SHOW GRANTS FOR 'sklep_app'@'localhost';
```
Baza zwróci listę wszystkich instrukcji `GRANT`, które zostały zastosowane do tego konta.

## 5. Co z tego jest na egzaminie

Nadawanie uprawnień to stały element zadań administracyjnych INF.03.

**Typowe polecenia egzaminacyjne:**
- „Nadaj użytkownikowi X pełne uprawnienia do bazy Y” $\rightarrow$ `GRANT ALL PRIVILEGES ON Y.* TO ...`
- „Ogranicz dostęp użytkownika Z tak, aby mógł jedynie odczytywać dane z tabeli produkt” $\rightarrow$ `GRANT SELECT ON Y.produkt TO ...` (zauważ, że tutaj nie używamy `.*`, tylko wskazujemy konkretną tabelę).

**Pułapka:** Jeśli w zadaniu jest napisane „odbyra uprawnienia”, a Ty użyjesz `DROP USER`, usuniesz całe konto, a nie tylko prawa. Pamiętaj: `REVOKE` zabiera klucz do konkretnych drzwi, `DROP USER` wyrzuca człowieka z budynku.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Użytkownik tylko do odczytu"
Utwórz użytkownika `raportowy` (`localhost`, hasło: `raport2026`) i nadaj mu uprawnienie do samego odczytu danych (`SELECT`) z bazy `obuwie`.

??? success "Rozwiązanie 1"
    ```sql
    CREATE USER 'raportowy'@'localhost' IDENTIFIED BY 'raport2026';
    GRANT SELECT ON obuwie.* TO 'raportowy'@'localhost';
    ```

!!! question "Ćwiczenie 2. Administrator bazy"
Utwórz użytkownika `manager_bazy` (`localhost`, hasło: `mgr123`) i nadaj mu wszystkie możliwe uprawnienia do bazy `obuwie`.

??? success "Rozwiązanie 2"
    ```sql
    CREATE USER 'manager_bazy'@'localhost' IDENTIFIED BY 'mgr123';
    GRANT ALL PRIVILEGES ON obuwie.* TO 'manager_bazy'@'localhost';
    ```

!!! question "Ćwiczenie 3. Korekta uprawnień"
Użytkownik `raportowy` z pierwszego ćwiczenia otrzymał przez pomyłkę prawo do usuwania danych (`DELETE`). Odbierz mu to uprawnienie.

??? success "Rozwiązanie 3"
    ```sql
    REVOKE DELETE ON obuwie.* FROM 'raportowy'@'localhost';
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Które z poniższych uprawnień jest najbezpieczniejsze dla użytkownika, który ma tylko przeglądać dane?",
    "opcje": [
      "ALL PRIVILEGES",
      "INSERT",
      "SELECT",
      "UPDATE"
    ],
    "poprawna": 2,
    "wyjasnienie": "Uprawnienie SELECT pozwala jedynie na odczyt danych. Nie umożliwia dodawania, zmiany ani usuwania żadnych rekordów."
  },
  {
    "pytanie": "Co oznacza zapis 'GRANT SELECT ON sklep.* TO ...'?",
    "opcje": [
      "Użytkownik może odczytać tylko jedną tabelę w bazie sklep",
      "Użytkownik może odczytać wszystkie tabele w bazie sklep",
      "Użytkownik może modyfikować wszystkie tabele w bazie sklep",
      "Użytkownik staje się właścicielem bazy sklep"
    ],
    "poprawna": 1,
    "wyjasnienie": "Gwiazdka (*) po nazwie bazy oznacza 'wszystkie obiekty w tej bazie'."
  },
  {
    "pytanie": "Jaką instrukcję należy zastosować, aby sprawdzić aktualne prawa użytkownika?",
    "opcje": [
      "CHECK PRIVILEGES FOR ...",
      "SHOW GRANTS FOR ...",
      "VIEW USER RIGHTS ...",
      "LIST PRIVILEGES ..."
    ],
    "poprawna": 1,
    "wyjasnienie": "Polecenie SHOW GRANTS wyświetla wszystkie uprawnienia nadane konkretnemu użytkownikowi."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="grant-revoke"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
