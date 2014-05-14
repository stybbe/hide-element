'use strict';

var popup = {

  addItemsToTable: function(items, url){
    try{
      var table = document.getElementById('group_table').getElementsByTagName('tbody')[0];

      for(var i = 0; i < items.length; i++){
        var row = table.insertRow(table.rows.length);
        this.bindRow_(row, items[i], url);

        var cell = row.insertCell(0);
        cell.className = "popup_item";

        var div = document.createElement('div');
        div.className = "truncate";
        var display = this.getDisplayText_(items[i]);
        var text = document.createTextNode(display);

        div.appendChild(text);
        cell.appendChild(div);

        var cell2 = row.insertCell(1);
        cell2.className = "removeButton";
      }
    }catch(err){
      console.log(err)
    }
  },

  sendMessage: function(message, cb){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, cb);
    });
  },

  removeElement: function(item, url){
    chrome.storage.local.get(url, function(items){
      chrome.storage.local.remove(url, function() {
        var index = -1;

        for (var i = 0; i < items[url].length; i++) {
          if (item.id == items[url][i].id && item.xPath == items[url][i].xPath){
            index = i;
          }
        }

        items[url].splice(index, 1);
        document.getElementById('group_table').deleteRow(index);

        if (items[url].length > 0){
          chrome.storage.local.set(items);
        }
      });
    });
  },

  bindRow_:function(row, item, url){
    row.addEventListener('click', function(){
      popup.sendMessage({
        'method':'ShowElement', 
        'item': item
      });
      popup.removeElement(item, url);
    });
  },

  getDisplayText_: function(item) {
    return item.id != "" ? item.id : item.xPath;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  popup.sendMessage({'method':'GetURL'}, function(url) { 
    chrome.storage.local.get(url, function(items){
      popup.addItemsToTable(items[url], url);
    });
  });
});