# ER-REL-Trainer

## Beschreibung
Mit dem ER-REL-Trainer wird, ausgehend von einer Phrase, die Überführung einer Beziehung zwischen Entitäten eines ER-Diagramms in ein logisches relationales Schema trainiert. Es gilt die nötigen Tabellen anzulegen, die erforderlichen Schlüsselattribute zu ergänzen und die Richtung festzulegen, in der die Tabellen miteinander in Beziehung stehen.

## Systemanforderungen
Voraussetzung für die App ist ein gängiger Webbrowser (Firefox, Google Chrome, Microsoft Edge, Opera, Safari) mit aktiviertem JavaScript in einer aktuellen Version.

## Installation
Die Webanwendung kann über GitHub Pages in ihrer Basiskonfiguration ohne Installation über die folgende Web-URL direkt genutzt werden: https://eild-nrw.github.io/er_rel_trainer/.
Über die Web-URL ist die Webanwendung immer auf dem neusten Stand und muss nicht von Hand aktualisiert werden.
Wird die Web-URL auf einem mobilen Gerät (Smartphone, Tablet) aufgerufen, kann die App von dort aus auf den Homescreen gelegt und anschließend wie eine native Mobile App genutzt werden.

Alternativ kann das Repository als ZIP-Datei heruntergeladen, auf einem beliebigen Webspace entpackt und durch den Aufruf der enthaltenen `index.html` gestartet werden.
Die ZIP-Variante hat den Vorteil einer von GitHub unabhängigen Version ohne externe Abhängigkeiten mit weitreichender individueller Anpassbarkeit.
Bei der ZIP-Variante können nach dem Entpacken die enthaltenen Ordner `docs`, `scorm` und `versions` gelöscht werden.

In einer Lernplattform (z.B. ILIAS oder Moodle) kann die App entweder über die Web-URL, über das Hochladen der ZIP-Datei oder über das im `scorm`-Ordner enthaltene "SCORM 1.2"-Modul integriert werden.

## Anpassbarkeit
Durch das Editieren der im Repository enthaltenen `configs.js` können weitreichende individuelle Anpassungen vorgenommen werden.

## Datenverarbeitung
In der unveränderten Basiskonfiguration werden an keiner Stelle Benutzer-spezifische Daten verarbeitet. Es handelt sich um reine Selbsttests mit direktem Feedback, was richtig/falsch beantwortet wurde. Es existieren keine Abhängigkeiten zu externen Servern und es findet entsprechend kein Datenaustausch mit anderen Servern statt.

Der Fortschritt kann, wenn gewünscht, offline-fähig lokal gespeichert werden, sodass man bei der Phrase weitermachen kann, wo man das letzte Mal aufgehört hat. Dies kann bei Bedarf in der `configs.js` aktiviert werden.

## Hintergrundinformationen
Der ER-REL-Trainer wurde an der Hochschule Bonn-Rhein-Sieg im Rahmen des EILD-Projekts von André Kless auf Basis von HTML, CSS und JavaScript in Form einer _ccmjs_-basierten Webkomponente im entwickelt.

## Code-Dokumentation
Eine aus den Dokumentationskommentaren generierte Code-Dokumentation für Entwickler findet sich unter https://eild-nrw.github.io/er_rel_trainer/docs/.

Der `libs`-Ordner enthält wiederverwendete Webkomponenten, Bibliotheken und Frameworks.

Der `versions`-Ordner enthält alles was nötig ist, um auch ältere Versionen weiter lauffähig zu halten und um die Anwendung auch in anderen Webseiten (mit absoluten statt relativen Pfaden) flexibel einsetzen zu können.

## Kontakt
Wir freuen uns über jedes Feedback und beantworten gern Ihre Fragen. Hierfür können Sie sich jederzeit (auch nach dem Ende des EILD-Projekts) an den Entwickler André Kless wenden.

Email: andre.kless@h-brs.de | Web: https://www.h-brs.de/de/inf/andre-kless
