function updatePopup() {
  chrome.storage.local.get({websites: []}, function(result) {
    var websites = result.websites;
    var websiteList = document.getElementById("websites");
    
    websiteList.innerHTML = "";
    for (var i = 0; i < websites.length; i++) {
      var website = websites[i];
      var li = document.createElement("li");
      var webURL = website.url
      var stripPoint = webURL.indexOf("/",10);
      var strippedURL = webURL.slice(0,stripPoint);
      var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      var dateWithoutTimezone = new Date(website.timestamp).toLocaleString('en-US', options);

      li.textContent = strippedURL + " - " + dateWithoutTimezone;
      websiteList.appendChild(li);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "update_popup") {
    updatePopup();
  }
});

function sendData() {
  url = "http://127.0.0.1:5000/get_websites";
  chrome.storage.local.get({websites: []}, function(result) {
    var data = result.websites;
    chrome.tabs.create(
      { url: chrome.runtime.getURL("send.html") },
      function(tab) {
        var handler = function(tabId, changeInfo) {
          if(tabId === tab.id && changeInfo.status === "complete"){
            chrome.tabs.onUpdated.removeListener(handler);
            chrome.tabs.sendMessage(tabId, {url: url, data: data});
          }
        };

        // in case we're faster than page load (usually):
        chrome.tabs.onUpdated.addListener(handler);
        // just in case we're too late with the listener:
        chrome.tabs.sendMessage(tab.id, {url: url, data: data}, function(response) {
          chrome.extension.getBackgroundPage().console.log("Deleting data");
          // delete the websites from storage that have been sent
          chrome.storage.local.set({websites: []});
          updatePopup();
        });
      }
    ); 
    
  });
}
 
document.addEventListener('DOMContentLoaded', function() {
  chrome.extension.getBackgroundPage().console.log("Heyyyy")
  var button = document.getElementById('send-data');
  button.addEventListener('click', function() {
    sendData();
  });
});

updatePopup();
