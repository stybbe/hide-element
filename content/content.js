'use strict';

var content = {
  hideElement: function(element){
    var url = this.getURL();
    var xPath = xpathUtil.getElementTree(element);
    var id = element.id;

    var style = window.getComputedStyle(element);
    var default_display = style.getPropertyValue('display');

    this.hideElementCSS(id, xPath);

    chrome.storage.local.get(url, function(items){
      var site = items;

      if (site[url] == null){
        site[url] = []
      }
      site[url].push({ 
        "id": id, 
        "xPath": xPath,
        "default_display": default_display
      });

      chrome.storage.local.set(site)
    });
  },

  resetElement: function(item){
    var selector = item.id != "" ? ('#' + item.id) : xpathUtil.toCss(item.xPath);
    var rule = cssUtil.getRule(selector);

    if (rule)
      rule.style['display'] = item.default_display;
    else
      console.log("couldn't find css rule.")
  },

  hideSavedElements: function(){
    var url = this.getURL();

    chrome.storage.local.get(url, function(sites){

      for(var site in sites){
        var items = sites[site];
        for(var i = 0; i < items.length; i++){
          content.hideElementCSS(items[i].id, items[i].xPath);
        }
      }

    });
  },

  getURL: function(){
    return location.host;
  },

  hideElementCSS: function(id, xPath){
    if (id != null && id != "")
      cssUtil.setNewStyle('#' + id, 'display', 'none');
    else if (xPath != null && xPath != "")
      cssUtil.setNewStyle(xpathUtil.toCss(xPath), 'display', 'none');
    else
      console.log("Couldn't hide element!");
  }
};


var _element = null;

document.addEventListener('mouseup', function (event) {
    if (event.button == 2) {
      _element = event.target;
    }
})

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {

    if (message.method == "RemoveElement")
      content.hideElement(_element);
    else if (message.method == "GetURL") 
      sendResponse(content.getURL());
    else if (message.method == "ShowElement")
      content.resetElement(message.item);
    
  }
);

content.hideSavedElements();