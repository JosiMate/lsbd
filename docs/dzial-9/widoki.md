# Widoki — wirtualne tabele
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IX**

Wyobraź sobie, że Twoja baza ma ogromną tabelę `zamowienia`, która zawiera 50 kolumn, w tym dane wrażliwe, jak numery kont czy wewnętrzne kody rabatowe. Chcesz jednak, aby pracownik magazynu widział tylko trzy rzeczy: numer zamówienia, nazwisko klienta i listę produktów.

Zamiast tworzyć nową, kopiowaną tabelę (co byłoby błędem w normalizacji), tworzymy **widok (View)**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić różnicę między tabelą a widokiem
    2. tworzyć widoki na podstawie zapytań SELECT
    3. wykorzystywać widoki do upraszczania złożonych złączeń (JOIN)
    4. uzasadnić użycie widoków w celu zwiększenia bezpieczeństwa danych

## 1. Czym jest widok?

Widok to **„zapisane zapytanie SELECT”**. Z perspektywy użytkownika (i aplikacji) widok wygląda i zachowuje się jak zwykła tabela, ale w rzeczywistości **nie przechowuje on własnych danych**.

Kiedy wykonujesz zapytanie do widoku:
`SELECT * FROM widok_magazyn;`
Baza danych „pod spodem” uruchamia zdefiniowane wcześniej zapytanie SELECT i zwraca jego aktualny wynik.

**Kluczowe cechy:**
- **Dynamiczność:** Jeśli dane w tabelach bazowych się zmienią, widok od razu to odzwierciedla.
- **Brak redundancji:** Widok nie zajmuje miejsca na dysku (zapisywana jest tylko jego definicja).
- **Wirtualność:** Nie możesz (w większości przypadków) dodawać danych bezpośrednio do widoku, jeśli składa się on z wielu tabel.

## 2. Tworzenie widoku: CREATE VIEW

Aby stworzyć widok, używamy instrukcji `CREATE VIEW`.

**Ogólny wzór:**
```sql
CREATE VIEW nazwa_widoku AS
SELECT kolumna1, kolumna2, ...
FROM tabela
WHERE warunek;
```

**Przykład praktyczny:** Tworzymy widok dla magazynu, który łączy dane z tabel `zamowienia` i `klienci`.
```sql
CREATE VIEW v_lista_wysylkowa AS
SELECT z.id_zamowienia, k.nazwisko, z.data_zamowienia, z.status
FROM zamowienia z
JOIN klienci k ON z.id_klienta = k.id_klienta
WHERE z.status = 'Oczekiwanie';
```

Teraz magazynier nie musi pisać JOIN-ów. Wystarczy:
`SELECT * FROM v_lista_wysylkowa;`

## 3. Widoki a bezpieczeństwo

Widoki są potężnym narzędziem administracyjnym. Zamiast dawać użytkownikowi dostęp do całej tabeli `uzytkownicy`, możemy:
1. Stworzyć widok `v_uzytkownicy_publiczni`, który pomija kolumnę `haslo` i `pesel`.
2. Nadać użytkownikowi uprawnienia `SELECT` **tylko do tego widoku**, a nie do tabeli bazowej.

Dzięki temu użytkownik widzi tylko to, co powinien, a dane wrażliwe pozostają bezpieczne.

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 często pojawia się zadanie typu: „Stwórz widok, który wyświetla listę wszystkich produktów z ceną powyżej 100 zł, łącząc tabele X i Y”.

**Pułapki egzaminacyjne:**
- **Nazwy kolumn:** Jeśli w zapytaniu SELECT w widoku używasz funkcji (np. `SUM(cena)`), musisz nadać tej kolumnie alias (`AS suma_cen`), w przeciwnym razie baza może odrzucić tworzenie widoku.
- **Mylenie widoku z tabelą:** Pamiętaj, że widok to tylko „maska”. Jeśli usuniesz tabelę bazową, widok przestanie działać.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Tworzenie prostego widoku"
Stwórz widok o nazwie `v_produkty_drogie`, który wyświetla nazwę i cenę wszystkich produktów z tabeli `produkty`, których cena przekracza 500 zł.

??? success "Rozwiązanie 1"
    ```sql
    CREATE VIEW v_produkty_drogie AS
    SELECT nazwa, cena
    FROM produkty
    WHERE cena > 500;
    ```

!!! question "Ćwiczenie 2. Widok z złączeniem"
Stwórz widok `v_sprzedaz_szczegoly`, który wyświetla numer zamówienia, nazwę produktu oraz ilość zamówionych sztuk, łącząc tabele `zamowienia` i `pozycje_zamowienia`.

??? success "Rozwiązanie 2"
    ```sql
    CREATE VIEW v_sprzedaz_szczegoly AS
    SELECT z.numer_zamowienia, p.nazwa, poz.ilosc
    FROM zamowienia z
    JOIN pozycje_zamowienia poz ON z.id_zamowienia = poz.id_zamowienia
    JOIN produkty p ON poz.id_produktu = p.id_produktu;
    ```

!!! question "Ćwiczenie 3. Zarządzanie widokami"
Jaką komendą usuniesz stworzony wcześniej widok `v_produkty_drogie` z bazy danych?

??? success "Rozwiązanie 3"
    ```sql
    DROP VIEW v_produkty_drogie;
    ```

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym różni się widok od zwykłej tabeli?",
    "opcje": [
      "Widok jest szybszy w wyszukiwaniu",
      "Widok nie przechowuje danych fizycznie, lecz jest zapisem zapytania SELECT",
      "Tabeli nie można usuwać, a widok można",
      "Widok nie pozwala na używanie klauzuli WHERE"
    ],
    "poprawna": 1,
    "wyjasnienie": "Widok to wirtualna tabela; dane są pobierane z tabel bazowych w momencie wywołania widoku."
  },
  {
    "pytanie": "Czy zmiana ceny produktu w tabeli 'produkty' wpłynie na dane wyświetlane w widoku 'v_produkty_drogie'?",
    "opcje": [
      "Nie, widok przechowuje kopię danych z momentu jego utworzenia",
      "Tak, ponieważ widok odwołuje się do aktualnych danych w tabeli bazowej",
      "Tylko jeśli zrestartujemy serwer MariaDB",
      "Tak, ale tylko jeśli użyjemy komendy UPDATE VIEW"
    ],
    "poprawna": 1,
    "wyjasnienie": "Widoki są dynamiczne — każdorazowo wykonują zapytanie do tabel bazowych."
  },
  {
    "pytanie": "W jakim celu stosuje się widoki do zwiększenia bezpieczeństwa bazy?",
    "opcje": [
      "Aby zaszyfrować dane w tabelach",
      "Aby ukryć przed użytkownikiem wrażliwe kolumny (np. hasła) w tabeli bazowej",
      "Aby uniemożliwić dostęp do bazy z zewnątrz",
      "Aby automatycznie tworzyć kopie zapasowe danych"
    ],
    "poprawna": 1,
    "wyjasnienie": "Nadając uprawnienia do widoku zamiast do tabeli, administrator może precyzyjnie kontrolować, które kolumny są widoczne dla danego użytkownika."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="widoki"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
