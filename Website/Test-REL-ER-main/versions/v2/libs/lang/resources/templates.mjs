/**
 * @overview HTML templates of ccmjs-based web component for multilingualism
 * @author André Kless <andre.kless@web.de> 2021
 */

import { html, render } from 'https://eild-nrw.github.io/er_rel_trainer/versions/v2/libs/lit/lit.js';
export { render };

/**
 * main HTML template
 * @param {Object.<string,string>} languages - selectable languages
 * @param {string} active - active language
 * @param {Function} onChange - when another language is selected
 * @example main( { de: 'German', en: 'English' }, 'en', lang => {} )
 * @returns {TemplateResult}
 */
export function main( languages, active, onChange ) {
  return html`
    <select @change=${ event => onChange( event.target.value ) }>
      ${ Object.keys( languages ).map( lang => html`
        <option .selected=${ lang === active } value="${ lang.toLowerCase() }">
          ${ lang.toUpperCase() } - ${ languages[ lang ] }
        </option>
      ` ) }
    </select>
  `;
}
