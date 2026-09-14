# Środowisko, import bazy i plik kwerend

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział I**

Pierwsze dziesięć minut egzaminu decyduje o tym, czy resztę spędzisz na
rozwiązywaniu zadania, czy na walce ze środowiskiem. Ta lekcja jest o czynnościach,
które wykonasz **zawsze, w tej samej kolejności**: uruchomić serwer, założyć bazę
z właściwym kodowaniem, zaimportować plik, sprawdzić, czy się udało, i przygotować
plik na zapytania.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. uruchomić serwer bazy danych i otworzyć phpMyAdmina
    2. założyć bazę z kodowaniem, przy którym polskie znaki nie zamienią się w „krzaczki"
    3. zaimportować bazę z pliku `.sql` i **sprawdzić**, czy import się powiódł
    4. rozpoznać trzy najczęstsze przyczyny nieudanego importu i usunąć je
    5. przygotować plik z zapytaniami i zrzuty ekranu dokładnie tak, jak wymaga tego arkusz
    6. wykonać eksport bazy do pliku

## 1. Co stoi na stanowisku

Na egzaminie i w pracowni pracujesz na tym samym zestawie:

| Element | Co to jest | Gdzie go szukać |
| --- | --- | --- |
| **XAMPP** | pakiet instalujący naraz serwer WWW i serwer bazy danych | panel sterowania XAMPP |
| **Apache** | serwer WWW; potrzebny, bo phpMyAdmin jest stroną | przycisk *Start* w panelu |
| **MariaDB** | właściwy serwer bazy danych (w panelu podpisany jako *MySQL*) | przycisk *Start* w panelu |
| **phpMyAdmin** | graficzny panel do obsługi bazy przez przeglądarkę | `http://localhost/phpmyadmin` |

!!! warning "Dwie usługi, nie jedna"

    Najczęstszy błąd na starcie: uruchomiony sam **MySQL**, bez **Apache**.
    Serwer bazy wtedy działa, ale phpMyAdmin się nie otworzy, bo nie ma go co
    wyświetlić. Uruchamiasz **obie** usługi i obie muszą świecić na zielono.

??? question "Nie startuje — co teraz?"

    - **Apache nie startuje** — port 80 zajmuje inny program (często Skype albo
      inny serwer WWW). W panelu XAMPP kliknij *Config → Service and Port
      Settings* i zmień port albo zamknij program, który go trzyma.
    - **MySQL nie startuje** — zwykle działa już inna instancja serwera bazy
      danych na porcie 3306 albo poprzednie zamknięcie było nieczyste.
    - **Wszystko startuje, ale strona się nie otwiera** — sprawdź, czy wpisujesz
      `localhost`, a nie nazwę komputera, i czy przeglądarka nie dopisała `https`.

    Na egzaminie stanowisko jest przygotowane i te problemy zwykle nie
    występują — ale wiedzieć, gdzie szukać, trzeba.

## 2. Kodowanie znaków — załatw to na początku

To jest najdroższy błąd na tym etapie, bo ujawnia się dopiero później i wymaga
powtórzenia pracy. Baza musi mieć kodowanie zgodne z danymi, które do niej trafią.

**Zakładając bazę** w phpMyAdminie (zakładka *Bazy danych* → nazwa → *Utwórz*)
wybierasz porównywanie znaków. Bezpieczny wybór to `utf8mb4_general_ci`;
w arkuszach spotyka się też `utf8_polish_ci`.

!!! example "Skąd biorą się „krzaczki""

    Znak „ł" zapisany w UTF-8 zajmuje dwa bajty. Jeżeli baza spodziewa się
    kodowania jednobajtowego, odczyta te dwa bajty jako **dwa osobne znaki** —
    i zamiast „Kozak Zimowy" zobaczysz „Kozak ZimowyÂ". Dane nie są uszkodzone,
    tylko czytane inną miarą.

    Dlatego kodowanie ustawia się **przed** wprowadzeniem danych, a nie po.

