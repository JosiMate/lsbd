# Wymagania edukacyjne i bhp

!!! abstract "O tym temacie"

    **1 godzina lekcyjna** · lekcja organizacyjna · **lokalne systemy baz danych**

    Pierwsza lekcja w roku. Ustalamy, jak pracować w pracowni i według czego
    będziesz oceniany. Do tej strony warto wracać przed sprawdzianem — to jest
    lista, według której powstają zadania.

[:material-format-list-bulleted: Spis tematów](../index.md){ .md-button }

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. stosować zasady bhp obowiązujące w pracowni komputerowej
    2. wskazać, co na tym przedmiocie podlega ocenie i według jakich wymagań
    3. powiedzieć, w jakim terminie oddaje się prace obowiązkowe i co się dzieje, gdy ich nie ma
    4. opisać, jak wygląda część praktyczna egzaminu INF.03 i jaki jest próg zdawalności
    5. odczytać z tej strony, jakie wymagania odpowiadają ocenie, o którą Ci chodzi

## Po co ten przedmiot

Kwalifikacja **INF.03. Tworzenie i administrowanie stronami i aplikacjami
internetowymi oraz bazami danych** ma w części praktycznej cztery obszary.
Bazy danych są **pierwszym** z nich — i jedynym, w którym za błąd w jednym
znaku traci się cały punkt, bo zapytanie albo zwraca właściwe wiersze, albo nie.

Ten przedmiot realizuje jednostkę **INF.03.4 Projektowanie i administrowanie
bazami danych**. Osiem efektów kształcenia z tej jednostki jest kręgosłupem
całego roku — znajdziesz je niżej w wymaganiach na oceny.

!!! info "Egzamin w liczbach"

    - część praktyczna trwa **150 minut** i obejmuje bazę danych, grafikę,
      HTML i CSS oraz skrypty
    - próg zdawalności części praktycznej to **75 %** punktów — dużo więcej
      niż 50 % wymagane z części pisemnej
    - na bazę danych przeznacza się zwykle **pierwsze 25–45 minut**; im szybciej
      ją zamkniesz, tym więcej czasu zostaje na resztę
    - zadania z bazy to najczęściej: import pliku `.sql`, **cztery zapytania**
      zapisane do pliku tekstowego i zrzuty ekranu z wynikami

## Bezpieczeństwo i higiena pracy

Pracownia komputerowa to miejsce, w którym łatwo o drobny wypadek i o zniszczenie
cudzej pracy. Zasady poniżej obowiązują na każdej lekcji.

**Organizacja stanowiska pracy**

- stanowisko zajmujesz za zgodą nauczyciela i pracujesz na przydzielonym komputerze
- przed rozpoczęciem pracy sprawdzasz stan przewodów i gniazd; uszkodzenia zgłaszasz,
  nie naprawiasz samodzielnie
- monitor ustawiasz tak, by górna krawędź ekranu była mniej więcej na wysokości oczu,
  a odległość wynosiła co najmniej 50 cm
- przy dłuższej pracy przy monitorze robisz przerwę i odrywasz wzrok od ekranu —
  to wymóg ergonomii, nie przywilej

**Zasady porządkowe i sanitarne**

- nie jesz i nie pijesz przy stanowisku komputerowym
- nie instalujesz własnego oprogramowania i nie zmieniasz ustawień systemu
- dbasz o czystość klawiatury, myszy i blatu; sprzęt jest używany przez kilkanaście
  osób dziennie

**Zasady szczególne dla tego przedmiotu**

- pracujesz **wyłącznie na własnej bazie** przypisanej do Twojego numeru
  w dzienniku; do cudzych baz nie wchodzisz nawet z ciekawości
- hasła do serwera bazy danych nie zapisujesz w przeglądarce na komputerze
  szkolnym ani nie wysyłasz komunikatorem
- przed każdą operacją nieodwracalną — `DROP`, `DELETE` bez `WHERE`,
  przywracaniem kopii — **robisz eksport bazy**. To jest nawyk, nie zalecenie
- serwer w pracowni jest wspólny; długie zapytania blokują go wszystkim,
  więc testujesz na małych zbiorach

**Sytuacje awaryjne**

- iskrzenie, dym lub zapach spalenizny: nie dotykasz urządzenia, odsuwasz się
  i natychmiast powiadamiasz nauczyciela
