/**
 * @overview App configurations of <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @author André Kless <andre.kless@web.de> 2022-2023
 * @copyright EILD.nrw 2022-2023
 * @license The MIT License (MIT)
 */

/**
 * Used app configuration of <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @module AppConfig
 */

/**
 * Configuration to show Lost Update phenomena.
 * @type {app_config}
 */
export const lost_update_gen = {
  "ops": {  // Festlegung der bei einer Transaktion möglichen Datenbankoperationen:
    "read1": "read({A},{a})",    // Leseoperation
    "add_x": "{a} = {a} + {x}",  // Rechenoperation auf dem gelesenen Datenbankattribut.
    "write": "write({A},{a})",   // Schreiboperation
  },
  "schedules": {  // Enthält die Einstellungen zum Generieren eines Schedules.
    "rules": [    // Regeln für die topologische Sortierung der Transaktionsschritte.
      // Standardregeln
      [ "T1,read1", "T1,add_x" ],  // T1: Erst Lesen, dann Addieren.
      [ "T1,add_x", "T1,write" ],  // T1: Erst Addieren, dann Schreiben.
      [ "T2,read1", "T2,add_x" ],  // Auch für T2 gilt: erst Lesen, dann Addieren.
      [ "T2,add_x", "T2,write" ],  // Auch für T2 gilt: erst Addieren, dann Schreiben.
      // 'Lost Update'-spezifische Regeln
      [ "T1,read1", "T2,write" ],
      [ "T2,write", "T1,write" ]
    ]
  },
  "text": {  // Texte und Beschriftungen
    "title": "\"Lost Update\"-Generator",  // Titel der App und Aufgabenstellung
    "task": "Beim \"Lost Update\"-Phänomen wird ein Wert, der von einer Transaktion geschrieben wurde von einer anderen Transaktion überschrieben.",
    "next": "Neue Konstellation generieren"  // Beschriftung für den "Weiter"-Button
  }
};

/**
 * Configuration to show Non-Repeatable Read phenomena.
 * @type {app_config}
 */
export const non_repeatable_read_gen = {
  "cols": [  // Beschriftung der Tabellenspalten
    "Step",
    "Transaction 1",
    "Transaction 2",
    "Database Attribute",
    "Attribute of Transaction 1",
    "Attribute of Transaction 2"
  ],
  "ops": {
    "read0": "read({A},{a})",   // Vorab-Leseoperation
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"         // Zurückrollen aller Datenbankoperationen der Transaktion.
  },
  "schedules": {
    "ops": [      // Gibt an, welche Transaktion welche Operationen nutzt.
      [ "read0", "read1", "rollb" ],  // Transaktion 1 (T1)
      [ "read1", "add_x", "write" ]   // Transaktion 2 (T2)
    ],
    "rules": [
      // Standardregeln
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // 'Non-Repeatable Read'-spezifische Regeln
      [ "T1,read0", "T2,write" ],
      [ "T2,write", "T1,read1" ],
      [ "T1,read1", "T1,rollb" ]
    ]
  },
  "text": {
    "title": "\"Non-Repeatable Read\"-Generator",
    "task": "Beim \"Non-Repeatable Read\"-Phänomen kann eine Transaktion während ihrer Laufzeit von einem Attribut zu unterschiedlichen Zeitpunkten unterschiedliche Werte lesen, da das Attribut während der Transaktion von einer anderen Transaktion verändert wurde.",
    "next": "Neue Konstellation generieren"
  }
};

/**
 * Configuration to show Dirty Read phenomena.
 * @type {app_config}
 */
export const dirty_read_gen = {
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "value": [ 1, 4 ],    // Startwert eines Datenbankattributs (Zufallszahl zwischen [min, max]).
  "summand": [ 1, 3 ],  // Summand für die Rechenoperation (Zufallszahl zwischen [min, max]).
  "schedules": {
    "ops": [
      [ "read1", "add_x", "write", "rollb" ],
      [ "read1", "add_x", "write" ]
    ],
    "rules": [
      // Standardregeln
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // 'Dirty Read'-spezifische Regeln
      [ "T1,write", "T2,read1" ],
      [ "T2,read1", "T1,rollb" ]
    ]
  },
  "text": {
    "title": "\"Dirty Read\"-Generator",
    "task": "Beim \"Dirty Read\"-Phänomen verändert eine Transaktion einen Wert, welcher von einer anderen Transaktion gelesen wird. Die Transaktion, die das Attribut verändert hat, wird allerdings zurückgesetzt und die andere Transaktion, die den veränderten Wert des Attributs gelesen hat, arbeitet auf einen \"verschmutzten\" Wert.",
    "next": "Neue Konstellation generieren"
  }
};

/**
 * Configuration to train Lost Update phenomena.
 * @type {app_config}
 */
