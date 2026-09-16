# -*- coding: utf-8 -*-
"""Kontrola zapytań wzorcowych trenera SQL — serwis lsbd.

Każde zapytanie wstawione na stronę w atrybucie data-wzorzec albo data-start
ma tu swój wpis razem z oczekiwaną liczbą wierszy. Skrypt wczytuje zestawy
danych wprost z docs/assets/js/sql-trener.js (to on jest źródłem prawdy, nie
docs/pliki/obuwie.sql — tamten jest w składni MariaDB) i wykonuje zapytania
na SQLite.

Po co: pół ćwiczeń w działach III, IV i VI zwracało na tej bazie pustą tabelę,
bo treść polecenia mówiła o danych, których w bazie nie ma. Ten skrypt wyłapuje
taki rozjazd, zanim zobaczy go uczeń.

Uruchomienie:   python narzedzia/sprawdz_zapytania.py
Kod wyjścia 1 oznacza, że któreś zapytanie nie działa albo zwraca inną liczbę
wierszy, niż zapowiada materiał.
"""
import pathlib
import re
import sqlite3
import sys

KORZEN = pathlib.Path(__file__).resolve().parent.parent
TRENER = KORZEN / "docs" / "assets" / "js" / "sql-trener.js"


def zestawy():
    """Wyjmuje zawartość obiektu BAZY z sql-trener.js."""
    js = TRENER.read_text(encoding="utf-8")
    out = {}
    for nazwa in re.findall(r"^\s*(\w+):\s*\[", js, re.M):
        blok = re.search(nazwa + r":\s*\[(.*?)\]\.join\(\"\\n\"\)", js, re.S)
        if not blok:
            continue
        linie = re.findall(r'"((?:[^"\\]|\\.)*)"', blok.group(1))
        out[nazwa] = "\n".join(
            l.encode().decode("unicode_escape").encode("latin1").decode("utf-8")
            for l in linie
        )
    return out


BAZY = zestawy()


