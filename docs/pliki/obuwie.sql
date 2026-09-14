-- Baza ćwiczeniowa „obuwie" — serwis lsbd, PCEiKZ Szczucin.
-- Układ wzorowany na arkuszach egzaminacyjnych INF.03: dwie tabele
-- połączone kluczem obcym. Import: phpMyAdmin → Import → wskaż ten plik.
--
-- Plik NIE tworzy bazy. Załóż ją wcześniej ręcznie, z kodowaniem
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
INSERT INTO kategoria VALUES
 (1,'Trzewiki'),(2,'Kozaki'),(3,'Sandały'),(4,'Sportowe');
INSERT INTO produkt VALUES
 (1,'Trzewik Alpin',    329.00,'czarny','skóra naturalna',18,1),
 (2,'Trzewik Roboczy',  259.50,'brązowy','skóra naturalna',15,1),
 (3,'Kozak Klasyk',     449.00,'czarny','skóra naturalna',34,2),
 (4,'Kozak Zimowy',     519.99,'bordowy','skóra naturalna',36,2),
 (5,'Sandał Lato',      129.00,'beżowy','skóra ekologiczna',4,3),
 (6,'Sandał Trekking',  189.00,'szary','tkanina',6,3),
 (7,'Biegacz 200',      279.00,'niebieski','tkanina',9,4),
 (8,'Biegacz 300',      349.00,'czarny','tkanina',11,4),
 (9,'Halówka Pro',      219.00,'biały','skóra ekologiczna',8,4),
 (10,'Trzewik Turysta', 399.00,'zielony','tkanina',22,1);
