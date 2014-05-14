'use strict';

var xpathUtil = {

  getElementTree: function(element){
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode){
      var index = 0;
      for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling){
        // Ignore document type declaration.
        if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
          continue;

        if (sibling.nodeName == element.nodeName)
          ++index;
      }

      var tagName = element.nodeName.toLowerCase();
      var pathIndex = (index ? "[" + (index+1) + "]" : "");
      paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
  },

  lookupElement: function(path){
    var evaluator = new XPathEvaluator();
    var result = null;
    try{
      result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    }catch(err) {
      return null;
    }
    return result.singleNodeValue; 
  },

  toCss: function(xpath){
    return xpath
      .replace(/\[(\d+?)\]/g, function(s,m1){ return '['+(m1)+']'; })
      .replace(/\/{2}/g, '')
      .replace(/\/+/g, ' > ')
      .replace(/@/g, '')
      .replace(/\[(\d+)\]/g, ':nth-of-type($1)')
      .replace(/^\s+/, '')
      .replace(/^> /, '');
  }
};