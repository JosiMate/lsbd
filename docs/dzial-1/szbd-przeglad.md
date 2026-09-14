# Systemy zarządzania bazami danych — przegląd i dobór

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział I**

Podczas tworzenia systemu informatycznego jedna z pierwszych decyzji dotyczy wyboru odpowiedniego silnika bazy danych. Błędny wybór na starcie oznacza późniejsze problemy z wydajnością, brakiem możliwości pracy wielu użytkowników naraz lub niepotrzebne koszty licencyjne. Ta lekcja wyjaśnia różnicę między bazą danych a systemem, który nią zarządza, przedstawia podział na modele plikowe i klient-serwer oraz podaje konkretne kryteria doboru SZBD do wymagań projektu. Znajomość tych pojęć jest bezpośrednio sprawdzana w części pisemnej egzaminu INF.03.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. rozróżnić bazę danych od systemu zarządzania bazą danych (SZBD)
    2. wyjaśnić różnice w działaniu modelu plikowego i modelu klient-serwer
    3. porównać popularne systemy SZBD pod kątem licencji, limitów i zastosowań
    4. dobrać właściwy SZBD do opisanego scenariusza biznesowego
    5. opisać zasady bezpiecznej instalacji, konfiguracji wielodostępu i aktualizacji SZBD

## 1. Czym jest SZBD, a czym baza danych

Częstym błędem na początku nauki jest utożsamianie bazy danych z programem, w którym się na niej pracuje. W języku technicznym są to dwa zupełnie różne pojęcia:

* **Baza danych (BD)** — to uporządkowany zbiór samych danych zapisanych na nośniku (np. pliki tabel na dysku).
* **System zarządzania bazą danych (SZBD / DBMS)** — to oprogramowanie pośredniczące między użytkownikiem lub aplikacją a samą bazą danych.

Baza danych bez SZBD jest tylko bezużytecznym ciągiem bajtów w pliku. Aplikacja użytkownika nie pisze bezpośrednio do plików bazy na dysku — wysyła zapytanie do SZBD, a ten wykonuje operację.

SZBD odpowiada za pięć kluczowych zadań:

1. **Zarządzanie dostępem i buforowaniem** — szybki odczyt i zapis danych na dysku przy użyciu pamięci RAM.
2. **Kontrola spójności (integralności)** — pilnowanie, aby dane spełniały zdefiniowane reguły (np. wymóg unikatowości klucza głównego lub istnienia klucza obcego).
3. **Zarządzanie uprawnieniami i bezpieczeństwem** — weryfikacja loginu, hasła i przyznanych praw do wykonania konkretnej operacji (`SELECT`, `INSERT`, `UPDATE`).
4. **Współbieżność (praca wielodostępowa)** — obsługa żądań pochodzących od wielu użytkowników w tym samym czasie bez uszkodzenia struktury danych.
5. **Tworzenie kopii zapasowych i odzyskiwanie danych** — zabezpieczenie przed utratą informacji w przypadku awarii zasilania lub sprzętu.

!!! info "Po co to rozróżnienie?"

    Gdy mówisz „tworzę bazę danych”, masz na myśli projektowanie tabel i relacji. Gdy mówisz „konfiguruję SZBD”, masz na myśli ustawianie portu sieciowego, kont użytkowników, limitów pamięci RAM czy parametrów kodowania.

## 2. Dwa światy: plikowy i klient-serwer

Wszystkie relacyjne systemy zarządzania bazami danych dzielą się na dwie główne architektonicznie grupy: **model plikowy** oraz **model klient-serwer**. To najważniejszy podział w tym temacie — z niego wynikają ograniczenia, wydajność i przeznaczenie każdego systemu.

### Model plikowy (embedded / desktop)

Przykłady: **SQLite**, **MS Access**.

