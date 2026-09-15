# Postacie normalne w praktyce
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

Normalizacja bazy danych przypomina układanie ubrań w szafie. Zamiast wrzucać wszystko na jedną wielką stertę, sortujesz koszule do jednej szuflady, a spodnie do innej. Dzięki temu łatwiej znaleźć to, czego szukasz, i szybciej możesz coś dodać lub usunąć. Proces ten jest kluczowy dla projektowania struktury bazy, która będzie wydajna i wolna od błędów logicznych.

Na egzaminie zawodowym INF.03 (szczególnie w części pisemnej) regularnie pojawiają się pytania o postacie normalne (1NF, 2NF, 3NF). Zrozumienie tych zasad pomoże Ci również w lepszym projektowaniu baz w części praktycznej.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. Wyjaśnić, na czym polegają anomalie w bazach danych i dlaczego są niebezpieczne.
    2. Określić pierwszą, drugą i trzecią postać normalną (1NF, 2NF, 3NF).
    3. Przeprowadzić normalizację prostej tabeli do 3NF.
    4. Rozpoznać sytuacje, w których należy zrezygnować z normalizacji.

## 1. Po co normalizować

**Normalizacja** to proces organizowania danych w relacyjnej bazie danych poprzez rozkładanie dużych tabel na mniejsze i definiowanie między nimi relacji.

Celem normalizacji jest:
- Eliminacja powtarzających się danych (redundancji).
- Zapewnienie spójności danych.
- Zapobieganie problemom podczas modyfikacji danych, czyli tzw. **anomaliom**.

Bez normalizacji dane są podatne na uszkodzenia i nielogiczne sytuacje, co w praktyce oznacza błędy w aplikacji, która z tej bazy korzysta.

## 2. Trzy anomalie

Gdy tabela nie jest znormalizowana (np. trzyma wszystko w jednym miejscu), pojawiają się trzy główne problemy. Wyobraź sobie "płaską" tabelę produktów, w której oprócz nazwy produktu przechowujesz nazwę kategorii:

| id_produktu | nazwa | nazwa_kategorii |
|---|---|---|
| 1 | Trampki | Obuwie sportowe |
| 2 | Adidasy | Obuwie sportowe |

1. **Anomalia wstawiania (Insert Anomaly)**
   Nie da się dodać samej nowej kategorii (np. "Klapki"), dopóki nie dodasz chociaż jednego produktu z tej kategorii. System wymusiłby wstawienie pustego produktu lub pominąłby kategorię.
2. **Anomalia aktualizacji (Update Anomaly)**
   Jeśli chcesz zmienić nazwę "Obuwie sportowe" na "Sport", musisz zaktualizować setki wierszy w tabeli produktów. Jeśli system padnie w trakcie, część produktów zostanie w starej kategorii, a część w nowej.
3. **Anomalia usuwania (Delete Anomaly)**
   Jeśli usuniesz ostatni produkt z danej kategorii, informacja o tym, że w ogóle istniała taka kategoria jak "Obuwie sportowe", bezpowrotnie zniknie z bazy.

## 3. Pierwsza postać normalna (1NF)

Tabela jest w **Pierwszej Postaci Normalnej (1NF)**, jeśli:
1. Każda komórka zawiera jedną, niepodzielną wartość (**atomowość**).
2. Brak w niej powtarzających się grup kolumn.

**Złamanie 1NF (brak atomowości):**
Wyobraź sobie kolumnę `telefony` z wartością `123456, 789012`. Co jeśli zechcesz wyszukać konkretny numer albo zaktualizować tylko jeden z nich?

**Złamanie 1NF (powtarzające się kolumny):**
Tworzenie kolumn `telefon1`, `telefon2`, `telefon3`. A co jeśli klient poda czwarty numer? Musiałbyś przebudować tabelę.

Rozwiązaniem jest stworzenie osobnej tabeli połączonej odpowiednią relacją.

