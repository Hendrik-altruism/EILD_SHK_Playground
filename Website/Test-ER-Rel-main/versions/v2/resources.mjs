/**
 * @overview Data-based resources of <i>ccmjs</i>-based web component for ER-REL Trainer.
 * @author André Kless <andre.kless@web.de> 2022
 * @license The MIT License (MIT)
 */

/**
 * Used app configuration of <i>ccmjs</i>-based web component for ER-REL Trainer.
 * @module AppConfig
 */

/**
 * Phrases data.
 * @type {phrase_data[]}
 */
export const phrases = [
  {
    "text": "Im Krankenhaus gibt es zu jedem Patienten eine Patientenakte.",
    "entities": [ "Patient", "Patientenakte" ],
    "relation": "hat",
    "solution": [ "1", "1" ],
    "comments": [
      "Zu jedem Patienten gibt es genau eine Patientenakte.",
      "Zu jeder Patientenakte gibt es genau einen Patienten."
    ]
  },
  {
    "text": "Im Chemielabor werden die Atomkerne von Atomen untersucht.",
    "entities": [ "Atom", "Atomkern" ],
    "relation": "hat",
    "solution": [ "1", "1" ],
    "comments": [
      "Jedes Atom hat genau einen Atomkern.",
      "Jeder Atomkern gehört zu genau einem Atom."
    ]
  },
  {
    "text": "Auf einer Konferenz sollen die Teilnehmer die Möglichkeit haben beim Einlass ein Namensschild zu bekommen.",
    "entities": [ "Namensschild", "Teilnehmer" ],
    "relation": "gehört zu",
    "solution": [ "1", "c" ],
    "comments": [
      "Jedes Namensschild gehört zu genau einem Teilnehmer.",
      "Ein Teilnehmer hat ein oder kein Namensschild."
    ]
  },
  {
    "text": "Bei einer Verkehrssimulation soll ein Fahrzeug auch einen Anhänger haben können.",
    "entities": [ "Anhänger", "Fahrzeug" ],
    "relation": "gehört zu",
    "solution": [ "1", "c" ],
    "comments": [
      "Ein Anhänger gehört zu genau einem Fahrzeug.",
      "Ein Fahrzeug hat einen oder keinen Anhänger."
    ]
  },
  {
    "text": "Für eine Stadtverwaltung soll es möglich sein auch eventuelle Bahnhöfe einer Stadt zu erfassen.",
    "entities": [ "Bahnhof", "Stadt" ],
    "relation": "gehört zu",
    "solution": [ "1", "cn" ],
    "comments": [
      "Ein Bahnhof gehört zu genau einer Stadt.",
      "Eine Stadt hat keinen, einen oder mehrere Bahnhöfe."
    ]
  },
  {
    "text": "Ein Hausbesitzer möchte erfassen, wer gerade in seinen beiden Häusern wohnt.",
    "entities": [ "Bewohner", "Haus" ],
    "relation": "wohnt in",
    "solution": [ "1", "cn" ],
    "comments": [
      "Ein Bewohner wohnt in genau einem Haus.",
      "Ein Haus hat keinen, einen oder mehrere Bewohner."
    ]
  },
  {
    "text": "Das Vereinswesen in Deutschland möchte eine Liste aller Vereine verwalten. Zu jedem Verein soll auch eine Kontaktperson eingetragen sein, wobei manche Vereine die gleiche Kontaktperson angeben.",
    "entities": [ "Verein", "Kontaktperson" ],
    "relation": "hat",
    "solution": [ "1", "n" ],
    "comments": [
      "Ein Verein hat genau eine Kontaktperson.",
      "Eine eingetragene Kontaktperson gehört zu mindestens einem Verein."
    ]
  },
  {
    "text": "Ein Radiosender für klassische Musik möchte eine Datensammlung von Musikstücken aufbauen, wobei für jedes Musikstück auch Hintergrundinformationen zum Komponisten abrufbar sein sollen.",
    "entities": [ "Musikstück", "Komponist" ],
    "relation": "hat",
    "solution": [ "1", "n" ],
    "comments": [
      "Ein Musikstück hat genau einen Komponisten.",
      "Zu jedem Komponisten in der Datensammlung gibt es mindestens ein Musikstück."
    ]
  },
  {
    "text": "Eine Mensa möchte ihren Bestand an Töpfen (inkl. Pfannen) nachhalten, um schneller festzustellen, ob etwas fehlt und nachgekauft werden muss. Die Deckel sollen separat erfasst werden, da diese auch einzeln nachbestellbar sind. Zu jedem Topf gibt es einen Deckel, es gibt allerdings auch Töpfe ohne Deckel (z.B. Wok).",
    "entities": [ "Topf", "Deckel" ],
    "relation": "hat",
    "solution": [ "c", "1" ],
    "comments": [
      "Ein Topf hat einen oder keinen Deckel.",
      "Ein Deckel gehört zu genau einem Topf."
    ]
  },
  {
    "text": "Bei der Bauplanung eines Mehrfamilienhauses soll für einen entsprechenden Aufpreis auch ein Fahrstuhl möglich sein.",
    "entities": [ "Haus", "Aufzug" ],
    "relation": "hat",
    "solution": [ "c", "1" ],
    "comments": [
      "Ein Haus hat einen oder keinen Aufzug.",
      "Ein Aufzug gehört zu genau einem Haus."
    ]
  },
  {
    "text": "Bei der Genforschung werden Chromosome und deren spezifische Merkmale untersucht, wobei sich während der Studie ein X-Chromosom mit einem X- oder Y-Chromosom verbinden kann und ein Y-Chromosom nur mit einem X-Chromosom.",
    "entities": [ "X-Chromosom", "Y-Chromosom" ],
    "relation": "verbunden",
    "solution": [ "c", "c" ],
    "comments": [
      "Ein X-Chromosom ist mit einem oder keinem Y-Chromosom verbunden.",
      "Ein Y-Chromosom ist mit einem oder keinem X-Chromosom verbunden."
    ]
  },
  {
    "text": "Für eine Fortpflanzungsstudie soll verwaltet werden, ob und wenn ja mit welchem Männchen ein Weibchen aktuell zusammen ist. Männchen und Weibchen der untersuchten Tierart haben nie mehrere Partner gleichzeitig.",
    "entities": [ "Weibchen", "Männchen" ],
    "relation": "ist zusammen mit",
    "solution": [ "c", "c" ],
    "comments": [
      "Ein Weibchen ist entweder mit einem oder keinem Männchen zusammen sein.",
      "Ein Männchen ist entweder mit einem oder keinem Weibchen zusammen sein."
    ]
  },
  {
    "text": "Bei einem Winzer gehört eine Weinflasche zu einer Weinsorte oder ist selbstgebraut.",
    "entities": [ "Weinflasche", "Weinsorte" ],
    "relation": "gehört zu",
    "solution": [ "c", "cn" ],
    "comments": [
      "Eine Weinflasche gehört zu genau einer oder keiner Weinsorte.",
      "Von einer Weinsorte hat ein Winzer entweder keine, eine oder mehrere Weinflaschen."
    ]
  },
  {
    "text": "Bei der Insektenforschung soll festgehalten werden, ob die Insekten im Labor Flügel haben oder nicht.",
    "entities": [ "Insekt", "Flügel" ],
    "relation": "hat",
    "solution": [ "c", "cn" ],
    "comments": [
      "Ein Insekt hat entweder Flügel oder keine Flügel.",
      "Im Labor gibt es kein, ein oder mehrere Insekten mit Flügeln."
    ]
  },
  {
    "text": "Der deutsche Staat möchte transparent machen, welcher Bürger welcher Partei angehört.",
    "entities": [ "Bürger", "Partei" ],
    "relation": "ist Mitglied in",
    "solution": [ "c", "n" ],
    "comments": [
      "Ein Bürger kann nur Mitglied in maximal einer Partei gleichzeitig sein.",
      "Eine Partei hat eine Mindestzahl an Mitgliedern."
    ]
  },
  {
    "text": "Bei einer Tierbeobachtung soll erfasst werden, welche der Tiere sich zu einer Herde zusammenschließen.",
    "entities": [ "Tier", "Herde" ],
    "relation": "gehört zu",
    "solution": [ "c", "n" ],
    "comments": [
      "Ein Tier gehört entweder zu einer oder keiner Herde.",
      "Eine Herde besteht aus mindestens einem Tier."
    ]
  },
  {
    "text": "Bei einer Weltraumsimulation kann ein Planet Monde haben, die ihn umkreisen.",
    "entities": [ "Planet", "Mond" ],
    "relation": "hat",
    "solution": [ "cn", "1" ],
    "comments": [
      "Ein Planet hat keinen, einen oder mehrere Monde.",
      "Ein Mond gehört immer zu genau einem Planeten."
    ]
  },
  {
    "text": "Der öffentliche Dienst möchte seine aktuell an Firmen vergebenen Aufträge verwalten.",
    "entities": [ "Firma", "Auftrag" ],
    "relation": "hat",
    "solution": [ "cn", "1" ],
    "comments": [
      "Eine Firma hat aktuell keinen, einen oder mehrere Aufträge.",
      "Ein vergebener Auftrag gehört zu genau einer Firma."
    ]
  },
  {
    "text": "In einem Point-and-Click-Adventure soll die Spielfigur ein Inventar für gesammelte Gegenstände haben.",
    "entities": [ "Inventar", "Gegenstand" ],
    "relation": "enthält",
    "solution": [ "cn", "c" ],
    "comments": [
      "Im Inventar sind kein, ein oder mehrere Gegenstände enthalten.",
      "Ein Gegenstand ist im Inventar entweder enthalten oder nicht."
    ]
  },
  {
    "text": "In einem Projektmanagement-Tool sollen Aufgaben einem Mitarbeiter hauptverantwortlich zugewiesen werden können.",
    "entities": [ "Mitarbeiter", "Aufgabe" ],
    "relation": "ist zuständig für",
    "solution": [ "cn", "c" ],
    "comments": [
      "Ein Mitarbeiter ist zuständig für keine, eine, oder mehrere Aufgaben.",
      "Eine Aufgabe kann maximal einem Mitarbeiter hauptverantwortlich zugewiesen sein."
    ]
  },
  {
    "text": "Bei einem Onlinehändler sollen Kunden Produkte bestellen und sich vorab schon Registrieren können.",
    "entities": [ "Kunde", "Produkt" ],
    "relation": "bestellt",
    "solution": [ "cn", "cn" ],
    "comments": [
      "Ein Kunde hat kein, ein oder mehrere Produkte bestellt.",
      "Ein Produkt wurde von keinem, einem oder mehreren Kunden bestellt."
    ]
  },
  {
    "text": "Im neuen Gesundheitszentrum soll am Ende jedes Kurses jeder Teilnehmer eine vorab vorbereitete Teilnahmebescheinigung erhalten.",
    "entities": [ "Teilnehmer", "Bescheinigung" ],
    "relation": "erhalten",
    "solution": [ "cn", "cn" ],
    "comments": [
      "Ein Teilnehmer hat keine, eine oder mehrere Teilnahmebescheinigungen erhalten.",
      "Eine Bescheinigung wurde entweder noch gar nicht, einmal oder mehrmals an Teilnehmer ausgestellt."
    ]
  },
  {
    "text": "In einem Sprachenzentrum soll gespeichert werden, welche der zu unterrichtenden Sprachen von welchen Dozenten gesprochen werden. Jeder Dozent beherrscht mindestens eine der Sprachen, zeitweise kann es aber passieren, dass es zu einer Sprachen keinen Dozenten gibt.",
    "entities": [ "Sprache", "Dozent" ],
    "relation": "gesprochen von",
    "solution": [ "cn", "n" ],
    "comments": [
      "Eine Sprache wird von keinem, einem oder mehreren Dozenten gesprochen.",
      "Ein Dozent beherrscht mindestens eine der zu unterrichtenden Sprachen."
    ]
  },
  {
    "text": "Beim Einwohnermeldeamt muss jeder Bürger seinen Wohnsitz anmelden. Obdachlose werden als 'ohne festen Wohnsitz' geführt und es können neben dem Hauptwohnsitz auch weitere Nebenwohnsitze gemeldet werden.",
    "entities": [ "Bürger", "Wohnsitz" ],
    "relation": "meldet an",
    "solution": [ "cn", "n" ],
    "comments": [
      "Ein Bürger hat keinen, einen oder mehrere Wohnsitze.",
      "Zu einem gemeldeten Wohnsitz gibt es mindestens einen Bürger, der dort wohnhaft ist."
    ]
  },
  {
    "text": "Eine Bibliothek möchte die einzelnen Seiten ausgewählter Bücher digitalisieren.",
    "entities": [ "Buch", "Seite" ],
    "relation": "hat",
    "solution": [ "n", "1" ],
    "comments": [
      "Ein Buch hat mehrere Seiten.",
      "Eine Seite gehört zu genau einem Buch."
    ]
  },
  {
    "text": "Ein Architekt möchte wichtige Eckdaten zu den einzelnen individuellen Räumen seiner Gebäude verwalten.",
    "entities": [ "Gebäude", "Raum" ],
    "relation": "hat",
    "solution": [ "n", "1" ],
    "comments": [
      "Ein Gebäude hat mindestens einen Raum.",
      "Ein Raum gehört zu genau einem Gebäude."
    ]
  },
  {
    "text": "Für ein Forschungsprojekt sollen in einem Landkreis alle Bäume und Wälder erfasst werden.",
    "entities": [ "Wald", "Baum" ],
    "relation": "hat",
    "solution": [ "n", "c" ],
    "comments": [
      "Ein Wald besteht aus mehreren Bäumen.",
      "Ein Baum muss nicht zwingend zu einem Wald gehören und gehört wenn dann immer nur zu genau einem Wald."
    ]
  },
  {
    "text": "Die Deutsche Post möchte bei der teilautomatisierten Briefverarbeitung den Absender eines Briefs erfassen.",
    "entities": [ "Absender", "Brief" ],
    "relation": "notiert auf",
    "solution": [ "n", "c" ],
    "comments": [
      "Ein erfasster Absender ist auf mindestens einem Brief notiert gewesen.",
      "Ein Brief enthält entweder einen oder keinen Absender."
    ]
  },
  {
    "text": "Für ein Restaurant sollen die aktuell verwendeten Rezepte und die vorhandenen Zutaten verwaltet werden.",
    "entities": [ "Rezept", "Zutat" ],
    "relation": "hat",
    "solution": [ "n", "cn" ],
    "comments": [
      "Ein Rezept hat immer mehrere Zutaten.",
      "Eine vorhandene Zutat wird in keinem, einem oder mehreren Rezepten verwendet."
    ]
  },
  {
    "text": "In einem App Store gibt es die Anforderung, dass für jede App mindestens eine von mehreren vordefinierten Kategorien angegeben werden muss.",
    "entities": [ "App", "Kategorie" ],
    "relation": "hat",
    "solution": [ "n", "cn" ],
    "comments": [
      "Für eine App muss mindestens eine Kategorie angegeben werden.",
      "Eine vordefinierte Kategorie wurde für keine, eine oder bereits für mehrere Apps angegeben."
    ]
  },
  {
    "text": "Ein Immobilienmakler möchte für seine verkauften Häuser die Kontaktdaten zu den neuen Eigentümern festhalten.",
    "entities": [ "Haus", "Eigentümer" ],
    "relation": "hat",
    "solution": [ "n", "n" ],
    "comments": [
      "Ein Haus hat mindestens einen Eigentümer.",
      "Ein Eigentümer hat mindestens ein Haus."
    ]
  },
  {
    "text": "Im Rahmen eines chemischen Experiments sollen ausgewählte Atome, ihre Elektronen und deren Bindungsfähigkeit untersucht werden.",
    "entities": [ "Atom", "Elektron" ],
    "relation": "hat",
    "solution": [ "n", "n" ],
    "comments": [
      "Ein Atom hat mindestens ein Elektron.",
      "Ein Elektron gehört zu einem oder mehreren Atomen (Elektronenpaarbindung)."
    ]
  },
  {
    "text": "Beim Standesamt wird verwaltet, welche Personen gerade miteinander verheiratet sind.",
    "entities": [ "Person", "Person" ],
    "relation": "verheiratet",
    "solution": [ "c", "c" ],
    "comments": [
      "Eine Person kann höchstens mit einer anderen Person verheiratet sein.",
      "Eine Person kann höchstens mit einer anderen Person verheiratet sein.",
    ]
  },
  {
    "text": "Für die Darstellung von Dateiordnern soll verwaltet werden, welcher Ordner welche anderen Ordner enthält.",
    "entities": [ "Ordner", "Ordner" ],
    "roles": [ "Ordner", "Oberordner" ],
    "relation": "enthält",
    "solution": [ "c", "cn" ],
    "comments": [
      "Ein Ordner hat entweder keinen oder genau einen Oberordner.",
      "Ein Oberordner enthält keinen, einen oder mehrere Unterordner."
    ]
  },
  {
    "text": "Für ein Unternehmen sollen die Mitarbeiter verwaltet werden, wobei jeder Mitarbeiter genau einen Vorgesetzten und jeder Vorgesetzte mindestens einen Mitarbeiter haben soll.",
    "entities": [ "Mitarbeiter", "Mitarbeiter" ],
    "roles": [ "", "Vorgesetzter" ],
    "relation": "hat Vorgesetzten",
    "solution": [ "1", "n" ],
    "comments": [
      "Ein Mitarbeiter hat immer genau einen Vorgesetzten.",
      "Ein Vorgesetzter hat mindestens einen Mitarbeiter."
    ]
  },
  {
    "text": "Für die Erstellung eines Verkehrsplans muss verwaltet werden, welche Haltestellen miteinander verbunden sind. Durch Bauarbeiten und Umleitungen kann es zeitweise vorkommen, dass eine Haltestelle nicht angefahren wird.",
    "entities": [ "Haltestelle", "Haltestelle" ],
    "relation": "verbunden",
    "solution": [ "cn", "cn" ],
    "comments": [
      "Eine Haltestelle ist mit keiner, einer oder mehreren anderen Haltestelle verbunden.",
      "Eine Haltestelle ist mit keiner, einer oder mehreren anderen Haltestelle verbunden."
    ]
  },
  {
    "text": "In einer neuen Hochschule sollen Studenten Lehrveranstaltungen besuchen und am Ende des Semesters von einem Professor geprüft werden.",
    "entities": [ "Student", "Professor", "Lehrveranstaltung" ],
    "relation": "wird geprüft",
    "solution": [ "cn", "cn", "cn" ],
    "comments": [
      "Ein Student wurde entweder noch gar nicht, einmal oder bereits mehrmals geprüft.",
      "Ein Professor hat entweder noch gar nicht, einmal oder bereits mehrmals geprüft.",
      "In einer Lehrveranstaltung wurde noch gar nicht, einmal oder bereits mehrmals geprüft."
    ]
  },
  {
    "text": "Eine Fluggesellschaft möchte protokollieren, welche Piloten mit welchen Flugzeugen auf welchen Flugrouten eingesetzt werden. Bisher wurden im System nur Piloten und Flugzeuge verwaltet, für das Protokoll nun auch Flugrouten.",
    "entities": [ "Pilot", "Flugzeug", "Flugroute" ],
    "relation": "eingesetzt",
    "solution": [ "cn", "cn", "n" ],
    "comments": [
      "Ein Pilot wurde bisher gar nicht, einmal oder mehrmals mit einem Flugzeug auf einer Flugroute eingesetzt.",
      "Ein Flugzeug wurde bisher gar nicht, einmal oder mehrmals von einem Piloten auf einer Flugroute eingesetzt.",
      "Eine in der Datenbank vorhandene Flugroute wurde mindestens einmal von einem Piloten mit einem Flugzeug bedient."
    ]
  },
  {
    "text": "Ein Team von Programmierern möchte den Quelltext ihrer Programme versionieren, so dass bei jedem Speichern von Änderungen automatisch eine neue Version vom Quelltext separat gespeichert wird.",
    "entities": [ "Programmierer", "Quelltext", "Version" ],
    "relation": "speichert",
    "solution": [ "cn", "n", "1" ],
    "comments": [
      "Ein Programmierer hat noch keine, eine oder bereits mehrere Versionen eines Quelltexts gespeichert.",
      "Zu einem gespeicherten Quelltext gibt es mindestens eine Version und mindestens einen Programmierer.",
      "Zu einer Version gibt es genau einen zugehörigen Quelltext und genau einen zugehörigen Programmierer."
    ]
  },
  {
    "text": "Eine Adoptionsstelle möchte für jedes Kind nachhalten, wer die biologische Mutter und werd der biologische Vater ist.",
    "entities": [ "Vater", "Mutter", "Kind" ],
    "relation": "hat",
    "solution": [ "n", "n", "1" ],
    "comments": [
      "Zu einem Vater gibt es eine oder mehrere Mütter und mindestens ein Kind.",
      "Zu einer Mutter gibt es einen oder mehrere Väter und mindestens ein Kind.",
      "Ein Kind hat genau eine Mutter und genau einen Vater."
    ]
  },
  {
    "text": "Ein Gericht möchte die Gerichtsverhandlungen protokollieren, insbesondere wer bei einer Gerichtsverhandlung Angeklagter, Richter, Staatsanwalt und Verteidiger ist. Im System werden auch Richter und Staatsanwälte und Verteidiger verwaltet, die noch an keiner Gerichtsverhandlung teilgenommen haben.",
    "entities": [ "Angeklagter", "Richter", "Staatsanwalt", "Verteidiger" ],
    "relation": "beteiligt",
    "solution": [ "n", "cn", "cn", "cn" ],
    "comments": [
      "Ein Angeklagter hat an mindestens einer Gerichtsverhandlungen teilgenommen.",
      "Ein Richter hat an keine, eine oder mehrere Gerichtsverhandlungen geleitet.",
      "Ein Staatsanwalt war bisher an keiner, einer oder mehreren Gerichtsverhandlungen beteiligt.",
      "Ein Verteidiger war bisher an keiner, einer oder mehreren Gerichtsverhandlungen beteiligt."
    ]
  },
  {
    "text": "Über eine eigens dafür aufgesetzte Datenbank soll protokolliert werden, welche Veranstaltung an welcher Location mit welchen Teilnehmern mit welchen Sponsoren stattgefunden hat.",
    "entities": [ "Veranstaltung", "Location", "Teilnehmer", "Sponsor" ],
    "relation": "findet statt",
    "solution": [ "n", "n", "n", "n" ],
    "comments": [
      "Eine in der Datenbank vorhandene Veranstaltung wurde mindestens einmal protokolliert.",
      "Eine in der Datenbank vorhandene Location wurde bisher gar nicht, einmal oder bereits mehrmals protokolliert.",
      "Ein in der Datenbank vorhandener Teilnehmer hat mindestens an einer Veranstaltung teilgenommen.",
      "Ein in der Datenbank vorhandener Sponsor hat sich an mindestens einer Veranstaltung beteiligt."
    ]
  },
  {
    "text": "Ein Tierheim verwaltet Haustiere, die ein neues Zuhause suchen. Es handelt sich dabei vor allem um Hunde und Katzen.",
    "entities": [ "Haustier", "Hund", "Katze" ],
    "solution": [ "p", "d" ],
    "comments": [
      "Im Tierheim gibt es auch Haustiere, die weder Hund noch Katze sind.",
      "Es gibt keine Haustiere, die gleichzeitig Hund und Katze sind."
    ]
  },
  {
    "text": "Ein Versandhaus möchte verschiedene Paketdienstleister für die Zustellung ihrer Waren beauftragen. Pakete sollen vor allem über DHL, Hermes oder DPD versendet werden.",
    "entities": [ "Paketdienstleister", "DHL", "Hermes", "DPD" ],
    "solution": [ "p", "d" ],
    "comments": [
      "Aufträge können auch an andere Paketdienstleister vergeben werden (z.B. UPS).",
      "Ein Auftrag wird immer nur an einen Paketdienstleister vergeben."
    ]
  },
  {
    "text": "Verwaltet werden sollen die Besucher einer Gründermesse, auf der vor allem Unternehmensgründer und Sponsoren zusammenkommen.",
    "entities": [ "Besucher", "Gründer", "Sponsor" ],
    "solution": [ "p", "n" ],
    "comments": [
      "Neben Gründer und Sponsoren können auch andere Personengruppen (z.B. Ideengeber) die Messe besuchen.",
      "Ein Gründer kann auch gleichzeitig ein Sponsor und ein Sponsor selbst auch ein Gründer sein."
    ]
  },
  {
    "text": "Für eine Hundeshow sollen die teilnehmenden Hunde verwaltet werden. Zur Zeit sind vor allem Schäferhund, Mops und Dackel im Trend. Mischlinge aus diesen Rassen werden nicht als separate Hunderasse im System verwaltet.",
    "entities": [ "Hund", "Schäferhund", "Mops", "Dackel" ],
    "solution": [ "p", "n" ],
    "comments": [
      "An der Hundeshow nehmen auch vereinzelt andere Hunderassen teil, die weder Schäferhund, noch Mops oder Dackel sind.",
      "Neben den reinrassigen Hunden nehmen auch Mischlinge teil (z.B. ein Mops-Dackel-Mix). Ein Hund kann daher auch mehreren Hunderassen angehören."
    ]
  },
  {
    "text": "Eine Adoptionsvermittlungsstelle möchte die Kontaktdaten der (biologischen) Eltern verwalten. Dabei sollen auch Vater- und Mutter-spezifische Merkmale erfasst und deshalb explizit zwischen beiden unterschieden werden.",
    "entities": [ "Elternteil", "Mutter", "Vater" ],
    "solution": [ "t", "d" ],
    "comments": [
      "Ein (biologischer) Elternteil ist entweder Mutter oder Vater.",
      "Ein Elternteil kann nicht gleichzeitig Vater und Mutter sein."
    ]
  },
  {
    "text": "Auf dem schnurlosen Haustelefon soll es im Adressbuch grundsätzlich drei Kategorien von Einträgen mit spezifischen Merkmalen geben: Privat, Arbeit und Mobil. Jeder Eintrag muss einer dieser Kategorien zugeordnet werden.",
    "entities": [ "Adressbuch", "Privat", "Arbeit", "Mobil" ],
    "solution": [ "t", "d" ],
    "comments": [
      "Jeder Adressbucheintrag muss einer der Kategorien zugeordnet werden.",
      "Ein Eintrag kann nur einer der Kategorien zugeordnet werden."
    ]
  },
  {
    "text": "An einer Hochschule soll zwischen zwei Personengruppen unterschieden werden: Es gibt nur Studenten und Mitarbeiter.",
    "entities": [ "Hochschulangehöriger", "Student", "Mitarbeiter" ],
    "solution": [ "t", "n" ],
    "comments": [
      "Neben Studenten und Mitarbeitern werden keine anderen Personengruppen an der Hochschule verwaltet.",
      "Ein Student kann gleichzeitig auch ein Mitarbeiter (studentische Hilfskraft) und ein Mitarbeiter auch Student sein."
    ]
  },
  {
    "text": "Für ein Krankenhaus sollen die verschiedenen Personengruppen verwaltet werden. Unterschieden wird dabei zwischen Besuchern, Patienten und Personal.",
    "entities": [ "Person", "Besucher", "Patient", "Personal" ],
    "solution": [ "t", "n" ],
    "comments": [
      "Im Krankenhaus gibt es nur Besucher, Patienten und Personal. Andere Personengruppen können nicht vorkommen.",
      "Eine Person kann auch mehreren Personengruppen angehören. Jemand vom Personal kann z.B. auch Patient oder Besucher sein."
    ]
  }
];

