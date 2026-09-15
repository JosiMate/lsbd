# Związki między encjami i ich liczebność
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

Bazy danych rzadko składają się z pojedynczych, odizolowanych tabel. Siła relacyjnych baz danych (takich jak MariaDB czy MySQL) polega właśnie na tym, że potrafią one odwzorować powiązania ze świata rzeczywistego, np. fakt, że uczeń należy do klasy, produkt do kategorii, a klient składa zamówienie. Umiejętność rozpoznawania i projektowania tych powiązań to absolutna podstawa dla każdego administratora i programisty baz danych.

Na egzaminie INF.03 bardzo często pojawiają się pytania o określanie rodzaju związku między tabelami oraz o prawidłowe rozplanowanie kluczy obcych i tabel pośredniczących na podstawie podanego opisu sytuacji.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. Wyjaśnić, czym jest związek między encjami.
    2. Rozpoznawać liczebność związków (1:1, 1:N, N:M) na podstawie opisu słownego.
    3. Wskazać, jak poszczególne typy związków są realizowane w strukturze bazy danych.
    4. Zaprojektować tabelę pośredniczącą dla relacji wiele do wielu.

## 1. Czym jest związek (relacja) między encjami

**Związek** to po prostu logiczne powiązanie między dwiema encjami (tabelami). Związki zwykle opisuje się czasownikami. Na przykład:
- Pracownik **pracuje w** dziale.
- Produkt **należy do** kategorii.
- Autor **pisze** książkę.

W relacyjnej bazie danych, fizyczną realizacją takiego związku są najczęściej **klucze obce** (FOREIGN KEY). Jeden wiersz w tabeli odwołuje się za pomocą ID do wiersza w innej tabeli. 

## 2. Liczebność (krotność) związku

**Liczebność** określa, ile egzemplarzy jednej encji może być powiązanych z jednym egzemplarzem drugiej encji. Rozróżniamy trzy główne typy liczebności:

- **1:1 (Jeden do jednego)** – jeden rekord z tabeli A jest powiązany z najwyżej jednym rekordem z tabeli B (i odwrotnie).
- **1:N (Jeden do wielu)** – jeden rekord z tabeli A może być powiązany z wieloma rekordami w tabeli B, ale jeden rekord w tabeli B jest powiązany tylko z jednym w tabeli A.
- **N:M (Wiele do wielu)** – jeden rekord z tabeli A może powiązać się z wieloma w B, a jeden w B z wieloma w A.

Poniżej przyjrzymy się każdemu z nich ze szczegółami.

## 3. Związek jeden do wielu (1:N)

To najpopularniejszy typ relacji w bazach danych.

**Przykład:** Kategoria a Produkt (w naszej bazie `obuwie`).
- Jedna kategoria (np. "Buty sportowe") może zawierać **wiele** produktów (Nike Air, Adidas Stan Smith, Puma Suede).
- Jeden konkretny produkt (np. Nike Air w danym rozmiarze i kolorze) należy do **jednej** konkretnej kategorii.

**Jak to zapisać w bazie?**
Klucz obcy stawiamy **zawsze po stronie "wiele"**. W tabeli `produkt` tworzymy kolumnę `kategoria_id`, która wskazuje na klucz główny tabeli `kategoria`.

!!! tip "Złota zasada 1:N"
    W relacji 1:N, tabela będąca "dzieckiem" (wiele) otrzymuje klucz obcy wskazujący na "rodzica" (jeden).

## 4. Związek jeden do jednego (1:1)

Ten typ związku jest rzadko spotykany, ponieważ najczęściej atrybuty powiązane 1:1 wrzuca się po prostu do jednej tabeli. Czasami jednak rozdzielenie jest uzasadnione.

**Przykład z życia:** Pracownik a jego Karta dostępowa.
- Pracownik może mieć w danym momencie tylko jedną kartę.
- Karta należy tylko do jednego pracownika.

