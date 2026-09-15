# Typy danych i dobór ich do atrybutów
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział II**

Kiedy projektujesz tabelę, nie wystarczy tylko wymyślić nazwy kolumn. Każda z nich musi mieć określony typ danych. Typ mówi bazie, czy w danej kolumnie będą liczby, tekst, daty czy może tylko wartości prawda/fałsz. Dobrze dobrany typ to podstawa stabilnego i szybkiego systemu.

Na egzaminie INF.03 prawidłowy dobór typów danych podczas tworzenia tabel to często punktowane zadanie. Egzaminatorzy sprawdzają, czy potrafisz oszacować wielkość danych i dobrać do nich najbardziej optymalny typ, nie marnując miejsca i unikając błędów (np. przy obliczeniach finansowych).

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. Wyjaśnić, dlaczego dobór typów danych ma znaczenie w projektowaniu bazy.
    2. Wskazać różnice między typami całkowitymi, zmiennoprzecinkowymi i stałoprzecinkowymi.
    3. Dobrać właściwy typ tekstowy (CHAR, VARCHAR, TEXT) w zależności od potrzeb.
    4. Używać odpowiednich typów do przechowywania daty, czasu oraz wartości logicznych.
    5. Zastosować reguły doboru typów w praktycznych przykładach (np. podczas pisania CREATE TABLE).

## 1. Po co dobierać typ danych?

Typ danych decyduje w bazie o kilku kluczowych kwestiach:
* **Ile miejsca zajmuje kolumna** – czy baza zarezerwuje na atrybut 1 bajt, czy może aż kilkadziesiąt bajtów na każdy wiersz.
* **Jakie operacje można wykonać** – bazy potrafią sortować poprawnie numerycznie typy liczbowe (2 jest przed 10), ale dla tekstów 10 będzie przed 2. Z typami numerycznymi można wykonywać obliczenia matematyczne.
* **Jakie wartości są dopuszczalne** – system bazodanowy pilnuje spójności (np. nie pozwoli wstawić tekstu „Ala” do kolumny typu `INT`).

Zły typ to nie tylko marnowane miejsce na dysku, ale też błędy logiczne i problemy z wydajnością, które zemścić się mogą po miesiącach działania aplikacji.

## 2. Typy liczbowe

W MariaDB typy liczbowe dzielimy na te, które przechowują liczby całkowite, oraz te ułamkowe.

**Liczby całkowite:**

| Typ | Rozmiar | Zakres (ze znakiem) | Zakres (UNSIGNED) | Zastosowanie |
| :--- | :--- | :--- | :--- | :--- |
| `TINYINT` | 1 bajt | -128 do 127 | 0 do 255 | Wiek, statusy (np. 1-aktywny, 0-nieaktywny) |
| `SMALLINT` | 2 bajty | -32 768 do 32 767 | 0 do 65 535 | Lata kalendarzowe, małe identyfikatory |
| `MEDIUMINT` | 3 bajty | -8 388 608 do 8 388 607 | 0 do 16 777 215 | Średnie zbiory danych |
| `INT` | 4 bajty | -2 mld do +2 mld | 0 do 4 mld | **Podstawowy typ dla kluczy głównych (ID)** |
| `BIGINT` | 8 bajtów | Bardzo duże liczby | Ogromne | Analiza danych, klucze w globalnych portalach |

!!! tip "UNSIGNED"
    Dodanie słowa `UNSIGNED` do typu całkowitego (np. `INT UNSIGNED`) sprawia, że kolumna nie przyjmuje wartości ujemnych. Dzięki temu górny limit ulega podwojeniu, co jest idealne dla ID, ilości sztuk w magazynie czy wagi przedmiotu (nie bywa ujemna).

**Liczby ułamkowe:**

