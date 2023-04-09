# Anomalie-Trainer

## Beschreibung
Der Anomalie-Trainer trainiert die Datenbank-Anomalien "Lost Update", "Non-Repeatable-Read" und "Dirty Read".

## Systemanforderungen
Voraussetzung für die App ist ein gängiger Webbrowser (Firefox, Google Chrome, Microsoft Edge, Opera, Safari) mit aktiviertem JavaScript in einer aktuellen Version.

## Installation
Die Webanwendung kann über GitHub Pages in ihrer Basiskonfiguration ohne Installation über die folgende Web-URL direkt genutzt werden: https://eild-nrw.github.io/anomaly_trainer/.
Über die Web-URL ist die Webanwendung immer auf dem neusten Stand und muss nicht von Hand aktualisiert werden.
Wird die Web-URL auf einem mobilen Gerät (Smartphone, Tablet) aufgerufen, kann die App von dort aus auf den Homescreen gelegt und anschließend wie eine native Mobile App genutzt werden.

Alternativ kann das Repository als ZIP-Datei heruntergeladen, auf einem beliebigen Webspace entpackt und durch den Aufruf der enthaltenen `index.html` gestartet werden.
Die ZIP-Variante hat den Vorteil einer von GitHub unabhängigen Version ohne externe Abhängigkeiten mit weitreichender individueller Anpassbarkeit.
Bei der ZIP-Variante können nach dem Entpacken die enthaltenen Ordner `docs`, `scorm` und `versions` gelöscht werden.

Eine dritte Möglichkeit ist ein _Fork_ des Repository, der anschließend über GitHub Pages veröffentlicht wird.
Diese Variante hat den Vorteil, dass kein eigener Webspace benötigt wird und gleichzeitig auch die individuelle Anpassbarkeit gegeben ist.

In einer Lernplattform (z.B. ILIAS oder Moodle) kann die App entweder über die Web-URL, über das Hochladen der ZIP-Datei oder über das im `scorm`-Ordner enthaltene "SCORM 1.2"-Modul integriert werden.

## Anpassbarkeit
Durch das Editieren der im Repository enthaltenen `configs.js` können weitreichende individuelle Anpassungen vorgenommen werden.
Layout und Design können über die `resources/styles.css` angepasst werden. Die `resources/templates.js` enthält die HTML-Templates,
in der bei Bedarf weitere HTML-ID's und HTML-Klassen ergänzt werden können, um das Selektieren von HTML-Elementen im CSS zu erleichtern.
Wer über die nötigen Programmierkenntnisse verfügt, kann auch die Logik des interaktiven Trainers in der `ccm.anomaly_trainer.js` anpassen.
Es handelt sich dabei um eine auf der _ccmjs_-Webtechnologie basierende Webkomponente.

## Datenverarbeitung
In der unveränderten Basiskonfiguration werden an keiner Stelle Benutzer-spezifische Daten verarbeitet.
Es handelt sich um reine Selbsttests mit direktem Feedback, was richtig/falsch beantwortet wurde.
Es existieren keine Abhängigkeiten zu externen Servern und es findet entsprechend kein Datenaustausch mit anderen Servern statt.

## Code-Dokumentation
Eine aus den Dokumentationskommentaren generierte Code-Dokumentation für Entwickler findet sich unter https://eild-nrw.github.io/anomaly_trainer/docs/.

Der `libs`-Ordner enthält wiederverwendete Webkomponenten, Bibliotheken und Frameworks.

Der `versions`-Ordner enthält alles was nötig ist, um auch ältere Versionen weiter lauffähig zu halten und um die Anwendung auch in anderen Webseiten (mit absoluten statt relativen Pfaden) flexibel einsetzen zu können.

## Lizenzen
Dieses Repository enthält Software und Content.
Bei der Software handelt es sich um freie Software unter der [MIT-Lizenz](/LICENSE).
Beim Content handelt es sich um gemeinfreie Inhalte unter der [CC0-Lizenz](https://creativecommons.org/publicdomain/zero/1.0/deed.de).
Content ist insbesondere der Titel und die Aufgabenbeschreibung in der Basiskonfiguration.

## Hintergrundinformationen
Der Anomalie-Trainer wurde an der Hochschule Bonn-Rhein-Sieg im Rahmen des [EILD-Projekts](https://github.com/EILD-nrw) von André Kless
auf Basis der Webstandards HTML, CSS und JavaScript in Form einer _ccmjs_-basierten Webkomponente entwickelt.

## Kontakt
Wir freuen uns über jedes Feedback und beantworten gern Ihre Fragen.
Hierfür können Sie sich jederzeit (auch nach dem Ende des EILD-Projekts) an den Entwickler André Kless wenden.

Email: andre.kless@h-brs.de | Web: https://www.h-brs.de/de/inf/andre-kless

![Logos von Projekt, Kooperationspartner und Förderer](/resources/img/logos/logos.jpg)