W modelu plikowym baza danych to po prostu jeden lub kilka plików na dysku. Kod SZBD nie działa jako osobna usługa w tle — jest wbudowany bezpośrednio w aplikację końcową (np. aplikację mobilną) lub wywoływany przez bibliotekę.

```
[Aplikacja / Program] ---> (Wbudowany silnik SZBD) ---> [Plik bazy danych na dysku]
```

**Co z tego wynika w praktyce?**

* **Brak procesu serwera:** Nie trzeba niczego instalować jako usługi, uruchamiać przed pracą ani konfigurować portów.
* **Przenośność:** Cała baza mieści się w jednym pliku. Aby ją skopiować lub zrealizować kopię zapasową, wystarczy przekopiować ten plik.
* **Zero konfiguracji sieciowej:** Praca odbywa się lokalnie na pliku.

**Dlaczego baza plikowa psuje się przy kilku osobach naraz?**

Gdy baza plikowa zostaje umieszczona na udziale sieciowym (np. w folderze udostępnionym w sieci lokalnej) i spróbuje otworzyć ją kilku użytkowników jednocześnie, każda stacja robocza musi czytać i zapisywać plik nagłówkowy bazy przez sieć.

System plików w sieci nie jest przystosowany do atomowych blokad małych fragmentów pliku. Aby zapisać pojedynczy wiersz, system plikowy musi zablokować cały plik lub jego duży fragment. Przy jednoczesnym zapisie od 3–5 osób dochodzi do opóźnień, konfliktów blokad, a w skrajnych przypadkach do fizycznego uszkodzenia struktury pliku bazy danych (`database disk image is malformed` w SQLite lub błędy uszkodzenia w MS Access).

!!! warning "Limit teoretyczny a praktyka w MS Access"

    Dokumentacja programu MS Access podaje, że maksymalna liczba jednoczesnych użytkowników wynosi **255**. Jest to jednak wartość wyłącznie teoretyczna. W rzeczywistych warunkach sieciowych baza plikowa MS Access udostępniona przez udział sieciowy zaczyna wykazywać problemy ze spójnością i drastyczny spadek wydajności już przy **kilku osobach edytujących dane jednocześnie**. To właśnie ograniczenia architektoniczne modelu plikowego — a nie sam rozmiar danych — są głównym powodem przechodzenia na model klient-serwer.

### Model klient-serwer

Przykłady: **MariaDB**, **PostgreSQL**, **MS SQL Server Express**.

W modelu klient-serwer bazy danych pilnuje osobny proces (usługa), który działa nieprzerwanie w tle i nasłuchuje na określonym porcie sieciowym (np. 3306 dla MariaDB, 5432 dla PostgreSQL, 1433 dla MS SQL Server).

```
[Klient A (phpMyAdmin)] --\
[Klient B (Sklep WWW)]  ---> [Port 3306] ---> [Proces Serwera SZBD] ---> [Pliki na serwerze]
[Klient C (Aplikacja)]  --/
```

Program użytkownika nie dotyka plików z danymi. Aplikacja (klient) łączy się przez sieć z serwerem bazy danych, przesyła zapytanie w języku SQL, a serwer samodzielnie wykonuje operację na plikach i odsyła klientowi gotowy wynik.

**Co z tego wynika w praktyce?**

* **Bezpieczny wielodostęp:** Serwer zarządza blokadami na poziomie pojedynczych wierszy (`row-level locking`). Tysiące użytkowników mogą jednocześnie odczytywać dane, a modyfikacja jednego wiersza nie blokuje pozostałym dostępu do reszty tabeli.
* **Konta i uprawnienia:** Każdy użytkownik loguje się własnym loginem i hasłem. Serwer precyzyjnie sprawdza uprawnienia do każdej tabeli i polecenia.
* **Stabilność i spójność:** Awaria aplikacji klienta (np. zawieszenie przeglądarki) nie uszkadza bazy, ponieważ proces serwera nadal bezpiecznie nadzoruje spójność danych.