Tutaj kryje się największa pułapka!
* **`DECIMAL(p, s)` (stałoprzecinkowe)** – dokładny typ liczbowy. Używamy go **ZAWSZE** do cen, walut i księgowości. Pierwszy parametr `p` to całkowita liczba cyfr, a `s` to liczba cyfr po przecinku. Np. `DECIMAL(10, 2)` to 8 cyfr przed i 2 po przecinku.
* **`FLOAT` i `DOUBLE` (zmiennoprzecinkowe)** – są to liczby o podwójnej / pojedynczej precyzji używane do naukowych, przybliżonych obliczeń (np. temperatura czy współrzędne geograficzne). Ze względu na to, jak komputery radzą sobie z ułamkami w systemie binarnym, użycie FLOAT dla pieniędzy może spowodować, że "znikną" lub pojawią się ułamki groszy.

## 3. Typy tekstowe

Teksty są podstawą każdej bazy danych, począwszy od imion, przez hasła, po artykuły.

* **`CHAR(n)`** – stała długość tekstu (do 255 znaków). Jeśli określisz `CHAR(10)` i wstawisz 4 litery, reszta zostanie wypełniona spacjami. 
    * *Kiedy używać?* Kod pocztowy (zawsze 6 znaków: XX-XXX), PESEL (11 znaków), numer rejestracyjny pojazdu.
* **`VARCHAR(n)`** – zmienna długość tekstu (maksymalnie ok. 65 tys. bajtów w teorii). Długość podana w nawiasie to tylko **limit górny**. Baza przechowuje jedynie użyte znaki plus 1 lub 2 bajty na informację o długości tego tekstu. 
    * *Kiedy używać?* Imię, nazwisko, tytuł filmu, adres e-mail, ulica. Na egzaminach INF.03 `VARCHAR(255)` i `VARCHAR(50)` królują.
* **`TEXT` i `LONGTEXT`** – do długich opisów. Używamy do treści artykułów, opisów produktów, komentarzy na blogu.

!!! info "Kodowanie a rozmiar"
    Zwróć uwagę, że w erze kodowania znaków `UTF-8` (w bazach zapisywane najczęściej jako `utf8mb4`), jeden polski znak potrafi zająć nawet do 4 bajtów, co ma znaczenie przy maksymalnych limitach (np. `VARCHAR`).

## 4. Typy daty i czasu

Dla czasu używamy dedykowanych typów. Nie przechowujemy daty w formacie tekstowym jako `VARCHAR` - to utrudnia liczenie (np. kto jest pełnoletni).

* **`DATE`** – data w formacie `YYYY-MM-DD` (np. `2024-11-20`).
* **`TIME`** – czas w formacie `HH:MM:SS`.
* **`DATETIME`** – data i czas (np. `2024-11-20 18:30:00`). Często stosowany do rejestracji daty zamówienia.
* **`TIMESTAMP`** – również data i czas, ale zależy od strefy czasowej serwera. Często aktualizuje się automatycznie.

!!! example "Funkcje"
    W SQL dzięki użyciu odpowiedniego formatu daty możesz później używać takich dobrodziejstw jak `NOW()` (zwraca obecny czas dla typu DATETIME), `CURDATE()` (zwraca dzisiejszą datę dla DATE) lub funkcji wyciągających rok z daty.

## 5. BOOLEAN i ENUM

* **`BOOLEAN` / `BOOL`** – typ prawda / fałsz. Ciekawostką jest, że w MariaDB (a tym samym w phpMyAdmin), typ `BOOLEAN` to tak naprawdę skrót od `TINYINT(1)`. Prawda to `1`, a fałsz to `0`. 
* **`ENUM`** – specjalny typ, do którego podaje się zamkniętą listę dozwolonych wartości np. `ENUM('S', 'M', 'L', 'XL')`.
    * *Uwaga:* Używaj ENUM ostrożnie. Jeśli wiesz, że zbiór w przyszłości często się zmieni (np. kolory ubrań), bezpieczniej jest stworzyć osobną tabelę `kolory` ze słownikiem i powiązać je kluczem obcym.

