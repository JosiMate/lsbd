#!/usr/bin/env python3
"""Kontrola spójności serwisu — to, czego nie wyłapie `mkdocs build --strict`.

    python narzedzia/sprawdz.py

Uruchamiaj przed commitem. Kod wyjścia 1, gdy coś jest nie tak, więc skrypt
nadaje się też do wpięcia w workflow przed krokiem budowania.

Sprawdza cztery rzeczy, na których serwis już się potknął:

1. Karty pracy — czy każde `data-karta="…"` ma swój plik JSON. Brak pliku nie
   psuje budowania: uczeń dostaje na stronie komunikat „Nie udało się wczytać
   definicji karty".
2. Budowa kart — `karta.js` czyta wiersz tabeli jako trójkę
   [identyfikator, etykieta, podpowiedź] i zapisuje odpowiedzi po
   identyfikatorze. Wiersz z pustym identyfikatorem GUBI to, co uczeń wpisał.
3. Nawigacja — czy każdy katalog działu ma `.nav.yml` i czy plik wymienia
   wszystkie strony z tego katalogu. Brak pliku daje w lewej kolumnie nazwę
   z katalogu („Dzial 7") i kolejność alfabetyczną zamiast programowej.
4. Spis tematów na stronie głównej — czy nie ma wierszy opisanych jako
   „w przygotowaniu", choć strona już istnieje. Wtedy materiał jest gotowy,
   ale uczeń nie ma do niego przejścia.
"""
import json
import pathlib
import re
import sys

KORZEN = pathlib.Path(__file__).resolve().parent.parent
DOCS = KORZEN / "docs"
KARTY = DOCS / "assets" / "karty"
POLA = {"tabela", "tekst", "zrzut", "wybor"}
PRZEDROSTEK = "lsbd-"          # klucz w localStorage musi nieść nazwę serwisu

bledy = []
uwagi = []


def strony():
    return sorted(p for p in DOCS.rglob("*.md"))


# ── 1 i 2. karty pracy ──────────────────────────────────────────────────
def sprawdz_karty():
    wolane = {}
    for p in strony():
        for nazwa in re.findall(r'data-karta="([^"]+)"', p.read_text(encoding="utf-8")):
            wolane.setdefault(nazwa, []).append(p.relative_to(DOCS))
    pliki = {p.stem: p for p in KARTY.glob("*.json")}

    for nazwa, gdzie in sorted(wolane.items()):
        if nazwa not in pliki:
            bledy.append(f"brak pliku assets/karty/{nazwa}.json — woła go "
                         + ", ".join(str(g) for g in gdzie))
    for nazwa in sorted(set(pliki) - set(wolane)):
        uwagi.append(f"assets/karty/{nazwa}.json nie jest przez nic wołany")

    identyfikatory, sufiksy = {}, {}
    for nazwa, p in sorted(pliki.items()):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            bledy.append(f"{p.name}: niepoprawny JSON — {e}")
            continue

        if d.get("id") != f"{PRZEDROSTEK}{nazwa}":
            bledy.append(f"{p.name}: identyfikator {d.get('id')!r}, oczekiwano "
                         f"{PRZEDROSTEK + nazwa!r} — bez tego karty z różnych "
                         f"serwisów nadpisują się w localStorage")
        identyfikatory.setdefault(d.get("id"), []).append(p.name)
        sufiksy.setdefault(d.get("sufiks"), []).append(p.name)

        numery = [z.get("nr") for z in d.get("zadania", [])]
        if numery != list(range(1, len(numery) + 1)):
            bledy.append(f"{p.name}: numeracja zadań {numery}, oczekiwano ciągłej od 1")

        widziane = set()
        for z in d.get("zadania", []):
            for pole in z.get("pola", []):
                typ = pole.get("typ")
                if typ not in POLA:
                    bledy.append(f"{p.name}: nieznany typ pola {typ!r}")
                    continue
                if typ == "tabela":
                    klucze = []
                    for wiersz in pole.get("wiersze", []):
                        if len(wiersz) != 3:
                            bledy.append(f"{p.name}, zadanie {z['nr']}: wiersz tabeli "
                                         f"ma {len(wiersz)} elementów zamiast trzech "
                                         f"[identyfikator, etykieta, podpowiedź]")
                            continue
                        if not str(wiersz[0]).strip():
                            bledy.append(f"{p.name}, zadanie {z['nr']}: wiersz tabeli "
                                         f"bez identyfikatora ({wiersz[1]!r}) — "
                                         f"odpowiedź ucznia nie zostanie zapisana")
                            continue
                        klucze.append(wiersz[0])
                else:
                    if not str(pole.get("id", "")).strip():
                        bledy.append(f"{p.name}, zadanie {z['nr']}: pole {typ} "
                                     f"bez identyfikatora")
                        continue
                    klucze = [pole["id"]]
                for k in klucze:
                    if k in widziane:
                        bledy.append(f"{p.name}: identyfikator pola {k!r} użyty dwa razy")
                    widziane.add(k)

    for wartosc, gdzie in identyfikatory.items():
        if len(gdzie) > 1:
            bledy.append(f"identyfikator karty {wartosc!r} w kilku plikach: {gdzie}")
    for wartosc, gdzie in sufiksy.items():
        if len(gdzie) > 1:
            bledy.append(f"sufiks {wartosc!r} w kilku plikach: {gdzie} — pobrane "
                         f"dokumenty Worda miałyby tę samą nazwę")
    return len(pliki)