/**
 * Notations data.
 * @type {Object.<string,notation_data>}
 */
export const notations = {
  "abrial": {
    "key": "abrial",
    "title": "Abrial",
    "centered": true,
    "comment": "Die Abrial bzw. (min,max)-Notation gibt für jeden an einer Beziehung beteiligten Entitätentyp an, mit wie vielen Entitäten auf der anderen Seite eine Entität dieses Typs mindestens und höchstens in Beziehung steht."
  },
  "arrow": {
    "key": "arrow",
    "title": "Pfeilnotation",
    "swap": true,
    "mirrored": true
  },
  "chen": {
    "key": "chen",
    "title": "Chen",
    "swap": true,
    "centered": true,
    "comment": "In der Chen-Notation sind nur einfache und mehrfache Beziehungstypen (1 und N) darstellbar, da die Beziehungsmengen bei Chen nur in ihrer Maximalaussage genannt werden. Bei Phrasen die auf einen bedingten oder mehrfach bedingten Beziehungstyp hindeuten, sollte besser zu einer anderen Notation gewechselt werden."
  },
  "crow": {
    "key": "crow",
    "title": "Krähenfuß",
    "swap": true,
    "mirrored": true
  },
  "mc": {
    "key": "mc",
    "swap": true,
    "title": "MC"
  },
  "uml": {
    "key": "uml",
    "swap": true,
    "title": "UML"
  }
};