export const lost_update_trainer = {
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "use_b": 30,    // Wahrscheinlichkeit mit der eine Transaktion ein anderes Datenbankattribut (B) nutzt (0-100).
  "schedules": {
    "anomaly": 50,  // Wahrscheinlichkeit mit der eine Anomalie auftritt (0-100).
    "rules": [
      // Standardregeln
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
    ],
    "inputs": [  // Enthält die Einstellungen für den [Ja|Nein]-Button.
      {
        "label": "Lost Update",        // Beschriftung für den [Ja|Nein]-Button
        "solution": [                  // Wenn die enthaltenen Regeln für den Schedule erfüllt sind, muss "Ja" ausgewählt werden.
          [ "T1,read1", "T2,write" ],  // T2 schreibt erst, nachdem T1 gelesen hat.
          [ "T2,write", "T1,write" ]   // T1 schreibt erst, nachdem T2 geschrieben hat.
        ]                              // (Dann ist es ein "Lost Update".)
      }
    ]
  },
  "text": {
    "title": "\"Lost Update\"-Trainer",
    "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Lost Update\" aufgetreten ist.",
    "yes": "Ja",              // Beschriftung für den linken Teil eines [Ja|Nein]-Buttons.
    "neither": "",            // Beschriftung für den mittleren Teil eines [Ja|Nein]-Buttons.
    "no": "Nein",             // Beschriftung für den rechten Teil eines [Ja|Nein]-Buttons.
    "submit": "Abschicken",   // Beschriftung für den Abschicken-Button.
    "next": "Nächste",
    "btn_data": "Zeige Ergebnisse"
  },
  "libs": ["ccm.load",
    [ { "url": "./webdav/valueCollection/resources/custom.js", "type": "module" },
      "./webdav/web.index.js",
      "./webdav/webdav.js",
      "./webdav/valueCollection/resources/highcharts.js"
   ]],
  "onchange": async event => {

    const ev = event.instance.getValue()

    if (event.event !== 'next'|| ev.sections.length<2) return;
    
    const phrase = ev.sections[ev.sections.length-2]

    if(phrase.hasOwnProperty('correct')){

      const date = new Date();
      const dateKey = (date.getMonth()+1).toString()+"-"+date.getDate().toString()
     
      insertRun(event.instance.schedules.inputs[0].label, phrase.correct, dateKey)
    }
  }
};

/**
 * Configuration to train Non-Repeatable-Read phenomena.
 * @type {app_config}
 */
