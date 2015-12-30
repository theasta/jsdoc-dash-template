/*global env: true */
/*eslint no-new:0 */
'use strict';

var TemplateRenderer = require('./lib/templateRenderer');
var DocSetGenerator = require('jsdoc-docset-generator');
var helper = require('jsdoc/util/templateHelper');
var fs = require('jsdoc/fs');
var path = require('path');

function convertToDashType(type) {
    var map = {
        "module": "Module",
        "external": "Resource",
        "function": 'Function',
        "class": 'Class',
        "callback": "Callback",
        "namespace": "Namespace",
        "mixin": "Mixin",
        "event": "Event",
        "globalobj": "Global",
        "file": "File",
        "member": "Property",
        "typedef": "Struct",
        "tutorial": "Guide"
    };
    return map[type];
}

TemplateRenderer.prototype.beforeGenerate = function () {
    this.view.dashTOC = function (doc) {
        var entryName = doc.name;
        if (doc.kind === 'globalobj') { entryName = 'Global'; }
        var entryType = doc.kind;
        if (doc.kind === 'typedef' && doc.signature) {
            entryType = 'callback';
        }
        return '<a name="//apple_ref/' + convertToDashType(entryType) + '/' + encodeURIComponent(entryName) + '" class="dashAnchor"></a>';
    };
};
TemplateRenderer.prototype.buildDocSet = function () {
    var members = this.getMembers();
    var entries = [];
    var regExp = /<a href="([^"]*)"/;

    ['modules', 'classes', 'namespaces', 'mixins', 'events'/*, 'interfaces'*/].forEach(function (key) {
        members[key].forEach(function (item) {
            var url = helper.linkto(item.longname, item.name);
            var entryPath = regExp.exec(url)[1];
            entries.push( {
                name: item.longname.replace('module:', ''),
                type: convertToDashType(item.kind),
                path: entryPath
            });

        });
    });

    members.globals.forEach(function (item) {
        var url = helper.linkto(item.longname, item.name);
        var entryPath = regExp.exec(url)[1];
        entries.push( {
            name: item.longname,
            type: convertToDashType(item.kind),
            path: entryPath
        });

    });

    members.externals.forEach(function(item) {
        var url = helper.linkto( item.longname, item.name.replace(/(^"|"$)/g, '') );
        var entryPath = regExp.exec(url)[1];

        entries.push( {
            name: item.name,
            type: convertToDashType(item.kind),
            path: entryPath
        });
    });

    members.tutorials.forEach(function(item) {
        var url = this.tutoriallink(item.name);
        var entryPath = regExp.exec(url)[1];
        entries.push( {
            name: item.name,
            type: 'Guide',
            path: entryPath
        });
    }, this);

    return entries;
};
/**
 @param {TAFFY} taffyData See <http://taffydb.com/>.
 @param {object} opts
 @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {

    var templateOptions = {
        includeNav: false
    };

    var docsetDestination = opts.destination;
    opts.destination += path.sep + "tmp" + Date.now();

    var templateRenderer = new TemplateRenderer(taffyData, tutorials, opts, templateOptions);

    var entries = templateRenderer.buildDocSet();

    var config = {};
    config.documentation = opts.destination;
    config.docSetRoot = docsetDestination;
    config.docSetName = path.basename(docsetDestination);

    try {
        var jsdocConf = opts.configure ? require(path.resolve(opts.configure)) : null;

        if (jsdocConf && jsdocConf.docset) {
            if (jsdocConf.docset.name) { config.docSetName = jsdocConf.docset.name; }
            if (jsdocConf.docset.icon) { config.icon = jsdocConf.docset.icon; }
        }
    } catch (e) {}

    var generator = new DocSetGenerator(config);

    return generator
        .populate(entries);
};
