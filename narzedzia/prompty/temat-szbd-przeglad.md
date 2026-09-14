# Prompt dla Julesa — temat „Systemy zarządzania bazami danych — przegląd i dobór"

Skopiuj wszystko poniżej linii i wklej do Julesa po podpięciu repozytorium `JosiMate/lsbd`.

---

## Zadanie

Dodaj do serwisu MkDocs nowy temat lekcji: **„Systemy zarządzania bazami danych — przegląd i dobór"** (dział I, temat 3). Serwis to materiały dla uczniów technikum informatycznego przygotowujących się do kwalifikacji **INF.03**, przedmiot „lokalne systemy baz danych". Odbiorcą tekstu jest **uczeń klasy technikum**, nie programista.

## Zanim cokolwiek napiszesz — przeczytaj wzorce

Styl tego serwisu jest ustalony. Przeczytaj te pliki i **odwzoruj ich konwencje co do znaku**:

1. `docs/dzial-1/srodowisko-import.md` — wzorzec strony tematu (nagłówek, cele, sekcje, ćwiczenia, quiz, karta pracy, stopka)
2. `docs/dzial-4/select-relacje.md` — drugi wzorzec, z widżetem trenera SQL
3. `docs/assets/karty/srodowisko-import.json` — wzorzec karty pracy
4. `docs/index.md` — spis tematów
5. `mkdocs.yml` — nawigacja
6. `README.md` — konwencje projektu

Nie wymyślaj własnej struktury. Jeżeli coś jest w tych plikach zrobione w określony sposób, zrób tak samo.

## Pliki do utworzenia i zmiany

| Plik | Co zrobić |
| --- | --- |
| `docs/dzial-1/szbd-przeglad.md` | **utwórz** — treść tematu |
| `docs/assets/karty/szbd-przeglad.json` | **utwórz** — karta pracy |
| `docs/index.md` | **zmień jeden wiersz** — zamień `Systemy zarządzania bazami danych — przegląd i dobór \| *w przygotowaniu*` na wiersz z odsyłaczem i znacznikiem „gotowe", dokładnie w formacie pozostałych gotowych wierszy w tej tabeli |
| `mkdocs.yml` | **dopisz jedną pozycję** w `nav`, w sekcji „Dział I. Środowisko pracy", po „Środowisko, import bazy i plik kwerend": `- "Systemy zarządzania bazami danych": dzial-1/szbd-przeglad.md` |

**Nie dotykaj żadnych innych plików.** W szczególności nie zmieniaj motywu, konfiguracji Material, plików JavaScript ani istniejących tematów.

## Wymagane konwencje

**Język.** Polski. Zwracaj się do ucznia per „ty". Piszesz rzeczowo i konkretnie — bez „warto pamiętać, że", bez „w dzisiejszych czasach", bez zachwytów nad technologią. Zdanie ma nieść informację albo go nie ma.

**Nagłówek pliku.** Dokładnie w tej postaci:

```markdown
# Systemy zarządzania bazami danych — przegląd i dobór

**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział I**
```

Pod spodem 3–5 zdań wprowadzenia mówiących, po co ten temat jest — z odniesieniem do egzaminu.

**Cele lekcji.** Blok `!!! success "Cele lekcji"` z listą numerowaną, zaczynającą się od „Po tej lekcji potrafisz:".

**Sekcje.** Numerowane: `## 1. …`, `## 2. …`. Podsekcje jako `### …`.

**Admonicje.** Używaj tych typów i tylko tych: `!!! info`, `!!! tip`, `!!! warning`, `!!! example`, `!!! note`, `!!! abstract`, `!!! question`, `??? question` (zwijana), `??? success` (zwijana, do rozwiązań). Każda admonicja ma tytuł w cudzysłowie. Treść wcięta czterema spacjami.

**Tabele.** Chętnie — to jest temat porównawczy i tabela niesie tu więcej niż akapit.

**Ćwiczenia.** Sekcja `## Ćwiczenia`, w niej **trzy** ćwiczenia jako `!!! question "Ćwiczenie N. Tytuł"`, każde zakończone linią `**Zapisujesz:** …`. Po każdym ćwiczeniu blok `??? success "Wskazówka do rozwiązania N"` albo `??? success "Rozwiązanie N"` z konkretną odpowiedzią — nie ogólnikiem. Na końcu sekcji blok `!!! note "Co oddajesz"` odsyłający do karty pracy na dole strony.

**Quiz.** Sekcja `## Sprawdź się`, a w niej dokładnie ta konstrukcja:

```html
<div class="quiz" markdown="0">
<script type="application/json">
[ … ]
</script>
</div>
```

