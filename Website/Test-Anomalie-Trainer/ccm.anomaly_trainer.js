"use strict";

/**
 * @overview <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @author André Kless <andre.kless@web.de> 2022-2023
 * @license The MIT License (MIT)
 * @copyright EILD.nrw 2022-2023
 * @version latest (1.0.0)
 */

( () => {

  /**
   * <i>ccmjs</i>-based web component for Anomaly Trainer.
   * @namespace WebComponent
   * @type {object}
   * @property {string} name - Unique identifier of the component.
   * @property {number[]} [version] - Version of the component according to Semantic Versioning 2.0 (default: latest version).
   * @property {string} ccm - URL of the (interchangeable) ccmjs version used at the time of publication.
   * @property {app_config} config - Default app configuration.
   * @property {Class} Instance - Class from which app instances are created.
   */
  const component = {
    name: 'anomaly_trainer',
    ccm: './libs/ccm/ccm.js',
    config: {
      // "anytime_finish": true,
      "cols": [ "", "T1", "T2", "A", "a1", "a2", "B", "b1", "b2" ],
      "css": [ "ccm.load",
        [  // is loaded serially (not in parallel)
          "./libs/bootstrap-5/css/bootstrap.css",
          "./resources/styles.css",
        ],
        { "url": "./libs/bootstrap-5/css/bootstrap-fonts.css", "context": "head" }
      ],
      "feedback": true,
      "helper": [ "ccm.load", { "url": "./libs/ccm/helper.js", "type": "module" } ],
      "html": [ "ccm.load", { "url": "./resources/templates.js", "type": "module" } ],
      // "onchange": event => console.log( event ),
      "onfinish": { "log": true, "restart": true },
      // "onready": event => console.log( event ),
      // "onstart": event => console.log( event ),
      "ops": {
        "read0": "read({A},{a})",
        "read1": "read({A},{a})",
        "add_x": "{a} = {a} + {x}",
        "write": "write({A},{a})",
        "rollb": "rollback"
      },
      "schedules": {
        "ops": [
          [ "read0", "read1", "add_x", "write", "rollb" ], // T1
          [ "read1", "add_x", "write" ]                    // T2
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
        "inputs": [
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
      "summand": [ 1, 9 ],
      "text": {
        "title": "Anomalie-Trainer",
        "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
        "yes": "Ja",
        "neither": "",
        "no": "Nein",
        "submit": "Abschicken",
        "next": "Nächste",
        "finish": "Neustart"
      },
      "toposort": [ "ccm.load", { "url": "./libs/toposort/toposort.js#toposort", "type": "module" } ],
      "use_b": 0,
      "value": [ 10, 80 ]
    },
    /**
     * @class
     * @memberOf WebComponent
     */
    Instance: function () {

      /**
       * Shortcut to helper functions
       * @private
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * App state data
       * @type {app_state}
       */
      let data;

      /**
       * When the instance is created, when all dependencies have been resolved and before the dependent sub-instances are initialized and ready. Allows dynamic post-configuration of the instance.
       * @async
       * @readonly
       * @function
       */
      this.init = async () => {

        // Merge all helper functions and offer them via a single variable.
        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );

      };

      /**
       * When the instance is created and after all dependent sub-instances are initialized and ready. Allows the first official actions of the instance that should only happen once.
       * @async
       * @readonly
       * @function
       */
      this.ready = async () => {

        // Trigger 'ready' event
        this.onready && await this.onready( { instance: this } );

      };

      /**
       * Starts the app. The current app state is visualized in the webpage area.
       * @async
       * @readonly
       * @function
       */
      this.start = async () => {

        // Load existing app state data.
        data = await $.dataset( this.data );

        // Not exists? => Set initial app state data.
        if ( !data.sections ) data = {
          correct: 0,
          sections: []
        };
        data.total = this.schedules.length || this.schedules.rounds;

        // Show the first schedule of transaction steps.
        this.next();

        // Trigger 'start' event.
        this.onstart && await this.onstart( { instance: this } );

      };

      /**
       * Shows the next section with another schedule of transaction steps.
       * @readonly
       * @function
       */
      this.next = () => {

        /**
         * Data for generating a schedule of transaction steps.
         * @type {object}
         */
        const schedule = this.schedules[ data.sections.length ] || this.schedules;

        /**
         * Initial app state data for the section.
         * @type {{a: number, b: number, steps: string[], t1: {summand: number, attr: string}, t2: {summand: number, attr: string}}}
         */
        const section = {
          a: schedule.a || random( ...this.value ),
          b: schedule.b || random( ...this.value ),
          solution: schedule.inputs?.map( input => input.solution ),
          steps: schedule.steps || [],
          t1: {
            attr: schedule.t1?.attr || ( !schedule.inputs || this.use_b <= Math.random() * 100 ? 'a' : 'b' ),
            summand: schedule.t1?.summand
          },
          t2: {
            attr: schedule.t2?.attr || ( !schedule.inputs || this.use_b <= Math.random() * 100 ? 'a' : 'b' ),
            summand: schedule.t2?.summand
          }
        };

        // Calculation of two different summands.
        while ( section.t1.summand === section.t2.summand ) {
          section.t1.summand = random( ...this.summand );
          section.t2.summand = random( ...this.summand );
        }

        // No given transaction steps? => Generate a new unique schedule of valid transaction steps.
        if ( !section.steps.length ) {

          /**
           * List of previously generated schedules.
           * @type {string[][]}
           */
          const history = data.sections.map( section => section.steps.toString() );

          /**
           * Indicates whether at least one anomaly must occur.
           * @type {boolean}
           */
          const anomaly = ( schedule.anomaly || 0 ) > Math.random() * 100;

          /**
           * Previous number of attempts to find a new schedule.
           * @type {number}
           */
          let repeats = 0;

          // Add each possible transaction step to the empty schedule.
          let steps = [];
          for ( let i = 1; i <= 2; i++ )
            ( schedule.ops ? schedule.ops[ i - 1 ] : Object.keys( this.ops ) ).forEach( op => steps.push( 'T' + i + ',' + op ) );

          // Generate schedules until a new unique schedule is found.
          do {

            // Shuffle the current schedule of transaction steps and put them in a valid order using topological sorting.
            section.steps = this.toposort( $.shuffleArray( steps ), schedule.rules );

            /**
             * Indicates whether transaction T1 ([0]) or T2 ([1]) was rolled back.
             * @type {[boolean,boolean]}
             */
            const rollbacks = [ false, false ];

            // Removal of not needed transaction steps.
            section.steps = section.steps.filter( step => {

              let [ t, op ] = step.split( ',' );  // op: Transaction operation index ('read1', 'add_x', 'write', 'read2' or 'rollb')
              t = parseInt( t[ 1 ] ) - 1;         // t = Transaction index ([0]: T1, [1]: T2)
              const rollback = rollbacks[ t ];    // rollback: Transaction is rolled back.

              // There is only a certain probability of a pre-read operation.
              if ( op === 'read0' && schedule.read0 <= Math.random() * 100 ) return false;

              // There is only a certain probability of a rollback operation.
              if ( op === 'rollb' ) {
                if ( schedule.rollb <= Math.random() * 100 ) return false;

                // All transaction steps after a rollback are removed.
                rollbacks[ t ] = true;
              }
              return !rollback;
            } );

          } while ( ( history.includes( section.steps.toString() ) || schedule.inputs && !getSolution( section, true ).includes( true ) && anomaly ) && ++repeats <= 500 );

          // Didn't find a unique new schedule and there is no fixed number of sections? => Restart the app.
          if ( repeats > 500 && !data.total ) return this.start();

          // Set the correct solution for the generated schedule.
          section.solution = getSolution( section );

        }

        // Add section data to app state data.
        data.sections.push( section );

        // Update main HTML template.
        this.html.render( this.html.main( this, this.section2table( section ) ), this.element );
        this.html.render( this.html.inputs( this ), this.element.querySelector( '#inputs' ) );

        // Trigger the 'change' event due to the start of the next section.
        this.onchange && this.onchange( { event: 'next', instance: this } );

      };

      /**
       * Converts the app state data of a section to table values.
       * @readonly
       * @function
       * @param {object} section - App state data of a section.
       * @returns {[[number,string,string,number,number|string,number|string,number,number|string,number|string]]} - Table values
       */
      this.section2table = section => {

        /**
         * Transactions data
         * @type {{t1: {nr: number, a: number, b: number, summand: number}, t2: {nr: number, a: number, b: number, summand: number}}}
         */
        const tdata = {
          t1: { nr: 1, a: 0, b: 0, summand: section.t1.summand },
          t2: { nr: 2, a: 0, b: 0, summand: section.t2.summand }
        };

        /**
         * Table values
         * @type {[[number,string,string,number,number|string,number|string,number,number|string,number|string]]}
         */
        const values = section.steps.map( ( step, i ) => {

          let [ tn, op ] = step.split( ',' );  // op: Transaction operation index ('read1', 'add_x', 'write', 'read2' or 'rollb')
          tn = tn.toLowerCase();               // tn: Transaction index ('t1' or 't2')
          const t = tdata[ tn ];                // t: Data of the active transaction
          const attr = section[ tn ].attr;     // attr: Database attribute on which the transaction works ('a' or 'b').

          // Calculate the attribute values for this transaction step.
          switch ( op ) {
            case 'read0':
            case 'read1': t[ attr ] = section[ attr ]; break;
            case 'add_x': t[ attr ] += t.summand; t.added = true; break;
            case 'write': section[ attr ] = t[ attr ]; t[ attr ] = 0; break;
            case 'rollb': if ( t.added ) section[ attr ] -= t.summand; t[ attr ] = 0; break;
          }

          // Replace placeholder for database attributes.
          op = this.ops[ op ];
          op = op.replaceAll( '{a}', attr ).replaceAll( '{A}', attr.toUpperCase() );
          op = op.replaceAll( '{x}', t.summand.toString() );

          // Compilation of the values for this table row.
          return [ i + 1, t.nr === 1 ? op : '', t.nr === 2 ? op : '', section.a, tdata.t1.a || '-', tdata.t2.a || '-', section.b, tdata.t1.b || '-', tdata.t2.b || '-' ];
        } );

        // Randomly swap the transaction steps of T1 and T2 if they use different operations.
        random( 0, 1 ) && values.forEach( row => [ row[ 1 ], row[ 2 ], row[ 3 ], row[ 4 ], row[ 5 ], row[ 6 ], row[ 7 ], row[ 8 ] ] = [ row[ 2 ], row[ 1 ], row[ 3 ], row[ 5 ], row[ 4 ], row[ 6 ], row[ 8 ], row[ 7 ] ] );

        // Add column names to the table.
        values.unshift( this.cols );

        // No second database attribute? => Remove corresponding columns.
        !this.use_b && values.forEach( row => row.length = 6 );

        return values;
      };

      /**
       * Returns the current app state.
       * @readonly
       * @function
       * @returns {app_state} A deep copy of the app state data.
       */
      this.getValue = () => $.clone( data );

      /**
       * Contains all event handlers.
       * @namespace AppEvents
       * @readonly
       * @type {Object.<string,function>}
       */
      this.events = {

        /**
         * When an answer is clicked.
         * @function
         * @memberOf AppEvents
         */
        onAnswer: () => {

          /**
           * App state data of the current section.
           * @type {object}
           */
          const section = data.sections.at( -1 );

          /**
           * Data used to generate the current schedule.
           * @type {object}
           */
          const schedule = this.schedules[ data.sections.length - 1 ] || this.schedules;

          // Cancel if the app is not a trainer but only a generator or if the solution has already been revealed.
          if ( !schedule.inputs || section.correct !== undefined ) return;

          // Update the user's input in the current section's app status data.
          section.input = Object.values( $.formData( this.element ) );

          // Update the HTML template for the input fields.
          this.html.render( this.html.inputs( this ), this.element.querySelector( '#inputs' ) )

          // Trigger the 'change' event due to user has chosen an answer.
          this.onchange && this.onchange( { event: 'answer', instance: this } );

        },

        /**
         * When the button to submit a solution is clicked.
         * @function
         * @memberOf AppEvents
         */
        onSubmit: () => {

          /**
           * App state data of the current section.
           * @type {object}
           */
          const section = data.sections.at( -1 );

          /**
           * Data used to generate the current schedule.
           * @type {object}
           */
          const schedule = this.schedules[ data.sections.length - 1 ] || this.schedules;

          // Cancel if the app is not a trainer but only a generator or if the solution has already been revealed or user input is still missing.
          if ( !schedule.inputs || section.correct !== undefined || !section.input || section.input.includes( '' ) ) return;

          // In the current section's app status data, add whether the user input matches the solution.
          section.points = 0; section.total = section.solution.length;
          for ( let i = 0; i < section.total; i++ )
            section.input[ i ] === section.solution[ i ] && section.points++;
          section.correct = section.points === section.total;
          section.correct && data.correct++;

          // Show Feedback? => Update the HTML template for the input fields, otherwise start next section.
          if ( this.feedback || data.sections.length === data.total )
            this.html.render( this.html.inputs( this ), this.element.querySelector( '#inputs' ) );
          else
            this.next();

          // Trigger the 'change' event due to user input being submitted.
          this.onchange && this.onchange( { event: 'submit', instance: this } );

        },

        /**
         * When the button that starts the next section is clicked.
         * @function
         * @memberOf AppEvents
         */
        onNext: () => {

          /**
           * App state data of the current section.
           * @type {object}
           */
          const section = data.sections.at( -1 );

          /**
           * Data used to generate the current schedule.
           * @type {object}
           */
          const schedule = this.schedules[ data.sections.length - 1 ] || this.schedules;

          // Cancel if the app is not a trainer but only a generator and the solution has either not yet been revealed or it is the last round.
          if ( !this.feedback || schedule.inputs && ( section.correct === undefined || data.sections.length === data.total ) ) return;

          // Show the next section with another constellation of transaction steps.
          this.next();

        },

        /**
         * When the finish button is clicked.
         * @function
         * @memberOf AppEvents
         */
        onFinish: () => {

          // Cancel if there is no fixed number of sections, or it is not the last round or the solution has not yet been revealed.
          if ( !data.total || !this.anytime_finish && ( data.sections.length < data.total || data.sections.at( -1 ).correct === undefined ) ) return;

          // Trigger the 'finish' event.
          $.onFinish( this );

        },

        /**
         * When the show results button is clicked.
         * @function
         * @memberOf AppEvents
         */
         onResult: () => {
          //Funktion in the WebDAV-Script to toggle the modal-dialog
          toggleDataModal()
        }

      };

      /**
       * Determines the correct solution of a section.
       * @param {object} section - App state data of a section
       * @param {boolean} [ignore] - Ignore if both transactions operate on the same data attribute.
       */
      const getSolution = ( section, ignore ) => {
        if ( !Array.isArray( section.solution ) ) return;
        const check = solution => !solution.map( rule => {
          rule = rule.map( step => section.steps.indexOf( step ) );
          return !rule.includes( -1 ) && rule[ 0 ] < rule[ 1 ];
        } ).includes( false );
        return section.solution.map( solution => {
          if ( !ignore && section.t1.attr !== section.t2.attr ) return false;
          if ( check( solution ) ) return true;
          return check( solution.map( rule => rule.map( step => step.split( ',' ).map( ( _, i ) => i ? _ : ( _ === 'T1' ? 'T2' : 'T1' ) ).join( ',' ) ) ) );
        } );

      };

      /**
       * Generates a random number within a range.
       * @private
       * @function
       * @param {number} min - Minimum possible value
       * @param {number} max - Maximum possible value
       * @returns {number}
       */
      const random = ( min, max ) => Math.floor( Math.random() * ( max - min + 1 ) + min );

    }
  };
  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();

/**
 * App configuration
 * @typedef {object} app_config
 * @prop {array} css - CSS dependencies.
 * @prop {array} helper - Dependency on helper functions.
 * @prop {Object.<string,TemplateResult>} html - HTML template dependencies.
 * @prop {function} [onchange] - When something changes in the app (user has chooses an answer, submit of user input, start of next section).
 * @prop {function|object} [onfinish] - When the finish button is clicked. Sets the finish actions.
 * @prop {function} [onready] - Is called once before the first start of the app.
 * @prop {function} [onstart] - When the app has finished starting.
 * @prop {array} toposort - Dependency to topological sorting algorithm.
 * @prop {string[]} cols - Labeling of the table columns.
 * @prop {object} ops - Definition of the database operations possible in a transaction.
 * @prop {string} [ops.read0] - Pre-read operation
 * @prop {string} ops.read1 - Read operation
 * @prop {string} ops.add_x - Arithmetic operation on the read database attribute.
 * @prop {string} ops.write - Write operation
 * @prop {string} [ops.rollb] - Rollback of all database operations of the transaction.
 * @prop {object>} random - Sets random factors in the app.
 * @prop {number} random.b - Probability that T2 uses a different database attribute (0.100).
 * @prop {number} random.read0 - Probability that a pre-read operation will occur (0-100).
 * @prop {number} random.rollb - Probability that a rollback will occur (0-100).
 * @prop {number} random.match - Probability that an anomaly occurs (0-100).
 * @prop {[number,number]} value - Initial value of a database attribute (random number between min and max).
 * @prop {[number,number]} summand - Summand for the arithmetic operation (random number between min and max).
 * @prop {object} text - Texts and Labels in the app.
 * @prop {string} text.title - App title
 * @prop {string} text.task - Task description
 * @prop {string} text.yes - Label of the 'Yes'-button
 * @prop {string} text.neither - Label of the 'Neither'-button
 * @prop {string} text.no - Label of the 'No'-button
 * @prop {string} text.submit - Label of the 'Submit'-button
 * @prop {string} text.next - Label of the 'Next'-button
 * @prop {string} text.finish - Label of the 'Finish'-button
 * @prop {(string[][]|{whitelists: string[][][], blacklist: string[][], label: string})[]} topology - Topological sorting rules
 */

/**
 * App state data
 * @typedef {object} app_state
 * @prop {number} correct - Number of correctly answered sections.
 * @prop {number} total - Number of sections.
 * @prop {app_section[]} sections - Data on the individual sections.
 */

/**
 * App state data of a section
 * @typedef {object} app_section
 */
