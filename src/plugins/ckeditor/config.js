/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
const config = {
  language: 'zh-cn',
  uiColor: '#9AB8F3',
  bodyClass: 'main-content'
}
config.toolbarGroups = [
  {name: 'clipboard', groups: ['clipboard', 'undo']},
  {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
  {name: 'links'},
  {name: 'insert'},
  {name: 'forms'},
  {name: 'tools'},
  {name: 'document', groups: ['mode', 'document', 'doctools']},
  {name: 'others'},
  '/',
  {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
  {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
  {name: 'styles'},
  {name: 'colors'},
  {name: 'about'}
]

// Remove some buttons provided by the standard plugins, which are
// not needed in the Standard(s) toolbar.
config.removeButtons = 'Underline,Subscript,Superscript'

// Set the most common block elements.
config.format_tags = 'p;h1;h2;h3;pre'

// Simplify the dialog windows.
config.removeDialogTabs = 'image:advanced;link:advanced'

export {config as default}
