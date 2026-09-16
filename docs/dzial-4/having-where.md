# HAVING kontra WHERE — w czym tkwi różnica?
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IV**

Gdy zaczynamy pracować z grupowaniem danych (`GROUP BY`), pojawia się problem: jak odfiltrować grupy? Jeśli chcemy wyświetlić tylko te kategorie, które mają więcej niż 5 produktów, nie możemy użyć klauzuli `WHERE`. Dlaczego? Ponieważ `WHERE` filtruje pojedyncze wiersze, ZANIM zostaną one pogrupowane. Do filtrowania gotowych już grup służy specjalna klauzula: **`HAVING`**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić różnicę między `WHERE` a `HAVING`
    2. stosować `HAVING` do filtrowania wyników agregacji
    3. łączyć `WHERE` i `HAVING` w jednym zapytaniu
    4. dobierać odpowiednie narzędzie filtrowania do treści zadania egzaminacyjnego

## 1. Dlaczego WHERE nie działa z agregatami?

Przypomnijmy kolejność wykonywania zapytania przez bazę danych:
1.  **FROM / JOIN** $\rightarrow$ Pobierz dane z tabel.
2.  **WHERE** $\rightarrow$ Odrzuć niepotrzebne wiersze (filtrowanie pojedynczych rekordów).
3.  **GROUP BY** $\rightarrow$ Pogrupuj pozostałe wiersze w grupy.
4.  **Agregacja** $\rightarrow$ Oblicz sumy, średnie itp. dla każdej grupy.
5.  **HAVING** $\rightarrow$ Odrzuć grupy, które nie spełniają warunku.
6.  **SELECT** $\rightarrow$ Wyświetl wynik końcowy.

Zauważ, że w momencie działania `WHERE`, baza danych jeszcze nie wie, ile jest produktów w grupie, bo grupowanie dzieje się później. Dlatego zapis:
`WHERE COUNT(*) > 5`
zawsze spowoduje błąd składni.

## 2. Jak działa HAVING?

`HAVING` działa dokładnie tak samo jak `WHERE`, ale jest uruchamiany **po agregacji**. Pozwala nam on stawiać warunki na wyniki funkcji takich jak `SUM`, `AVG` czy `COUNT`.

**Przykład:** Chcemy wyświetlić tylko te kategorie, w których jest więcej niż 3 produkty.

```sql
SELECT id_kategorii, COUNT(*) 
FROM produkt 
GROUP BY id_kategorii 
HAVING COUNT(*) > 3;
```
*Tłumaczenie:* „Pogrupuj produkty po kategorii, policz je, a potem pokaż mi tylko te grupy, w których wynik liczenia jest większy niż 3”.

## 3. WHERE i HAVING w jednym zapytaniu

To jest poziom „ekspert”, który często pojawia się w trudniejszych zadaniach. Możemy użyć obu klauzul jednocześnie, aby najpierw odfiltrować wiersze, a potem odfiltrować grupy.

**Zadanie:** Wyświetl kategorie, w których jest więcej niż 2 produkty, ale bierz pod uwagę tylko produkty, których cena jest wyższa niż 100 zł.

```sql
SELECT id_kategorii, COUNT(*) 
FROM produkt 
WHERE cena > 100              -- KROK 1: odrzuć tanie buty
GROUP BY id_kategorii        -- KROK 2: pogrupuj te drogie buty
HAVING COUNT(*) > 2;         -- KROK 3: zostaw grupy, gdzie jest więcej niż 2 takie buty
```

### Podsumowanie różnic

| Cecha | WHERE | HAVING |
| :--- | :--- | :--- |
| **Kiedy działa?** | Przed grupowaniem | Po grupowaniu |
| **Co filtruje?** | Pojedyncze wiersze | Całe grupy |
| **Można użyć agregatów?** | NIE (np. nie można użyć `SUM()`) | TAK (np. można użyć `SUM()`) |
| **Główny cel** | Ograniczenie zbioru danych | Ograniczenie wyników zestawienia |

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 pułapka `WHERE` vs `HAVING` to klasyk. 

**Jak rozpoznać, czego użyć?**
*   Jeśli warunek dotyczy czegoś, co jest w tabeli (np. `cena > 100`, `kolor = 'czarny'`) $\rightarrow$ użyj `WHERE`.
*   Jeśli warunek dotyczy wyniku obliczeń (np. `SUM(cena) > 1000`, `COUNT(*) < 2`) $\rightarrow$ użyj `HAVING`.

## 5. Ćwicz na żywej bazie { #cwicz-na-zywej-bazie }

Poniżej działa prawdziwy silnik SQL z bazą `obuwie` — tą samą, którą
importujesz w ćwiczeniach z działu I. Wpisz zapytanie i naciśnij
**Wykonaj** albo ++ctrl+enter++. Przycisk **Przywróć bazę** cofa wszystko
do stanu wyjściowego, więc nie da się tu niczego zepsuć.

<div class="sql-trener" data-baza="obuwie" data-start="SELECT id_kategorii, COUNT(*), AVG(cena) FROM produkt GROUP BY id_kategorii;"></div>

