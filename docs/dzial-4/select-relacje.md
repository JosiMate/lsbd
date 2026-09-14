# Zapytania z relacją (JOIN)

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

W każdym arkuszu INF.03 jedno z czterech zapytań brzmi mniej więcej tak:
*„wybierające jedynie nazwę i cenę buta oraz odpowiadającą im nazwę kategorii.
Należy posłużyć się relacją"*. To jest **najdroższe** zapytanie z całej czwórki —
i jedyne, którego nie da się napisać na wyczucie. Ta lekcja jest o tym, jak
je zbudować tak, żeby działało za pierwszym razem.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wskazać w strukturze bazy klucz główny i klucz obcy oraz powiedzieć, co je łączy
    2. napisać zapytanie łączące dwie tabele i wybrać z nich wskazane kolumny
    3. stosować aliasy tabel i wyjaśnić, kiedy są konieczne
    4. rozpoznać iloczyn kartezjański i wiedzieć, skąd się wziął
    5. dołożyć do złączenia warunek i sortowanie
    6. rozróżnić `JOIN` i `LEFT JOIN` na konkretnym przykładzie

## 1. Po co w ogóle relacja

Wyobraź sobie jedną tabelę z butami, w której przy każdym bucie stoi nazwa
kategorii:

| nazwa | cena | kategoria |
| --- | ---: | --- |
| Trzewik Alpin | 329,00 | Trzewiki |
| Trzewik Roboczy | 259,50 | Trzewiki |
| Kozak Klasyk | 449,00 | Kozaki |

Nazwa „Trzewiki" powtarza się przy każdym trzewiku. Trzy kłopoty z tego wynikają:

- **marnowane miejsce** — ten sam napis zapisany setki razy
- **literówki** — przy jednym bucie „Trzewiki", przy drugim „Trzewki"; dla bazy
  to dwie różne kategorie
- **zmiana nazwy** — żeby przemianować kategorię, trzeba poprawić wszystkie wiersze

Dlatego kategorie wydziela się do **osobnej tabeli**, a przy bucie zostaje tylko
odsyłacz — liczba wskazująca wiersz w tamtej tabeli.

## 2. Klucz główny i klucz obcy

W bazie `obuwie`, na której tu pracujemy, jest to zrobione tak:

=== "Tabela `kategoria`"

    | kolumna | opis |
    | --- | --- |
    | `id_kategorii` | **klucz główny** — numer unikatowy w tej tabeli |
    | `nazwa` | nazwa kategorii |

=== "Tabela `produkt`"

    | kolumna | opis |
    | --- | --- |
    | `id_produktu` | **klucz główny** tabeli produktów |
    | `nazwa`, `cena`, `kolor`, `material`, `wysokosc` | cechy buta |
    | `id_kategorii` | **klucz obcy** — wskazuje wiersz w tabeli `kategoria` |

!!! tip "Jak to rozpoznać w arkuszu w dziesięć sekund"

    Otwórz strukturę obu tabel w phpMyAdminie i poszukaj kolumny, która
    **występuje w obu**. Prawie zawsze nazywa się tak samo (`id_kategorii`)
    i to ona jest miejscem złączenia. Jeżeli nazwy się różnią, szukasz kolumny
    typu liczbowego, której wartości wyglądają jak numery z drugiej tabeli.

## 3. Składnia złączenia

```sql
SELECT produkt.nazwa, produkt.cena, kategoria.nazwa
FROM produkt
JOIN kategoria ON produkt.id_kategorii = kategoria.id_kategorii;
```

Czyta się to od `FROM`:

1. **`FROM produkt`** — bierzemy tabelę produktów
2. **`JOIN kategoria`** — dokładamy do niej tabelę kategorii
3. **`ON produkt.id_kategorii = kategoria.id_kategorii`** — sklejamy wiersze tam,
   gdzie te dwie kolumny mają równe wartości
4. **`SELECT ...`** — z tak sklejonego zestawu wybieramy kolumny

!!! warning "Słowo «jedynie» w poleceniu jest punktowane"

    Polecenie mówi: *„wybierające **jedynie** nazwę i cenę buta oraz
    odpowiadającą im nazwę kategorii"*. To znaczy: dokładnie trzy kolumny.
    `SELECT *` zwróci poprawne wiersze i **nie dostanie punktu**, bo zwróci
    także kolumny, o które nikt nie prosił.

### Aliasy — skrót, który się opłaca

```sql
SELECT p.nazwa, p.cena, k.nazwa
FROM produkt AS p
JOIN kategoria AS k ON p.id_kategorii = k.id_kategorii;
```

`AS` można pominąć (`FROM produkt p`). Alias skraca zapis, a przy trzech tabelach
staje się koniecznością.