export const non_repeatable_read_trainer = {
  "ops": {
    "read0": "read({A},{a})",
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "use_b": 30,
  "schedules": {
    "anomaly": 50,
    "read0": 80,    // Wahrscheinlichkeit mit der eine Vorab-Leseoperation vorkommt (0-100).
    "rounds": 6,    // Anzahl der Schedules, die generiert und abgefragt werden.
    "ops": [
      [ "read0", "read1" ],
      [ "read1", "add_x", "write" ]
    ],
    "rules": [
      [ "T1,read0", "T1,read1" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ]
    ],
    "inputs": [
      {
        "label": "Non-Repeatable Read",
        "solution": [
          [ "T1,read0", "T2,write" ],
          [ "T2,write", "T1,read1" ]
        ]
      }
    ]
  },
  "text": {
    "title": "\"Non-Repeatable Read\"-Trainer",
    "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Non-Repeatable Read\" aufgetreten ist.",
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken",
    "next": "Nächste",
    "finish": "Neustart",  // Beschriftung für den Fertig-Button zum Abschließen der App.
    "btn_data": "Zeige Ergebnisse"
  },
  "onchange": async event => {

    const ev = event.instance.getValue()

    if (event.event !== 'next'|| ev.sections.length<2) return;
    
    const phrase = ev.sections[ev.sections.length-2]

    if(phrase.hasOwnProperty('correct')){

      const date = new Date();
      const dateKey = date.getDate().toString()+"_"+(date.getMonth()+1).toString()
     
      //insertRun(event.instance.schedules.inputs[0].label, phrase.correct, dateKey)
    }
  }
};

/**
 * Configuration to train Dirty Read phenomena.
 * @type {app_config}
 */
export const dirty_read_trainer = {
  "feedback": false,  // Kein visuelles Feedback, ob eine Antwort richtig oder falsch ist.
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "use_b": 30,
  "schedules": {
    "anomaly": 50,
    "rollb": 80,    // Wahrscheinlichkeit mit der ein Rollback vorkommt (0-100).
    "rounds": 6,
    "ops": [
      [ "read1", "add_x", "write", "rollb" ],
      [ "read1", "add_x", "write" ]
    ],
    "rules": [
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T1,write", "T1,rollb" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ]
    ],
    "inputs": [
      {
        "label": "Dirty Read",
        "solution": [
          [ "T1,write", "T2,read1" ],
          [ "T2,read1", "T1,rollb" ]
        ]
      }
    ]
  },
  "text": {
    "title": "\"Dirty Read\"-Trainer",
    "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Dirty Read\" aufgetreten ist.",
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken",
    "next": "Nächste",
    "finish": "Neustart",
    "btn_data": "Zeige Ergebnisse"
  },
  "onchange": async event => {

    const ev = event.instance.getValue()

    if (event.event !== 'next'|| ev.sections.length<2) return;
    
    const phrase = ev.sections[ev.sections.length-2]

    if(phrase.hasOwnProperty('correct')){

      const date = new Date();
      const dateKey = date.getDate().toString()+"_"+(date.getMonth()+1).toString()
     
      //insertRun(event.instance.schedules.inputs[0].label, phrase.correct, dateKey)
    }
  }
};

/**
 * Configuration to train all three types of anomaly phenomena.
 * @type {app_config}
 */
export const complete = {
  "ops": {
    "read0": "read({A},{a})",
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "schedules": {
    "ops": [
      [ "read0", "read1", "add_x", "write", "rollb" ],
      [ "read1", "add_x", "write" ]
    ],
    "rules": [
      [ "T1,read0", "T1,read1" ],
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T1,write", "T1,rollb" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      [ "T2,write", "T1,rollb" ]
    ],
    "anomaly": 90,
    "read0": 90,
    "rollb": 90,
    "rounds": 10,
    "inputs": [    // Hier gibt es nun mehrere [Ja|Nein]-Buttons
      {
        "label": "Lost Update",
        "solution": [
          [ "T1,read1", "T2,write" ],
          [ "T2,write", "T1,write" ]
        ]
      },
      {
        "label": "Non-Repeatable Read",
        "solution": [
          [ "T1,read0", "T2,write" ],
          [ "T2,write", "T1,read1" ]
        ]
      },
      {
        "label": "Dirty Read",
        "solution": [
          [ "T1,write", "T2,read1" ],
          [ "T2,read1", "T1,rollb" ]
        ]
      }
    ]
  },
  "text": {
    "title": "Anomalie-Trainer",
    "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken",
    "next": "Nächste",
    "finish": "Neustart",
    "btn_data": "Zeige Ergebnisse"
  },
  "onchange": async event => {

    const ev = event.instance.getValue()

    if (event.event !== 'next'|| ev.sections.length<2) return;
    
    const phrase = ev.sections[ev.sections.length-2]

    if(phrase.hasOwnProperty('correct')){

      const date = new Date();
      const dateKey = date.getDate().toString()+"_"+(date.getMonth()+1).toString()
      
      insertRun(event.instance.schedules.inputs[ev.sections.length-2].label, phrase.correct, dateKey)
      console.log(ev)
    }
  }
};

/**
 * Configuration to train all three types of anomaly phenomena with specific schedules.
 * @type {app_config}
 */
export const specific = {
  "ops": {
    "read0": "read({A},{a})",
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "use_b": 100,
  "schedules": [  // Hier gibt es nun mehrere fest vordefinierte Schedules.
    {
      "a": 32,
      "b": 58,
      "steps": [ "T1,read1", "T2,read0", "T1,add_x", "T1,write", "T2,read1", "T2,add_x", "T2,write" ],
      "t1": { "attr": "a", "summand": 4 },
      "t2": { "attr": "a", "summand": 7 },
      "inputs": [
        {
          "label": "Lost Update",
          "solution": false
        },
        {
          "label": "Non-Repeatable Read",
          "solution": true
        }
      ]
    },
    {  // Hier wird einmalig ein "Lost Update" generiert, also keine [Ja|Nein]-Buttons.
      "ops": [
        [ "read1", "add_x", "write" ],
        [ "read1", "add_x", "write" ]
      ],
      "rules": [
        // Standardregeln
        [ "T1,read1", "T1,add_x" ],
        [ "T1,add_x", "T1,write" ],
        [ "T2,read1", "T2,add_x" ],
        [ "T2,add_x", "T2,write" ],
        // 'Lost Update'-spezifische Regeln
        [ "T1,read1", "T2,write" ],
        [ "T2,write", "T1,write" ]
      ]
    },
    {
      // (Startwerte für Datenbankattribute werden diesmal zufällig bestimmt.)
      "steps": [ "T1,read0", "T2,read1", "T2,add_x", "T1,read1", "T2,write", "T1,add_x", "T1,write", "T2,rollb" ],
      "t1": { "attr": "b" },  // (Summand für Rechenoperation wird zufällig bestimmt.)
      "t2": { "attr": "b" },  // (Summand für Rechenoperation wird zufällig bestimmt.)
      "inputs": [
        {
          "label": "Lost Update",
          "solution": true
        },
        {
          "label": "Non-Repeatable Read",
          "solution": false
        },
        {
          "label": "Dirty Read",
          "solution": false
        }
      ]
    }
  ],
  "text": {
    "title": "Anomalie-Trainer mit spezifischen Schedules",
    "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken",
    "next": "Nächste",
    "finish": "Neustart",
    "btn_data": "Zeige Ergebnisse"
  }
};