!!! note "Podsumowanie różnic architektonicznych"

    * Model plikowy wybierasz tam, gdzie baza ma być prosta, lekka, bezobsługowa i działa dla jednego użytkownika lub w trybie tylko do odczytu.
    * Model klient-serwer wybierasz wszędzie tam, gdzie dane będą modyfikowane przez wielu użytkowników naraz przez sieć lub aplikację internetową.

## 3. Przegląd konkretnych systemów

Na rynku występuje wiele systemów SZBD. W poniższej tabeli zestawiono pięć najpopularniejszych rozwiązań, z którymi spotkasz się w nauce i pracy zawodowej:

| SZBD | Model pracy | Gdzie leżą dane | Konta i uprawnienia | Licencja | Typowe zastosowanie |
| --- | --- | --- | --- | --- | --- |
| **MariaDB / MySQL** | Klient-serwer | Pliki na serwerze w katalogu danych | Zaawansowane (użytkownicy, hosty, role) | Otwarta i darmowa (GPL) | Strony i sklepy WWW, aplikacje internetowe, środowisko INF.03 |
| **SQLite** | Plikowy (embedded) | Jeden plik `.sqlite` / `.db` na dysku | Brak (dostęp zależy od uprawnień pliku w OS) | Domena publiczna (Public Domain) | Aplikacje mobilne (Android/iOS), aplikacje desktopowe, pliki konfiguracji |
| **MS Access** | Plikowy (desktop) | Jeden plik `.accdb` / `.mdb` na dysku | Podstawowe (hasło pliku) | Część płatnego pakietu biurowego (Microsoft 365) | Małe biurowe ewidencje lokalne, proste formularze dla 1 użytkownika |
| **PostgreSQL** | Klient-serwer | Pliki na serwerze w katalogu danych | Bardzo zaawansowane (role, uprawnienia, SSL) | Otwarta i darmowa (PostgreSQL License) | Duże systemy finansowe, dane przestrzenne (GIS), zaawansowana analityka |
| **MS SQL Server Express** | Klient-serwer | Pliki `.mdf` / `.ldf` na serwerze | Zaawansowane (konta SQL / Windows Authentication) | Darmowa (edycja Express z limitami) | Aplikacje biznesowe w środowisku Windows dla małych i średnich firm |

### Znane i zweryfikowane limity systemów

Przy doborze bazy danych decydują konkretne parametry techniczne podawane przez producentów:

* **MS Access:**
    * Maksymalny rozmiar pliku bazy: **2 GB** (łącznie z obiektami systemowymi).
    * Maksymalna liczba jednoczesnych użytkowników: **255** (limit teoretyczny).
    * Maksymalna liczba pól w tabeli: **255**.
    * Maksymalna liczba obiektów w bazie: **32 768**.
* **MS SQL Server Express:**
    * Maksymalny rozmiar bazy danych: **10 GB**.
    * Pamięć bufora: **1410 MB** na instancję.
    * Wykorzystanie procesora: mniejsze z: **1 gniazdo albo 4 rdzenie**.

!!! tip "Licencje — co warto wiedzieć"

    MariaDB, MySQL i PostgreSQL są całkowicie darmowe w zastosowaniach komercyjnych. MS Access wymaga zakupu licencji na pakiet Office/Microsoft 365. MS SQL Server Express jest bezpłatną wersją komercyjnego serwera SQL Server, przygotowaną przez firmę Microsoft z myśla o mniejszych projektach — stąd nałożone limity na pamięć RAM (1410 MB) i rozmiar bazy (10 GB).

## 4. Kryteria doboru

Nie istnieje jeden „najlepszy” system zarządzania bazą danych. Dobre wyznaczenie silnika bazy danych polega na przeanalizowaniu wymagań projektu pod kątem zestawu kryteriów:

