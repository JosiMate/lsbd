# Operacje CRUD w kodzie aplikacji
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VIII**

W codziennej pracy programisty rzadko wpisuje się komendy SQL bezpośrednio w konsoli. Zamiast tego, tworzy się funkcje w aplikacji, które wykonują te zapytania w imieniu użytkownika. Większość aplikacji do zarządzania danymi opiera się na czterech podstawowych operacjach, które wspólnie nazywamy skrótem **CRUD**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić znaczenie akronimu CRUD
    2. przypisać operacje biznesowe aplikacji do odpowiadających im komend SQL
    3. opisać przepływ danych od kliknięcia przycisku w aplikacji do zapisu w bazie
    4. wyjaśnić, w jaki sposób aplikacja odbiera i przetwarza wyniki zapytań SELECT

## 1. Czym jest CRUD?

**CRUD** to angielski skrót od czterech podstawowych funkcji zarządzania danymi:

| Litera | Operacja (ang.) | Działanie (pl.) | Odpowiednik w SQL | Przykład w aplikacji |
| :--- | :--- | :--- | :--- | :--- |
| **C** | **Create** | Tworzenie | `INSERT INTO ...` | Dodanie nowego klienta do bazy |
| **R** | **Read** | Odczyt | `SELECT ...` | Wyświetlenie listy produktów |
| **U** | **Update** | Aktualizacja | `UPDATE ... SET ...` | Zmiana ceny produktu |
| **D** | **Delete** | Usuwanie | `DELETE FROM ...` | Usunięcie starego zamówienia |

Jeśli aplikacja posiada wszystkie te funkcje dla danej encji (np. dla Produktów), mówimy, że posiada pełny „moduł CRUD”.

## 2. Przepływ danych: Od kliknięcia do bazy

Kiedy użytkownik klika przycisk „Zapisz” w formularzu dodawania produktu, w aplikacji dzieje się następująca sekwencja zdarzeń:

1. **Interfejs (UI):** Użytkownik wpisuje dane w pola tekstowe i klika przycisk.
2. **Logika aplikacji:** Program pobiera tekst z pól, sprawdza, czy nie są puste i czy format jest poprawny (walidacja).
3. **Budowanie zapytania:** Aplikacja tworzy zapytanie SQL (np. `INSERT INTO produkty (nazwa, cena) VALUES ('Klawiatura', 150);`).
4. **Wysyłka:** Sterownik wysyła zapytanie do serwera bazy danych.
5. **Wykonanie:** MariaDB wykonuje operację i zwraca informację: „Sukces” lub „Błąd”.
6. **Odpowiedź dla użytkownika:** Aplikacja wyświetla komunikat: „Produkt został dodany pomyślnie”.

## 3. Jak aplikacja „czyta” dane? (Result Set)

W przypadku operacji **Read (SELECT)**, baza danych nie zwraca pojedynczej odpowiedzi, ale całą tabelę wyników, zwaną **Result Set** (zestawem wyników).

Aplikacja nie wyświetla tego zestawu jako surowego tekstu. Zamiast tego:
- Tworzy pętlę (np. `while` lub `for`), która przechodzi przez każdy wiersz wyników.
- Każdy wiersz zamienia na obiekt w kodzie (np. obiekt klasy `Produkt`).
- Obiekty te są następnie przekazywane do tabeli w interfejsie użytkownika.

## 4. Co z tego jest na egzaminie

W zadaniach egzaminacyjnych często pojawiają się polecenia typu: „Zaprojektuj funkcjonalność aplikacji, która pozwoli na aktualizację danych użytkownika”.

**Klucz do sukcesu:**
Musisz wykazać, że rozumiesz mapowanie: **„aktualizacja danych” $\rightarrow$ operacja UPDATE**.