**Kiedy stosujemy 1:1 w projektowaniu?**
- **Ze względów bezpieczeństwa:** Oddzielamy dane wrażliwe (np. hasła, piny, zarobki) do innej tabeli o zaostrzonych prawach dostępu.
- **Dla optymalizacji:** Gdy część danych jest rzadko odczytywana, a zawiera dużo tekstu (np. pełny biogram pracownika) lub duże pliki binarne (zdjęcie), możemy wynieść je do osobnej tabeli, by nie spowalniać zapytań na głównej tabeli `pracownik`.

W związku 1:1 klucz obcy umieszczamy w jednej z tabel (zazwyczaj tej "podrzędnej"), z nałożonym dodatkowym ograniczeniem `UNIQUE`, aby zapobiec przypisaniu więcej niż raz.

## 5. Związek wiele do wielu (N:M)

Relacja niezwykle ważna w świecie rzeczywistym, ale... w relacyjnych bazach danych **nie da się jej zrealizować bezpośrednio między dwiema tabelami**.

**Przykład:** Uczeń a Przedmiot.
- Uczeń Janek uczęszcza na **wiele** przedmiotów (matematyka, informatyka, polski).
- Przedmiot (np. informatyka) ma **wielu** uczniów (Janka, Zosię, Piotrka).

Gdzie wstawić klucz obcy? Do `uczen`? (Wtedy uczeń miałby tylko jeden przedmiot). Do `przedmiot`? (Przedmiot miałby tylko jednego ucznia). 

**Rozwiązanie:** Należy zastosować **tabelę pośredniczącą** (nazywaną też asocjacyjną lub łączącą). 

Rozbijamy związek na dwie relacje 1:N:
1. `uczen` (1) — (N) `uczen_przedmiot`
2. `przedmiot` (1) — (N) `uczen_przedmiot`

Tabela `uczen_przedmiot` będzie miała co najmniej dwie kolumny: `uczen_id` i `przedmiot_id`. W ten sposób możemy zapisać każdy fakt uczestnictwa ucznia w zajęciach.

!!! example "Przykład: Aktorzy i Filmy"
    Tabela A: `aktor`
    Tabela B: `film`
    Tabela łącząca: `obsada` (z kolumnami `aktor_id`, `film_id`, ewentualnie dodatkowymi jak `nazwa_roli`)

## 6. Od opisu do struktury — jak rozpoznać liczebność

Często w zadaniach z egzaminu (lub w pracy dla klienta) dostajesz tylko opis słowny i musisz zadecydować o kształcie bazy. Stosuj "test dwóch pytań".

Weźmy parę encji X i Y:
1. **Pytanie 1:** Czy jeden egzemplarz X może mieć powiązanych wiele egzemplarzy Y? (Tak/Nie)
2. **Pytanie 2:** Czy jeden egzemplarz Y może mieć powiązanych wiele egzemplarzy X? (Tak/Nie)

Wyniki:
- Obie odpowiedzi to **Nie** $\rightarrow$ związek **1:1**
- Jedna odpowiedź to **Tak**, druga **Nie** $\rightarrow$ związek **1:N**
- Obie odpowiedzi to **Tak** $\rightarrow$ związek **N:M**

## 7. Co z tego jest na egzaminie

Na części pisemnej egzaminu INF.03 możesz spotkać zadania w stylu:

> *Baza danych sklepu zawiera tabele `Klienci` oraz `Faktury`. Klient może otrzymać wiele faktur. Faktura jest wystawiana tylko dla jednego klienta. Jaka jest to relacja i w której tabeli znajdzie się klucz obcy?*

Odpowiedź na podstawie naszej lekcji: To związek 1:N. Klucz obcy znajdzie się po stronie "wiele", czyli w tabeli `Faktury` (odniesienie do ID z `Klienci`).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Typy związków z życia"

    Zastosuj "test dwóch pytań" i określ rodzaj liczebności (1:1, 1:N lub N:M) dla poniższych par encji z otaczającego nas świata. Podaj również krótkie uzasadnienie dla każdego przypadku:
    
    1. Państwo – Stolica
    2. Autor – Książka
    3. Nauczyciel – Klasa (w której wychowuje)
    4. Samochód – Właściciel (przyjmij, że w dowodzie rejestracyjnym może być dwóch współwłaścicieli)
    5. Pacjent – Lekarz (przyjmijmy rejestrację w przychodni w ciągu całego życia pacjenta)

    **Zapisujesz:** Pięć podpunktów z określonym typem relacji i krótkim, jednym zdaniem uzasadnienia.

