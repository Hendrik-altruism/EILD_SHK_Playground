BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Durchlauf" (
	"Durchlauf_ID"	INTEGER,
	"Student"	INTEGER,
	"Aufgabe"	INTEGER,
	"Punktzahl"	INTEGER,
	FOREIGN KEY("Aufgabe") REFERENCES "Aufgabe"("Aufgabe_Nr") ON DELETE SET NULL,
	FOREIGN KEY("Student") REFERENCES "Student"("Student_ID") ON DELETE SET NULL,
	PRIMARY KEY("Durchlauf_ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Student" (
	"Student_ID"	INTEGER,
	"Vorname"	TEXT,
	"Nachname"	TEXT,
	PRIMARY KEY("Student_ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Teilaufgabe_BeziehungsTypen" (
	"Teilaufgabe_ID"	INTEGER,
	"Loesung"	INTEGER,
	"Aufgabe"	INTEGER,
	FOREIGN KEY("Aufgabe") REFERENCES "Aufgabe"("Aufgabe_Nr") ON DELETE SET NULL,
	PRIMARY KEY("Teilaufgabe_ID")
);
CREATE TABLE IF NOT EXISTS "Aufgabe" (
	"Aufgabe_Nr"	INTEGER,
	"Anzahl_Teilaufgaben"	INTEGER,
	PRIMARY KEY("Aufgabe_Nr")
);
INSERT INTO "Durchlauf" VALUES (1,1,1,2);
INSERT INTO "Durchlauf" VALUES (2,1,1,2);
INSERT INTO "Student" VALUES (1,'Hans','Peter');
INSERT INTO "Student" VALUES (2,'Wolfgang','Spät');
INSERT INTO "Student" VALUES (3,'Patrik','Lustig');
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (1,2,1);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (2,4,1);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (3,14,2);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (4,9,2);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (5,2,1);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (6,13,2);
INSERT INTO "Teilaufgabe_BeziehungsTypen" VALUES (7,3,2);
INSERT INTO "Aufgabe" VALUES (1,2);
INSERT INTO "Aufgabe" VALUES (2,5);
COMMIT;
