import { html, render } from "./../libs/lit/lit.js";
export { render };

/**
 * returns the main HTML template
 * @param {Object} instance - instance of ccmjs-based web component for ER model to relational scheme training
 * @param {Object} state - current app state data
 * @param {Object} phrase - data of current phrase
 * @param {number} phrase_nr - number of current phrase
 * @param {Object.<string,Function>} events - contains all event handlers
 * @returns {TemplateResult} main HTML template
 */
export function main(instance, state, phrase, phrase_nr, events) {
  const notation = instance.notations[state.notation]; // data of the currently used notation
  const section = state.sections[phrase_nr - 1]; // app state data of current phrase
  const input =
    section.feedback && section.feedback.show_solution
      ? section.feedback
      : section.input; // current user input data
  const left = section.solution[0]; // left cardinality
  const right = section.solution[1]; // right cardinality
  const is_single =
    (left === "c" || left === "1") && (right === "c" || right === "1"); // is one-to-one relationship
  const is_multi =
    (left === "cn" || left === "n") &&
    (right === "cn" || right === "n") &&
    section.esolution[1] === "t"; // is many-to-many relationship

  return html`
    <h1 class="mx-3">${instance.text.title}</h1>
    <!-- Title -->
    <header
      class="bg-light border rounded-top d-flex flex-wrap justify-content-between align-items-center p-2"
    >
      <div id="heading" class="p-2 pr-3">
        ${!section.feedback
          ? instance.text.heading
          : section.correct
          ? instance.text.correct
          : instance.text.failed}
      </div>
      <!-- Heading -->
      <div class="d-flex align-items-center text-nowrap px-2">
        <!-- Notation Selection -->
        <section ?data-hidden=${Object.keys(instance.notations).length === 1}>
          <div class="d-flex align-items-center">
            <label for="notation-input" class="m-0 text-nowrap"
              ><b>${instance.text.notation}</b></label
            >
            <select
              id="notation-input"
              class="form-control ml-2"
              @change=${events.onNotationChange}
            >
              ${Object.values(instance.notations)
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(
                  ({ key, title }) =>
                    html`<option
                      value="${key}"
                      .selected=${state.notation === key}
                    >
                      ${title}
                    </option>`
                )}
            </select>
          </div>
        </section>

        <!-- Legend -->
        <section class="ml-2" ?data-hidden=${!instance.legend}>
          <button class="btn btn-link" @click=${events.onLegendClick}>
            ${instance.text.legend}
          </button>
        </section>
      </div>
    </header>
    <main class="border rounded-bottom border-top-0 px-4 py-2">
      <div>
        <!-- Phrase -->
        <section class="lead text-nowrap px-2 py-3">
          <b
            >${instance.ccm.helper.html(
              instance.text.phrase,
              phrase_nr.toString()
            )}</b
          >
          <span class="text-wrap">${phrase.text}</span>
        </section>

        <!-- Diagram -->
        <section class="px-2 pt-3">
          <div class="d-flex justify-content-between lead text-nowrap">
            <div class="pr-1">${instance.text.entity1}</div>
            <div class="pl-1">${instance.text.entity2}</div>
          </div>
          <div id="diagram" class="text-center">
            <div class="entity border rounded p-3 text-nowrap">
              ${phrase.relationship[0]}
            </div>
            <div>
              <img
                id="left"
                class="${notation.left}"
                src="${notation.images[
                  instance.values.indexOf(
                    section.solution[notation.swap ? 1 : 0]
                  ) + 1
                ]}"
              />
            </div>
            <div class="filler"></div>
            <div id="name">
              <img id="middle" src="${notation.images[5]}" />
              <div class="text-nowrap" ?data-centered=${notation.centered}>
                ${phrase.relationship[1]}
              </div>
            </div>
            <div class="filler"></div>
            <div>
              <img
                id="right"
                src="${notation.images[
                  instance.values.indexOf(
                    section.solution[notation.swap ? 0 : 1]
                  ) + 1
                ]}"
              />
            </div>
            <div class="entity border rounded p-3 text-nowrap">
              ${phrase.relationship[2]}
            </div>
          </div>
        </section>

        <section class="lead text-nowrap px-2 py-3">
          <b>
            Schritt 1: Erstellen sie das Typschema mit den Hauptattributen
          </b>
        </section>

        <!-- "Add Table" Buttons -->
        <section id="table_buttons" class="p-2 text-nowrap">
          ${addTableButton(0)} ${addTableButton(1)} ${addTableButton(2)}
        </section>

        <!-- Notation Comment
        <section class="comment" ?data-hidden=${phrase_nr !== 1 ||
        !notation.comment ||
        section.input.keys.find((table) => table)}>
          <div class="alert alert-info mt-3 mb-0" role="alert">${notation.comment}</div>
        </section>
        -->

        <!-- Relational Scheme Tables -->
        <section id="tables" class="px-2 text-nowrap">
          <div>${renderTable(0, 1)}</div>
          <div>
            ${arrow(1, 2, 0, events.onArrowChange)}
            ${arrow(1, 1, 0, events.onArrowChange)}
          </div>
          <div>${arrow(1, 2, 0)} ${arrow(1, 0, 1)}</div>
          <div>${arrow(1, 2, 0)} ${arrow(1, 0, 1, events.onArrowChange)}</div>
          <div>
            ${arrow(1, 2, 0)}
            <div>${renderTable(1, 1)}</div>
          </div>
          <div>${arrow(1, 0, 2)} ${arrow(1, 2, 1, events.onArrowChange)}</div>
          <div>${arrow(1, 0, 2)} ${arrow(1, 1, 2)}</div>
          <div>
            ${arrow(1, 0, 2, events.onArrowChange)}
            ${arrow(1, 1, 2, events.onArrowChange)}
          </div>
          <div>${renderTable(2, 1)}</div>
        </section>
        <!-- Phrase Comments -->
        ${(!section.feedback &&
          (!section.input.keys[0] || !section.input.keys[2]) &&
          phraseComment(instance.text.comment.create_tables)) ||
        ""}
        ${(!section.feedback &&
          !section.input.keys.every(
            (table) => !table || table.some((key, i) => key && i < 3)
          ) &&
          phraseComment(instance.text.comment.add_keys)) ||
        ""}
        ${(!section.feedback &&
          missingArrowheads() &&
          phraseComment(instance.text.comment.missing_arrow)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          (!section.input.keys[0] || !section.input.keys[2]) &&
          phraseComment(instance.text.comment.missing_entity_table)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          ((section.input.keys[0] &&
            !section.input.keys[0][3] &&
            !section.input.keys[0].some((key) => key === "oid")) ||
            (section.input.keys[2] &&
              !section.input.keys[2][3] &&
              !section.input.keys[2].some((key) => key === "oid"))) &&
          phraseComment(instance.text.comment.missing_entity_oid)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[1] &&
          phraseComment(instance.text.comment.no_nm_table)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          !section.input.keys[1] &&
          phraseComment(instance.text.comment.missing_nm_table)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[1] &&
          (!section.input.keys[1][0] || !section.input.keys[1][2]) &&
          phraseComment(instance.text.comment.missing_nm_oref)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[1] &&
          section.input.keys[1][0] &&
          section.input.keys[1][2] &&
          (section.input.keys[1][0] !== "oid" ||
            section.input.keys[1][2] !== "oid") &&
          phraseComment(instance.text.comment.missing_nm_oid, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          JSON.stringify(section.input.keys) ===
            JSON.stringify(section.feedback.keys) &&
          JSON.stringify(section.input.arrows) !==
            JSON.stringify(section.feedback.arrows) &&
          phraseComment(
            instance.text.comment.missing_arrowhead,
            section.input.keys[0][2] ? 0 : 2
          )) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[1] &&
          section.input.keys[1][0] &&
          section.input.keys[1][2] &&
          JSON.stringify(section.input.arrows) !==
            JSON.stringify(section.feedback.arrows) &&
          phraseComment(instance.text.comment.missing_arrowhead_nm, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          left === "1" &&
          right === "1" &&
          JSON.stringify(section.input) === JSON.stringify(section.feedback) &&
          phraseComment(instance.text.comment.merge_11)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[0] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[2] &&
          ((section.input.keys[0][2] !== section.feedback.keys[0][2] &&
            section.input.keys[0][2] === section.feedback.keys[2][0]) ||
            (section.input.keys[2][0] !== section.feedback.keys[2][0] &&
              section.input.keys[2][0] === section.feedback.keys[0][2])) &&
          phraseComment(instance.text.comment.wrong_site, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[0] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[2] &&
          (section.input.keys[0][5][2].me !==
            section.feedback.keys[0][5][2].me ||
            section.input.keys[2][5][0].me !==
              section.feedback.keys[2][5][0].me) &&
          phraseComment(instance.text.comment.wrong_me, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[1] &&
          section.feedback.keys[1] &&
          (section.input.keys[1][5][0].me !== "1-1" ||
            section.input.keys[1][5][2].me !== "1-1") &&
          phraseComment(instance.text.comment.wrong_me_nm, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[0] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[2] &&
          ((section.input.keys[0][5][2].name === "oref" &&
            section.feedback.keys[0][5][2].name === "eb") ||
            (section.input.keys[2][5][0].name === "oref" &&
              section.input.keys[2][5][0].feedback === "eb")) &&
          phraseComment(instance.text.comment.wrong_eb, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[0] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[2] &&
          ((section.input.keys[0][5][2].name === "eb" &&
            section.feedback.keys[0][5][2].name === "oref") ||
            (section.input.keys[2][5][0].name === "eb" &&
              section.input.keys[2][5][0].feedback === "oref")) &&
          phraseComment(instance.text.comment.wrong_oref, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[0] &&
          section.input.keys[1] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[1] &&
          section.feedback.keys[2] &&
          (section.input.keys[0][4] !== section.feedback.keys[0][4] ||
            section.input.keys[1][4] !== section.feedback.keys[1][4] ||
            section.input.keys[2][4] !== section.feedback.keys[2][4]) &&
          phraseComment(instance.text.comment.wrong_tab, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          !is_multi &&
          section.input.keys[0] &&
          section.input.keys[2] &&
          section.feedback.keys[0] &&
          section.feedback.keys[2] &&
          (section.input.keys[0][5][2].be !==
            section.feedback.keys[0][5][2].be ||
            section.input.keys[2][5][0].be !==
              section.feedback.keys[2][5][0].be) &&
          phraseComment(instance.text.comment.wrong_be, 0)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          is_multi &&
          section.input.keys[1] &&
          section.feedback.keys[1] &&
          (section.input.keys[1][5][0].be !== false ||
            section.input.keys[1][5][2].be !== false) &&
          phraseComment(instance.text.comment.wrong_be, 0)) ||
        ""}
        <div ?data-hidden=${!tablesConnected()}>
          <section class="lead text-nowrap px-2 py-3">
            <b> Schritt 2: Welche Objekttabellen müssen erstellt werden </b>
          </section>

          <!-- "Add Table" Buttons -->
          <section id="table_buttons" class="p-2 text-nowrap">
            ${blabla(0)} ${blabla(1)} ${blabla(2)}
          </section>

          <section id="tables" class="px-2 text-nowrap">
            <div>${renderTable(0, 2)}</div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 2, 0, events.onArrowChange)}
              ${arrow(2, 1, 0, events.onArrowChange)}
            </div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 2, 0)} ${arrow(2, 0, 1)}
            </div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 2, 0)} ${arrow(2, 0, 1, events.onArrowChange)}
            </div>
            <div>
              <div
                ?data-hidden=${(section.input.keys[0] &&
                  section.input.keys[0][4] &&
                  section.input.keys[2] &&
                  section.input.keys[2][4]) ||
                (section.input.keys[1] && section.input.keys[1][4])}
              >
                ${arrow(2, 2, 0)}
              </div>
              <div>${renderTable(1, 2)}</div>
            </div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 0, 2)} ${arrow(2, 2, 1, events.onArrowChange)}
            </div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 0, 2)} ${arrow(2, 1, 2)}
            </div>
            <div
              ?data-hidden=${(section.input.keys[0] &&
                section.input.keys[0][4] &&
                section.input.keys[2] &&
                section.input.keys[2][4]) ||
              (section.input.keys[1] && section.input.keys[1][4])}
            >
              ${arrow(2, 0, 2, events.onArrowChange)}
              ${arrow(2, 1, 2, events.onArrowChange)}
            </div>
            <div>${renderTable(2, 2)}</div>
          </section>
        </div>
        ${(section.feedback &&
          !section.correct &&
          phraseComment(instance.text.comment.s2)) ||
        ""}
        ${(instance.feedback &&
          section.feedback &&
          ((section.input.keys[0] &&
            section.feedback.keys[0] &&
            section.input.keys[0][4] != section.feedback.keys[0][4]) ||
            (section.input.keys[1] &&
              section.feedback.keys[1] &&
              section.input.keys[1][4] != section.feedback.keys[1][4]) ||
            (section.input.keys[2] &&
              section.feedback.keys[2] &&
              section.input.keys[2][4] != section.feedback.keys[2][4])) &&
          phraseComment(instance.text.comment.wrong_tab, 0)) ||
        ""}

        <!-- Buttons -->
        <section class="d-flex justify-content-center flex-wrap px-2 py-3">
          <button
            class="btn btn-outline-danger m-1"
            @click=${events.onCancelButton}
            ?data-hidden=${!instance.oncancel}
          >
            ${instance.text.cancel}
          </button>
          <button
            class="btn btn-primary m-1"
            @click=${events.onSubmitButton}
            ?data-hidden=${section.feedback || !tablesConnected()}
          >
            ${instance.text.submit}
          </button>
          <button
            class="btn btn-warning m-1"
            @click=${events.onRetryButton}
            ?data-hidden=${section.correct !== false || !instance.retry}
          >
            ${instance.text.retry}
          </button>
          <button
            class="btn btn-info m-1"
            @click=${events.onSolutionButton}
            ?data-hidden=${section.correct !== false || !instance.show_solution}
          >
            ${section.feedback && section.feedback.show_solution
              ? instance.text.show_feedback
              : instance.text.show_solution}
          </button>
          <button
            class="btn btn-primary m-1"
            @click=${events.onNextButton}
            ?data-hidden=${!section.feedback || phrase_nr === instance.number}
          >
            ${instance.text.next}
          </button>
          <button
            class="btn btn-primary m-1"
            @click=${events.onFinishButton}
            ?data-hidden=${!section.feedback ||
            phrase_nr < instance.number ||
            !instance.onfinish}
          >
            ${instance.text.finish}
          </button>
          <button
            id="userData"
            class="btn btn-primary m-1"
            ?data-hidden=${!window.webdav}
            @click=${window.webdav ? toggleDataModal : null}
            data-lang="btn_data"
          >
            ${instance.text.btn_data}
          </button>
        </section>

        <!-- Current State -->
        <section
          class="text-center px-2 pb-3"
          ?data-hidden=${!instance.feedback || state.total < 2}
        >
          <small id="current_state"
            >${instance.ccm.helper.html(
              instance.text.current_state,
              state.correct.toString(),
              state.total.toString()
            )}</small
          >
        </section>
      </div>
    </main>
    <footer class="mx-3 mt-3 text-center">
      <img src="./resources/img/logos.jpg" />
      <!-- Logos -->
    </footer>
  `;

  /**
   * returns the HTML template for an 'add table' button
   * @param {number} table - table index (0: left, 1: middle, 2: right)
   * @returns {TemplateResult} HTML template for an 'add table' button
   */
  function addTableButton(table) {
    return html`
      <div
        class="text-${table === 0
          ? "left"
          : table === 1
          ? "center px-2"
          : "right"}"
      >
        <button
          class="btn btn-${section.feedback
            ? section.feedback.keys[table]
              ? "danger"
              : "success"
            : "primary"} btn-sm"
          @click=${() => events.onAddTyp(table)}
          .disabled=${section.feedback}
          ?data-invisible=${input.keys[table] !== null}
        >
          + "${section.relationship[table]}"${instance.text.typ}
        </button>
      </div>
    `;
  }
  /**
   * returns the HTML template for an 'add table' button
   * @param {number} table - table index (0: left, 1: middle, 2: right)
   * @returns {TemplateResult} HTML template for an 'add table' button
   */
  function blabla(table) {
    return html`
      <div
        class="text-${table === 0
          ? "left"
          : table === 1
          ? "center px-2"
          : "right"}"
        ?data-invisible=${input.keys[table] === null}
      >
        <button
          class="btn btn-${section.feedback
            ? section.feedback.keys[table] && !section.feedback.keys[table][4]
              ? "danger"
              : "success"
            : "primary"} btn-sm"
          @click=${() => events.isTable(table)}
          .disabled=${section.feedback}
          ?data-invisible=${input.keys[table] !== null && !input.keys[table][4]}
        >
          + "${section.relationship[table]}"${instance.text.table}
        </button>
      </div>
    `;
  }

  /**
   * returns the HTML template for relational scheme table
   * @param {number} table - table index (0: left, 1: middle, 2: right)
   * @returns {TemplateResult} HTML template for relational scheme table
   */
  function renderTable(table, schritt) {
    /**
     * key attributes of the tables
     * @type {(string|boolean)[]}
     */
    const keys = input.keys[table];

    /**
     * missed key attributes for correct solution
     * @type {(string|boolean)[]}
     */
    const missed_keys =
      section.feedback &&
      section.feedback.keys[table] &&
      keys &&
      section.feedback.keys[table].find((key, table) => key && !keys[table]);

    /**
     * table has a composite primary key
     * @type {boolean}
     */
    const multi_oid =
      keys &&
      (keys[0] === "oid") + (keys[1] === "oid") + (keys[2] === "oid") > 0 &&
      keys[3];
    return html`
      <div
        class="scheme border"
        ?data-invisible=${keys === null || (keys[4] && schritt == 2)}
      >
        <header
          class="bg-${section.feedback
            ? section.feedback.keys[table] &&
              keys &&
              (schritt == 1 || section.feedback.keys[table][4] === keys[4])
              ? "success"
              : "danger"
            : keys == null
            ? null
            : schritt == 1
            ? "badge badge-info"
            : "light"} border-bottom px-3 py-2 d-inline-flex justify-content-center align-items-center"
        >
          <span
            >${keys === null ? null : schritt == 1 ? "Typ-" : "Tabelle-"}
            ${section.relationship[table]}
          </span>
          <span
            class="icon"
            ?data-hidden=${!keys}
            @click=${() => events.onRemoveTable(table, schritt)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg text-danger ml-1"
              viewBox="0 0 16 16"
            >
              <path
                d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"
              />
            </svg>
          </span>
        </header>
        <main class="p-2">
          <div
            class="${schritt == 2
              ? "d-flex align-items-stretch border border-primary rounded bg-light"
              : ""}"
            ?data-hidden=${!multi_oid}
          >
            <div>
              ${multi_oid && schritt == 2 && keys && keys[3]
                ? attr(
                    toID(section.relationship[table], "oid", schritt),
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    schritt
                  )
                : ""}
              ${(multi_oid &&
                keys &&
                keys[5].map((key, i) =>
                  i < 3 && key.name !== false && key.name === "oid"
                    ? attr(
                        toID(section.relationship[i], key.name, schritt),
                        false,
                        key.name === "oid",
                        key.name === "eb",
                        key.me,
                        key.be === "r",
                        key.be === "u",
                        true,
                        i,
                        schritt
                      )
                    : ""
                )) ||
              ""}
            </div>
            <div
              class="bg-primary d-flex align-items-center"
              ?data-hidden=${schritt == 1}
            >
              <span
                class="badge badge-primary ml-0"
                title="${instance.text.multi_oid_badge}"
                >OID</span
              >
            </div>
          </div>

          ${!multi_oid &&
          schritt == 2 &&
          keys &&
          keys[3] &&
          keys[0] !== "oid" &&
          keys[1] !== "oid" &&
          keys[2] !== "oid"
            ? attr(
                toID(section.relationship[table], "oid", schritt),
                true,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                schritt
              )
            : ""}
          ${(keys &&
            keys[5].map((key, i) =>
              i < 3 && key.name !== false && !(key.name === "oid" && multi_oid)
                ? attr(
                    toID(section.relationship[i], key.name, schritt),
                    false,
                    key.name === "oref" || key.name === "oid",
                    key.name === "eb",
                    key.me,
                    key.be === "r",
                    key.be === "u",
                    false,
                    i,
                    schritt
                  )
                : ""
            )) ||
          ""}

          <div class="px-1 ${missed_keys ? "bg-danger" : ""}">
            <button
              class="btn btn-link btn-sm mt-1 p-0"
              .disabled=${section.feedback}
              ?data-hidden=${(keys &&
                keys[3] &&
                !addableForeignKey(input.keys, table)) ||
              (section.feedback && !missed_keys) ||
              schritt == 2}
              @click=${() => events.onAddAttrTable(table)}
            >
              + ${instance.text.key_attr}
            </button>
          </div>
        </main>
      </div>
    `;

    /**
     **
     */
    function attr(
      name,
      oid,
      oref,
      eb,
      me,
      redundanz,
      unique,
      tab,
      reftable,
      schritt
    ) {
      return html`
        <div
          class="attr p-1  ${eb || tab
            ? "ml-3"
            : ""} d-flex align-items-center ${section.feedback &&
          section.feedback.keys[table] &&
          schritt == 1
            ? (reftable !== false &&
                keys[reftable] === section.feedback.keys[table][reftable] &&
                keys[5][reftable].me ===
                  section.feedback.keys[table][5][reftable].me &&
                keys[5][reftable].be ===
                  section.feedback.keys[table][5][reftable].be) ||
              (reftable === false &&
                oid &&
                keys[3] === section.feedback.keys[table][3])
              ? "bg-success"
              : "bg-danger"
            : ""}"
        >
          <span title="${instance.text.attr_name}"
            >${me === "0-n" || me === "1-n" ? "{" + name + "}" : name}</span
          >
          ${oid && !multi_oid
            ? html`<span
                class="badge badge-primary"
                title="${instance.text.oid_badge}"
                >OID</span
              >`
            : ""}
          ${oref
            ? html`<span
                class="badge badge-warning"
                title="${instance.text.oref_badge}"
                >REF</span
              >`
            : ""}
          ${eb
            ? html`<span
                class="badge badge-info"
                title="${instance.text.eb_badge}"
                >EB</span
              >`
            : ""}
          ${me
            ? html`<span
                class="badge badge-success"
                title="${instance.text.me_badge}"
                >[${me.toUpperCase()}]</span
              >`
            : ""}
          ${redundanz
            ? html`<span
                class="badge badge-secondary"
                title="${instance.text.redundanz_badge}"
                >R!</span
              >`
            : ""}
          ${unique
            ? html`<span
                class="badge badge-secondary"
                title="${instance.text.unique_badge}"
                >U!</span
              >`
            : ""}
          <span
            ?data-hidden=${schritt == 2}
            class="icon"
            title="${instance.text.remove_attr}"
            @click=${() => events.onRemoveAttr(table, reftable)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg text-danger ml-1"
              viewBox="0 0 16 16"
            >
              <path
                d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"
              />
            </svg>
          </span>
        </div>
      `;
    }

    /**
     * converts a string to a key attribute name
     * @param {string} string
     * @returns {string} key attribute name
     */
    function toID(string, ref, schritt) {
      switch (ref) {
        case "oid":
          return (
            string
              .toLowerCase()
              .trim()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/\W/g, "_") + "_oid"
          );
        case "oref":
          return (
            string
              .toLowerCase()
              .trim()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/\W/g, "_") + "_oid"
          );
        case "eb":
          return (
            string
              .toLowerCase()
              .trim()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/\W/g, "_") + "_typ"
          );
        default:
          break;
      }
    }
  }

  function typ() {
    return html` typ `;
  }

  /**
   * returns the HTML template for an arrow line
   * @param {number} [from] - index of the table from which the arrow starts
   * @param {number} [to] - table index
   * @param {Function} [onChange] - when the arrowhead is changed
   * @returns {TemplateResult} HTML template for an arrow line
   */
  function arrow(schritt, from, to, onChange) {
    return html`
      <div class="line" ?data-hidden=${
        !input.keys[from] ||
        !input.keys[to] ||
        (!input.keys[from][to] && !input.keys[to][from])
      }>
        <div class="${schritt == 1 ? "arrowhead" : "arrowhead2"} ${
      schritt == 1 &&
      section.feedback &&
      section.feedback.keys[from] &&
      section.feedback.keys[to] &&
      (section.feedback.keys[from][to] || section.feedback.keys[to][from])
        ? input.arrows[from][to] === section.feedback.arrows[from][to]
          ? "bg-success"
          : "bg-danger"
        : ""
    }" ?data-hidden=${!onChange}>
          
        <select data-from="${from}" data-to="${to}" .value="${(
      input.arrows[from][to] + 0
    ).toString()}" @change=${onChange} ?data-hidden=${schritt == 2}>
          <option value="0"> </option>  
            <option value="1">${from - to > 0 ? "⟵" : "⟶"}</option>
            <option value="2">${from - to > 0 ? "⇇" : "⇉"}</option>
            
          </select>
          <div class="arrow" ?data-hidden=${
            JSON.stringify(input.arrows[0]) ===
              JSON.stringify(["0", "0", "0"]) &&
            JSON.stringify(input.arrows[1]) ===
              JSON.stringify(["0", "0", "0"]) &&
            JSON.stringify(input.arrows[2]) === JSON.stringify(["0", "0", "0"])
          }>
            <div class="filler" ?data-hidden=${from - to > 0}></div>
            <div ?data-hidden=${input.arrows[from][to] !== "0"}></div>
            <svg ?data-hidden=${
              input.arrows[from][to] !== "1"
            } height="8" width="8" class="${
      from - to > 0 ? "mirrored" : ""
    }"><polygon points="0,0 8,4 0,8" style="fill:black"></polygon></svg>
            <svg ?data-hidden=${
              input.arrows[from][to] !== "2"
            } version="1.1" baseProfile="full" width="25" height="25" class="${
      from - to > 0 ? "mirrored" : ""
    } xmlns="http://www.w3.org/2000/svg">
              <rect id="svg_background" width="100%" height="100%" x="0" y="0" style="fill:#fff;" ></rect>
              <polygon points="10,0 18,4 10,8"  style="fill:#000;fill-rule:nonzero;stroke-width:0;stroke:#000000;opacity:1;"></polygon>
              <polygon points="10,16 18,20 10,24"  style="fill:#000;fill-rule:nonzero;stroke-width:0;stroke:#000000;opacity:1;"></polygon>
              <line x1="0" y1="4" x2="10" y2="4"  style="stroke-width: 2; stroke: rgb(0, 0, 0); opacity: 1;"></line>
             <line x1="0" y1="20" x2="10" y2="20"  style="stroke-width: 2; stroke: rgb(0, 0, 0); opacity: 1;"></line>
              <line x1="1" y1="5" x2="1" y2="20"  style="stroke-width: 2; stroke: rgb(0, 0, 0); opacity: 1;"></line>
              <circle cx="4" cy="12"  r="1" style="fill:#000;stroke-width:0;stroke:#000000;opacity:1;"></circle>
              <circle cx="8" cy="12"  r="1" style="fill:#000;stroke-width:0;stroke:#000000;opacity:1;"></circle>
              <circle cx="12" cy="12"  r="1" style="fill:#000;stroke-width:0;stroke:#000000;opacity:1;"></circle>
            </svg>
            <div class="filler" ?data-hidden=${from - to < 0}></div>
          </div>
        </div>
        <div ?data-hidden=${
          onChange ||
          (JSON.stringify(input.arrows[0]) ===
            JSON.stringify(["0", "0", "0"]) &&
            JSON.stringify(input.arrows[1]) ===
              JSON.stringify(["0", "0", "0"]) &&
            JSON.stringify(input.arrows[2]) === JSON.stringify(["0", "0", "0"]))
        } ></div>
      </div>
    `;
  }

  /**
   * returns the HTML template for a comment
   * @param {string} text - comment text
   * @param {number} [oref_table] - index of the table that needs a foreign key
   * @returns {TemplateResult} HTML template for a comment
   */
  function phraseComment(text, oref_table) {
    return html`
      <section class="comment">
        <div class="alert alert-info mt-2 mb-0" role="alert">
          ${text
            .replaceAll("%middle%", phrase.relationship[1])
            .replaceAll("%oref%", phrase.relationship[oref_table])
            .replaceAll("%noref%", phrase.relationship[oref_table ? 0 : 2])}
        </div>
      </section>
    `;
  }

  /**
   * checks whether there are at least 2 tables and whether each table is connected to at least one other table
   * @returns {boolean}
   */
  function tablesConnected() {
    // less than two tables? => at least two tables required
    if (input.keys.filter((table) => table).length < 2) return false;

    // check for each table => is the table linked to at least one other table?
    for (let from = 0; from < input.keys.length; from++)
      if (input.keys[from]) if (!isConnected(from)) return false;
    return true;

    /**
     * checks whether a table is connected to at least one other table
     * @param {number} from - table index (0: left, 1: middle, 2: right)
     * @return {boolean}
     */
    function isConnected(from) {
      for (
        let to = 0;
        to < input.keys.length;
        to++ // check for each table:
      )
        if (from !== to)
          if (input.keys[to])
            if (input.keys[from][to] || input.keys[to][from])
              if (input.arrows[from][to] || input.arrows[to][from])
                // - only other tables
                // - other table is created?
                // - both tables connected with a foreign key?
                // - connection has an arrow head?
                return true; // => both tables are connected
      return false; // => table is not connected
    }
  }

  /**
   * checks whether there are missing arrowheads
   * @returns {boolean}
   */
  function missingArrowheads() {
    for (let i = 0; i < input.keys.length; i++)
      if (input.keys[i])
        for (let j = 0; j < input.keys[i].length; j++)
          if (input.keys[i][j] === "oref" || input.keys[i][j] === "oid") {
            if (input.arrows[i][j] === "0" && input.arrows[j][i] === "0")
              return true;
          }
    return false;
  }
}