??? success "Wskazówka do rozwiązania 1"

    Pamiętaj np., że jedna książka może mieć kilku współautorów, a autor może napisać wiele książek. Jak to wpłynie na relację (nr 2)? Podobnie z samochodem, który może mieć kilku właścicieli, a jeden właściciel kilka aut (nr 4).

!!! question "Ćwiczenie 2. Produkt i kolory"

    Załóżmy, że rozbudowujemy naszą bazę `obuwie`. Mamy tabelę `produkt`. Chcemy dodać informacje o kolorach. 
    Wymaganie biznesowe: *Jeden model produktu (np. Nike Air) może występować w kilku różnych kolorach. Z kolei jeden kolor (np. czerwony) jest przypisany do wielu produktów w sklepie.*
    
    Zaprojektuj rozwiązanie. Jakie utworzysz tabele? 

    **Zapisujesz:** Listę nowych tabel oraz wylistowane w nich kolumny. Zaznacz, która kolumna jest kluczem głównym (PK), a która obcym (FK). Wskaż typ relacji produkt-kolor.

??? success "Wskazówka do rozwiązania 2"

    Odpowiedz sobie na dwa pytania z sekcji 6, żeby dowiedzieć się, jak to relacja (czy jeden produkt ma wiele kolorów? czy jeden kolor ma wiele produktów?). Jeśli to relacja wiele do wielu (N:M), musisz stworzyć tabelę łączącą, np. `produkt_kolor`.

!!! question "Ćwiczenie 3. System biblioteczny"

    Masz za zadanie wstępnie zaprojektować kluczową część bazy dla małej biblioteki szkolnej. System musi przechowywać informacje o czytelnikach, książkach oraz historii wypożyczeń (kto, co, kiedy pożyczył, do kiedy ma oddać).
    
    Zaprojektuj zestaw tabel (wraz z ich kolumnami), które zrealizują te wymagania. Opisz słownie relacje (związki i liczebność) między tymi tabelami.

    **Zapisujesz:** Nazwy tabel z wyszczególnionymi kolumnami (wraz ze wskazaniem kluczy PK i FK) oraz 1-2 zdania objaśniające, w jakich związkach pozostają ze sobą te tabele.

