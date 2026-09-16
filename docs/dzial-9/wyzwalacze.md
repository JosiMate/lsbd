# Wyzwalacze (Triggers)
**Lokalne systemy baz danych · technik informatyk · INF.03.4 · dział IX**

Wyobraź sobie, że chcesz prowadzić idealny dziennik zmian w swojej bazie danych. Za każdym razem, gdy cena produktu zostanie zmieniona, chcesz, aby w specjalnej tabeli `log_cen` automatycznie pojawił się wpis: „Kto, kiedy i na ile zmienił cenę produktu X”.

Ręczne dopisywanie do logów w aplikacji jest ryzykowne — programista może zapomnieć o jednej funkcji. Rozwiązaniem są **Wyzwalacze (Triggers)**.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić zasadę działania wyzwalacza (triggera)
    2. odróżnić wyzwalacze typu BEFORE od AFTER
    3. tworzyć wyzwalacze reagujące na operacje INSERT, UPDATE i DELETE
    4. projektować systemy automatycznego logowania zmian (audit trail)

## 1. Czym jest wyzwalacz?

Wyzwalacz to specjalny rodzaj procedury, która **nie jest wywoływana przez użytkownika**, ale przez samą bazę danych w odpowiedzi na konkretne zdarzenie.

Zdarzeniem tym jest zawsze jedna z trzech operacji:
- `INSERT` (dodanie rekordu)
- `UPDATE` (modyfikacja rekordu)
- `DELETE` (usunięcie rekordu)

Wyzwalacz działa jak „czujnik”: gdy w tabeli X wydarzy się operacja Y, wykonaj automatycznie kod Z.

## 2. Kiedy wyzwalać? (BEFORE vs AFTER)

Możemy zdecydować, w którym momencie trigger ma zadziałać:

- **BEFORE (Przed):** Wyzwalacz uruchamia się *zanim* dane zostaną zapisane w tabeli. Jest idealny do **walidacji i korekty danych**.
  *Przykład:* Jeśli użytkownik wpisał cenę ujemną, trigger może ją zmienić na 0 przed zapisem.
- **AFTER (Po):** Wyzwalacz uruchania się *po* pomyślnym zapisie danych. Jest idealny do **aktualizacji innych tabel lub logowania**.
  *Przykład:* Po dodaniu zamówienia, trigger automatycznie zmniejsza ilość produktu w magazynie.

## 3. Słowa klucze NEW i OLD

Wewnątrz wyzwalacza mamy dostęp do dwóch wirtualnych tabel, które pozwalają nam porównać dane:

- **`NEW`**: Zawiera nowe wartości, które właśnie są wpisywane do bazy.
- **`OLD`**: Zawiera stare wartości, które były w bazie przed zmianą.

| Operacja | `OLD` | `NEW` | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **INSERT** | $\text{NULL}$ | $\checkmark$ | Sprawdzenie danych przed zapisem |
| **UPDATE** | $\checkmark$ | $\checkmark$ | Porównanie: „co było, a co jest” |
| **DELETE** | $\checkmark$ | $\text{NULL}$ | Archiwizacja usuniętego rekordu |

## 4. Przykład praktyczny: Logowanie zmian ceny

Tworzymy trigger, który przy każdej zmianie ceny produktu dopisuje informację do tabeli `log_cen`.

```sql
DELIMITER //

CREATE TRIGGER tr_log_zmiany_ceny
AFTER UPDATE ON produkty
FOR EACH ROW
BEGIN
    -- Sprawdzamy, czy cena faktycznie się zmieniła
    IF OLD.cena <> NEW.cena THEN
        INSERT INTO log_cen (id_produktu, stara_cena, nowa_cena, data_zmiany)
        VALUES (OLD.id_produktu, OLD.//cena, NEW.cena, NOW());
    END IF;
END //

DELIMITER ;
```

## 5. Co z tego jest na egzaminie

Zadania z wyzwalaczami są często uznawane za najtrudniejsze, ale mają stały schemat. Zazwyczaj brzmią: „Stwórz wyzwalacz, który po dodaniu zamówienia zmniejszy ilość towaru w magazynie”.

**Klucz do odpowiedzi:**
- Wybierz odpowiedni moment: `AFTER INSERT`.
- Użyj słowa kluczowego `NEW` do pobrania ID produktu z nowego zamówienia.
- Wykonaj `UPDATE` na tabeli magazynowej.

