/*global env: true */
/*eslint no-new:0 */
'use strict';

var TemplateRenderer = require('./lib/templateRenderer');
var helper = require('jsdoc/util/templateHelper');
var jsdocDocSet = require('jsdoc-docset');


TemplateRenderer.prototype.beforeGenerate = function () {
  this.view.dashTOC = jsdocDocSet.viewHelpers.dashAnchor;
};

/**
 @param {TAFFY} taffyData See <http://taffydb.com/>.
 @param {object} opts
 @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {

  var templateOptions = opts.templateOptions;

  if (!templateOptions) {
    templateOptions = {
      includeNav: false
    }
  }

  var templateRenderer = new TemplateRenderer(taffyData, tutorials, opts, templateOptions);

  return jsdocDocSet.createDocSet({
    templateHelper: helper,
    docletHelper: templateRenderer,
    opts: opts
  });
};