!!! tip "To samo dotyczy strony"

    Jeżeli w dalszej części egzaminu wyświetlasz dane na stronie w PHP, musisz
    ustawić kodowanie także tam: `<meta charset="utf-8">` w HTML-u oraz
    ustawienie kodowania połączenia z bazą w skrypcie. Trzy miejsca, jedno
    kodowanie.

## 3. Import bazy z pliku `.sql`

Plik, który dostajesz w arkuszu (najczęściej `baza.sql`), zawiera gotowe polecenia
SQL: tworzące tabele i wstawiające dane.

**Kolejność czynności:**

1. Rozpakuj archiwum z arkusza — **nie pracuj na pliku w archiwum**.
2. Otwórz phpMyAdmina i sprawdź, czy plik **sam tworzy bazę**. Otwórz go
   w Notatniku i poszukaj na początku `CREATE DATABASE`:
      - jeżeli **jest** — nie zakładaj bazy ręcznie, import ją utworzy
      - jeżeli **nie ma** — najpierw załóż bazę o nazwie z polecenia i wejdź do niej
3. Zakładka **Import** → *Przeglądaj* → wskaż plik → *Wykonaj* (na dole).
4. Poczekaj na komunikat o powodzeniu.

!!! warning "Sprawdź import, nie zakładaj, że się udał"

    Komunikat „Wykonano" na zielono nie wystarcza. Zrób trzy rzeczy:

    - czy na liście po lewej pojawiły się **wszystkie tabele**
    - czy w tabelach **są wiersze** — kliknij *Przeglądaj* w co najmniej jednej
    - czy polskie znaki wyświetlają się poprawnie

    Import, który utworzył puste tabele, wygląda tak samo jak udany — do momentu,
    w którym pierwsze zapytanie zwróci zero wierszy.

??? question "Import się nie powiódł — trzy typowe przyczyny"

    **Plik jest za duży.** phpMyAdmin ma limit rozmiaru wgrywanego pliku.
    Widać go na stronie importu przy polu wyboru pliku. Rozwiązanie: skorzystać
    z importu skompresowanego pliku albo zwiększyć limit w konfiguracji PHP.

    **Baza o tej nazwie już istnieje.** Zdarza się przy drugim podejściu.
    Usuń starą bazę albo zaimportuj do nowej i zmień nazwę w dalszej pracy —
    ale wtedy pamiętaj, żeby zmienić ją także w skrypcie PHP.

    **Plik ma inne kodowanie, niż deklaruje formularz.** Na stronie importu
    jest pole *Zestaw znaków pliku*. Jeśli polskie znaki wyszły uszkodzone,
    usuń bazę i zaimportuj ponownie z właściwym ustawieniem — poprawianie
    znaków zapytaniami po fakcie to strata czasu.

## 4. Plik z zapytaniami

Arkusz wymaga, żeby **treść każdego zapytania** trafiła do pliku tekstowego —
najczęściej o nazwie `kwerendy.txt`. To jest osobno oceniane: samo wykonanie
zapytania w phpMyAdminie punktu nie daje, jeśli treści nie ma w pliku.

**Zasady, które warto mieć w nawykach:**

- nazwa pliku **dokładnie taka, jak w poleceniu** — nie `Kwerendy.txt`,
  nie `kwerendy.doc`
- zapisuj plik w katalogu wskazanym w arkuszu, nie na pulpicie
- każde zapytanie w osobnej linii albo oddzielone pustą linią, w kolejności z polecenia
- kopiuj treść **działającego** zapytania — nie tego, które dopiero piszesz
- zapisuj plik **po każdym zapytaniu**, nie na końcu

!!! example "Jak to wygląda w środku"

    ```sql
    -- kw1
    SELECT kolor, material FROM produkt WHERE wysokosc > 10;

    -- kw2
    SELECT produkt.nazwa, produkt.cena, kategoria.nazwa
    FROM produkt JOIN kategoria ON produkt.id_kategorii = kategoria.id_kategorii;

    -- kw3
    CREATE USER 'Marek'@'localhost' IDENTIFIED BY 'M@reK';

    -- kw4
    GRANT SELECT, UPDATE ON obuwie.produkt TO 'Marek'@'localhost';
    ```

    Komentarze `-- kw1` nie są wymagane, ale porządkują plik i nic nie psują.