/**
 * German translations.
 * @type {Object.<string,string>}
 */
export const de = {

  /* Badges */
  "badge_ak": "AK",
  "badge_ak_title": "Alternativschlüssel",
  "badge_fk": "FK",
  "badge_fk_title": "Fremdschlüssel",
  "badge_man": "NOT NULL",
  "badge_opt": "NULL",
  "badge_pk": "PK",
  "badge_pk_title": "Primärschlüssel",

  /* Basic Terms */
  "main_title": "ER-REL-Trainer",
  "main_heading": "Gegeben ist ein ER-Diagramm, das eine Beziehung zwischen Entitäten zeigt. Ihre Aufgabe ist es das ER-Diagramm in ein logisches relationales Schema zu überführen und dafür die nötigen Tabellen anzulegen, darin die erforderlichen Schlüsselattribute zu ergänzen und die Richtung festzulegen, in der die Tabellen miteinander in Beziehung stehen.",
  "main_notation": "ER-Notation:",
  "main_phrase": "Phrase",
  "main_table": "Tabelle",

  /* Buttons */
  "btn_correction": "Korrigieren",
  "btn_finish": "Neustart",
  "btn_next": "Weiter",
  "btn_skip": "Überspringen",
  "btn_solution": "Zeige Lösung",
  "btn_submit": "Abschicken",

  /* Comments During Input */
  "comment_create_tables": "Hinweis: Über die Buttons unter dem ER-Diagramm können neue Tabellen angelegt werden. Entscheide, welche Tabellen benötigt werden.",
  "comment_decide_null": "Hinweis: Lege für jedes Attribut fest, ob dessen Wert optional (NULL) oder verpflichtend (NOT NULL) ist.",
  "comment_connect_tables": "Hinweis: Setze über Fremdschlüssel die Tabellen miteinander in Beziehung.",
  "comment_set_arrows": "Hinweis: Lege an den Endpunkten der Verbindungslinien zwischen Tabellen fest, in welcher Richtung die Tabellen miteinander in Beziehung stehen.",

  /* Comments on Wrong Solution Concerning Tables */
  "comment_missing_entity_table": "Hinweis: Für jede Entität muss eine Tabelle erstellt werden.",
  "comment_missing_relation_table": "Hinweis: Zur Auflösung einer 'n:m'-Beziehung zwischen zwei oder mehr Entitäten wird eine zusätzliche Tabelle benötigt.",
  "comment_not_needed_relation_table": "Hinweis: Eine zusätzliche Tabelle wird nur bei einer 'n:m'-Beziehung zwischen zwei oder mehr Entitäten benötigt.",

  /* Comments on Wrong Solution Concerning Primary Keys */
  "comment_missing_pk": "Hinweis: Jede angelegte Tabelle benötigt einen Primärschlüssel.",
  "comment_pk_not_null": "Hinweis: Attribute, die zum Primärschlüssel gehören, sind immer Pflichtfelder (NOT NULL).",
  "comment_wrong_pk": "Hinweis: Eine Entitäts-Tabelle hat üblicherweise einen künstlichen Primärschlüssel und der Attributname orientiert sich am Namen der Entität.",
  "comment_nm_pk": "Hinweis: Bei einer 'n:m'-Beziehung zwischen zwei oder mehr Entitäten hat die zusätzliche Tabelle üblicherweise einen zusammengesetzten Primärschlüssel, bestehend aus jeweils einem Attribut für jede Entität. Darüber wird sichergestellt, dass jede Kombination aus deren Werten nur einmal vorkommt.",

  /* Comments on Wrong Solution Concerning Foreign Keys */
  "comment_1c_fk": "Hinweis: Wenn bei einer '1:1'-Beziehung beide Entitäten über unterschiedliche Kardinalitäten verfügen, wird der Fremdschlüssel bei der schwächeren Entität hinzugefügt. Eine Entität ist eine schwache Entität, wenn ihre Existenz von der jeweils anderen Entität abhängt.",
  "comment_1n_fk": "Hinweis: Bei einer '1:n'-Beziehung wird der Fremdschlüssel bei der einfachen Entität gesetzt. Eine einfache Entität ist die Entität, die höchstens einmal mit der jeweils anderen Entität verbunden ist.",
  "comment_nm_fk": "Hinweis: Bei einer 'n:m'-Beziehung zwischen zwei oder mehr Entitäten werden die Fremdschlüssel in der zusätzlichen Tabelle gesetzt.",
  "comment_hierarchy_fk": "Hinweis: Bei einer Generalisierung/Spezialisierung werden die Fremdschlüssel bei den Spezialisierungen gesetzt.",
  "comment_not_null_fk": "Hinweis: Wird über den Fremdschlüssel eine Muss-Kardinalität modelliert, ist der Fremdschlüssel nicht optional (NOT NULL). Dadurch ist die Referenzierung eines Datensatzes in der Zieltabelle verpflichtend.",
  "comment_null_fk": "Hinweis: Wird über den Fremdschlüssel eine Kann-Kardinalität modelliert, ist der Fremdschlüssel optional (NULL). Dadurch ist die Referenzierung eines Datensatzes in der Zieltabelle nicht verpflichtend.",

  /* Comments on Wrong Solution Concerning Alternate Keys */
  "comment_ak": "Hinweis: Bei einer '1:1'-Beziehung wird der Fremdschlüssel als Alternativschlüssel gesetzt, damit es keine mehrfache Referenzierung eines Datensatzes in der Zieltabelle geben kann. Ohne den Alternativschlüssel würde man eine '1:n'-Beziehung statt einer '1:1'-Beziehung realisieren.",

  /* Comments on Correct Solution */
  "comment_alternate_solution": "Hinweis: Dies ist eine alternative Lösung. Sie entspricht nicht der empfohlenen Lösung, erfüllt aber ebenfalls die Anforderungen.",
  "comment_mandatory": "Hinweis: Dies ist eine korrekte Lösung. Bedenke aber, dass manches auch nicht modellierbar war. Eine Muss-Kardinalität, bei der über den Fremdschlüssel referenzierten Entität, lässt sich im logischen relationalen Schema nicht abbilden. Es kann zwar beim Fremdschlüssel mittels NULL und NOT NULL festgelegt werden, dass es zu jeder A-Entität mindestens eine B-Entität geben muss, aber nicht gleichzeitig auch umgekehrt. Eine Referenzierung in beide Richtungen wäre eine Redundanz und daher keine Lösung.",
  "comment_total": "Hinweis: Dies ist eine korrekte Lösung. Bedenke aber, dass manches auch nicht modellierbar war. Bei einer Generalisierung/Spezialisierung lässt sich die totale Vollständigkeit im logischen relationalen Schema nicht abbilden. Es kann daher nicht garantiert werden, dass es keine weiteren Untertypen des Obertyps gibt.",
  "comment_disjoint": "Hinweis: Dies ist eine korrekte Lösung. Bedenke aber, dass manches auch nicht modellierbar war. Bei einer Generalisierung/Spezialisierung lässt sich die Disjunktheit im logischen relationalen Schema nicht abbilden. Es kann daher nicht garantiert werden, dass eine Entität genau einer Spezialisierung angehört.",

  /* Feedback */
  "feedback_correct": "Ihre Antwort war richtig!",
  "feedback_failed": "Ihre letzte Antwort war falsch!",
  "feedback_solution": "Richtige Lösung:",

  /* Generalisation/Specialisation Relation */
  "hierarchy_d": "disjunkt",
  "hierarchy_is": "ist",
  "hierarchy_n": "nicht-disjunkt",
  "hierarchy_p": "partiell",
  "hierarchy_t": "total",

  /* Legend of Notations */
  "legend": "Legende",
  "legend_1": "einfach",
  "legend_c": "bedingt",
  "legend_n": "mehrfach",
  "legend_cn": "bedingt mehrfach",

  /* Table Dialog */
  "table_dialog_info": "Lege fest, welche Attribute Teil welcher Schlüssel sind. Entscheide auch für jedes Attribut, ob es optional (NULL) oder verpflichtend (NOT NULL) ist."

};