## 6. Dobór typu do atrybutu — reguły kciuka

Poniższa tabela zbiera uniwersalne reguły, które przydadzą Ci się przy projektowaniu bazy `obuwie` i nie tylko.

| Atrybut / Zastosowanie | Preferowany typ w SQL | Uwagi |
| :--- | :--- | :--- |
| Identyfikator (ID) | `INT UNSIGNED AUTO_INCREMENT` | Dla tabel >2 mld rekordów używamy `BIGINT` |
| Nazwisko, imię, miasto, e-mail | `VARCHAR(50)` do `VARCHAR(255)` | Zmienny limit, dobierz według zdrowego rozsądku |
| Opis artykułu, recenzja, komentarz | `TEXT` | Nie wymaga podawania długości |
| PESEL, Kod pocztowy, NIP, ISBN | `CHAR(11)`, `CHAR(6)`, itp. | Stała liczba znaków |
| Cena produktu, rabat kwotowy | `DECIMAL(10,2)` | 10 cyfr, z czego dwie to grosze |
| Liczba sztuk w magazynie, wyświetlenia | `INT UNSIGNED` | Wartość zawsze dodatnia (ew. 0) |
| Data urodzenia, data zwrotu | `DATE` | Wystarczy sam dzień |
| Moment wpłynięcia zamówienia | `DATETIME` | Ważny jest dzień i godzina |
| Czy aktywny? Czy zapłacono? | `BOOLEAN` (lub `TINYINT(1)`) | Prawda (1) lub Fałsz (0) |

## 7. Co z tego jest na egzaminie?

Na egzaminach INF.03 najczęściej proszą o napisanie skryptów do tworzenia bazy (`CREATE TABLE ...`). Tam samodzielnie musisz dobrać typ do kolumny (np. podają "pesel", a Ty wiesz, że to CHAR). W części pisemnej możesz trafić na test wyboru, w którym zapytają, czym różni się `CHAR` od `VARCHAR` albo kiedy użyć `FLOAT` a kiedy `DECIMAL`.

## Ćwiczenia

!!! question "Ćwiczenie 1. Analiza typów w tabeli produkt"

    Otwórz strukturę tabeli `produkt` (w bazie `obuwie`) w phpMyAdminie. Wypisz każdą kolumnę, jej typ i wyjaśnij, dlaczego został wybrany taki typ (nie inny).

    **Zapisujesz:** Zestawienie w tabeli w karcie pracy.

??? success "Wskazówka do rozwiązania 1"

    Zwróć uwagę, dlaczego `id` jest `INT`, a `cena` jest zazwyczaj `DECIMAL(10,2)`.

!!! question "Ćwiczenie 2. Projekt tabeli zamowienie"

    Zaprojektuj tabelę `zamowienie` dla sklepu obuwniczego. Powinna zawierać: id zamówienia, datę, klienta (imię, nazwisko), adres, produkt (id), ilość, cena jednostkowa, czy zapłacone. Dobierz typ do każdego atrybutu i uzasadnij.

    **Zapisujesz:** Zaprojektowane typy z uzasadnieniem w karcie pracy.

??? success "Wskazówka do rozwiązania 2"

    Rozbij datę na odpowiedni format, zastanów się czy ilość może być ujemna (użyj `UNSIGNED`), a płatność powinna przyjmować tylko Prawda/Fałsz.

