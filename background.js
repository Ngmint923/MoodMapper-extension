chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    var url = tab.url;
    var timestamp = new Date().getTime();
    chrome.storage.local.get({websites: []}, function(result) {
      var websites = result.websites;
      websites.push({url: url, timestamp: timestamp});
      chrome.storage.local.set({websites: websites});
      chrome.runtime.sendMessage({action: "update_popup"});
    });
  }
});