## 5. Zrzuty ekranu

Zrzut jest **dowodem wykonania** — jeżeli go nie ma, zapytanie liczy się tak,
jakby nie zostało wykonane.

Reguła z arkusza brzmi dosłownie: *„Nie kadruj zrzutu. Powinien on obejmować cały
ekran monitora, z widocznym paskiem zadań"*.

| Co robisz | Jak |
| --- | --- |
| zrzut całego ekranu | klawisz ++print-screen++, potem wklejenie do edytora grafiki i zapis |
| nazwa pliku | dokładnie z polecenia — zwykle `kw1`, `kw2`, `kw3`, `kw4` |
| format | ten, który podaje arkusz — najczęściej PNG |
| co ma być widać | **treść zapytania i jego wynik na jednym zrzucie** |

!!! warning "Najczęstsze straty punktów na tym etapie"

    - zrzut wykadrowany do samej tabeli wyników — brak paska zadań
    - widoczny wynik, ale niewidoczna treść zapytania
    - plik zapisany jako `kw1.jpg`, kiedy polecenie mówiło o PNG
    - zrzut zrobiony przed wykonaniem zapytania, z pustym polem wyniku

## 6. Eksport bazy na koniec

Jeżeli w trakcie zadania zmieniałeś strukturę albo dane, arkusz zwykle wymaga
oddania bazy w pliku. Zakładka **Eksport** → *Szybki* → format **SQL** → *Wykonaj*.

Eksport warto zrobić także **dla siebie**, w połowie pracy — jeżeli coś pójdzie
nie tak przy `UPDATE` albo `DELETE`, wracasz do stanu sprzed minuty zamiast
importować wszystko od nowa.

## 7. Checklista pierwszych dziesięciu minut

!!! abstract "Przejdź to bez zastanawiania"

    1. Uruchom **Apache** i **MySQL** — obie na zielono
    2. Rozpakuj archiwum z arkusza do katalogu wskazanego w poleceniu
    3. Otwórz `localhost/phpmyadmin`
    4. Sprawdź w Notatniku, czy `baza.sql` zawiera `CREATE DATABASE`
    5. Załóż bazę (jeśli trzeba) z kodowaniem `utf8mb4_general_ci`
    6. Zaimportuj plik
    7. **Sprawdź**: tabele są, wiersze są, polskie znaki są
    8. Utwórz pusty plik z zapytaniami o nazwie z polecenia
    9. Przeczytaj treść wszystkich czterech zapytań, zanim napiszesz pierwsze

## Ćwiczenia

!!! question "Ćwiczenie 1. Przejście całej ścieżki"

    Pobierz plik [`obuwie.sql`](../pliki/obuwie.sql) i przejdź z nim całą drogę:
    załóż bazę `obuwie` z kodowaniem `utf8mb4_general_ci`, zaimportuj plik,
    a potem **udowodnij, że import się udał** — nie słowem, tylko liczbami.

    **Zapisujesz:** liczbę tabel, liczbę wierszy w każdej z nich oraz zrzut
    ekranu z widoczną nazwą bazy i listą tabel.

??? success "Wskazówka do rozwiązania 1"

    Liczbę wierszy najszybciej sprawdzisz zapytaniem, nie klikaniem:

    ```sql
    SELECT COUNT(*) FROM produkt;
    SELECT COUNT(*) FROM kategoria;
    ```

    W tym pliku są **dwie** tabele: `produkt` z 10 wierszami i `kategoria`
    z 4 wierszami. Jeżeli wychodzi inaczej, import był niepełny.

!!! question "Ćwiczenie 2. Zepsuj kodowanie celowo"

    Załóż drugą bazę, tym razem z porównywaniem znaków `latin1_swedish_ci`,
    i zaimportuj do niej ten sam plik. Obejrzyj tabelę `produkt`.

    **Zapisujesz:** zrzut ekranu z uszkodzonymi znakami oraz odpowiedź na dwa
    pytania: które konkretnie znaki się zepsuły i dlaczego akurat te.