- awaryjne wyłączenie zasilania pracowni obsługuje wyłącznie nauczyciel
- znasz rozmieszczenie gaśnicy i drogę ewakuacyjną

## Zasady oceniania

### Wymagania są kumulatywne

Żeby otrzymać daną ocenę, trzeba spełniać **wszystkie** wymagania na oceny niższe.
Nie da się dostać czwórki, pomijając to, co jest wpisane przy trójce.

| Ocena | Poziom | Co to znaczy na tym przedmiocie |
| --- | --- | --- |
| dopuszczająca (2) | konieczne | Z pomocą nauczyciela importujesz bazę i wykonujesz proste `SELECT`-y. |
| dostateczna (3) | podstawowe | Samodzielnie piszesz zapytania z warunkiem i sortowaniem, czytasz strukturę tabel. |
| dobra (4) | rozszerzające | Łączysz tabele relacją, grupujesz dane, tworzysz i modyfikujesz strukturę bazy. |
| bardzo dobra (5) | dopełniające | Projektujesz bazę od diagramu do działającej struktury, administrujesz uprawnieniami i kopiami. |
| celująca (6) | wykraczające | Rozwiązujesz pełne zadania egzaminacyjne w czasie i na wynik pozwalający zdać. |

!!! warning "Ocena niedostateczna"

    Jedynkę otrzymuje uczeń, który nie spełnia wymagań na ocenę dopuszczającą:
    nie potrafi z pomocą nauczyciela wykonać podstawowego zapytania ani odczytać
    struktury tabeli.

### Co podlega ocenie

- **zadania wykonywane przy komputerze na lekcji** — podstawowa forma oceniania;
  liczy się działające rozwiązanie, nie opis, jak by się je zrobiło
- **pliki z zapytaniami** oddawane w formacie takim jak na egzaminie
- **sprawdziany praktyczne** po większych działach, zapowiadane z tygodniowym wyprzedzeniem
- **kartkówki** ze składni i pojęć, bez zapowiedzi
- **projekt bazy** realizowany etapami przez kilka lekcji
- **aktywność i systematyczność pracy**

### Prace obowiązkowe — terminy i skutki braku

!!! note "To ustalenie przedmiotowe, nie zapis statutu"

    Poniższe terminy ustalił nauczyciel przedmiotu na podstawie art. 44b ust. 10
    ustawy o systemie oświaty. Obowiązują jednakowo wszystkich w klasie.

Część prac jest **obowiązkowa** — bez nich nie da się sprawdzić, czy umiesz to,
co jest wypisane w wymaganiach na tej stronie. Są to **karty pracy do tematów**,
**prace praktyczne wykonywane przy komputerze** oraz **prace projektowe**.
W poleceniu zawsze jest napisane, że praca jest obowiązkowa i dokąd ją odsyłasz.

- pracę oddajesz **na najbliższej lekcji z tego przedmiotu** po tej, na której
  została zadana — albo odsyłasz w Dzienniku VULCAN, jeżeli tak mówi polecenie
- jeżeli w tym terminie pracy nie ma, dostajesz **wyznaczony termin dodatkowy:
  14 dni**. Informacja o nim trafia do modułu zadań i do wiadomości w dzienniku —
  nie musisz się o nią dopominać
- dopiero **po bezskutecznym upływie terminu dodatkowego** zostaje wystawiona
  ocena niedostateczna. Nie za sam brak pliku, lecz dlatego, że nie ma czym
  potwierdzić opanowania wymaganej umiejętności
- **oddanie pracy po terminie zawsze ma sens** — praca zostaje oceniona, w dzienniku
  zostają obie oceny, a przy ocenie okresowej i rocznej brana jest pod uwagę **wyższa**
- choroba, dłuższa nieobecność albo sytuacja losowa: **zgłoś to przed upływem terminu**,
  a termin zostanie przesunięty
- zalecenia z opinii i orzeczeń poradni psychologiczno-pedagogicznej są uwzględniane
  przy ustalaniu terminu i formy pracy (§ 36 statutu)

### Samodzielność pracy i weryfikacja

Ocena z tego przedmiotu opisuje **Twoje** umiejętności. Praca, która ich nie
pokazuje, nie jest dla mnie żadną informacją — niezależnie od tego, jak dobrze
wygląda.