## 4. Druga postać normalna (2NF)

Tabela jest w **Drugiej Postaci Normalnej (2NF)**, jeśli:
1. Jest już w 1NF.
2. Każdy atrybut niekluczowy zależy od CAŁEGO klucza głównego, a nie tylko od jego części.

!!! tip "Dla kogo 2NF?"
    Reguła 2NF dotyczy **tylko** tabel, które mają klucz główny złożony z więcej niż jednej kolumny.

**Przykład:**
Tabela `pozycja_zamowienia` z kluczem głównym składającym się z dwóch kolumn: `(id_zamowienia, id_produktu)`.
Jeśli dodamy do niej kolumnę `nazwa_produktu`, złamiemy 2NF. Dlaczego? Bo `nazwa_produktu` zależy tylko od `id_produktu`, a nie od `id_zamowienia`.
Rozwiązanie: `nazwa_produktu` ląduje w oddzielnej tabeli `produkt`.

## 5. Trzecia postać normalna (3NF)

Tabela jest w **Trzeciej Postaci Normalnej (3NF)**, jeśli:
1. Jest już w 2NF.
2. Żaden atrybut niekluczowy nie zależy od innego atrybut niekluczowego. Oznacza to brak tzw. zależności przechodnich (tranzytywnych).

**Przykład:**
Tabela klientów z kolumnami `(id, imie, kod_pocztowy, miasto)`.
Zauważ, że `miasto` wynika bezpośrednio z `kodu_pocztowego`, a nie z tożsamości klienta (`id`). Mamy tu zależność: `id` → `kod_pocztowy` → `miasto`.
Złamanie 3NF grozi anomalią aktualizacji, gdy zmieni się gmina. Rozwiązanie to wyniesienie `kod_pocztowy, miasto` do osobnej tabeli słownikowej.

## 6. Normalizacja krok po kroku — przykład

Weźmy wyjściową, błędną tabelę ze wszystkim, co dotyczy zamówienia na buty:

**Tabela startowa:**
`zamowienie (id_zam, data, klient, telefony_klienta, id_prod, nazwa_prod, cena_prod, ilosc)`

1. **Do 1NF:** Kolumna `telefony_klienta` może zawierać wiele numerów. Rozbijamy to.
   - `zamowienie (id_zam, data, klient, id_prod, nazwa_prod, cena_prod, ilosc)`
   - `telefon (id_tel, nr_tel, klient)`
2. **Do 2NF:** Załóżmy, że kluczem w `zamowieniu` jest `(id_zam, id_prod)` (jedno zamówienie ma wiele produktów). Ale `nazwa_prod` i `cena_prod` zależą tylko od `id_prod`. Rozbijamy:
   - `zamowienie_info (id_zam, data, klient)`
   - `pozycja_zamowienia (id_zam, id_prod, ilosc)`
   - `produkt (id_prod, nazwa_prod, cena_prod)`
3. **Do 3NF:** W tabeli `zamowienie_info`, dane klienta (które mogą być obszerne) nie powinny tkwić luźno i się powtarzać.
   - `klient (id_klienta, dane_klienta)`
   - `zamowienie (id_zam, data, id_klienta)`
   
W ten sposób osiągnęliśmy schemat bazy, gdzie każda informacja ma swoje jedno, dedykowane miejsce.

## 7. Kiedy NIE normalizować (Denormalizacja)

Normalizacja to standard dla baz operacyjnych (OLTP), na których działa np. sklep internetowy. Jednak w systemach analitycznych (Hurtownie Danych) czy systemach raportowych czasem celowo łamie się 3NF. Ten proces to **denormalizacja**. Polega on na złączeniu tabel po to, by odczyt danych (raportowanie) był natychmiastowy bez skomplikowanych i powolnych klauzul `JOIN`.
**Jednak na egzaminie INF.03 zawsze trzymaj się pełnej normalizacji (co najmniej do 3NF).**