!!! question "Ćwiczenie 3. Eksperyment: DECIMAL vs FLOAT"

    W tabeli `produkt` cena jest często typu `DECIMAL(10,2)`. Co by się stało, gdyby była typu `FLOAT`? Wykonaj eksperyment na swojej bazie: stwórz tymczasową tabelę z kolumną typu `FLOAT`, wstaw do niej wartość np. `19.99` i ją odczytaj. Zapisz wnioski (co się dzieje z pieniędzmi w komputerze, gdy używamy FLOAT).

    **Zapisujesz:** Kod SQL, który stworzył tabelę, wykonał INSERT, oraz wniosek ze zjawiska zaokrągleń ułamków binarnych.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaki typ danych najlepiej wybrać do przechowywania polskiego kodu pocztowego (np. 33-230)?",
    "opcje": ["VARCHAR(6)", "CHAR(6)", "INT", "TEXT"],
    "poprawna": 1,
    "wyjasnienie": "Kod pocztowy w Polsce zawsze ma format XX-XXX, czyli dokładnie 6 znaków. Dlatego CHAR(6) jest najlepszym wyborem. INT obetnie wiodące zero, a myślnik uniemożliwia zapis jako liczba."
  },
  {
    "pytanie": "Który typ danych bezwzględnie należy wybrać do zapisywania cen produktów (wartości finansowych)?",
    "opcje": ["FLOAT", "DOUBLE", "DECIMAL", "VARCHAR"],
    "poprawna": 2,
    "wyjasnienie": "Do zapisu walut używamy typów stałoprzecinkowych (DECIMAL), co eliminuje błędy zaokrągleń występujące w zmiennoprzecinkowych typach FLOAT i DOUBLE."
  },
  {
    "pytanie": "Co oznacza UNSIGNED w definicji INT UNSIGNED?",
    "opcje": ["Pole będzie niewidoczne", "Brak wartości ujemnych", "Tylko liczby pierwsze", "Tekst bez znaków specjalnych"],
    "poprawna": 1,
    "wyjasnienie": "UNSIGNED informuje bazę danych, że w tej kolumnie nie będą występować liczby ujemne (bez znaku minus). Zwiększa to limit dodatni liczby dwukrotnie."
  },
  {
    "pytanie": "Który z typów danych zastosujesz do przechowywania długiego opisu produktu, nie znając jego maksymalnej długości?",
    "opcje": ["VARCHAR(255)", "CHAR(255)", "TEXT", "INT"],
    "poprawna": 2,
    "wyjasnienie": "TEXT służy do przechowywania długich ilości tekstu (do ok. 65 tys. znaków), gdy rozmiar VARCHAR(255) to za mało, np. na artykuły lub obszerne opisy."
  },
  {
    "pytanie": "Typ DATE służy do:",
    "opcje": ["Przechowywania daty w formacie RR-MM", "Przechowywania daty w formacie RRRR-MM-DD", "Przechowywania daty i dokładnej godziny", "Przechowywania czasu (HH:MM:SS)"],
    "poprawna": 1,
    "wyjasnienie": "Typ DATE w systemach SQL zapisuje informacje zgodnie ze standardem ISO jako YYYY-MM-DD."
  },
  {
    "pytanie": "W jaki sposób baza MariaDB przechowuje pod spodem typ BOOLEAN?",
    "opcje": ["Jako napis TRUE lub FALSE", "Jako typ FLOAT", "Jako pojedynczy bajt tekstu (Y/N)", "Jako typ TINYINT(1) o wartościach 1 lub 0"],
    "poprawna": 3,
    "wyjasnienie": "W MariaDB / MySQL BOOLEAN i BOOL to synonimy dla TINYINT(1), gdzie 1 zazwyczaj oznacza prawda, a 0 fałsz."
  },
  {
    "pytanie": "Główna różnica między CHAR a VARCHAR polega na tym, że:",
    "opcje": ["VARCHAR działa wolniej", "CHAR zawsze rezerwuje tyle bajtów, ile wynosi określona długość w nawiasie (stała długość)", "CHAR używa się do liczb", "VARCHAR jest stałoprzecinkowy"],
    "poprawna": 1,
    "wyjasnienie": "CHAR to ciąg o stałej długości (wypełnia wolne miejsce spacjami), a VARCHAR to ciąg o zmiennej długości (zajmuje tylko tyle znaków, ile faktycznie wstawiono + bajt wielkości)."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="typy-danych"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