1. **Liczba jednoczesnych użytkowników i intensywność zapisu:**
   Czy baza będzie obsługiwać jednego użytkownika (aplikacja mobilna, lokalny arkusz), czy setki osób jednocześnie zapisujących dane (sklep internetowy)?
2. **Rozmiar danych:**
   Czy przewidywana objętość danych zmieści się w limitach darmowych edycji (np. do 2 GB w Accessie czy do 10 GB w SQL Server Express), czy wymaga braku sztucznych ograniczeń (MariaDB, PostgreSQL)?
3. **Koszt licencji i budżet:**
   Czy projekt zakłada wyłącznie rozwiązania open-source (0 zł za licencje), czy firma posiada już wykupono licencje na środowisko Microsoftu?
4. **Wymagania sprzętowe i zasoby serwera:**
   Czy baza ma działać na słabym urządzeniu (np. Raspberry Pi, telefon z Androidem), czy na dedykowanym serwerze wielordzeniowym z dużą ilością pamięci RAM?
5. **Potrzeba kopii zapasowych w locie i uprawnień:**
   Czy wymagane jest robienie kopii zapasowych bez przerywania pracy użytkowników oraz przydzielanie szczegółowych uprawnień do poszczególnych tabel?
6. **Przenośność i bezobsługowość:**
   Czy aplikacja ma działać bezpośrednio po skopiowaniu bez konieczności instalowania i konfigurowania dodatkowych usług serwerowych?
7. **Dostępność wsparcia, dokumentacji i kompetencje zespołu:**
   W czym zespół programistów i administratorów ma doświadczenie i co łatwiej będzie utrzymać w długim okresie?

## 5. Cztery scenariusze do rozstrzygnięcia

Oto przykłady realnych sytuacji decyzyjnych wraz z wybranym rozwiązaniem i uzasadnieniem.

### Scenariusz 1: Aplikacja mobilna do śledzenia nawyków (działająca offline)
* **Wybór:** **SQLite**
* **Uzasadnienie:** Aplikacja działa lokalnie na telefonie jednego użytkownika. Nie ma serwera sieciowego ani wielodostępu. SQLite jest wbudowane w systemy Android i iOS, nie wymaga instalacji ani haseł, a cała baza mieści się w jednym pliku w pamięci urządzenia.

### Scenariusz 2: Ewidencja sprzętu dla jednoosobowej firmy usługowej
* **Wybór:** **MS Access** (lub SQLite z prostym interfejsem)
* **Uzasadnienie:** Z bazy korzysta tylko jedna osoba na jednym komputerze. Objętość danych nie przekroczy kilkudziesięciu megabajtów (daleko do limitu 2 GB). Access pozwala błyskawicznie wyklikać formularze i raporty bez pisania kodu w PHP czy C#.

### Scenariusz 3: Sklep internetowy obsługiwany przez 3 pracowników w sieci lokalnej
* **Wybór:** **MariaDB / MySQL**
* **Uzasadnienie:** Występuje równoczesny dostęp wielu osób (klient sklepu przez WWW oraz 3 pracowników wprowadzających zamówienia). Wymagany jest model klient-serwer. MariaDB zapewnia bezpłatną licencję, pełną spójność transakcyjną, wysoki poziom bezpieczeństwa i natywną współpracę ze skryptami PHP.

### Scenariusz 4: System zarządzania produkcją dla 200 użytkowników z wymogiem wysokiej dostępności
* **Wybór:** **PostgreSQL** lub **MS SQL Server** (pełna wersja)
* **Uzasadnienie:** Duża liczba jednoczesnych połączeń i intensywny zapis wymagają zaawansowanego serwera z możliwością tworzenia klastrów i kopii zapasowych w locie. Wybór darmowej edycji Express (SQL Server) odpada ze względu na limit 10 GB bazy i 1410 MB RAM.

## 6. Instalacja, konfiguracja wielodostępu i aktualizacja