## 8. Co z tego jest na egzaminie

W części pisemnej egzaminu INF.03 często pojawiają się pytania w stylu:
- *Co to jest pierwsza postać normalna?* (szukaj odp: atomowość).
- *Która postać normalna wymaga, by atrybuty zależały od pełnego klucza?* (odp: 2NF).
- Podany jest zły układ tabeli z pytaniem o to, jak poprawnie wydzielić tabele.

## Ćwiczenia

!!! question "Ćwiczenie 1. Anomalie w płaskiej tabeli"

    Dana jest tabela: `zamowienie(id, klient_imie, klient_nazwisko, klient_telefon, produkt_nazwa, produkt_cena, ilosc)`. Wskaż, które kolumny będą wielokrotnie powielać swoje wartości przy setkach zamówień. Określ, jakie anomalie (wstawiania, aktualizacji, usuwania) mogą wystąpić. Podaj po jednym, jasnym przykładzie na każdą anomalię dla tej właśnie tabeli.

    **Zapisujesz:** Wypisane kolumny oraz trzy opisy przykładów anomalii.

??? success "Wskazówka do rozwiązania 1"

    Dane klienta będą się powtarzać, jeśli zrobi drugie zamówienie. Podobnie dane produktu. Anomalia wstawiania: jak dodać nowego klienta przed jego pierwszym zakupem? Aktualizacji: jak zaktualizować cenę produktu we wszystkich zamówieniach, by nie pominąć żadnego? Usuwania: usunięcie ostatniego wiersza z danym produktem trwale usuwa info o nim.

!!! question "Ćwiczenie 2. Wiele wartości (1NF)"

    Tabela `uczniowie` zawiera kolumnę `przedmioty` z wartościami typu "matematyka, fizyka, informatyka" złączonymi przecinkami. Czy tabela jest w 1NF? Jeśli nie, jak należy to poprawić zachowując zasady relacyjnych baz danych?

    **Zapisujesz:** Odpowiedź tak/nie wraz ze schematem poprawnego układu tabel.

??? success "Wskazówka do rozwiązania 2"

    Rozwiązanie wymaga utworzenia trzech tabel, klasycznej relacji wiele do wielu: `uczniowie`, `przedmioty` oraz tabela łącząca (np. `uczen_przedmiot`).

!!! question "Ćwiczenie 3. Krok po kroku do 3NF"

    Doprowadź wejściową tabelę z ćwiczenia pierwszego: `zamowienie(id, klient_imie, klient_nazwisko, klient_telefon, produkt_nazwa, produkt_cena, ilosc)` do Trzeciej Postaci Normalnej (3NF). Wymień powstające tabele, podaj ich kolumny, wskaż wyraźnie klucze główne oraz klucze obce.

    **Zapisujesz:** Poprawnie znormalizowaną strukturę relacyjną w postaci np. `tabela(klucz_PK, kolumna, inne_ID_FK)`.