Tablica ma zawierać **8** obiektów o polach: `pytanie` (string), `opcje` (tablica 4 stringów), `poprawna` (indeks od 0), `wyjasnienie` (string — wyjaśnia, *dlaczego* poprawna jest poprawna, a przy okazji dlaczego kusząca błędna jest błędna). JSON musi być poprawny składniowo — sprawdź to.

**Karta pracy.** Na końcu strony, przed stopką:

```markdown
## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="szbd-przeglad"></div>
```

**Stopka.** Po `---` kursywą: skąd wzięte są liczby i kiedy sprawdzone. Wzoruj się na stopkach w obu wzorcach.

**Trenera SQL w tym temacie nie używaj** — to temat porównawczy, nie o pisaniu zapytań.

## Treść — co ma być w środku

Temat realizuje efekt **INF.03.4 (3): „korzysta z systemów zarządzania bazami danych"**, którego kryteria weryfikacji brzmią: *rozróżnia dostępne SZBD · dobiera SZBD do określonego zastosowania · instaluje SZBD · konfiguruje SZBD do pracy w środowisku wielu użytkowników · aktualizuje SZBD*. Każde z tych pięciu kryteriów ma znaleźć pokrycie w tekście.

Proponowany układ sekcji (możesz doprecyzować tytuły, nie zmieniaj zakresu):

1. **Czym jest SZBD, a czym baza danych** — rozróżnienie, którego uczniowie notorycznie nie robią: baza to dane, SZBD to program, który nimi zarządza. Podaj, za co odpowiada SZBD (dostęp, spójność, uprawnienia, kopie, współbieżność).
2. **Dwa światy: plikowy i klient-serwer** — najważniejszy podział w tym temacie. Model plikowy (SQLite, MS Access): dane w pliku, brak procesu serwera, dostęp przez udział sieciowy. Model klient-serwer (MariaDB, PostgreSQL, MS SQL Server): proces nasłuchujący na porcie, konta użytkowników, uprawnienia. Wyjaśnij, **co z tego wynika praktycznie** — dlaczego baza plikowa psuje się przy kilku osobach naraz.
3. **Przegląd konkretnych systemów** — tabela porównawcza obejmująca: **MariaDB/MySQL**, **SQLite**, **MS Access**, **PostgreSQL**, **MS SQL Server Express**. Kolumny: model pracy, gdzie leżą dane, konta i uprawnienia, licencja, typowe zastosowanie.
4. **Kryteria doboru** — lista tego, co realnie decyduje: liczba jednoczesnych użytkowników, rozmiar danych, koszt licencji, wymagania sprzętowe, potrzeba kopii zapasowych i uprawnień, przenośność, dostępność wsparcia i dokumentacji, kompetencje osoby, która będzie to utrzymywać.
5. **Cztery scenariusze do rozstrzygnięcia** — krótkie przypadki, przy każdym wskazanie rozwiązania z uzasadnieniem. Proponowane: aplikacja mobilna działająca offline; ewidencja dla jednoosobowej firmy; sklep internetowy na 3 stanowiskach; system dla 200 użytkowników z wymogiem dostępności.
6. **Instalacja, konfiguracja wielodostępu i aktualizacja** — krótko, ale konkretnie, bo to trzy osobne kryteria egzaminacyjne. Przy wielodostępie: konta użytkowników zamiast jednego wspólnego, `root` nie służy do pracy codziennej, uprawnienia nadaje się najwęższe z możliwych. Przy aktualizacji: kopia zapasowa przed aktualizacją, sprawdzenie zgodności, aktualizacje bezpieczeństwa.
7. **Co z tego jest na egzaminie** — zwięźle: na INF.03 pracuje się na MariaDB przez phpMyAdmina, ale w części pisemnej pojawiają się pytania o rozróżnianie systemów i dobór do zastosowania.

## Liczby, których masz użyć — są sprawdzone

Wstaw je do tekstu. **Nie zmieniaj ich i nie dopisuj innych liczb**, jeżeli nie masz pewnego źródła — lepiej napisać opisowo niż zmyślić wartość.

| Fakt | Wartość | Źródło do podania w stopce |
| --- | --- | --- |
| MS Access — maksymalny rozmiar pliku bazy | **2 GB** (łącznie z obiektami systemowymi) | Microsoft, „Specyfikacje programu Access" |
| MS Access — maksymalna liczba jednoczesnych użytkowników | **255** | jw. |
| MS Access — maksymalna liczba pól w tabeli | **255** | jw. |
| MS Access — maksymalna liczba obiektów w bazie | **32 768** | jw. |
| SQL Server Express — maksymalny rozmiar bazy | **10 GB** | dokumentacja edycji SQL Server |
| SQL Server Express — pamięć bufora | **1410 MB** na instancję | jw. |
| SQL Server Express — procesor | mniejsze z: **1 gniazdo albo 4 rdzenie** | jw. |
| Egzamin INF.03 — czas części praktycznej | **150 minut** | arkusze CKE |
| Egzamin INF.03 — próg zdawalności części praktycznej | **75 %** | jw. |