Dobre zarządzanie SZBD obejmuje trzy praktyczne etapy życia serwera: instalację, przydzielenie dostępu oraz utrzymanie i aktualizacje.

### Instalacja SZBD

Szczegółowa instrukcja uruchomienia pakietu XAMPP dla środowiska egzaminacyjnego znajduje się w lekcji [Środowisko, import bazy i plik kwerend](srodowisko-import.md).

Sama instalacja różni się zasadniczo w zależności od modelu architektonicznego:

* **W modelu plikowym (SQLite):** Instalacja nie występuje wcale — dołącza się jedynie bibliotekę bazy danych do projektu.
* **W modelu klient-serwer (MariaDB, PostgreSQL, MS SQL Server):** Instalator rejestruje w systemie operacyjnym **usługę działającą w tle** (`service` / `daemon`). Podczas instalacji określa się:
    * **Port sieciowy** (np. 3306), na którym serwer będzie nasłuchiwał żądań.
    * **Hasło konta głównego administratora** (np. `root` lub `sa`) — ważne, aby nie zostawiać go pustego.
    * **Tryb uruchamiania** (autostart wraz ze startem systemu operacyjnego).

### Konfiguracja wielodostępu i uprawnień

W środowisku produkcyjnym niedopuszczalne jest, aby aplikacje użytkowników łączyły się z bazą danych na konto administratora (`root`).

Zasady konfiguracji wielodostępu:

1. **Unikatowe konta:** Każdy użytkownik lub usługa zewnętrzna otrzymuje własne login i hasło.
2. **Niezależność hosta:** W MariaDB uprawnienia definiuje się dla pary `użytkownik@host` (np. `'sklep'@'localhost'` lub `'jan'@'192.168.1.%'`).
3. **Zasada najniższych uprawnień (Least Privilege):** Użytkownik powinien otrzymać wyłącznie te uprawnienia, które są mu niezbędne do pracy. Aplikacja wyświetlająca katalog produktów potrzebuje tylko `GRANT SELECT`, a nie praw do usuwania tabel (`DROP`) czy tworzenia użytkowników.

### Aktualizacja SZBD

Aktualizacja serwera bazy danych jest konieczna ze względu na poprawki bezpieczeństwa i wydajności, ale niesie ryzyko uszkodzenia danych lub braku kompatybilności.

Trzy złote zasady aktualizacji:

1. **Kopia zapasowa (Backup) przed akcją:** Zawsze przed rozpoczęciem aktualizacji wykonuje się pełny zrzut bazy danych (`mysqldump` / wyeksportowanie struktury i danych).
2. **Sprawdzenie kompatybilności:** Weryfikacja dokumentacji nowej wersji (pliku *release notes*) pod kątem usuwanych funkcji (`deprecated`) oraz zmian w składni SQL.
3. **Aktualizacje bezpieczeństwa:** W środowiskach produkcyjnych poprawki bezpieczeństwa (*security patches*) instaluje się regularnie w wyznaczonych okienkach serwisowych po wcześniejszym przetestowaniu na środowisku testowym.

## 7. Co z tego jest na egzaminie

Część praktyczna egzaminu **INF.03** trwa **150 minut**, a próg zdawalności wynosi **75 %**. Pracujesz na niej wyłącznie na serwerze **MariaDB** zarządzanym przez panel **phpMyAdmin** — nie musisz tam wybierać ani instalować innego SZBD.

Jednak w części pisemnej (testowej) regularnie pojawiają się pytania weryfikujące znajomość podziału systemów. Pytania te dotyczą:

