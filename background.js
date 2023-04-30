chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url != "chrome://newtab/" && tab.url != "" && !tab.url.startsWith("http://127.0.0.1:5000/get_websites")) {
    saveSite(tab);
  }
});

chrome.tabs.onActivated.addListener(function(tabId) { 
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    if (tabs[0].url != "chrome://newtab/" && tabs[0].url != "") 
      saveSite(tabs[0])
  })
});

function saveSite(tab) {
  console.log("Adding website to storage");
  var url = tab.url;
  console.log(url)
  var timestamp = new Date().getTime();
  chrome.storage.local.get({websites: []}, function(result) {
    var websites = result.websites;
    websites.push({url: url, timestamp: timestamp});
    chrome.storage.local.set({websites: websites});
    chrome.runtime.sendMessage({action: "update_popup"});
  });
}