/**
 * returns the HTML template for legend table
 * @param {Object} instance - instance of ccmjs-based web component for ER model to relational scheme training
 * @returns {TemplateResult} HTML template for legend table
 */
export function legend(instance) {
  return html`
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col"></th>
          ${instance.text.selection.map((selection, i) =>
            !i ? "" : html`<th scope="col">${selection}</th>`
          )}
        </tr>
      </thead>
      <tbody>
        ${Object.values(instance.notations)
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(
            (notation) => html`
              <tr>
                <th scope="row" style="vertical-align: middle">
                  ${notation.title}
                </th>
                ${instance.text.selection.map((selection, i) =>
                  !i ? "" : html`<td><img src="${notation.images[i]}" /></td>`
                )}
              </tr>
            `
          )}
      </tbody>
    </table>
  `;
}

/**
 * returns the HTML template for 'add foreign key' form
 * @param {Object} instance - instance of ccmjs-based web component for ER model to relational scheme training
 * @param {Object} section - app state data of current section
 * @param {number} table - index of the table that will contain the foreign key (0: left, 1: middle, 2: right)
 * @param {Function} onSubmit - when form is submitted
 * @returns {TemplateResult} HTML template for 'attribute form'
 */
export function addKeyForm(instance, section, table, onSubmit) {
  /**
   * referencable tables
   * @type {number[]}
   */
  const tables = [];

  // determine referencable tables
  for (
    let i = 0;
    i <= 2;
    i++ // check for each possible table:
  )
    if (table !== i)
      if (section.input.keys[i])
        if (section.input.keys[i][3])
          if (!section.input.keys[table][i])
            // - not the table that will contain the foreign key?
            // - table is created?
            // - table has an artificial primary key?
            // - table is not already referenced by the table that will contain the foreign key?
            tables.push(i); // => table is referencable

  return html`
    <form id="attr-form" @submit=${onSubmit}>
      <!-- oid -->
      <div class="form-group" title="${instance.text.oid}" hidden=true "}>
        <input type="checkbox" name="oid" id="key-oid">
        <label class="form-check-label pl-1" for="key-oid">
          ${instance.text.oid}
          <span class="badge badge-primary" title="${
            instance.text.oid_badge
          }">OID</span>
        </label>
      </div>

      <!-- Foreign Key -->
      <div class="form-group" title="${instance.text.oref_input}">
        <input type="checkbox" name="oref" id="key-oref" .disabled=${!addableForeignKey(
          section.input.keys,
          table
        )}>
        <label class="form-check-label pl-1" for="key-oref">
          ${instance.text.oref}
          <span class="badge badge-warning" title="${
            instance.text.oref_badge
          }">REF</span>
        </label>
      </div>

      <!-- Einbettung -->
      <div class="form-group" title="${instance.text.eb_input}">
        <input type="checkbox" name="eb" id="key-eb" .disabled=${!addableForeignKey(
          section.input.keys,
          table
        )}>
        <label class="form-check-label pl-1" for="key-eb">
          ${instance.text.eb}
          <span class="badge badge-info" title="${
            instance.text.eb_badge
          }">EB</span>
        </label>
      </div>

      <!-- Referenced Table/Typ -->
      <div id="ref_select" class="form-group" title="${
        instance.text.ref_select_input
      }">
        <label for="key-ref-select">${instance.text.ref_select}</label>
        <select class="form-control" name="table" id="key-ref-select">
          ${tables.map(
            (table) =>
              html`<option value="${table}">
                ${section && section.relationship[table]}
              </option>`
          )}
        </select>
      </div>

      <!--Mengenwertigesatrebut -->
      <div class="form-group" title="${instance.text.ma_input}">
        <label class="form-check-label pl-1" for="key-maspan">
          
          <select name="maselect" id="key-maselect" for="key-maselect">
            <option value="1-1">1-1</option>  
            <option value="0-n">0-N</option>
            <option value="1-n">1-N</option>
            <option value="0-1">0-1</option> 
          </select>
          ${instance.text.ma}
          <span id="maspan" for="key-maspan" class="badge badge-success"  title="${
            instance.text.ma_badge
          }">[1-1]</span>
        </label>
      </div>

      <!-- Bedingungen -->
      <div class="form-group"">
        <h5>${instance.text.bedingung}</h5>
      </div>

      <!-- Redundanzkontrolle Attribute -->
      <div class="form-group" title="${instance.text.redundanz_input}">
        <input type="checkbox" name="redundanz" id="key-redundanz">
        <label class="form-check-label pl-1" for="key-redundanz">
          ${instance.text.redundanz}
          <span class="badge badge-secondary" title="${
            instance.text.redundanz_badge
          }">R!</span>
        </label>
      </div>

      <!-- Eindeutig Attribute -->
      <div class="form-group" title="${instance.text.unique_input}">
        <input type="checkbox" name="unique" id="key-unique">
        <label class="form-check-label pl-1" for="key-unique">
          ${instance.text.unique}
          <span class="badge badge-secondary" title="${
            instance.text.unique_badge
          }">U!</span>
        </label>
      </div>
    </form>
  `;
}
/**
 * checks for a relational scheme table whether there is at least one other table that could be referenced with a foreign key
 * @param {(string|boolean)[]} keys - key attributes of the tables
 * @param {number} table - index of the table that is checked (0: left, 1: middle, 2: right)
 * @returns {boolean}
 */
function addableForeignKey(keys, table) {
  for (
    let i = 0;
    i <= 2;
    i++ // check for each possible table:
  )
    if (table !== i)
      if (keys[i])
        if (keys[i][3])
          if (!keys[table][i])
            // - not the current table?
            // - table is created?
            // - table has an artificial primary key?
            // - table is not already referenced by a foreign key in current table?
            return true; // => table is referencable with another foreign key

  return false; // => there is no other table that could be referenced with a foreign key
}