!!! example "Dwie kolumny o tej samej nazwie"

    Obie tabele mają kolumnę `nazwa`. Samo `SELECT nazwa` zwróci błąd
    **„Column 'nazwa' in field list is ambiguous"** — baza nie wie, o którą
    chodzi. Dlatego przy złączeniach kolumny pisze się z przedrostkiem:
    `p.nazwa` i `k.nazwa`.

    Jeżeli chcesz, żeby w wyniku były rozróżnialne, nadaj im podpisy:

    ```sql
    SELECT p.nazwa AS but, k.nazwa AS kategoria
    FROM produkt p JOIN kategoria k ON p.id_kategorii = k.id_kategorii;
    ```

### Starsza forma, którą też spotkasz

```sql
SELECT produkt.nazwa, kategoria.nazwa
FROM produkt, kategoria
WHERE produkt.id_kategorii = kategoria.id_kategorii;
```

Działa tak samo i w arkuszach bywa akceptowana. Ma jednak wadę: jeżeli
**zapomnisz warunku w `WHERE`**, zapytanie nie zgłosi błędu — po prostu zwróci
bzdurę. Przy zapisie z `JOIN ... ON` trudniej o to samo przeoczenie.

## 4. Iloczyn kartezjański — błąd, który nie wygląda na błąd

Jeżeli połączysz dwie tabele bez warunku, baza sklei **każdy wiersz z każdym**:

```sql
SELECT * FROM produkt, kategoria;
```

Przy 10 produktach i 4 kategoriach dostaniesz **40 wierszy** — i każdy but pojawi
się w czterech kategoriach naraz. Zapytanie się wykona, wynik będzie wyglądał
poważnie, a punktu nie będzie.

!!! tip "Test w trzy sekundy"

    Poprawne złączenie „produkt do kategorii" zwraca **tyle wierszy, ile jest
    produktów** — tu 10. Jeżeli wyszło więcej, brakuje warunku złączenia.
    Jeżeli mniej — część produktów nie ma dopasowania i trzeba sprawdzić dane
    albo użyć `LEFT JOIN`.

## 5. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Poniżej działa prawdziwy silnik SQL z bazą `obuwie` — tą samą, którą importujesz
w ćwiczeniach z działu I. Wpisz zapytanie i naciśnij **Wykonaj** albo ++ctrl+enter++.

<div class="sql-trener" data-baza="obuwie" data-start="SELECT p.nazwa, p.cena, k.nazwa AS kategoria
FROM produkt p
JOIN kategoria k ON p.id_kategorii = k.id_kategorii;"></div>

