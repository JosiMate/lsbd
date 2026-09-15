# Klucze główne i obce w SQL-u
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział V**

W poprzedniej lekcji nauczyliśmy się tworzyć proste tabele. Jednak to nie dane w nich zawarte, ale **powiązania** między nimi sprawiają, że baza danych jest potężna. W tym rozdziale skupimy się na tym, jak w języku SQL definiować klucze, które gwarantują, że dane w naszej bazie są spójne i nie powstają w nich błędy (np. zamówienie dla klienta, który nie istnieje).

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. definiować klucze główne (PRIMARY KEY) na różne sposoby
    2. tworzyć klucze obce (FOREIGN KEY) w celu łączenia tabel
    3. stosować ograniczenia integralności relacyjnej w zapytaniach `CREATE TABLE`
    4. wyjaśnić różnicę między kluczem głównym a unikatowym (UNIQUE)

## 1. Implementacja Klucza Głównego (PRIMARY KEY)

Klucz główny można zdefiniować na dwa sposoby.

### Sposób 1: Przy definicji kolumny (Inline)
Jest to najszybsza metoda, stosowana przy prostych kluczach jednokolumnowych.
```sql
CREATE TABLE produkt (
    id_produktu INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100)
);
```

### Sposób 2: Na końcu definicji tabeli (Table Constraint)
Tym sposobem **musimy** posługiwać się w przypadku **kluczy złożonych**.
```sql
CREATE TABLE pozycja_zamowienia (
    id_zamowienia INT,
    id_produktu INT,
    ilosc INT,
    PRIMARY KEY (id_zamowienia, id_produktu)
);
```

## 2. Implementacja Klucza Obcego (FOREIGN KEY)

Klucz obcy to „pomost” do innej tabeli. W SQL definiujemy go za pomocą klauzuli `FOREIGN KEY`, wskazując, która kolumna w obecnej tabeli odwołuje się do której kolumny w tabeli nadrzędnej.

**Ogólny wzór:**
`FOREIGN KEY (kolumna_tutaj) REFERENCES tabela_nadrzedna(kolumna_tam)`

**Przykład praktyczny:** Tworzymy tabelę `produkt`, która odwołuje się do tabeli `kategoria`.
```sql
CREATE TABLE produkt (
    id_produktu INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100),
    id_kategorii INT,
    FOREIGN KEY (id_kategorii) REFERENCES kategoria(id_kategorii)
);
```

### Ważne zasady klucza obcego:
1.  **Typy danych muszą być identyczne:** Jeśli `id_kategorii` w tabeli `kategoria` jest typu `INT UNSIGNED`, to w tabeli `produkt` również musi być `INT UNSIGNED`. Inaczej baza zgłosi błąd.
2.  **Cel musi być kluczem:** Możemy odwoływać się tylko do kolumn, które są kluczami głównymi (lub unikatowymi) w tabeli nadrzędnej.

## 3. PRIMARY KEY a UNIQUE

Często mylimy te dwa pojęcia, ponieważ oba wymuszają unikatowość danych.

| Cecha | PRIMARY KEY | UNIQUE |
| :--- | :--- | :--- |
| **Liczba w tabeli** | Tylko jeden na tabelę | Może być wiele w jednej tabeli |
| **Wartości NULL** | Nigdy nie dopuszcza NULL | Dopuszcza NULL (zależnie od SZBD) |
| **Główny cel** | Identyfikacja wiersza | Zapobieganie duplikatom w konkretnym polu |

**Przykład:** W tabeli `klient` kluczem głównym jest `id_klienta`, ale chcemy, aby każdy klient miał unikatowy adres e-mail. Używamy więc:
`email VARCHAR(100) UNIQUE`

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 najczęstszym błędem jest pominięcie klucza obcego w zapytaniu `CREATE TABLE` lub błędna kolejność tworzenia tabel.