**Co wolno, a czego nie.** Wolno korzystać z dokumentacji, przykładów z sieci,
pomocy kolegi i narzędzi — także tych opartych na sztucznej inteligencji. To są
narzędzia pracy i nikt Ci ich nie zabrania. Granica leży gdzie indziej: **masz
rozumieć to, co oddajesz**. Umieć wyjaśnić każdy wiersz, powtórzyć to na innych
danych i powiedzieć, dlaczego zrobiłeś tak, a nie inaczej. Jeżeli tego nie
potrafisz, to nie jest Twoja praca — choćbyś sam wysłał plik.

**Każda praca może zostać zweryfikowana.** Weryfikuję wyrywkowo, po kilka prac
z każdej partii, także wtedy, gdy nie mam żadnych wątpliwości. Nikt nie jest
wtedy „wybrany" ani o nic oskarżany — to normalny element sprawdzania osiągnięć.
Weryfikacja trwa kilkanaście minut i wygląda tak:

- odtwarzasz **fragment** pracy przy mnie, na zmienionych danych
- odpowiadasz, dlaczego w jednym konkretnym miejscu wybrałeś takie rozwiązanie
- mówisz, co się stanie, jeżeli zmienię jeden parametr — i sprawdzamy
- przy pracach z pomiarami: powtarzamy jeden pomiar na miejscu

**Co się dzieje, gdy weryfikacja wypadnie źle.** Praca **nie podlega ocenie** —
nie jako kara, tylko dlatego, że nie potwierdza Twoich umiejętności. Ocenę
dostajesz za to, co pokazałeś podczas weryfikacji, a umiejętność sprawdzamy
jeszcze raz w terminie, który wyznaczę. Droga do oceny pozostaje otwarta
na tych samych zasadach co przy pracy nieoddanej.

**Dwa tory, które się nie mieszają.** Ocena z przedmiotu opisuje umiejętności —
i tylko to. Nieuczciwość jest sprawą **zachowania** i tam trafia: do uwagi dla
wychowawcy, jako element wywiązywania się z obowiązków ucznia (§ 43 ust. 1 pkt 1
statutu). Jedno na drugie nie wpływa, bo § 43 ust. 3 statutu wprost tego zakazuje.
Nie dostaniesz jedynki „za ściąganie" — dostaniesz ocenę odpowiadającą temu,
co potrafisz, i uwagę za to, jak się zachowałeś.

**Jak sobie to ułatwić.** Zapisuj źródła, z których korzystałeś, prosto w pracy.
Zostawiaj ślad kolejnych wersji zamiast jednego gotowego pliku. I sprawdź sam
siebie przed oddaniem: zasłoń kod albo konfigurację i spróbuj opowiedzieć,
co tam jest. Jeżeli idzie gładko, weryfikacja też pójdzie gładko.

### Zaliczanie zaległości

Jeżeli nie było Cię na zapowiedzianej pracy pisemnej, **musisz** ją zaliczyć —
to obowiązek wynikający ze statutu, a nie to samo co dobrowolna poprawa opisana niżej.

- niezaliczoną pracę piszesz w formie i terminie wyznaczonych przez
  nauczyciela — **nie później niż dwa tygodnie od dnia powrotu do szkoły**
  (§ 30 ust. 5 statutu)
- niewykonane zadanie praktyczne uzupełniasz na najbliższych zajęciach
  lub na konsultacjach
- zapytanie albo skrypt wykonany niesamodzielnie nie podlega ocenie; możesz
  zostać poproszony o objaśnienie każdego wiersza

### Poprawa oceny

!!! note "To ustalenie przedmiotowe, nie zapis statutu"

    Statut szkoły nie reguluje poprawiania ocen bieżących. Poniższe zasady ustalił
    nauczyciel przedmiotu na podstawie art. 44b ust. 10 ustawy o systemie oświaty.
    Obowiązują jednakowo wszystkich w klasie.

- poprawiać można oceny z prac obejmujących **cały dział** (praktyczny sprawdzian przy komputerze kończący dział); kartkówki,
  odpowiedzi, pojedyncze zadania i aktywność poprawie nie podlegają — tu liczy się
  systematyczność
- poprawa jest **dobrowolna** i przysługuje **jeden raz** do każdej oceny
- termin: **dwa tygodnie** od otrzymania ocenionej pracy, w dniu uzgodnionym
  z nauczycielem — w miarę możliwości poza lekcją, na konsultacjach
