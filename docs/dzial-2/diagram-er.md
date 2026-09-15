# Diagram E/R — od szkicu do struktury
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

Zanim zaczniesz pisać kod SQL, musisz dokładnie wiedzieć, co chcesz zbudować. Tworzenie bazy danych bez planu to jak budowanie domu bez projektu. Właśnie dlatego programiści i analitycy używają diagramów E/R (Entity-Relationship, czyli diagram związków encji). Pozwalają one "narysować" bazę danych na kartce lub ekranie, co ułatwia dogadanie szczegółów z klientem oraz zapobiega błędom w przyszłości. 

Na egzaminie INF.03 często spotkasz się z diagramami — zarówno w części pisemnej (gdzie musisz je umieć czytać), jak i w praktycznej (gdzie dostajesz gotowy schemat bazy do zaprogramowania).

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. Wyjaśnić, z jakich elementów składa się diagram E/R i narysować jego podstawowe elementy.
    2. Rozpoznać i porównać notację Chena oraz notację Kurzej Łapki (Crow's foot).
    3. Odczytać strukturę bazy danych, klucze główne i obce oraz relacje na podstawie gotowego diagramu.
    4. Przetworzyć krótki scenariusz z życia na diagram E/R.
    5. Zamienić stworzony diagram E/R na poprawny kod SQL.

## 1. Po co rysować diagram

Diagram E/R to nic innego jak **graficzny model Twojej bazy danych**. Rysuje się go ZANIM napiszesz choćby jedną linijkę polecenia `CREATE TABLE`. Dlaczego to takie ważne?
- **Komunikacja z klientem** — klient nie zrozumie kodu SQL, ale zrozumie obrazek, na którym jest `Klient`, `Zamówienie` i `Produkt`.
- **Wykrywanie błędów na wczesnym etapie** — łatwiej zmazać gumką jedną linię na kartce niż zmieniać skomplikowane powiązania w działającej bazie danych.
- **Dokumentacja** — diagram jest instrukcją obsługi Twojej bazy dla innych informatyków.

## 2. Elementy diagramu

Każdy diagram E/R opiera się na trzech głównych klockach, niezależnie od tego, jakiej notacji używamy:

* **Encja (Entity)** — obiekt z prawdziwego świata, o którym chcemy gromadzić informacje (np. `uczeń`, `samochód`, `produkt`). Zazwyczaj na diagramach to **prostokąt**. Encja w przyszłości stanie się tabelą w bazie.
* **Atrybut (Attribute)** — cecha danej encji (np. dla encji `uczeń` atrybutem będzie `imie`, `nazwisko`, `pesel`). Może być rysowany jako **owal** połączony z encją lub jako wpis na liście wewnątrz prostokąta. Ważne: **Klucz główny** (Primary Key) zawsze jest specjalnie oznaczany, zazwyczaj przez **podkreślenie** jego nazwy.
* **Związek (Relationship)** — powiązanie między encjami (np. uczeń *wypożycza* książkę). Rysowany jako **linia** łącząca encje, czasem z **rombem** w środku, z opisaną **liczebnością** (np. 1:1, 1:N, M:N).

## 3. Dwie popularne notacje

W informatyce spotkasz różne style rysowania tych samych baz. Najpopularniejsze to notacja Chena i notacja Kurzej Łapki.

### Notacja Chena (klasyczna)
Stworzona przez Petera Chena. Jest to wersja "akademicka".
* **Encje** to prostokąty.
* **Atrybuty** to owale połączone liniami z encją (klucz główny jest podkreślony).
* **Związki** to romby na liniach łączących encje.

!!! example "Notacja Chena"
    Zajmuje dużo miejsca na kartce, ale jasno oddziela atrybuty od samych encji.

### Notacja Kurzej Łapki (Crow's foot / IE)
To notacja preferowana przez programistów i narzędzia typu phpMyAdmin (w widoku Projektant).
* **Encje** to prostokąty, podzielone poziomo na sekcje.
* **Atrybuty** są wpisane wewnątrz prostokąta jako lista. Górna część to nazwa tabeli, niżej klucz główny (PK - Primary Key), a pod nim reszta kolumn (w tym klucze obce FK - Foreign Key).
* **Związki** to tylko linie, a ich zakończenia mają odpowiednie kształty (np. potrójne rozwidlenie przypominające "kurzą łapkę" oznacza stronę *wiele*).

!!! tip "phpMyAdmin"
    Kiedy w phpMyAdminie używasz funkcji **Projektant** (Designer), narzędzie generuje diagram właśnie w stylu zbliżonym do Crow's foot, co idealnie odzwierciedla relacje między tabelami.

## 4. Czytanie gotowego diagramu

Wyobraź sobie, że dostajesz schemat naszej bazy `obuwie`. W notacji tabelarycznej (Crow's foot) widzisz:
1. Prostokąt `kategoria` (atrybuty: `id_kategorii` PK, `nazwa`).
2. Prostokąt `produkt` (atrybuty: `id_produktu` PK, `nazwa`, `cena`, `id_kategorii` FK).
3. Linię poprowadzoną od `kategoria` do `produkt`. Linia zaczyna się pojedynczo, a przy tabeli `produkt` ma "kurzą łapkę" (wiele).

Odczytujesz to tak:
* Mam dwie tabele: `kategoria` i `produkt`.
* Tabela `kategoria` ma klucz główny `id_kategorii`.
* Tabela `produkt` ma klucz obcy `id_kategorii`, łączący się z tabelą `kategoria`.
* Relacja to 1:N — jedna kategoria może mieć wiele produktów, ale jeden produkt przypisany jest do jednej kategorii.

## 5. Od scenariusza do diagramu — krok po kroku

Jak stworzyć diagram na podstawie opisu od klienta? Przeanalizujmy scenariusz:
*"Prowadzę sklep z butami. Mam produkty (każdy ma nazwę i cenę). Buty są przypisane do jednej kategorii (kategoria ma swoją nazwę)."*

**Krok 1: Wypisz encje (rzeczowniki z opisu)**
Z opisu wyciągamy obiekty: `produkt`, `kategoria`.

**Krok 2: Wypisz atrybuty**
Dla produktu: `nazwa`, `cena`. Dla kategorii: `nazwa`.

**Krok 3: Ustal klucze główne**
Musimy dodać sztuczne identyfikatory, by odróżnić od siebie rekordy. Do produktu dajemy `id_produktu`, do kategorii `id_kategorii`. Oznaczamy je jako klucze główne.

**Krok 4: Narysuj związki i liczebność**
Zastanawiamy się: czy jedna kategoria to wiele produktów? Tak. Czy jeden produkt to wiele kategorii? Nie. To relacja 1:N.

**Krok 5: Dodaj klucze obce**
W relacji 1:N klucz obcy ląduje po stronie "N". Zatem do encji `produkt` dopisujemy atrybut `id_kategorii` (jako FK).

## 6. Od diagramu do SQL

Mając gotowy diagram, wystarczy napisać polecenia `CREATE TABLE`. Istnieje jedna złota zasada: **najpierw tworzysz tabele, które nie mają kluczy obcych** (nie zależą od innych), a potem te z kluczami obcymi.

Z naszego scenariusza, najpierw kategoria:
```sql
CREATE TABLE kategoria (
  id_kategorii INT PRIMARY KEY AUTO_INCREMENT,
  nazwa VARCHAR(50)
);
```
Następnie produkt:
```sql
CREATE TABLE produkt (
  id_produktu INT PRIMARY KEY AUTO_INCREMENT,
  nazwa VARCHAR(100),
  cena DECIMAL(8,2),
  id_kategorii INT,
  FOREIGN KEY (id_kategorii) REFERENCES kategoria(id_kategorii)
);
```

## 7. Co z tego jest na egzaminie

Na egzaminie INF.03 temat E/R pojawia się bardzo często:
* **Egzamin pisemny:** Możesz dostać diagram w notacji Chena lub Crow's foot i będziesz musiał odpowiedzieć np. "Ile tabel powstanie z tego schematu?" albo "Jaka relacja łączy te dwie tabele?".
* **Egzamin praktyczny:** W zadaniu zazwyczaj otrzymasz już gotowy "schemat bazy danych" (często po prostu pokazane tabele z relacjami) i Twoim zadaniem będzie napisać do niego polecenia SQL i stworzyć to w systemie.

## Ćwiczenia

!!! question "Ćwiczenie 1. Projektant w phpMyAdmin"

    Uruchom środowisko XAMPP, przejdź do przeglądarki i otwórz phpMyAdmin. Wejdź w przygotowaną wcześniej bazę `obuwie`. W górnym menu bazy danych znajdź opcję **Projektant** (Designer) (może być ukryta pod "Więcej").
    
    Zauważysz wygenerowany diagram bazy danych. Na podstawie tego, co widzisz, narysuj na kartce papieru odpowiadający mu diagram w notacji "Kurzej łapki" (prostokąty z nazwami kolumn).
    
    **Zapisujesz:** Zrób zdjęcie lub zrzut ekranu swojego rysunku lub opisz krótko słowami, jakie elementy narysowałeś (która tabela ma jakie kolumny i gdzie zaczyna/kończy się linia powiązania).

??? success "Wskazówka do rozwiązania 1"

    W Projektancie powinieneś zobaczyć dwa prostokąty: `kategoria` oraz `produkt`. Od pola `id_kategorii` w tabeli `kategoria` (klucz główny) powinna być poprowadzona linia powiązania do pola `id_kategorii` w tabeli `produkt` (klucz obcy).

!!! question "Ćwiczenie 2. Projekt własnej bazy - gry planszowe"

    Przeczytaj poniższy opis scenariusza:
    "Sklep z grami planszowymi. Każda gra ma tytuł, cenę i rok wydania. Gry pogrupowane są w kategorie (strategiczne, rodzinne, karciane). Każda gra należy do dokładnie jednej kategorii, a dana kategoria może zawierać wiele gier."
    
    1. Zaprojektuj diagram E/R dla tej bazy (możesz użyć notacji Crow's foot na kartce).
    2. Na jego podstawie napisz polecenia `CREATE TABLE`.
    
    **Zapisujesz:** Kod SQL do utworzenia obu tabel z poprawnie zdefiniowanymi kluczami (PK i FK). Pamiętaj o właściwej kolejności tworzenia!

??? success "Wskazówka do rozwiązania 2"

    Najpierw należy utworzyć tabelę dla kategorii, bo nie ma kluczy obcych. Następnie tworzysz tabelę z grami, dodając pole (np. `kategoria_id`), które będzie kluczem obcym odnoszącym się do klucza głównego tabeli z kategoriami.

!!! question "Ćwiczenie 3. Rozbudowa projektu - tabele pośredniczące"

    Rozbuduj projekt bazy danych z ćwiczenia 2 o nowe wymagania:
    - Dodaj encję `producent` (nazwa, kraj) — każda gra ma dokładnie jednego producenta.
    - Dodaj encję `klient` (imie, email) — relacja: klient może kupić wiele gier, a gra może być kupiona przez wielu klientów (to relacja wiele-do-wielu).
    
    Narysuj pełny diagram. 
    
    **Zapisujesz:** Napisz komendy `CREATE TABLE` realizujące tę bardziej złożoną strukturę. Aby rozwiązać problem wiele-do-wielu, musisz zastosować tabelę pośredniczącą (np. `zakupy` lub `zamowienia`).

??? success "Wskazówka do rozwiązania 3"

    Dla relacji wiele-do-wielu z klientami potrzebujesz piątej tabeli pośredniczącej, która będzie miała co najmniej dwa klucze obce: `gra_id` oraz `klient_id`.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Dlaczego rysujemy diagram E/R przed napisaniem kodu SQL?",
    "opcje": [
      "Aby łatwiej i taniej wyłapać błędy logiczne w powiązaniach",
      "Bo system zarządzania bazą danych nie uruchomi się bez diagramu",
      "Aby sprawdzić szybkość zapytań w bazie",
      "Aby wygenerować rekordy testowe dla tabel"
    ],
    "poprawna": 0,
    "wyjasnienie": "Diagram służy jako projekt koncepcyjny. Pozwala na zaplanowanie struktury przed implementacją."
  },
  {
    "pytanie": "Jak w notacji Chena oznacza się encję?",
    "opcje": [
      "Jako prostokąt",
      "Jako owal",
      "Jako romb",
      "Jako podwójną linię"
    ],
    "poprawna": 0,
    "wyjasnienie": "W notacji Chena prostokąty oznaczają encje, owale atrybuty, a romby związki."
  },
  {
    "pytanie": "Jak na diagramach oznaczany jest zazwyczaj klucz główny (Primary Key)?",
    "opcje": [
      "Poprzez podkreślenie nazwy atrybutu",
      "Znakami zapytania na końcu nazwy",
      "Pisząc go czerwoną czcionką",
      "Rysując go zawsze jako pierwszy z prawej strony"
    ],
    "poprawna": 0,
    "wyjasnienie": "Zwyczajowo klucz główny (PK) na diagramach (szczególnie Chena) jest podkreślony, lub opisany jako PK na liście."
  },
  {
    "pytanie": "Na czym polega zasada kolejności tworzenia tabel (CREATE TABLE) z gotowego diagramu?",
    "opcje": [
      "Najpierw tworzy się tabele bez kluczy obcych",
      "Najpierw tworzy się tabele posiadające klucze obce",
      "Zawsze należy układać tabele alfabetycznie",
      "Kolejność nie ma znaczenia w nowoczesnych systemach"
    ],
    "poprawna": 0,
    "wyjasnienie": "Tabela zawierająca klucz obcy odwołuje się do innej tabeli. Ta inna tabela musi już istnieć, dlatego tworzymy ją wcześniej."
  },
  {
    "pytanie": "W której notacji związki zapisywane są najczęściej jako romby?",
    "opcje": [
      "W notacji Chena",
      "W notacji Crow's foot (kurza łapka)",
      "W notacji IDEF1X",
      "W notacji UML"
    ],
    "poprawna": 0,
    "wyjasnienie": "Romb symbolizujący relację to charakterystyczna cecha notacji Chena."
  },
  {
    "pytanie": "Jeśli w scenariuszu występuje rzeczownik, np. 'produkt' lub 'pracownik', to na diagramie stanie się on najprawdopodobniej:",
    "opcje": [
      "Encją",
      "Atrybutem",
      "Kluczem obcym",
      "Relacją"
    ],
    "poprawna": 0,
    "wyjasnienie": "Rzeczowniki w opisach logicznych zazwyczaj wskazują obiekty bazy danych, czyli encje."
  },
  {
    "pytanie": "Narzędzie 'Projektant' (Designer) w programie phpMyAdmin prezentuje strukturę bazy danych korzystając z notacji zbliżonej do:",
    "opcje": [
      "Notacji Kurzej Łapki (Crow's foot)",
      "Notacji Chena",
      "Wykresu kołowego",
      "Schematu blokowego"
    ],
    "poprawna": 0,
    "wyjasnienie": "Projektant phpMyAdmina wyświetla tabele jako prostokąty z listą kolumn i łączy je liniami bez rombów, co jest zgodne z notacją Crow's foot."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="diagram-er"></div>

---

*Treści dopasowane do wymagań egzaminacyjnych INF.03, materiały dla technikum.*