!!! warning "To jest SQLite, nie MariaDB"

    Trener używa SQLite skompilowanego do WebAssembly, więc działa bez serwera,
    prosto w przeglądarce. **`SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `GROUP BY`
    i `HAVING` zachowują się identycznie** jak w MariaDB — do nauki zapytań to
    wystarcza w zupełności.

    Czego tu nie ma: `CREATE USER`, `GRANT` i innych poleceń administracyjnych.
    Tych uczysz się w phpMyAdminie, bo SQLite nie ma kont użytkowników.

## 6. Zadanie egzaminacyjne krok po kroku

!!! abstract "Treść jak z arkusza"

    *Zapytanie wybierające jedynie nazwę i cenę buta oraz odpowiadającą im nazwę
    kategorii. Należy posłużyć się relacją.*

**Jak je rozłożyć:**

| Fragment polecenia | Co z niego wynika |
| --- | --- |
| „jedynie nazwę i cenę buta" | dwie kolumny z tabeli `produkt`, nic więcej |
| „oraz odpowiadającą im nazwę kategorii" | trzecia kolumna, z tabeli `kategoria` |
| „należy posłużyć się relacją" | złączenie po kluczu obcym, nie dwa osobne zapytania |

```sql
SELECT produkt.nazwa, produkt.cena, kategoria.nazwa
FROM produkt
JOIN kategoria ON produkt.id_kategorii = kategoria.id_kategorii;
```

Trzy kolumny, jedno złączenie, 10 wierszy. Tyle.

## 7. Złączenie z warunkiem i sortowaniem

Kolejność części zapytania jest stała i nie da się jej zamienić:

```sql
SELECT p.nazwa, p.cena, k.nazwa
FROM produkt p
JOIN kategoria k ON p.id_kategorii = k.id_kategorii
WHERE p.cena > 300
ORDER BY p.cena DESC;
```

`SELECT` → `FROM` → `JOIN ... ON` → `WHERE` → `ORDER BY`. Warunek dotyczący
**danych** idzie do `WHERE`; warunek **łączenia tabel** zostaje w `ON`.

## 8. `LEFT JOIN` — kiedy zwykły `JOIN` gubi wiersze

`JOIN` pokazuje tylko te wiersze, które mają dopasowanie po obu stronach.
Kategoria bez żadnego produktu **w ogóle się nie pojawi** — i to bywa treścią
zadania („wypisz wszystkie kategorie wraz z liczbą produktów, także te puste").

```sql
SELECT k.nazwa, p.nazwa
FROM kategoria k
LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;
```

`LEFT JOIN` zachowuje **wszystkie** wiersze tabeli z lewej strony, a tam, gdzie
nie ma dopasowania, wstawia `NULL`. Sprawdź to w trenerze: dopisz kategorię
bez produktów i porównaj oba zapytania.

## Ćwiczenia

!!! question "Ćwiczenie 1. Trzy kolumny, jedno złączenie"

    Napisz zapytanie wybierające **jedynie** nazwę i cenę produktu oraz nazwę
    jego kategorii. Sprawdź w trenerze — powinno zwrócić 10 wierszy.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT p.nazwa, p.cena, k.nazwa FROM produkt p JOIN kategoria k ON p.id_kategorii = k.id_kategorii;"></div>

    **Zapisujesz:** treść zapytania i liczbę zwróconych wierszy.

!!! question "Ćwiczenie 2. Złączenie z warunkiem"

    Wypisz nazwy produktów należących do kategorii **Sportowe**. Wynik ma mieć
    jedną kolumnę.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT p.nazwa FROM produkt p JOIN kategoria k ON p.id_kategorii = k.id_kategorii WHERE k.nazwa = 'Sportowe';"></div>

    **Zapisujesz:** treść zapytania i liczbę wierszy.

??? success "Wskazówka do rozwiązania 2"

    Warunek dotyczy nazwy kategorii, więc idzie do `WHERE k.nazwa = 'Sportowe'`.
    Prawidłowy wynik to **3** wiersze. Jeżeli wychodzi 10 — warunek nie zadziałał;
    jeżeli 0 — sprawdź wielkość liter i apostrofy wokół tekstu.

!!! question "Ćwiczenie 3. Zobacz błąd na własne oczy"

    Wykonaj w trenerze zapytanie `SELECT * FROM produkt, kategoria;` i policz
    wiersze. Potem odpowiedz, skąd wzięła się ta liczba i czym różni się to
    zapytanie od poprawnego.

    **Zapisujesz:** liczbę wierszy, wyjaśnienie skąd się bierze, i poprawioną
    wersję zapytania.

??? success "Wskazówka do rozwiązania 3"

    Wyjdzie **40** wierszy: 10 produktów × 4 kategorie. Baza skleiła każdy
    wiersz z każdym, bo nie powiedziano jej, po czym ma je dopasować.
    Poprawka to dopisanie warunku — albo w `WHERE`, albo, lepiej, przejście
    na zapis `JOIN ... ON`.

!!! question "Ćwiczenie 4. Ile butów w kategorii"

    Napisz zapytanie, które dla każdej kategorii poda jej nazwę i liczbę
    produktów. Skorzystaj z `COUNT(*)` i `GROUP BY`.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT k.nazwa, COUNT(*) FROM produkt p JOIN kategoria k ON p.id_kategorii = k.id_kategorii GROUP BY k.nazwa;"></div>

    **Zapisujesz:** treść zapytania i wynik przepisany do tabelki.

!!! note "Co oddajesz"

    Wyniki wszystkich czterech ćwiczeń wpisujesz do karty pracy na dole strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**. Do ćwiczenia 3
    dołącz zrzut ekranu z widoczną liczbą wierszy.

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co robi klucz obcy?",
    "opcje": [
      "Szyfruje dane w tabeli",
      "Wskazuje wiersz w innej tabeli — jest odsyłaczem do niej",
      "Nadaje wierszowi unikatowy numer w jego własnej tabeli",
      "Blokuje możliwość usunięcia tabeli"
    ],
    "poprawna": 1,
    "wyjasnienie": "Klucz obcy przechowuje wartość klucza głównego z tabeli powiązanej. To po nim łączy się tabele w zapytaniu. Unikatowy numer w obrębie własnej tabeli nadaje klucz GŁÓWNY."
  },
  {
    "pytanie": "Zapytanie SELECT nazwa FROM produkt p JOIN kategoria k ON p.id_kategorii = k.id_kategorii; zwraca błąd. Dlaczego?",
    "opcje": [
      "Bo brakuje średnika",
      "Bo kolumna „nazwa” występuje w obu tabelach i baza nie wie, o którą chodzi",
      "Bo aliasów nie wolno używać razem z JOIN",
      "Bo JOIN wymaga co najmniej trzech kolumn w SELECT"
    ],
    "poprawna": 1,
    "wyjasnienie": "To błąd „ambiguous column name”. Po złączeniu obie kolumny „nazwa” są w zasięgu, więc trzeba wskazać tabelę: p.nazwa albo k.nazwa."
  },
  {
    "pytanie": "Złączenie 10 produktów z 4 kategoriami zwróciło 40 wierszy. Co się stało?",
    "opcje": [
      "Wszystko w porządku — tak działa JOIN",
      "Powstał iloczyn kartezjański: zabrakło warunku złączenia",
      "Baza zawiera zduplikowane dane",
      "Trzeba było użyć LEFT JOIN"
    ],
    "poprawna": 1,
    "wyjasnienie": "Bez warunku baza skleja każdy wiersz z każdym: 10 × 4 = 40. Poprawne złączenie „produkt do kategorii” zwraca tyle wierszy, ile jest produktów, czyli 10."
  },
  {
    "pytanie": "Polecenie mówi „wybierające jedynie nazwę i cenę”. Czy SELECT * dostanie punkt?",
    "opcje": [
      "Tak, bo zwraca poprawne wiersze",
      "Nie — słowo „jedynie” oznacza dokładnie te kolumny i żadnych innych",
      "Tak, jeśli dodatkowe kolumny są puste",
      "Zależy od egzaminatora"
    ],
    "poprawna": 1,
    "wyjasnienie": "Kryteria oceniania sprawdzają zestaw zwróconych kolumn. „Jedynie” jest wiążące — dodatkowe kolumny są takim samym błędem jak brakujące."
  },
  {
    "pytanie": "Gdzie trafia warunek dotyczący ceny produktu w zapytaniu ze złączeniem?",
    "opcje": [
      "Do ON, obok warunku złączenia",
      "Do WHERE, po części JOIN … ON",
      "Do SELECT, jako dodatkowa kolumna",
      "Do ORDER BY"
    ],
    "poprawna": 1,
    "wyjasnienie": "W ON zostaje to, co ŁĄCZY tabele. Warunek dotyczący danych — cena, kolor, materiał — trafia do WHERE. Kolejność części zapytania jest stała: SELECT, FROM, JOIN … ON, WHERE, ORDER BY."
  },
  {
    "pytanie": "Czym różni się LEFT JOIN od JOIN?",
    "opcje": [
      "LEFT JOIN jest szybszy",
      "LEFT JOIN zachowuje wszystkie wiersze tabeli z lewej strony, także te bez dopasowania — brakujące wartości wypełnia NULL-ami",
      "LEFT JOIN łączy tabele w odwrotnej kolejności",
      "Nie ma różnicy, to dwa zapisy tego samego"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zwykły JOIN pokazuje tylko pary, które mają dopasowanie po obu stronach — kategoria bez produktów zniknie z wyniku. LEFT JOIN ją zostawi, z NULL-ami w kolumnach z prawej tabeli."
  },
  {
    "pytanie": "Po co stosuje się aliasy tabel (FROM produkt p)?",
    "opcje": [
      "Żeby zapytanie działało szybciej",
      "Żeby skrócić zapis i jednoznacznie wskazywać kolumny — przy trzech tabelach to już konieczność",
      "Bo bez aliasu nie da się użyć JOIN",
      "Żeby ukryć prawdziwe nazwy tabel przed użytkownikiem"
    ],
    "poprawna": 1,
    "wyjasnienie": "Alias to wyłącznie wygoda zapisu i jednoznaczność. Na szybkość nie wpływa, a JOIN działa także bez niego — tylko zapytanie robi się dłuższe."
  },
  {
    "pytanie": "Zapisy FROM produkt, kategoria WHERE … oraz FROM produkt JOIN kategoria ON …:",
    "opcje": [
      "dają różne wyniki",
      "dają ten sam wynik, ale w pierwszym łatwiej zapomnieć warunku i dostać iloczyn kartezjański bez żadnego komunikatu o błędzie",
      "pierwszy jest niepoprawny składniowo",
      "drugi działa tylko w MariaDB"
    ],
    "poprawna": 1,
    "wyjasnienie": "Oba są poprawne i dają ten sam wynik. Różnica jest praktyczna: przy zapisie z przecinkiem pominięty warunek nie jest błędem składniowym, więc zapytanie po cichu zwraca bzdurę."
  }
]
</script>
</div>

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="select-relacje"></div>

---

*Cytat treści zadania pochodzi z arkusza egzaminacyjnego INF.03. Liczby wierszy
podane w ćwiczeniach policzone na bazie `obuwie` dołączonej do tego serwisu.
Stan sprawdzony 14 września 2026 r.*
