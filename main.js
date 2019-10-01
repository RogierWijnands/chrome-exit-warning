chrome.runtime.onInstalled.addListener(() => {
  let tabs = [];

  chrome.tabs.onCreated.addListener((tab) => {
    tabs[tab.id] = {id: tab.id, url: tab.url, windowId: tab.windowId};
  });

  chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (typeof tabs[id] !== 'undefined') {
      tabs[id].url = tab.url;
      tabs[id].windowId = tab.windowId;
    }
  });

  chrome.tabs.onRemoved.addListener((id, info) => {
    if (typeof tabs[id] !== 'undefined') {
      if (!info.isWindowClosing) {
        console.log(id, tabs);
        tabs = tabs.splice(tabs.indexOf(id), 1);
        console.log(id, tabs);
      }
    }
  });

  chrome.windows.onRemoved.addListener((id) => {
    const r = confirm("Are you sure you want to close this window?");

    if (!r) {
      let count = 0;
      for (let i in tabs) {
        if (tabs[i].windowId === id) {
          if (count === 0) {
            chrome.windows.create({url: tabs[i].url});
          } else {
            chrome.tabs.create({url: tabs[i].url});
          }
          count++;
        }
      }
    }

    tabs = tabs.splice(tabs.indexOf(id), 1);
  });

});