- poprawa obejmuje ten sam zakres materiału i ma porównywalną trudność
- w dzienniku zostają **obie oceny**, ale przy ocenie okresowej i rocznej brana jest
  pod uwagę **wyższa** — przystąpienie do poprawy nigdy Ci nie zaszkodzi
- nieusprawiedliwione niestawienie się w umówionym terminie oznacza utratę prawa
  do poprawy tej oceny
- ocena niedostateczna za **nieoddaną pracę obowiązkową** nie przechodzi przez tę
  procedurę — tam wystarczy oddać pracę, a zostanie oceniona (patrz „Prace obowiązkowe”
  wyżej)

### Zadania na ocenę celującą

Zadania na szóstkę są **działowe, nie tematyczne**: obejmują materiał całego działu
i wymagają czegoś więcej niż powtórzenia ćwiczenia z lekcji. Ich komplet znajdziesz
przy spisie tematów działu — pełne treści, widoczne **od początku działu**, żebyś
miał czas wybrać i popracować.

Są **dobrowolne**. Ich brak niczego nie obniża, a wykonanie nie zwalnia z prac
obowiązkowych. **Karty pracy do tematów są od nich niezależne** — nie ma w nich
żadnej rubryki na zadanie dodatkowe.

| Co odsyłasz | Jak to ma wyglądać |
| --- | --- |
| gdzie | Dziennik VULCAN, zadanie **„Zadanie na ocenę celującą: Dział …”** założone do tego działu |
| termin | **dwa tygodnie od zakończenia działu**; potem zadanie zostaje zamknięte i otwiera się kolejne |
| plik z pracą | kod, archiwum z witryną, dokumentacja, arkusz albo zrzuty z pomiarami — zależnie od zadania |
| nazwa pliku | `nr<numer w dzienniku>-<litera zadania>`, np. `nr12-B.zip` |
| opis w treści zadania | 3–5 zdań: które zadanie wybrałeś, co zrobiłeś, jaki jest wynik albo wniosek |

- wybierasz **jedno** zadanie z działu; przy każdym jest napisane, po którym temacie
  da się je wykonać
- pracę oceniam pod kątem **samodzielności i poprawności**, nie objętości; krótkie
  i działające jest lepsze od długiego i niedokończonego
- wykonane i oddane w terminie zadanie liczy się jako „inne, porównywalne osiągnięcie”
  w rozumieniu § 29 ust. 1 pkt 1 lit. c statutu — **do oceny celującej nie trzeba
  startować w konkursie**
- pojedyncze zadanie daje ocenę bieżącą; na **celującą ocenę roczną** składa się praca
  wykraczająca prowadzona systematycznie, w kilku działach w ciągu roku

### Chcesz wyższą ocenę roczną niż przewidywana

Na to statut przewiduje osobną drogę (§ 35 statutu):

1. o przewidywanej ocenie rocznej dowiadujesz się **na tydzień** przed klasyfikacyjnym
   posiedzeniem rady pedagogicznej — z wpisu w dzienniku elektronicznym
2. najpóźniej **5 dni** przed tym posiedzeniem składasz do dyrektora **pisemny wniosek**
   o sprawdzenie wiadomości
3. sprawdzian z tego przedmiotu ma formę **praktyczną albo łączoną** i obejmuje wymagania
   na ocenę, o którą się ubiegasz — dokładnie te wypisane niżej na tej stronie
4. odbywa się **nie później niż 3 dni** przed posiedzeniem rady
5. jeżeli nie wykażesz się wymaganiami na wnioskowaną ocenę, zostaje ocena przewidywana;
   z przebiegu sprawdzianu nauczyciel sporządza protokół

### Warto wiedzieć

- oceny bieżące mogą mieć „+” i „−” — z wyjątkiem celującej i niedostatecznej
  (§ 28 ust. 2 statutu)
- w ciągu dnia możesz mieć tylko **jeden** godzinny sprawdzian, a w tygodniu
  **nie więcej niż trzy** (§ 30 ust. 2 statutu)
- ocenioną pracę dostajesz do wglądu razem z uzasadnieniem oceny w ciągu
  **dwóch tygodni** od jej napisania (§ 30 ust. 3 statutu)
- przy ocenianiu uwzględniane są zalecenia z opinii i orzeczeń poradni
  psychologiczno-pedagogicznej — wymagania dostosowuje się do Twoich
  możliwości, z zachowaniem wymagań koniecznych (§ 36 statutu)