/**
 * English translations.
 * @type {Object.<string,string>}
 */
export const en = {

  /* Badges */
  "badge_ak": "AK",
  "badge_ak_title": "Alternate Key",
  "badge_fk": "FK",
  "badge_fk_title": "Foreign Key",
  "badge_man": "NOT NULL",
  "badge_opt": "NULL",
  "badge_pk": "PK",
  "badge_pk_title": "Primary Key",

  /* Basic Terms */
  "main_title": "ER-REL Trainer",
  "main_heading": "Given an ER diagram showing a relationship between entities. Your task is to convert the ER diagram into a logical relational schema and to create the necessary tables, add the necessary key attributes and determine the direction in which the tables are related to each other.",
  "main_notation": "ER Notation:",
  "main_phrase": "Phrase",
  "main_table": "Table",

  /* Buttons */
  "btn_correction": "Correction",
  "btn_finish": "Restart",
  "btn_next": "Next",
  "btn_skip": "Skip",
  "btn_solution": "Show Solution",
  "btn_submit": "Submit",

  /* Comments During Input */
  "comment_create_tables": "Note: New tables can be created using the buttons below the ER diagram. Decide which tables are needed.",
  "comment_decide_null": "Note: Specify for each attribute whether its value is optional (NULL) or mandatory (NOT NULL).",
  "comment_connect_tables": "Note: Use foreign keys to relate the tables to one another.",
  "comment_set_arrows": "Note: At the endpoints of the connecting lines between tables, specify in which direction the tables relate to each other.",

  /* Comments on Wrong Solution Concerning Tables */
  "comment_missing_entity_table": "Note: A table must be created for each entity.",
  "comment_missing_relation_table": "Note: An additional table is required to resolve an 'many-to-many' relationship between two or more entities.",
  "comment_not_needed_relation_table": "Note: An additional table is only required for an 'many-to-many' relationship between two or more entities.",

  /* Comments on Wrong Solution Concerning Primary Keys */
  "comment_missing_pk": "Note: Each table created requires a primary key.",
  "comment_pk_not_null": "Note: Attributes belonging to the primary key are always mandatory (NOT NULL).",
  "comment_wrong_pk": "Note: An entity table usually has an artificial primary key and the attribute name is based on the entity name.",
  "comment_nm_pk": "Note: In an 'many-to-many' relationship between two or more entities, the additional table typically has a composite primary key consisting of one attribute for each entity. This ensures that each combination of their values occurs only once.",

  /* Comments on Wrong Solution Concerning Foreign Keys */
  "comment_1c_fk": "Note: In an 'one-to-one' relationship, if both entities have different cardinalities, the foreign key is added at the weaker entity. An entity is a weak entity if its existence depends on the other entity.",
  "comment_1n_fk": "Note: In an 'one-to-many' relationship, the foreign key is set on the simple entity. A simple entity is the entity that is connected to the other entity at most once.",
  "comment_nm_fk": "Note: In an 'many-to-many' relationship between two or more entities, the foreign keys are set in the additional table.",
  "comment_hierarchy_fk": "Note: In the case of a generalization/specialization, the foreign keys are set for the specializations.",
  "comment_not_null_fk": "Note: If a mandatory cardinality is modeled via the foreign key, the foreign key is not optional (NOT NULL). This means that a data record must be referenced in the target table.",
  "comment_null_fk": "Note: If an optional cardinality is modeled via the foreign key, the foreign key is optional (NULL). This means that referencing a data record in the target table is not mandatory.",

  /* Comments on Wrong Solution Concerning Alternate Keys */
  "comment_ak": "Note: In an 'one-to-one' relationship, the foreign key is set as an alternative key so that a data record cannot be referenced multiple times in the target table. Without the alternative key, an 'one-to-many' relationship would be realized instead of an 'one-to-one' relationship.",

  /* Comments on Correct Solution */
  "comment_alternate_solution": "Note: This is an alternative solution. It is not the recommended solution, but still fulfills the requirements.",
  "comment_mandatory": "Note: This is a correct solution. But keep in mind that some things could not be modeled. A mandatory cardinality for the entity referenced via the foreign key cannot be mapped in the logical relational schema. With the foreign key, you can use NULL and NOT NULL to specify that there must be at least one B entity for every A entity, but not vice versa at the same time. Referencing in both directions would be redundant and therefore not a solution.",
  "comment_total": "Note: This is a correct solution. But keep in mind that some things could not be modeled. In the case of generalization/specialization, total completeness cannot be represented in the logical relational schema. It can therefore not be guaranteed that there are no further subtypes of the supertype.",
  "comment_disjoint": "Note: This is a correct solution. But keep in mind that some things could not be modeled. In the case of generalization/specialization, the disjointness cannot be represented in the logical relational schema. It can therefore not be guaranteed that an entity belongs to exactly one specialization.",

  /* Feedback */
  "feedback_correct": "Your answer was correct!",
  "feedback_failed": "Your last answer was wrong!",
  "feedback_solution": "Correct solution:",

  /* Generalisation/Specialisation Relation */
  "hierarchy_d": "disjoint",
  "hierarchy_is": "is",
  "hierarchy_n": "non-disjoint",
  "hierarchy_p": "partial",
  "hierarchy_t": "total",

  /* Legend of Notations */
  "legend": "Legend",
  "legend_1": "Simple",
  "legend_c": "Conditional",
  "legend_n": "Multiple",
  "legend_cn": "Conditional Multiple",

  /* Table Dialog */
  "table_dialog_info": "Specify which attributes are part of which keys. Also decide for each attribute whether it is optional (NULL) or mandatory (NOT NULL)."

};