# (baza, etykieta, zapytanie, oczekiwana liczba wierszy albo None = tylko wykonaj)
PRZYPADKI = [
    # ── dział III · select-podstawy.md ──────────────────────────────────────
    ("obuwie", "III/select · start", "SELECT nazwa, cena FROM produkt;", 10),
    ("obuwie", "III/select · ćw.1", "SELECT nazwa, wysokosc FROM produkt;", 10),
    ("obuwie", "III/select · ćw.2",
     'SELECT nazwa AS "Model", cena AS "Cena (zł)" FROM produkt;', 10),
    ("obuwie", "III/select · ćw.3", "SELECT nazwa FROM kategoria;", 4),

    # ── dział III · filtrowanie-warunki.md ──────────────────────────────────
    ("obuwie", "III/where · start",
     "SELECT nazwa, cena, kolor FROM produkt WHERE cena < 300;", 5),
    ("obuwie", "III/where · ćw.1 (poprawione: 400 zamiast 150)",
     "SELECT nazwa FROM produkt WHERE cena < 400 AND kolor = 'czarny';", 2),
    ("obuwie", "III/where · ćw.2 (poprawione: Trzewik/Kozak)",
     "SELECT * FROM produkt WHERE nazwa LIKE 'Trzewik%' OR nazwa LIKE 'Kozak%';", 5),
    ("obuwie", "III/where · ćw.3",
     "SELECT nazwa, cena FROM produkt WHERE cena BETWEEN 120 AND 300;", 5),
    ("obuwie", "III/where · ćw.4 (poprawione: czarny/szary/biały)",
     "SELECT nazwa FROM produkt WHERE kolor IN ('czarny', 'szary', 'biały');", 5),
    ("obuwie", "III/where · przykład w sekcji 3",
     "SELECT nazwa FROM produkt WHERE nazwa LIKE 'Trzewik%';", 3),
    ("obuwie", "III/where · przykład AND w sekcji 2",
     "SELECT nazwa FROM produkt WHERE cena < 300 AND kolor = 'niebieski';", 1),

    # ── dział III · sortowanie-limit.md ─────────────────────────────────────
    ("obuwie", "III/order · start",
     "SELECT nazwa, cena FROM produkt ORDER BY cena DESC LIMIT 3;", 3),
    ("obuwie", "III/order · ćw.1", "SELECT nazwa FROM produkt ORDER BY nazwa ASC;", 10),
    ("obuwie", "III/order · ćw.2",
     "SELECT nazwa, cena FROM produkt ORDER BY cena ASC LIMIT 5;", 5),
    ("obuwie", "III/order · ćw.3",
     "SELECT nazwa, kolor, cena FROM produkt ORDER BY kolor ASC, cena DESC;", 10),

    # ── dział III · obsluga-null.md (baza braki) ────────────────────────────
    ("braki", "III/null · start (pułapka = NULL)",
     "SELECT nazwa FROM produkt WHERE kolor = NULL;", 0),
    ("braki", "III/null · ćw.1",
     "SELECT nazwa FROM produkt WHERE wysokosc IS NULL;", 3),
    ("braki", "III/null · ćw.2",
     "SELECT * FROM produkt WHERE cena IS NOT NULL AND kolor IS NOT NULL;", 7),
    ("braki", "III/null · ćw.3a (cena = 0)",
     "SELECT nazwa FROM produkt WHERE cena = 0;", 1),
    ("braki", "III/null · ćw.3b (cena IS NULL)",
     "SELECT nazwa FROM produkt WHERE cena IS NULL;", 2),
    ("braki", "III/null · pominięcie NULL przy <",
     "SELECT nazwa FROM produkt WHERE cena < 500;", 8),
    ("braki", "III/null · COUNT(*) kontra COUNT(cena)",
     "SELECT COUNT(*), COUNT(cena), COUNT(kolor) FROM produkt;", 1),

    # ── dział IV · zlaczenia-zewnetrzne.md (baza braki) ─────────────────────
    ("braki", "IV/left · start",
     "SELECT k.nazwa, p.nazwa FROM kategoria k "
     "LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;", 10),
    ("braki", "IV/left · INNER dla porównania",
     "SELECT k.nazwa, p.nazwa FROM kategoria k "
     "JOIN produkt p ON k.id_kategorii = p.id_kategorii;", 9),
    ("braki", "IV/left · ćw.1",
     "SELECT k.nazwa, p.nazwa FROM kategoria k "
     "LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii;", 10),
    ("braki", "IV/left · ćw.2 (puste kategorie)",
     "SELECT k.nazwa FROM kategoria k "
     "LEFT JOIN produkt p ON k.id_kategorii = p.id_kategorii "
     "WHERE p.id_produktu IS NULL;", 1),
    ("braki", "IV/left · ćw.3 (produkty bez kategorii)",
     "SELECT p.nazwa, k.nazwa FROM produkt p "
     "LEFT JOIN kategoria k ON p.id_kategorii = k.id_kategorii;", 11),

    # ── dział IV · agregacja-groupby.md ─────────────────────────────────────
    ("obuwie", "IV/agregacja · start",
     "SELECT COUNT(*), MIN(cena), MAX(cena), AVG(cena) FROM produkt;", 1),
    ("obuwie", "IV/agregacja · ćw.1a", "SELECT COUNT(*) FROM produkt;", 1),
    ("obuwie", "IV/agregacja · ćw.1b", "SELECT MIN(cena) FROM produkt;", 1),
    ("obuwie", "IV/agregacja · ćw.1c", "SELECT AVG(cena) FROM produkt;", 1),
    ("obuwie", "IV/agregacja · ćw.2",
     "SELECT id_kategorii, COUNT(*) FROM produkt GROUP BY id_kategorii;", 4),
    ("obuwie", "IV/agregacja · ćw.3",
     "SELECT k.nazwa, SUM(p.cena) FROM kategoria k "
     "JOIN produkt p ON k.id_kategorii = p.id_kategorii GROUP BY k.nazwa;", 4),

    # ── dział IV · having-where.md ──────────────────────────────────────────
    ("obuwie", "IV/having · start",
     "SELECT id_kategorii, COUNT(*), AVG(cena) FROM produkt GROUP BY id_kategorii;", 4),
    ("obuwie", "IV/having · ćw.1",
     "SELECT id_kategorii, AVG(cena) FROM produkt "
     "GROUP BY id_kategorii HAVING AVG(cena) > 200;", 3),
    ("obuwie", "IV/having · ćw.2 (poprawione: 3 zamiast 5)",
     "SELECT k.nazwa, COUNT(*) FROM kategoria k "
     "JOIN produkt p ON k.id_kategorii = p.id_kategorii "
     "GROUP BY k.nazwa HAVING COUNT(*) >= 3;", 2),
    ("obuwie", "IV/having · ćw.3 (poprawione: tkanina zamiast czarny)",
     "SELECT id_kategorii, COUNT(*) FROM produkt "
     "WHERE material = 'tkanina' GROUP BY id_kategorii HAVING COUNT(*) > 1;", 1),
    ("obuwie", "IV/having · stary wariant ćw.2 (ma być pusty)",
     "SELECT k.nazwa, COUNT(*) FROM kategoria k "
     "JOIN produkt p ON k.id_kategorii = p.id_kategorii "
     "GROUP BY k.nazwa HAVING COUNT(*) >= 5;", 0),
    ("obuwie", "IV/having · stary wariant ćw.3 (ma być pusty)",
     "SELECT id_kategorii, COUNT(*) FROM produkt "
     "WHERE kolor = 'czarny' GROUP BY id_kategorii HAVING COUNT(*) > 1;", 0),

    # ── dział IV · podzapytania.md ──────────────────────────────────────────
    ("obuwie", "IV/podzapytania · start",
     "SELECT nazwa, cena FROM produkt "
     "WHERE cena > (SELECT AVG(cena) FROM produkt);", 5),
    ("obuwie", "IV/podzapytania · ćw.1",
     "SELECT nazwa FROM produkt WHERE cena < (SELECT AVG(cena) FROM produkt);", 5),
    ("obuwie", "IV/podzapytania · ćw.2",
     "SELECT nazwa FROM produkt WHERE id_kategorii IN "
     "(SELECT id_kategorii FROM kategoria WHERE nazwa LIKE 'S%');", 5),
    ("obuwie", "IV/podzapytania · ćw.3",
     "SELECT * FROM produkt WHERE cena = (SELECT MAX(cena) FROM produkt);", 1),

    # ── dział VI · insert.md ────────────────────────────────────────────────
    ("obuwie", "VI/insert · start",
     "INSERT INTO kategoria (nazwa) VALUES ('Kapcie'); "
     "SELECT * FROM kategoria;", 5),
    ("obuwie", "VI/insert · ćw.1 (poprawione: Kapcie zamiast Sandały)",
     "INSERT INTO kategoria (nazwa) VALUES ('Kapcie'); "
     "INSERT INTO kategoria (nazwa) VALUES ('Trampki'); "
     "INSERT INTO kategoria (nazwa) VALUES ('Buty robocze'); "
     "SELECT * FROM kategoria;", 7),
    ("obuwie", "VI/insert · ćw.2",
     "INSERT INTO produkt (nazwa, cena, kolor, id_kategorii) "
     "VALUES ('Nike Zoom', 450.00, 'pomarańczowy', 1); "
     "SELECT nazwa, cena, kolor FROM produkt WHERE nazwa = 'Nike Zoom';", 1),

    # ── dział VI · update-delete.md ─────────────────────────────────────────
    ("obuwie", "VI/update · start",
     "UPDATE produkt SET cena = cena + 20 WHERE id_kategorii = 2; "
     "SELECT nazwa, cena FROM produkt WHERE id_kategorii = 2;", 2),
    ("obuwie", "VI/update · ćw.1",
     "UPDATE produkt SET cena = cena + 20 WHERE id_kategorii = 2; "
     "SELECT nazwa, cena FROM produkt WHERE id_kategorii = 2;", 2),
    ("obuwie", "VI/update · ćw.2 (poprawione: produkt zamiast klient)",
     "UPDATE produkt SET nazwa = 'Biegacz 250' WHERE id_produktu = 7; "
     "SELECT id_produktu, nazwa FROM produkt WHERE id_produktu = 7;", 1),
    ("obuwie", "VI/update · ćw.3 (poprawione: 400 zamiast 1000)",
     "DELETE FROM produkt WHERE cena > 400; SELECT nazwa, cena FROM produkt;", 8),
    ("obuwie", "VI/update · stary wariant ćw.3 (nic nie usuwa)",
     "DELETE FROM produkt WHERE cena > 1000; SELECT nazwa, cena FROM produkt;", 10),
]


