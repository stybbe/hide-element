'use strict';

function OnClick(info, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {'method':'RemoveElement'}, function(response) { });
  });
}

var idConsole = chrome.contextMenus.create({
  title: 'Remove Element',
  contexts: ["all"],
  onclick: OnClick
});