**Pułapki egzaminacyjne:**
- **Mylenie UPDATE z INSERT:** Pamiętaj, że `INSERT` tworzy nowy wiersz, a `UPDATE` zmienia istniejący.
- **Zapominanie o klauzuli WHERE:** W aplikacjach operacje Update i Delete muszą być zawsze powiązane z konkretnym identyfikatorem (np. `WHERE id = 5`). Brak `WHERE` w zapytaniu wysłanym z aplikacji doprowadzi do zmiany lub usunięcia **wszystkich** danych w tabeli!

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Mapowanie CRUD"
Dopasuj akcję użytkownika w aplikacji do odpowiedniej litery z akronimu CRUD oraz komendy SQL:
1. „Chcę zmienić swój numer telefonu w profilu” $\rightarrow$ [ ] $\rightarrow$ [ ]
2. „Chcę zobaczyć historię moich zamówień” $\rightarrow$ [ ] $\rightarrow$ [ ]
3. „Chcę usunąć z koszyka niepotrzebny produkt” $\rightarrow$ [ ] $\rightarrow$ [ ]
4. „Chcę zarejestrować nowe konto w serwisie” $\rightarrow$ [ ] $\rightarrow$ [ ]

??? success "Rozwiązanie 1"
    1. Zmiana numeru $\rightarrow$ **U** (Update) $\rightarrow$ `UPDATE`
    2. Historia zamówień $\rightarrow$ **R** (Read) $\rightarrow$ `SELECT`
    3. Usunięcie produktu $\rightarrow$ **D** (Delete) $\rightarrow$ `DELETE`
    4. Rejestracja konta $\rightarrow$ **C** (Create) $\rightarrow$ `INSERT`

!!! question "Ćwiczenie 2. Analiza przepływu"
Wymień w poprawnej kolejności kroki, które musi wykonać aplikacja, aby wyświetlić na ekranie cenę produktu o ID = 10.

??? success "Rozwiązanie 2"
    1. Pobranie ID (10) z interfejsu.
    2. Utworzenie zapytania `SELECT cena FROM produkty WHERE id = 10;`.
    3. Wysłanie zapytania przez sterownik do bazy danych.
    4. Odebranie Result Set (jednego wiersza z ceną).
    5. Wyświetlenie wartości ceny w polu tekstowym aplikacji.

!!! question "Ćwiczenie 3. Krytyczny błąd"
Programista napisał funkcję usuwania użytkownika, która generuje zapytanie: `DELETE FROM uzytkownicy;` (bez klauzuli WHERE). Co stanie się po kliknięciu przycisku „Usuń” w aplikacji?

??? success "Rozwiązanie 3"
    Z bazy danych zostaną usunięci **wszyscy** użytkownicy, a nie tylko ten wybrany. Jest to krytyczny błąd bezpieczeństwa i poprawności danych.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Która z operacji CRUD odpowiada za pobieranie danych z bazy?",
    "opcje": [
      "Create",
      "Read",
      "Update",
      "Delete"
    ],
    "poprawna": 1,
    "wyjasnienie": "Read (odczyt) odpowiada za pobieranie danych przy użyciu instrukcji SELECT."
  },
  {
    "pytanie": "Co w kontekście aplikacji oznacza 'Result Set'?",
    "opcje": [
      "Sposób na szybsze wysyłanie zapytań",
      "Zbiór wierszy zwrócony przez bazę danych po wykonaniu zapytania SELECT",
      "Błąd połączenia z serwerem bazy danych",
      "Specjalny rodzaj indeksu w tabeli"
    ],
    "poprawna": 1,
    "wyjasnienie": "Result Set to tabela z wynikami, którą aplikacja musi przetworzyć (np. w pętli), aby wyświetlić dane użytkownikowi."
  },
  {
    "pytanie": "Dlaczego w operacjach Update i Delete w aplikacjach kluczowe jest użycie klauzuli WHERE?",
    "opcje": [
      "Ponieważ bez niej baza danych nie pozwoli na uruchomienie zapytania",
      "Aby zapytanie działało szybciej",
      "Aby zmiana lub usunięcie dotyczyło tylko konkretnego rekordu, a nie całej tabeli",
      "Ponieważ tylko wtedy można użyć sterownika JDBC"
    ],
    "poprawna": 2,
    "wyjasnienie": "Bez klauzuli WHERE operacja UPDATE lub DELETE zostanie zastosowana do każdego wiersza w tabeli, co zazwyczaj prowadzi do nieodwracalnej utraty danych."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="operacje-crud"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