??? success "Wskazówka do rozwiązania 3"

    Centralnym punktem jest tu fakt Wypożyczenia. Relacja między czytelnikiem a książką (ktoś może z czasem pożyczyć wiele książek, a książka wędruje przez ręce wielu czytelników) to N:M. Potrzebujesz więc trzech tabel. Czytelnik i Książka to tabele słownikowe, a "Wypożyczenie" będzie tabelą pośredniczącą – oprócz kluczy obcych do czytelnika i książki dodaj tam jeszcze kolumny na datę wypożyczenia i datę zwrotu.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaki jest najczęstszy typ związku między dwiema tabelami w relacyjnej bazie danych?",
    "opcje": [
      "Jeden do wielu (1:N)",
      "Jeden do jednego (1:1)",
      "Wiele do wielu (N:M)",
      "Brak powiązań między encjami"
    ],
    "poprawna": 0,
    "wyjasnienie": "Najczęściej występuje 1:N (np. kategoria-produkty, klient-zamówienia)."
  },
  {
    "pytanie": "Gdzie należy umieścić klucz obcy (Foreign Key) w związku jeden do wielu (1:N)?",
    "opcje": [
      "Zawsze w tabeli będącej po stronie 'wiele' (podrzędnej).",
      "Zawsze w tabeli będącej po stronie 'jeden' (nadrzędnej).",
      "W osobnej tabeli łączącej.",
      "Po równo w obu tabelach jako połączony klucz."
    ],
    "poprawna": 0,
    "wyjasnienie": "W związku 1:N klucz obcy ląduje po stronie 'N' (np. produkt posiada ID kategorii, do której należy)."
  },
  {
    "pytanie": "Dlaczego związek wiele do wielu (N:M) nie może być bezpośrednio utworzony przez klucz obcy z jednej tabeli do drugiej?",
    "opcje": [
      "Ponieważ kolumna może przechowywać tylko jedną wartość przypisaną do danego rekordu, a my potrzebujemy wskazać wiele rekordów.",
      "Ponieważ SQL nie obsługuje takich związków.",
      "Ponieważ wymagałoby to włączenia specjalnego silnika bazy danych.",
      "W MySQL relacje N:M tworzy się używając spacji jako separatora wewnątrz jednej kolumny."
    ],
    "poprawna": 0,
    "wyjasnienie": "Baza relacyjna opiera się na prostych atomowych wartościach. Nie możemy do jednej komórki FK wpisać listy identyfikatorów z innej tabeli."
  },
  {
    "pytanie": "Jak realizuje się relację wiele do wielu (N:M) w bazach danych?",
    "opcje": [
      "Poprzez utworzenie tabeli pośredniczącej (asocjacyjnej).",
      "Rozdzielając każdą wartość po przecinku w jednej komórce (typ SET).",
      "Duplikując dane we wszystkich tabelach.",
      "Poprzez dodanie klucza obcego do tabeli ważniejszej."
    ],
    "poprawna": 0,
    "wyjasnienie": "Tworzy się trzecią tabelę (pośredniczącą), która połączy identyfikatory z dwóch głównych tabel. Przez to rozbija się relację N:M na dwie relacje 1:N."
  },
  {
    "pytanie": "Jaki jest rodzaj powiązania (relacji) między pracownikiem a jego osobistą, służbową kartą wstępu (przy założeniu, że ma ją na wyłączność)?",
    "opcje": [
      "1:1",
      "1:N",
      "N:M",
      "Relacja zwrotna"
    ],
    "poprawna": 0,
    "wyjasnienie": "Pracownik ma tylko jedną kartę, a konkretna karta należy do jednego pracownika – to układ jeden do jednego."
  },
  {
    "pytanie": "Baza posiada tabele UCZNIOWIE oraz ZAJECIA_POZALEKCYJNE. Uczeń może uczęszczać na wiele zajęć, a na jedne zajęcia uczęszcza wielu uczniów. Ile docelowo tabel pojawi się w bazie dla tej struktury?",
    "opcje": [
      "Trzy (uczniowie, zajecia, oraz tabela łącząca uczen_zajecia)",
      "Dwie (uczniowie i zajecia połączone kluczem obcym)",
      "Cztery (uczniowie, zajecia, obecnosci i wychowawca)",
      "Jedna, gromadząca wszystko"
    ],
    "poprawna": 0,
    "wyjasnienie": "Mamy związek N:M, dlatego konieczne jest zastosowanie tabeli pośredniczącej, więc łącznie będą 3 tabele."
  },
  {
    "pytanie": "Kiedy programista bazy danych może zadecydować o wydzieleniu nowej tabeli w relacji jeden-do-jednego z główną tabelą?",
    "opcje": [
      "By wydzielić bardzo duże objętościowo rzadko odczytywane dane (np. obrazy) ze względów wydajnościowych, lub by odseparować wrażliwe dane (np. hasła).",
      "Zawsze, kiedy tabela główna ma więcej niż 10 kolumn.",
      "Kiedy chcemy połączyć się z zewnętrznym API.",
      "By zaoszczędzić miejsce na dysku – dzieląc dane zajmują one mniej miejsca."
    ],
    "poprawna": 0,
    "wyjasnienie": "Relację 1:1 stosuje się najczęściej dla optymalizacji dostępu do rzadszych i dużych danych, oraz ze względów bezpieczeństwa (oddzielenie haseł/zarobków)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="zwiazki-liczebnosc"></div>

---

*PCEiKZ Szczucin · lokalne systemy baz danych · INF.03 · materiały przygotował: J.K.*
