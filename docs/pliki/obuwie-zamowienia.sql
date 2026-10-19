-- Baza ćwiczeniowa „obuwie” z zamówieniami — serwis lsbd, PCEiKZ Szczucin.
-- Karta pracy działu IV: te same kategorie i produkty co w obuwie.sql
-- oraz klienci, zamówienia i pozycje zamówień (pięć tabel).
-- Import: phpMyAdmin → Import → wskaż ten plik.
--
-- Plik NIE tworzy bazy. Załóż ją wcześniej ręcznie (np. sklep), z kodowaniem
-- utf8mb4_general_ci, i dopiero wtedy zaimportuj tę zawartość.

SET NAMES utf8mb4;

CREATE TABLE kategoria (
  id_kategorii INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nazwa        VARCHAR(60) NOT NULL
);
CREATE TABLE produkt (
  id_produktu  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nazwa        VARCHAR(80) NOT NULL,
  cena         DECIMAL(8,2) NOT NULL,
  kolor        VARCHAR(30),
  material     VARCHAR(40),
  wysokosc     INT,
  id_kategorii INT,
  FOREIGN KEY (id_kategorii) REFERENCES kategoria(id_kategorii)
);
CREATE TABLE klient (
  id_klienta   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  imie         VARCHAR(40) NOT NULL,
  nazwisko     VARCHAR(60) NOT NULL,
  miasto       VARCHAR(60)
);
CREATE TABLE zamowienie (
  id_zamowienia   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_klienta      INT,
  data_zamowienia DATE NOT NULL,
  FOREIGN KEY (id_klienta) REFERENCES klient(id_klienta)
);
CREATE TABLE pozycja (
  id_pozycji    INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_zamowienia INT,
  id_produktu   INT,
  ilosc         INT NOT NULL,
  FOREIGN KEY (id_zamowienia) REFERENCES zamowienie(id_zamowienia),
  FOREIGN KEY (id_produktu) REFERENCES produkt(id_produktu)
);
INSERT INTO kategoria VALUES
 (1,'Trzewiki'),
 (2,'Kozaki'),
 (3,'Sandały'),
 (4,'Sportowe');
INSERT INTO produkt VALUES
 (1,'Trzewik Alpin',329.00,'czarny','skóra naturalna',18,1),
 (2,'Trzewik Roboczy',259.50,'brązowy','skóra naturalna',15,1),
 (3,'Kozak Klasyk',449.00,'czarny','skóra naturalna',34,2),
 (4,'Kozak Zimowy',519.99,'bordowy','skóra naturalna',36,2),
 (5,'Sandał Lato',129.00,'beżowy','skóra ekologiczna',4,3),
 (6,'Sandał Trekking',189.00,'szary','tkanina',6,3),
 (7,'Biegacz 200',279.00,'niebieski','tkanina',9,4),
 (8,'Biegacz 300',349.00,'czarny','tkanina',11,4),
 (9,'Halówka Pro',219.00,'biały','skóra ekologiczna',8,4),
 (10,'Trzewik Turysta',399.00,'zielony','tkanina',22,1);
INSERT INTO klient VALUES
 (1,'Anna','Nowak','Tarnów'),
 (2,'Piotr','Wiśniewski','Kraków'),
 (3,'Katarzyna','Lis','Szczucin'),
 (4,'Marek','Zając','Tarnów'),
 (5,'Ewa','Kowalczyk','Dąbrowa Tarnowska'),
 (6,'Tomasz','Wójcik','Kraków');
INSERT INTO zamowienie VALUES
 (1,1,'2026-09-02'),
 (2,2,'2026-09-05'),
 (3,1,'2026-09-14'),
 (4,3,'2026-09-20'),
 (5,4,'2026-10-01'),
 (6,2,'2026-10-03'),
 (7,1,'2026-10-08');
INSERT INTO pozycja VALUES
 (1,1,1,1),
 (2,1,5,2),
 (3,2,7,1),
 (4,2,9,1),
 (5,3,3,1),
 (6,4,9,2),
 (7,4,6,1),
 (8,5,4,1),
 (9,5,2,1),
 (10,6,7,2),
 (11,7,10,1),
 (12,7,5,1);