* odróżnienia bazy plikowej (SQLite, MS Access) od serwerowej (MariaDB, PostgreSQL, MS SQL Server),
* limitów MS Accessa i limitów darmowej wersji SQL Server Express,
* doboru odpowiedniego SZBD do podanych w treści zadania wymagań klienta.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Dobór do scenariusza"

    Przeanalizuj poniższe trzy opisy potrzeb klientów i wskaż dla każdego najbardziej odpowiedni system SZBD z tabeli w sekcji 3.

    * **Sytuacja A:** Aplikacja na tablet dla kuriera, pracująca bez dostępu do sieci internetowej podczas zbierania podpisów w terenie.
    * **Sytuacja B:** Prosty system rezerwacji sal w małej szkole językowej — 4 recepcjonistki pracujące jednocześnie w sieci lokalnej.
    * **Sytuacja C:** Szkolny system oceniania i frekwencji na 500 uczniów z dostępem dla nauczycieli, uczniów i rodziców przez przeglądarkę WWW.

    Pamiętaj, że o ocenie decyduje **uzasadnienie** wyboru przez kryteria z sekcji 4, a nie sama nazwa systemu!

    **Zapisujesz:** wybrane nazwy SZBD oraz 2–3 zdania uzasadnienia do każdego wyboru.

??? success "Rozwiązanie 1"

    * **Sytuacja A:** **SQLite.** Aplikacja działa na jednym urządzeniu bez dostępu do sieci. Baza plikowa wbudowana w aplikację nie wymaga serwera ani konfiguracji.
    * **Sytuacja B:** **MariaDB / MySQL** (lub MS SQL Server Express). Występuje równoczesny dostęp 4 osób w sieci lokalnej, więc baza plikowa MS Access psułaby się przy zapisie. Wymagany jest model klient-serwer.
    * **Sytuacja C:** **MariaDB / MySQL** lub **PostgreSQL**. System z dostępem przez WWW dla setek użytkowników wymaga stabilnego silnika klient-serwer bez limitów licencyjnych, ze sprawną obsługą współbieżności i natywną integracją ze skryptami WWW (PHP/Python).

!!! question "Ćwiczenie 2. Sprawdzenie własnego stanowiska"

    Sprawdź, jaki serwer bazy danych działa na Twoim stanowisku w pracowni szkolnej. Otwórz phpMyAdmina (`http://localhost/phpmyadmin`) i odczytaj informacje z bloku **Serwer baz danych** po prawej stronie.

    Uruchom także zapytanie:
    ```sql
    SELECT VERSION();
    ```

    Odszukaj w sieci internetowej, jaka jest obecnie najnowsza stabilna wersja tego systemu i porównaj ją z wersją zainstalowaną w pracowni.

    **Zapisujesz:** dokładną nazwę serwera (np. MariaDB / MySQL), wersję zwracaną przez zapytanie, użyty silnik (np. InnoDB), wersję najnowszą dostępną w sieci oraz zrzut ekranu z phpMyAdmina.

??? success "Rozwiązanie 2"

    W pakiecie XAMPP domyślnym serwerem jest zazwyczaj **MariaDB** (np. wersja `10.4.32-MariaDB` lub zbliżona). Domyślnym silnikiem składowania tabel relacyjnych wspierającym klucze obce jest **InnoDB**. Różnica między wersją na stanowisku a najnowszą wydaną wersją wynika z cyklu aktualizacji pakietów typu XAMPP/WAMP w pracowniach szkolnych.

!!! question "Ćwiczenie 3. Granice na papierze"

    Wykonaj obliczenia szacunkowe pojemności bazy danych przy założeniu, że **średni rozmiar jednego rekordu wynosi dokładnie 500 bajtów**.

    Oblicz:
    1. Ile maksymalnie takich rekordów zmieści się w pliku bazy MS Access przed osiągnięciem limitu **2 GB** (przyjmij $2\text{ GB} = 2\text{ }147\text{ }483\text{ }648\text{ B}$)?
    2. Ile maksymalnie takich rekordów zmieści się w darmowej bazie MS SQL Server Express przed osiągnięciem limitu **10 GB** (przyjmij $10\text{ GB} = 10\text{ }737\text{ }418\text{ }240\text{ B}$)?
    3. Ile razy więcej rekordów pozwala zapisać MS SQL Server Express w porównaniu do MS Access?

    **Zapisujesz:** pełny tok obliczeń matematycznych, wyniki liczbowe oraz jeden akapit wniosku na temat realnych ograniczeń obu systemów.