**Zapamiętaj:**
*   Jeśli w zadaniu jest mowa o „powiązaniu tabel”, „relacji” lub „kluczu obcym” $\rightarrow$ musisz dopisać `FOREIGN KEY (...) REFERENCES ...`.
*   Zawsze sprawdzaj, czy nazwy kolumn w `REFERENCES` zgadzają się z tymi, które zdefiniowałeś w tabeli nadrzędnej.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Projektowanie kluczy"
    Napisz polecenie `CREATE TABLE` dla tabeli `zamowienie`.
    - `id_zamowienia` (PK, auto)
    - `data_zamowienia` (DATE, obowiązkowe)
    - `id_klienta` (FK odwołujący się do tabeli `klient(id_klienta)`)

??? success "Rozwiązanie 1"
    ```sql
    CREATE TABLE zamowienie (
        id_zamowienia INT PRIMARY KEY AUTO_INCREMENT,
        data_zamowienia DATE NOT NULL,
        id_klienta INT,
        FOREIGN KEY (id_klienta) REFERENCES klient(id_klienta)
    );
    ```

!!! question "Ćwiczenie 2. Klucz złożony"
    Napisz polecenie `CREATE TABLE` dla tabeli `pozycja_zamowienia`, w której klucz główny jest złożony z `id_zamowienia` i `id_produktu`. Dodaj klucze obce dla obu tych kolumn.

??? success "Rozwiązanie 2"
    ```sql
    CREATE TABLE pozycja_zamowienia (
        id_zamowienia INT,
        id_produktu INT,
        ilosc INT,
        PRIMARY KEY (id_zamowienia, id_produktu),
        FOREIGN KEY (id_zamowienia) REFERENCES zamowienie(id_zamowienia),
        FOREIGN KEY (id_produktu) REFERENCES produkt(id_produktu)
    );
    ```

!!! question "Ćwiczenie 3. Unikatowe dane"
    Stwórz tabelę `uzytkownik` z kolumnami: `id` (PK), `login` (unikatowy, obowiązkowy) oraz `haslo` (obowiązkowe).

??? success "Rozwiązanie 3"
    ```sql
    CREATE TABLE uzytkownik (
        id INT PRIMARY KEY AUTO_INCREMENT,
        login VARCHAR(50) NOT NULL UNIQUE,
        haslo VARCHAR(255) NOT NULL
    );
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaka jest główna różnica między PRIMARY KEY a UNIQUE?",
    "opcje": [
      "UNIQUE nie może być kluczem głównym",
      "Tabela może mieć wiele kolumn UNIQUE, ale tylko jeden PRIMARY KEY",
      "PRIMARY KEY dopuszcza wartości NULL, a UNIQUE nie",
      "Nie ma różnicy, to dwa określenia tego samego"
    ],
    "poprawna": 1,
    "wyjasnienie": "Klucz główny jest jedyny w tabeli i identyfikuje wiersz. UNIQUE służy do zapewnienia unikatowości w innych kolumnach (np. e-mail)."
  },
  {
    "pytanie": "Co się stanie, jeśli spróbujemy stworzyć klucz obcy odwołujący się do kolumny, która NIE jest kluczem głównym w tabeli nadrzędnej?",
    "opcje": [
      "Baza danych automatycznie zmieni tę kolumnę w klucz główny",
      "Zapytanie zostanie wykonane, ale relacja nie będzie działać",
      "Baza danych zgłosi błąd (np. 'Foreign key constraint is incorrectly formed')",
      "Klucz obcy zostanie utworzony jako klucz naturalny"
    ],
    "poprawna": 2,
    "wyjasnienie": "Klucz obcy musi odwoływać się do kolumny, która gwarantuje unikatowość (zazwyczaj PRIMARY KEY)."
  },
  {
    "pytanie": "W którym miejscu zapytania CREATE TABLE definiuje się klucz obcy?",
    "opcje": [
      "Zawsze przed definicją kolumn",
      "Tylko wewnątrz definicji kolumny",
      "Po zdefiniowaniu wszystkich kolumn, na końcu listy",
      "W osobnym zapytaniu SELECT"
    ],
    "poprawna": 2,
    "wyjasnienie": "Choć niektóre SZBD pozwalają na definicję inline, standardem i najbezpieczniejszą metodą jest definiowanie FOREIGN KEY po liście kolumn."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="klucze-sql"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
