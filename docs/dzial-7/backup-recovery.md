# Kopia zapasowa i przywracanie bazy
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział VII**

W poprzednim dziale nauczyliśmy się, jak eksportować i importować dane. Z perspektywy użytkownika był to sposób na przeniesienie bazy. Z perspektywy administratora, jest to proces tworzenia **kopii zapasowych (backupów)**. 

Wyobraź sobie sytuację: firma prowadzi sklep internetowy. O godzinie 3:00 nad ranem serwer ulega awarii, a dysk zostaje uszkodzony. Bez kopii zapasowej firma traci całą historię zamówień, listę klientów i stany magazynowe. Backup to jedyna polisa ubezpieczeniowa administratora bazy danych.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. zaplanować strategię kopii zapasowych dla małego systemu
    2. rozróżnić pełny zrzut bazy od eksportu konkretnych tabel
    3. przeprowadzić procedurę przywracania bazy po awarii
    4. wyjaśnić różnicę między kopią logiczną a fizyczną

## 1. Strategie backupu

Nie każdą bazę trzeba kopiować w ten sam sposób. Wybór zależy od tego, jak często zmieniają się dane i jak dużą stratę firma może zaakceptować.

| Typ backupu | Co jest kopiowane? | Zalety | Wady |
| :--- | :--- | :--- | :--- |
| **Pełny (Full)** | Cała baza danych, wszystkie tabele i dane | Najprostsze przywracanie (jeden plik) | Zajmuje dużo miejsca, trwa długo |
| **Przyrostowy (Incremental)** | Tylko dane, które zmieniły się od ostatniego backupu | Szybki, zajmuje mało miejsca | Przywracanie wymaga wszystkich plików z kolei |

**Zasada 3-2-1 (Standard branżowy):**
Aby dane były naprawdę bezpieczne, administratorzy stosują zasadę:
- **3 kopie** danych (oryginał + 2 backupy).
- **2 różne nośniki** (np. dysk serwera + zewnętrzny dysk twardy).
- **1 kopia poza siedzibą** (np. w chmurze lub w innym budynku).

## 2. Backup logiczny vs fizyczny

W phpMyAdmin korzystamy z **backupu logicznego**. Co to oznacza?

- **Backup Logiczny (Zrzut SQL):** Baza generuje plik tekstowy z instrukcjami SQL (`CREATE`, `INSERT`). 
  - *Plusy:* Można go przeczytać w Notatniku, można go zaimportować do innej wersji bazy danych.
  - *Minusy:* Przy ogromnych bazach (terabajty danych) import trwa bardzo długo.

- **Backup Fizyczny:** Kopiujemy bezpośrednio pliki binarne, w których serwer przechowuje dane na dysku.
  - *Plusy:* Błyskawiczne przywracanie (po prostu kopiujemy pliki z powrotem).
  - *Minusy:* Pliki są nieczytelne dla człowieka, muszą być przywracane do tej samej wersji serwera.

## 3. Procedura przywracania po awarii (Disaster Recovery)

Przywracanie bazy to nie tylko kliknięcie „Import”. To proces, który musi być przemyślany:

1. **Analiza strat:** Sprawdzenie, kiedy powstała ostatnia sprawna kopia.
2. **Przygotowanie środowiska:** Instalacja serwera i utworzenie pustej bazy o właściwej nazwie.
3. **Import danych:** Wgranie pliku `.sql` do bazy.
4. **Weryfikacja:** Sprawdzenie, czy dane są aktualne i czy relacje między tabelami działają poprawnie.
5. **Ponowne nadanie uprawnień:** Pamiętaj, że zrzut bazy często nie zawiera kont użytkowników i ich haseł (są one w systemowej bazie `mysql`) $\rightarrow$ użytkowników trzeba utworzyć i uprawnić od nowa!

## 4. Co z tego jest na egzaminie

Na egzaminie INF.03 backup pojawia się głównie w formie importu pliku `.sql`, ale w pytaniach teoretycznych może pojawić się kwestia bezpieczeństwa danych.

