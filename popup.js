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

updatePopup();
