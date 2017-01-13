const process = require('process');
const bowerFile = require(process.cwd() + '/bower.json');
const _ = require('lodash');

module.exports = function BowerAlternativeSourceResolver(bower) {

  const SPLIT_COMPONENT_REQUEST = /([^\/]*)\/([^#]*)#?(.*)?/;
  const ALTERNATE_SOURCES = bower.config.alternateSources || bowerFile.alternateSources || [];

  let matchRule = undefined;

  return {
    match: function(source) {
      const matchedSource = _.filter(ALTERNATE_SOURCES, ({ owner, url }) => source.indexOf(owner) === 0);      
      matchRule = _.first(matchedSource);
      return (matchRule !== undefined);
    },
    locate: function(source) {
      const aspects = SPLIT_COMPONENT_REQUEST.exec(source);
      const alternateUrlTemplate = _.template(matchRule.url);
      return alternateUrlTemplate({
        owner: aspects[1],
        package: aspects[2], 
        version: aspects[3] || ''
      });
    },
    fetch: function(endPoint, cached) {
      return {
        tempPath: './',
        removeIgnores: true
      }
    }
  };
};