??? success "Rozwiązanie 3"

    **Tok obliczeń:**
    1. **MS Access (2 GB):**
       $$2\text{ }147\text{ }483\text{ }648\text{ B} / 500\text{ B} = 4\text{ }294\text{ }967{,}296 \approx 4\text{ }294\text{ }967\text{ rekordów (ok. 4,3 mln)}$$
    2. **MS SQL Server Express (10 GB):**
       $$10\text{ }737\text{ }418\text{ }240\text{ B} / 500\text{ B} = 21\text{ }474\text{ }836{,}48 \approx 21\text{ }474\text{ }836\text{ rekordów (ok. 21,5 mln)}$$
    3. **Stosunek pojemności:**
       $$21\text{ }474\text{ }836 / 4\text{ }294\text{ }967 = 5\text{ razy więcej}$$

    **Wniosek:**
    Wyliczone wartości stanowią górne oszacowanie teoretyczne. W rzeczywistości w pliku bazy część miejsca zajmują indeksy, nagłówki stron danych oraz fragmentacja, więc realna liczba rekordów będzie mniejsza. Limit 2 GB w MS Access pozwala pomieścić ponad 4 miliony prostych wierszy ewidencji — pokazuje to, że przy standardowych zastosowaniach biurowych limit rozmiaru pliku rzadko stanowi pierwszą przeszkodę. Prawdziwą granicą stosowalności MS Accessa jest brak odporności na wielodostęp sieciowy, a nie sama pojemność dyskowa.