??? success "Wskazówka do rozwiązania 3"

    Pamiętaj o wydzieleniu klientów, zamówień, produktów i szczegółów zamówień. Niech `zamowienie` będzie nagłówkiem nagłówkiem z `id_klienta`, a relacja wiele-do-wielu zamówień i produktów w `pozycja_zamowienia`.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Na czym polega atomowość danych w 1NF?",
    "opcje": [
      "W komórce znajduje się tylko jedna, niepodzielna wartość.",
      "Tabela musi mieć dokładnie jeden klucz główny.",
      "Wartości tekstowe i liczbowe nie mieszają się w tej samej kolumnie.",
      "Dane w tabeli są w pełni chronione przed anomalią usuwania."
    ],
    "poprawna": 0,
    "wyjasnienie": "Atomowość (wymóg 1NF) oznacza niepodzielność pojedynczej informacji w obrębie komórki – np. brak kilku nr telefonu oddzielonych przecinkiem."
  },
  {
    "pytanie": "Brak możliwości wprowadzenia informacji o nowym, pustym dziale (bez pracowników), to przykład:",
    "opcje": [
      "Anomalii aktualizacji",
      "Anomalii wstawiania",
      "Złamania reguły 2NF",
      "Anomalii usuwania"
    ],
    "poprawna": 1,
    "wyjasnienie": "Nie możemy wstawić 'samego faktu istnienia' ponieważ struktura narzuca nam podanie innych zależności. To anomalia wstawiania."
  },
  {
    "pytanie": "Kiedy mówimy o naruszeniu Drugiej Postaci Normalnej (2NF)?",
    "opcje": [
      "Gdy kolumny niekluczowe nie zależą od siebie wzajemnie.",
      "Gdy nie ma klucza głównego.",
      "Gdy atrybut niekluczowy zależy jedynie od części klucza złożonego.",
      "Gdy w jednej komórce jest kilka wartości."
    ],
    "poprawna": 2,
    "wyjasnienie": "2NF dotyczy zależności atrybutów od całego klucza głównego w przypadku, gdy jest to klucz złożony."
  },
  {
    "pytanie": "Czego dotyczy Trzecia Postać Normalna (3NF)?",
    "opcje": [
      "Wymaga, aby kolumny zależały od całego klucza wprost, eliminując zależności tranzytywne.",
      "Nakazuje podział kolumn tekstowych na mniejsze.",
      "Wyklucza klucze obce powiązane więcej niż jednym polem.",
      "Wymusza atomowość wszystkich komórek tabeli."
    ],
    "poprawna": 0,
    "wyjasnienie": "3NF likwiduje zależności przechodnie – każdy atrybut niekluczowy musi zależeć bezpośrednio od klucza głównego, a nie od innych atrybutów niekluczowych."
  },
  {
    "pytanie": "Jakie zjawisko powstaje, gdy usunięcie pracownika powoduje usunięcie wiedzy, jak nazywało się jego stanowisko (bo był jedynym zatrudnionym na tym stanowisku)?",
    "opcje": [
      "Anomalia usuwania",
      "Brak relacji w 1NF",
      "Anomalia wstawiania",
      "Denormalizacja"
    ],
    "poprawna": 0,
    "wyjasnienie": "Jest to klasyczny objaw anomalii usuwania, gdy usunięcie wiersza skutkuje niespodziewaną utratą innych danych."
  },
  {
    "pytanie": "Co robimy podczas procesu denormalizacji?",
    "opcje": [
      "Dodajemy indeksy optymalizujące.",
      "Zamieniamy bazy relacyjne na NoSQL.",
      "Usuwamy całkowicie wszystkie relacje z bazy.",
      "Celowo łączymy tabele (nawet za cenę redundancji), aby przyspieszyć odczyty raportów."
    ],
    "poprawna": 3,
    "wyjasnienie": "Denormalizacja stosowana jest w systemach analitycznych celem uproszczenia zapytań i ograniczenia powolnych operacji JOIN."
  },
  {
    "pytanie": "Załóżmy, że tabela zamowienia posiada kolumny: id_zamowienia, kod_pocztowy_klienta, nazwa_miasta. Której reguły normalnej to nie spełnia (zakładając klucz po id_zamowienia)?",
    "opcje": [
      "3NF (ponieważ miasto zależy od kodu pocztowego, a nie id_zamowienia)",
      "2NF (ponieważ klucz jest złożony)",
      "1NF (ponieważ to brak atomowości)",
      "Jest w pełni znormalizowane (3NF)."
    ],
    "poprawna": 0,
    "wyjasnienie": "Występuje tu zależność przechodnia: nazwa_miasta zależy od kodu pocztowego (atrybutu niekluczowego). Tym samym złamano 3NF."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="postacie-normalne"></div>

---

*Źródło: Materiały edukacyjne do kursu INF.03*