---

## Ćwiczenia

!!! question "Ćwiczenie 1. Projektowanie triggera"
Zaprojektuj wyzwalacz `tr_zapobiegaj_ujemnym`, który działa przed (`BEFORE`) wstawieniem danych do tabeli `produkty`. Jeśli cena jest mniejsza niż 0, trigger ma ustawić ją na 0.

??? success "Rozwiązanie 1"
    ```sql
    DELIMITER //
    CREATE TRIGGER tr_zapobiegaj_ujemnym
    BEFORE INSERT ON produkty
    FOR EACH ROW
    BEGIN
        IF NEW.cena < 0 THEN
            SET NEW.cena = 0;
        END IF;
    END //
    DELIMITER ;
    ```

!!! question "Ćwiczenie 2. Logowanie usunięć"
Stwórz wyzwalacz `tr_archiwizacja_klientów`, który po usunięciu klienta (`AFTER DELETE`) zapisze jego nazwisko i datę usunięcia w tabeli `archiwum_klientow`.

??? success "Rozwiązanie 2"
    ```sql
    DELIMITER //
    CREATE TRIGGER tr_archiwizacja_klientów
    AFTER DELETE ON klienci
    FOR EACH ROW
    BEGIN
        INSERT INTO archiwum_klientow (nazwisko, data_usuniecia)
        VALUES (OLD.nazwisko, NOW());
    END //
    DELIMITER ;
    ```

!!! question "Ćwiczenie 3. Analiza NEW/OLD"
Które słowo kluczowe (`NEW` czy `OLD`) należy użyć w triggerze `AFTER UPDATE`, aby sprawdzić wartość kolumny **przed** dokonaniem zmiany?

??? success "Rozwiązanie 3"
    Należy użyć słowa kluczowego `OLD`.

!!! note "Co oddajesz"
    Wyniki wszystkich trzech ćwiczeń wpisujesz do karty pracy na dole tej strony, a gotowy dokument oddajesz przez **Zadania w Dzienniku VULCAN**.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Kiedy najlepiej zastosować wyzwalacz typu BEFORE?",
    "opcje": [
      "Gdy chcemy zapisać historię zmiany w innej tabeli",
      "Gdy chcemy zmodyfikować dane przed ich zapisem w bazie",
      "Gdy chcemy powiadomić użytkownika o sukcesie operacji",
      "Gdy chcemy usunąć powiązane rekordy z innych tabel"
    ],
    "poprawna": 1,
    "wyjasnienie": "Wyzwalacze BEFORE pozwalają na walidację i korektę danych (za pomocą SET NEW.kolumna = ...) zanim trafią one na dysk."
  },
  {
    "pytanie": "W operacji DELETE, z której wirtualnej tabeli możemy pobrać dane usuniętego rekordu?",
    "opcje": [
      "Z tabeli NEW",
      "Z tabeli OLD",
      "Z tabeli CURRENT",
      "Z żadnej, dane są usuwane natychmiast"
    ],
    "poprawna": 1,
    "wyjasnienie": "W operacji DELETE nie ma nowych danych (NEW), są tylko dane stare (OLD), które właśnie zostają usunięte."
  },
  {
    "pytanie": "Co oznacza instrukcja 'FOR EACH ROW' w definicji triggera?",
    "opcje": [
      "Że trigger uruchamia się tylko raz dla całego zapytania",
      "Że trigger uruchamia się osobno dla każdego wiersza dotkniętego operacją",
      "Że trigger przetwarza tylko pierwszy wiersz z tabeli",
      "Że trigger działa tylko dla rekordów z kluczem głównym"
    ],
    "poprawna": 1,
    "wyjasnienie": "Jeśli zapytanie UPDATE zmieni 10 wierszy, trigger FOR EACH ROW zostanie wykonany 10 razy."
  }
]
</script>
</div>

---

## Karta pracy

Wypełnij kartę na tej stronie, a potem pobierz gotowy dokument Worda i oddaj
go przez **Zadania w Dzienniku VULCAN**.

<div class="karta-pracy" data-karta="wyzwalacze"></div>

---

*Materiały przygotowane dla uczniów technikum informatycznego (INF.03).*