!!! note "Co oddajesz"

    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Jaka jest główna różnica pojęciowa między bazą danych a systemem zarządzania bazą danych (SZBD)?",
    "opcje": [
      "Baza danych to plik z danymi, a SZBD to oprogramowanie zarządzające dostępem do tych danych",
      "Baza danych działa tylko w sieci, a SZBD działa wyłącznie lokalnie",
      "Nie ma żadnej różnicy, to dwa określenia tego samego programu",
      "SZBD to język SQL, a baza danych to tabela w phpMyAdminie"
    ],
    "poprawna": 0,
    "wyjasnienie": "Baza danych to sam zbiór zapisanych informacji na dysku, podczas gdy SZBD (DBMS) to program pośredniczący, odpowiadający za spójność, bezpieczeństwo, współbieżność i odczyt/zapis danych."
  },
  {
    "pytanie": "Dlaczego baza plikowa MS Access udostępniona w folderze sieciowym psuje się przy pracy kilku osób naraz?",
    "opcje": [
      "Ponieważ licencja pakietu Office zabrania pracy sieciowej",
      "Ponieważ udziały sieciowe nie zapewniają bezpiecznego blokowania małych fragmentów pliku bazy",
      "Ponieważ plik .accdb automatycznie kasuje się przy wykryciu drugiego połączenia",
      "Ponieważ MS Access nie posiada tabel relacyjnych"
    ],
    "poprawna": 1,
    "wyjasnienie": "Bazy plikowe nie mają osobnego procesu serwera zarządzającego blokadami wierszy przez sieć. Gdy kilka stacji naraz próbuje zapisywać do tego samego pliku przez udział sieciowy, dochodzi do konfliktów i uszkodzenia pliku bazy."
  },
  {
    "pytanie": "Który z wymienionych systemów SZBD działa w modelu embedded (plikowym) i jest wbudowany w systemy mobilne Android i iOS?",
    "opcje": [
      "PostgreSQL",
      "MariaDB",
      "SQLite",
      "MS SQL Server Express"
    ],
    "poprawna": 2,
    "wyjasnienie": "SQLite jest bezobsługową bazą plikową w domenie publicznej, niewymagającą procesu serwera, dzięki czemu stanowi standard w aplikacjach mobilnych i desktopowych."
  },
  {
    "pytanie": "Jaki jest maksymalny rozmiar pliku bazy danych w programie MS Access?",
    "opcje": [
      "1 GB",
      "2 GB",
      "10 GB",
      "Bez limitu"
    ],
    "poprawna": 1,
    "wyjasnienie": "Według specyfikacji firmy Microsoft maksymalny rozmiar pliku bazy MS Access (łącznie ze wszystkimi obiektami systemowymi) wynosi dokładnie 2 GB."
  },
  {
    "pytanie": "Jakie są ograniczenia darmowej edycji MS SQL Server Express?",
    "opcje": [
      "Max 2 GB bazy, max 512 MB RAM, max 1 rdzeń CPU",
      "Max 10 GB bazy na bazę, max 1410 MB RAM na instancję, max 1 gniazdo lub 4 rdzenie CPU",
      "Brak limitu rozmiaru bazy, ale działa tylko przez 30 dni",
      "Można utworzyć tylko jedną tabelę w bazie"
    ],
    "poprawna": 1,
    "wyjasnienie": "Firma Microsoft ogranicza darmową edycję SQL Server Express do 10 GB rozmiaru pojedynczej bazy, 1410 MB pamięci RAM dla bufora oraz mniejszej z wartości: 1 gniazdo procesora lub 4 rdzenie."
  },
  {
    "pytanie": "Które rozwiązanie SZBD wybierzesz dla sklepu internetowego obsługiwanego przez skrypty PHP z wieloma jednoczesnymi klientami?",
    "opcje": [
      "MS Access z plikiem na dysku Google Drive",
      "SQLite z plikiem w katalogu projektu",
      "MariaDB lub PostgreSQL w modelu klient-serwer",
      "Notatnik z plikiem tekstowym CSV"
    ],
    "poprawna": 2,
    "wyjasnienie": "Aplikacje internetowe z wielodostępem wymagają silnika w modelu klient-serwer (np. MariaDB lub PostgreSQL), który bezpiecznie obsługuje współbieżny zapis i integrację z serwerem WWW."
  },
  {
    "pytanie": "Na czym polega zasada najniższych uprawnień (Least Privilege) przy konfiguracji kont w SZBD?",
    "opcje": [
      "Wszyscy użytkownicy logują się na konto root bez hasła",
      "Każdy użytkownik i aplikacja otrzymuje wyłącznie te uprawnienia, które są niezbędne do wykonywania ich zadań",
      "Uprawnienia przyznaje się tylko na 15 minut dziennie",
      "Tylko administrator może wykonywać polecenie SELECT"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zasada najniższych uprawnień nakazuje ograniczać prawa kont (np. przyznawać tylko SELECT aplikacji prezentującej dane), aby zminimalizować skutki ewentualnego przejęcia konta lub błędu w kodzie."
  },
  {
    "pytanie": "Jaka jest najważniejsza czynność, którą należy wykonać BEZPOŚREDNIO przed aktualizacją serwera bazy danych?",
    "opcje": [
      "Usunięcie wszystkich kont użytkowników",
      "Sformatowanie dysku twardego",
      "Wykonanie pełnej kopii zapasowej (backupu) struktur i danych",
      "Zmiana nazwy bazy danych"
    ],
    "poprawna": 2,
    "wyjasnienie": "Zawsze przed przystąpieniem do aktualizacji SZBD wykonuje się pełną kopię zapasową bazy danych, aby w razie niepowodzenia lub niekompatybilności móc natychmiast przywrócić działający system."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="szbd-przeglad"></div>

---

*Źródła danych: Microsoft („Specyfikacje programu Access”), dokumentacja edycji SQL Server Express, arkusze egzaminacyjne CKE. Stan danych sprawdzony 14 września 2026 r.*
