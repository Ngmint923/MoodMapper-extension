var onMessageHandler = function(message){
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);
  
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", message.url);
    chrome.extension.getBackgroundPage().console.log(message.data)
    for(var key in message.data) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", message.data[key]["url"]);
      hiddenField.setAttribute("value", message.data[key]["timestamp"]);
      chrome.extension.getBackgroundPage().console.log(message.data[key]["url"])
      chrome.extension.getBackgroundPage().console.log(message.data[key]["timestamp"])
      form.appendChild(hiddenField);
    }
    chrome.extension.getBackgroundPage().console.log(form)
    document.body.appendChild(form);
    console.log(message);
    form.submit();
  };
  
chrome.runtime.onMessage.addListener(onMessageHandler);