- jeżeli czasowo nie możesz pracować przy komputerze, wykonujesz zadania
  w formie zastępczej ustalonej z nauczycielem
- droga do szóstki nie prowadzi wyłącznie przez konkursy — zasady opisuje sekcja
  „Zadania na ocenę celującą” wyżej na tej stronie
- laureaci i finaliści olimpiad i turniejów zawodowych otrzymują celującą roczną ocenę
  klasyfikacyjną (§ 37 ust. 6 statutu); z mocy art. 44j ustawy o systemie oświaty to samo prawo mają laureaci
  konkursów przedmiotowych o zasięgu wojewódzkim i ponadwojewódzkim

Te wymagania, sposoby sprawdzania osiągnięć oraz warunki uzyskania oceny wyższej niż
przewidywana zostały podane do wiadomości do **25 września**, zgodnie z § 26 ust. 1 statutu.


## Wymagania na poszczególne oceny

Rozwiń dział, żeby zobaczyć, co trzeba umieć na każdą ocenę. Wymagania wywodzą się
wprost z jednostki **INF.03.4** podstawy programowej kształcenia w zawodzie
technik informatyk.

??? abstract "Dział I. Środowisko pracy — instalacja, phpMyAdmin, import bazy"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - uruchamia serwer bazy danych i otwiera phpMyAdmina
    - odnajduje bazę i tabelę na liście
    - odczytuje nazwy kolumn i typy danych w widoku struktury

    **Ocena dostateczna (3)** — *wymagania podstawowe* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - zakłada bazę danych i nadaje jej właściwe kodowanie
    - importuje bazę z pliku `.sql` i sprawdza, czy import się powiódł
    - zapisuje treść zapytania do pliku tekstowego zgodnie z poleceniem

    **Ocena dobra (4)** — *wymagania rozszerzające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - rozpoznaje przyczynę nieudanego importu i usuwa ją
    - wyjaśnia, czym jest kodowanie znaków i skąd biorą się „krzaczki"
    - wykonuje eksport bazy do pliku i sprawdza zawartość pliku

    **Ocena bardzo dobra (5)** — *wymagania dopełniające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - dobiera system zarządzania bazą danych do zastosowania i uzasadnia wybór
    - konfiguruje serwer do pracy wielu użytkowników
    - przygotowuje stanowisko do pracy egzaminacyjnej bez podpowiedzi

    **Ocena celująca (6)** — *wymagania wykraczające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - podejmuje zadania dodatkowe, w tym przygotowanie do części praktycznej egzaminu INF.03

??? abstract "Dział IV. Relacje i agregacja — zapytania łączące tabele"

    **Ocena dopuszczająca (2)** — *wymagania konieczne*

    - wskazuje w strukturze bazy klucz główny i klucz obcy
    - odczytuje, które kolumny łączą dwie tabele

    **Ocena dostateczna (3)** — *wymagania podstawowe* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - pisze zapytanie łączące dwie tabele i wybierające z nich wskazane kolumny
    - stosuje aliasy tabel, żeby skrócić zapis

    **Ocena dobra (4)** — *wymagania rozszerzające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - rozróżnia złączenie wewnętrzne i zewnętrzne i wskazuje, kiedy które daje inny wynik
    - łączy zapytanie z warunkiem i sortowaniem
    - stosuje funkcje agregujące z grupowaniem

    **Ocena bardzo dobra (5)** — *wymagania dopełniające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - łączy trzy tabele i uzasadnia kolejność złączeń
    - stosuje `HAVING` i rozróżnia je od `WHERE`
    - buduje podzapytania

    **Ocena celująca (6)** — *wymagania wykraczające* *(spełnia wymagania na ocenę niższą, a ponadto)*

    - rozwiązuje zadania z arkuszy egzaminacyjnych INF.03 dotyczące zapytań złożonych

!!! note "Pozostałe działy"

    Wymagania do działów II, III, V–IX powstają wraz z materiałami do nich.
    Spis wszystkich działów i tematów jest na [stronie głównej](../index.md).

---

Te wymagania, sposoby sprawdzania osiągnięć oraz warunki uzyskania oceny wyższej niż
przewidywana zostały podane do wiadomości do **25 września**, zgodnie z § 26 ust. 1 statutu.