Przy limicie Accessa dopisz uwagę, która ma wartość dydaktyczną: **255 jednoczesnych użytkowników to limit teoretyczny** — w praktyce baza plikowa na udziale sieciowym zaczyna się psuć przy kilku osobach edytujących te same dane, i to jest powód, dla którego wybiera się model klient-serwer, a nie sam rozmiar danych.

Licencje podaj opisowo, bez numerów wersji licencji, jeżeli nie jesteś pewien: MariaDB i PostgreSQL są otwarte i darmowe, SQLite jest w domenie publicznej, MS Access jest częścią płatnego pakietu biurowego, SQL Server Express jest darmowy, ale z wypisanymi wyżej limitami.

## Ćwiczenia — czego mają dotyczyć

1. **Dobór do scenariusza.** Uczeń dostaje trzy opisane sytuacje i wskazuje SZBD z uzasadnieniem przez kryteria z sekcji 4. W rozwiązaniu podaj sensowne odpowiedzi i zaznacz, że liczy się **uzasadnienie**, nie sama nazwa.
2. **Sprawdzenie własnego stanowiska.** Uczeń ustala, jaka wersja serwera bazy danych działa u niego (`SELECT VERSION();` w phpMyAdminie albo zakładka informacyjna), zapisuje wersję, silnik i porównuje z wersją najnowszą.
3. **Granice na papierze.** Uczeń liczy, ile rekordów zmieści się w bazie Accessa przy założonym rozmiarze rekordu, i porównuje z limitem SQL Server Express. To ćwiczenie rachunkowe — w rozwiązaniu podaj tok obliczeń, a nie samą liczbę.

## Karta pracy — struktura

Plik `docs/assets/karty/szbd-przeglad.json` zbuduj dokładnie jak `srodowisko-import.json`. Wymagania:

- `"id": "lsbd-szbd-przeglad"` — **przedrostek `lsbd-` jest obowiązkowy**; wszystkie serwisy szkoły stoją na jednej domenie i dzielą `localStorage`, więc bez przedrostka karty z różnych przedmiotów nadpisałyby się nawzajem
- `"tytul": "Systemy zarządzania bazami danych — przegląd i dobór"`
- `"przedmiot": "PCEiKZ Szczucin · lokalne systemy baz danych · INF.03"`
- `"klasa": ""`
- `"sufiks": "LSBD-SZBD"`
- `zadania`: cztery pozycje — po jednej na każde ćwiczenie plus samoocena na końcu; numeracja `nr` od 1 bez przerw
- pola typu `tabela`, `tekst` i `zrzut` — jak we wzorcu; identyfikatory pól unikatowe w obrębie karty

## Definicja ukończenia

Zadanie jest zrobione, gdy **wszystkie** te punkty są spełnione:

- [ ] `mkdocs build --strict` kończy się bez błędów i **bez nowych ostrzeżeń** (`pip install -r requirements.txt` najpierw)
- [ ] JSON quizu parsuje się poprawnie i ma 8 pytań, każde z 4 opcjami i wyjaśnieniem
- [ ] `docs/assets/karty/szbd-przeglad.json` parsuje się poprawnie, ma `id` z przedrostkiem `lsbd-`, a numeracja `nr` jest ciągła
- [ ] nowa strona jest osiągalna z nawigacji i ze spisu tematów na stronie głównej
- [ ] w tekście padają wszystkie liczby z tabeli wyżej, w podanych wartościach
- [ ] pięć kryteriów weryfikacji efektu INF.03.4 (3) ma pokrycie w treści
- [ ] stopka podaje źródła i datę sprawdzenia
- [ ] żaden inny plik repozytorium nie został zmieniony

## Czego nie robić

- nie zmieniaj `mkdocs.yml` poza dopisaniem jednej pozycji w `nav`
- nie ruszaj `docs/assets/js/`, `docs/stylesheets/`, `narzedzia/`
- nie dodawaj zależności do `requirements.txt`
- nie wstawiaj obrazków ani odsyłaczy do zewnętrznych plików, których nie ma w repozytorium
- nie wstawiaj widżetu `sql-trener` na tej stronie
- nie podawaj liczb, których nie masz w tabeli wyżej i nie umiesz potwierdzić źródłem
- nie pisz, że któryś system jest „najlepszy" — cała lekcja jest o tym, że dobiera się go do zastosowania

## Pull request

Gałąź: `temat/szbd-przeglad`. W opisie PR wypisz: utworzone i zmienione pliki, wynik `mkdocs build --strict` oraz listę z definicji ukończenia z odhaczonymi punktami.