??? success "Wskazówka do rozwiązania 2"

    Zepsują się wyłącznie znaki spoza podstawowego zestawu ASCII: „ł", „ó",
    „ą", „ż". Litery `a`–`z` i cyfry przejdą bez szwanku, bo w UTF-8 zajmują
    jeden bajt i mają ten sam kod co w `latin1`.

    To jest cała tajemnica „krzaczków": nie psuje się tekst, tylko te znaki,
    które w UTF-8 potrzebują więcej niż jednego bajtu.

!!! question "Ćwiczenie 3. Plik kwerend jak na egzaminie"

    Wykonaj na bazie `obuwie` dwa zapytania:

    - wybierające `nazwa` i `cena` produktów droższych niż 300 zł
    - wybierające `kolor` i `material` produktów o wysokości większej niż 10

    Zapisz ich treść do pliku `kwerendy.txt` i zrób zrzuty `kw1.png` oraz
    `kw2.png` zgodnie z regułą z punktu 5.

    **Zapisujesz:** treść obu zapytań, liczbę zwróconych wierszy i oba zrzuty.

??? success "Wskazówka do rozwiązania 3"

    ```sql
    SELECT nazwa, cena FROM produkt WHERE cena > 300;
    SELECT kolor, material FROM produkt WHERE wysokosc > 10;
    ```

    Pierwsze zwróci **5** wierszy, drugie **6**. Jeżeli drugie zwraca 10,
    pominąłeś warunek; jeżeli zwraca 0 — sprawdź, czy kolumna nazywa się
    `wysokosc` (bez polskich znaków), bo tak jest w pliku.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony,
    a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "phpMyAdmin nie otwiera się pod adresem localhost/phpmyadmin, choć w panelu XAMPP MySQL świeci na zielono. Dlaczego?",
    "opcje": [
      "Baza danych jest uszkodzona",
      "Nie uruchomiono Apache — phpMyAdmin jest stroną WWW i potrzebuje serwera WWW",
      "Przeglądarka blokuje połączenia lokalne",
      "Trzeba użyć adresu z nazwą komputera zamiast localhost"
    ],
    "poprawna": 1,
    "wyjasnienie": "phpMyAdmin to aplikacja napisana w PHP, czyli strona. Serwer bazy danych ją obsłuży dopiero wtedy, gdy będzie ją miał kto wyświetlić — a tym zajmuje się Apache. Uruchamia się obie usługi."
  },
  {
    "pytanie": "Kiedy ustawia się kodowanie znaków bazy?",
    "opcje": [
      "Przed wprowadzeniem danych — przy zakładaniu bazy",
      "Po imporcie, kiedy widać, że znaki są uszkodzone",
      "Kodowania nie da się ustawić, zależy od systemu operacyjnego",
      "Przy każdym zapytaniu osobno"
    ],
    "poprawna": 0,
    "wyjasnienie": "Kodowanie decyduje o tym, jak bajty są odczytywane. Ustawione po fakcie nie naprawi już wprowadzonych danych — trzeba usunąć bazę i zaimportować ponownie z właściwym ustawieniem."
  },
  {
    "pytanie": "Plik baza.sql zawiera na początku polecenie CREATE DATABASE. Co robisz przed importem?",
    "opcje": [
      "Zakładasz bazę ręcznie i importujesz do niej",
      "Nie zakładasz bazy — import utworzy ją sam",
      "Usuwasz z pliku linię CREATE DATABASE",
      "Importujesz do bazy o dowolnej nazwie, nazwa nie ma znaczenia"
    ],
    "poprawna": 1,
    "wyjasnienie": "Jeżeli plik sam tworzy bazę, ręczne jej założenie prowadzi do konfliktu nazw albo do zaimportowania tabel w niewłaściwym miejscu. Dlatego plik warto najpierw obejrzeć w Notatniku."
  },
  {
    "pytanie": "Import zakończył się komunikatem o powodzeniu. Co sprawdzasz?",
    "opcje": [
      "Nic — zielony komunikat wystarcza",
      "Czy tabele się pojawiły, czy mają wiersze i czy polskie znaki są poprawne",
      "Tylko rozmiar bazy w megabajtach",
      "Czy plik .sql nadal istnieje na dysku"
    ],
    "poprawna": 1,
    "wyjasnienie": "Import może utworzyć strukturę bez danych — i wygląda to identycznie jak import udany, dopóki pierwsze zapytanie nie zwróci zera wierszy. Trzy sprawdzenia zajmują pół minuty."
  },
  {
    "pytanie": "Zapytanie zostało wykonane w phpMyAdminie, wynik jest poprawny, ale treści nie ma w pliku kwerend. Co z punktami?",
    "opcje": [
      "Punkty są, bo zapytanie działa",
      "Punkty przepadają — arkusz wymaga zapisania treści zapytania do pliku",
      "Punkty są przyznawane w połowie",
      "Egzaminator odtworzy zapytanie z historii phpMyAdmina"
    ],
    "poprawna": 1,
    "wyjasnienie": "Oceniane są pliki oddane przez zdającego. Wykonanie zapytania na ekranie nie zostawia śladu, który egzaminator mógłby ocenić — dlatego plik zapisuje się po każdym zapytaniu, nie na końcu."
  },
  {
    "pytanie": "Jak ma wyglądać zrzut ekranu z wynikiem zapytania?",
    "opcje": [
      "Wykadrowany do samej tabeli wyników, żeby był czytelny",
      "Cały ekran monitora z widocznym paskiem zadań, z treścią zapytania i wynikiem",
      "Zdjęcie ekranu zrobione telefonem",
      "Wystarczy wynik, bez treści zapytania"
    ],
    "poprawna": 1,
    "wyjasnienie": "Arkusz mówi wprost: „Nie kadruj zrzutu. Powinien on obejmować cały ekran monitora, z widocznym paskiem zadań”. Na jednym zrzucie musi być widać i zapytanie, i to, co zwróciło."
  },
  {
    "pytanie": "Po co robić eksport bazy w połowie pracy nad zadaniem?",
    "opcje": [
      "Bo arkusz tego wymaga przy każdym zapytaniu",
      "Żeby po nieudanym UPDATE albo DELETE wrócić do stanu sprzed minuty zamiast importować wszystko od nowa",
      "Żeby przyspieszyć działanie serwera",
      "Nie ma takiej potrzeby, phpMyAdmin ma funkcję cofania"
    ],
    "poprawna": 1,
    "wyjasnienie": "phpMyAdmin nie ma cofania zmian w danych. UPDATE bez WHERE zmienia wszystkie wiersze i jedynym wyjściem jest kopia. Eksport zajmuje kilkanaście sekund."
  },
  {
    "pytanie": "W bazie z kodowaniem latin1 nazwa „Sandał Lato” wyświetla się z uszkodzonym znakiem, a „Biegacz 200” jest poprawny. Dlaczego?",
    "opcje": [
      "Bo druga nazwa zawiera cyfry",
      "Bo uszkodzeniu ulegają tylko znaki, które w UTF-8 zajmują więcej niż jeden bajt",
      "Bo pierwsza nazwa jest dłuższa",
      "To przypadek, przy ponownym odświeżeniu będzie odwrotnie"
    ],
    "poprawna": 1,
    "wyjasnienie": "Litery a–z i cyfry mają w UTF-8 ten sam, jednobajtowy kod co w latin1 — przechodzą bez zmian. Dopiero „ł”, „ó”, „ą” zajmują dwa bajty i przy złym kodowaniu są czytane jako dwa osobne znaki."
  }
]
</script>
</div>

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**. Do zrzutów ekranu wystarczy klawisz
++print-screen++ albo ++win+shift+s++.

<div class="karta-pracy" data-karta="srodowisko-import"></div>

---

*Opisy interfejsu dotyczą XAMPP-a z serwerem MariaDB i phpMyAdmina w wersji
polskiej. Cytat z reguły dotyczącej zrzutów pochodzi z arkusza egzaminacyjnego
INF.03. Stan sprawdzony 14 września 2026 r. Nazwy pozycji w menu bywają różne
w kolejnych wydaniach — zasada pozostaje ta sama.*