!!! info "To SQLite, nie MariaDB"

    Trener liczy w przeglądarce, na silniku SQLite. Składnia `SELECT`,
    `WHERE`, `ORDER BY`, `LIMIT`, `JOIN`, `GROUP BY` i `HAVING` jest ta sama
    co w phpMyAdminie, ale poleceń administracyjnych (`CREATE USER`,
    `GRANT`) ten silnik nie zna — te ćwiczysz w phpMyAdminie.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Filtrowanie grup"
    Napisz zapytanie, które wyświetli identyfikatory kategorii, w których średnia
    cena produktu jest wyższa niż 200 zł. Przejdą 3 z 4 kategorii.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT id_kategorii, AVG(cena) FROM produkt GROUP BY id_kategorii HAVING AVG(cena) &gt; 200;"></div>

??? success "Rozwiązanie 1"
    ```sql
    SELECT id_kategorii, AVG(cena) 
    FROM produkt 
    GROUP BY id_kategorii 
    HAVING AVG(cena) > 200;
    ```

!!! question "Ćwiczenie 2. Wąskie sito"
    Wyświetl nazwy kategorii (dołączając tabelę `kategoria`), w których są co
    najmniej 3 produkty. W bazie `obuwie` pasują do tego dwie kategorie.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT k.nazwa, COUNT(*) FROM kategoria k JOIN produkt p ON k.id_kategorii = p.id_kategorii GROUP BY k.nazwa HAVING COUNT(*) &gt;= 3;"></div>

??? success "Rozwiązanie 2"
    ```sql
    SELECT k.nazwa, COUNT(*)
    FROM kategoria k
    JOIN produkt p ON k.id_kategorii = p.id_kategorii
    GROUP BY k.nazwa
    HAVING COUNT(*) >= 3;
    ```

    Podnieś próg do `>= 5` i wykonaj jeszcze raz — wynik będzie pusty. To nie
    jest błąd zapytania: w tej bazie po prostu nie ma tak licznej kategorii.

!!! question "Ćwiczenie 3. Podwójny filtr"
    Wyświetl identyfikatory kategorii, w których jest więcej niż jeden produkt
    z materiału 'tkanina'. Najpierw `WHERE` odsiewa wiersze, dopiero potem
    `HAVING` odsiewa grupy — wyjdzie jeden wiersz.

    <div class="sql-trener" data-baza="obuwie" data-wzorzec="SELECT id_kategorii, COUNT(*) FROM produkt WHERE material = 'tkanina' GROUP BY id_kategorii HAVING COUNT(*) &gt; 1;"></div>

??? success "Rozwiązanie 3"
    ```sql
    SELECT id_kategorii, COUNT(*)
    FROM produkt
    WHERE material = 'tkanina'
    GROUP BY id_kategorii
    HAVING COUNT(*) > 1;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Która z poniższych instrukcji jest poprawna składniowo?",
    "opcje": [
      "SELECT nazwa FROM produkt WHERE COUNT(*) > 5",
      "SELECT nazwa FROM produkt GROUP BY nazwa HAVING COUNT(*) > 5",
      "SELECT nazwa FROM produkt HAVING COUNT(*) > 5",
      "SELECT nazwa FROM produkt WHERE SUM(cena) > 100"
    ],
    "poprawna": 1,
    "wyjasnienie": "Funkcje agregujące (jak COUNT) mogą być użyte tylko w klauzuli HAVING lub SELECT. Nie wolno ich używać w WHERE."
  },
  {
    "pytanie": "Kiedy należy użyć klauzuli HAVING zamiast WHERE?",
    "opcje": [
      "Kiedy chcemy przyspieszyć zapytanie",
      "Kiedy filtrujemy dane na podstawie wyników funkcji agregujących (np. SUM, AVG)",
      "Kiedy tabela nie ma klucza głównego",
      "Kiedy chcemy sortować wyniki w kolejności malejącej"
    ],
    "poprawna": 1,
    "wyjasnienie": "WHERE odfiltrowuje wiersze przed grupowaniem, a HAVING odfiltrowuje grupy po obliczeniu agregatów."
  },
  {
    "pytanie": "W jakiej kolejności procesor bazy danych wykonuje te klauzule?",
    "opcje": [
      "SELECT $\rightarrow$ WHERE $\rightarrow$ GROUP BY $\rightarrow$ HAVING",
      "WHERE $\rightarrow$ GROUP BY $\rightarrow$ HAVING $\rightarrow$ SELECT",
      "GROUP BY $\rightarrow$ WHERE $\rightarrow$ HAVING $\rightarrow$ SELECT",
      "HAVING $\rightarrow$ WHERE $\rightarrow$ GROUP BY $\rightarrow$ SELECT"
    ],
    "poprawna": 1,
    "wyjasnienie": "Najpierw filtrujemy wiersze (WHERE), potem grupujemy (GROUP BY), następnie filtrujemy grupy (HAVING) i na końcu wybieramy pola do wyświetlenia (SELECT)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="having-where"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
