'use strict';

var cssUtil = {
  getRule: function(rule, flag){
    rule = rule.toLowerCase();

    try{
      for (var i=0; i<document.styleSheets.length; i++){
        var styleSheet=document.styleSheets[i];
        var ii=0;
        var cssRule=false;
        do {
          if (styleSheet.cssRules){
            cssRule = styleSheet.cssRules[ii];
            if (cssRule && cssRule.selectorText){
              if (cssRule.selectorText.toLowerCase()==rule){

                if (flag=='delete'){
                  styleSheet.deleteRule(ii);
                  return true;
                } else {
                  return cssRule;
                }
              }
            }
            ii++;
          }
        }while (cssRule)
      }
    }catch (err){
      console.log(err)
    }
    return false;
  },

  deleteRule: function(rule){
    return this.getRule(rule,'delete');
  },

  addRule: function(rule){
    document.styleSheets[0].addRule(rule, null, 0);

    return getRule(rule);
  },

  setNewStyle: function(selector, property, value){
    var rule = cssUtil.getRule(selector);

    if (rule)
      rule.style[property] = value;
    else{
      var node = document.createElement('style');
      node.innerHTML = selector + '{'+ property + ':' + value +'}';
      document.getElementsByTagName("head")[0].appendChild(node);
    }
  }
};