# ── 3. nawigacja ────────────────────────────────────────────────────────
def sprawdz_nawigacje():
    katalogi = sorted(k for k in DOCS.iterdir()
                      if k.is_dir() and list(k.glob("*.md")))
    for k in katalogi:
        nav = k / ".nav.yml"
        if not nav.exists():
            bledy.append(f"{k.name}: brak .nav.yml — w lewej kolumnie wyjdzie nazwa "
                         f"katalogu i kolejność alfabetyczna")
            continue
        tresc = nav.read_text(encoding="utf-8")
        if "title:" not in tresc:
            bledy.append(f"{k.name}/.nav.yml: brak klucza title")
        wymienione = set(re.findall(r":\s*(\S+\.md)\s*$", tresc, re.M))
        for md in sorted(k.glob("*.md")):
            if md.name not in wymienione:
                uwagi.append(f"{k.name}/{md.name} nie jest wymieniony w .nav.yml — "
                             f"trafi na koniec działu z tytułem z nagłówka")
    return len(katalogi)


# ── 4. spis tematów na stronie głównej ──────────────────────────────────
def sprawdz_spis():
    tresc = (DOCS / "index.md").read_text(encoding="utf-8")
    if "spis-tematow" not in tresc:
        return 0
    blok = tresc.split("spis-tematow", 1)[1].split("</div>", 1)[0]
    nagl = None
    ile = 0
    for linia in blok.splitlines():
        m = re.match(r"###\s+(.*)", linia)
        if m:
            nagl = m.group(1).strip()
            continue
        if not linia.startswith("|") or "w przygotowaniu" not in linia:
            continue
        ile += 1
        tytul = re.sub(r"[*`]", "", linia.split("|")[1]).strip()
        # czy istnieje strona o zbliżonej nazwie w katalogu tego działu?
        for md in DOCS.rglob("*.md"):
            if md.name == "index.md":
                continue
            h1 = ""
            for w in md.read_text(encoding="utf-8").splitlines():
                if w.startswith("# "):
                    h1 = w[2:].strip()
                    break
            if h1 and h1.lower() == tytul.lower():
                bledy.append(f"spis tematów: „{tytul}” ma status „w przygotowaniu”, "
                             f"ale strona {md.relative_to(DOCS)} istnieje — nie ma do niej "
                             f"przejścia ze strony głównej")
                break
    return ile


# ── wynik ───────────────────────────────────────────────────────────────
ile_kart = sprawdz_karty()
ile_dzialow = sprawdz_nawigacje()
ile_zapowiedzi = sprawdz_spis()

print(f"Sprawdzono: {ile_kart} kart pracy, {ile_dzialow} katalogów z materiałami, "
      f"{ile_zapowiedzi} zapowiedzianych tematów w spisie.")

if uwagi:
    print("\nDo rozważenia:")
    for u in uwagi:
        print(f"  · {u}")

if bledy:
    print(f"\nBłędy ({len(bledy)}):")
    for b in bledy:
        print(f"  ✗ {b}")
    sys.exit(1)

print("\nBez zastrzeżeń.")