def main():
    bledy = 0
    for baza, etykieta, zapytanie, oczekiwane in PRZYPADKI:
        db = sqlite3.connect(":memory:")
        db.executescript(BAZY[baza])
        # Wielopolecenowe wzorce wykonujemy tak jak trener: cały skrypt po kolei,
        # a liczymy wynik OSTATNIEGO polecenia, które zwróciło wiersze.
        wiersze = []
        try:
            kur = db.cursor()
            for polecenie in [p.strip() for p in zapytanie.split(";") if p.strip()]:
                kur.execute(polecenie)
                pobrane = kur.fetchall()
                if kur.description is not None:
                    wiersze = pobrane
        except Exception as e:                      # noqa: BLE001
            print("✗ %-52s BŁĄD: %s" % (etykieta, e))
            bledy += 1
            continue
        finally:
            db.close()
        n = len(wiersze)
        if oczekiwane is not None and n != oczekiwane:
            print("✗ %-52s %d wierszy, oczekiwano %d" % (etykieta, n, oczekiwane))
            for w in wiersze[:12]:
                print("      ", w)
            bledy += 1
        else:
            podglad = "; ".join(str(w) for w in wiersze[:2])
            print("✓ %-52s %2d w.  %s" % (etykieta, n, podglad[:60]))
    print("\nBłędnych przypadków: %d z %d" % (bledy, len(PRZYPADKI)))
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