**Kluczowe pojęcia:**
- **Zrzut (dump)** $\rightarrow$ plik tekstowy z instrukcjami SQL.
- **Integralność danych** $\rightarrow$ stan, w którym dane w bazie są poprawne i spójne (np. nie ma zamówienia przypisanego do nieistniejącego klienta).

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Planowanie backupu"
Twoja firma posiada bazę danych o rozmiarze 10 MB. Dane zmieniają się rzadko (raz na kilka dni). Zaproponuj najprostszą strategię kopii zapasowych. Jak często byś je robił i gdzie przechowywał?

??? success "Rozwiązanie 1"
    Przy tak małej bazie optymalnym rozwiązaniem jest **pełny backup logiczny (zrzut .sql)** wykonywany raz w tygodniu (lub raz dziennie). Plik można przechowywać na dysku serwera oraz w chmurze (np. OneDrive/Google Drive), co realizuje zasadę 3-2-1.

!!! question "Ćwiczenie 2. Szybka diagnostyka zrzutu"
Otwórz plik `.sql` z dowolnej swojej bazy. Znajdź w nim sekcję dotyczącą kodowania znaków (np. `/*!40101 SET NAMES utf8mb4 */`). Wyjaśnij, dlaczego ta informacja jest kluczowa przy przywracaniu bazy na innym komputerze.

??? success "Rozwiązanie 2"
    Informacja o kodowaniu (np. UTF-8) mówi serwerowi, jak interpretować znaki specjalne (np. polskie ą, ć, ł). Jeśli przywrócimy bazę z kodowaniem UTF-8 na serwerze ustawionym na Latin1, w danych pojawią się tzw. „krzaczki”.

!!! question "Ćwiczenie 3. Symulacja awarii"
1. Wykonaj pełny eksport swojej bazy.
2. Usuń wszystkie tabele z bazy (użyj `DROP TABLE` lub zakładki Operacje $\rightarrow$ Usuń).
3. Przywróć bazę z pliku eksportu.
4. Sprawdź, czy wszystkie dane wróciły.

??? success "Rozwiązanie 3"
    Kroki wykonane poprawnie $\rightarrow$ dane przywrócone. To ćwiczenie pokazuje, że zrzut `.sql` jest kompletną instrukcją odtworzenia stanu bazy.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Co jest główną zaletą backupu logicznego (zrzutu SQL) nad fizycznym?",
    "opcje": [
      "Szybszy czas przywracania",
      "Mniejsza objętość pliku",
      "Możliwość odczytania i edycji treści w edytorze tekstu",
      "Brak konieczności posiadania hasła do bazy"
    ],
    "poprawna": 2,
    "wyjasnienie": "Backup logiczny to plik tekstowy. Możemy go otworzyć w Notatniku, zmienić w nim jedną wartość lub usunąć jedną tabelę przed importem."
  },
  {
    "pytanie": "Zasada 3-2-1 w backupach mówi, że należy posiadać:",
    "opcje": [
      "3 kopie, 2 formaty plików, 1 raz w tygodniu",
      "3 kopie, 2 różne nośniki, 1 kopia w innej lokalizacji",
      "3 bazy, 2 użytkowników, 1 administratora",
      "3 godziny na przywrócenie, 2 próby, 1 weryfikacja"
    ],
    "poprawna": 1,
    "wyjasnienie": "To standard bezpieczeństwa zapobiegający utracie danych w przypadku np. pożaru budynku (dlatego jedna kopia musi być poza siedzibą)."
  },
  {
    "pytanie": "Dlaczego po przywróceniu bazy z pliku .sql często trzeba ponownie nadawać uprawnienia użytkownikom?",
    "opcje": [
      "Ponieważ pliki .sql niszczą hasła użytkowników",
      "Ponieważ uprawnienia są przechowywane w systemowej bazie 'mysql', a zrzut zazwyczaj dotyczy tylko jednej, konkretnej bazy użytkownika",
      "Ponieważ MariaDB automatycznie resetuje uprawnienia po każdym imporcie",
      "Ponieważ import danych zawsze usuwa konta użytkowników"
    ],
    "poprawna": 1,
    "wyjasnienie": "Użytkownicy i ich prawa są globalnymi obiektami serwera (znajdują się w bazie danych `mysql`), a nie wewnątrz Twojej bazy `sklep_db`. Eksportując tylko jedną bazę, nie eksportujesz kont użytkowników."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="backup-recovery"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
