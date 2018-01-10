function getYellKey(url) {
  const requestURL = `http://www.yellkey.com/api/new?url=${url}&time=5`;
  return fetch(requestURL)
    .then(response => response.json())
    .then(({key}) => {
      if (key) {
        return key;
      }
      throw new Error('Did not receive a YellKey');
    })
    .catch(err => {
      throw new Error(
        'Could not fetch from YellKey URL. Maybe the URL needs to be updated?'
      )
    });
}

function sendToPopup(content) {
  const container = document.getElementById('url');

  // If popup has any children, clear them.
  for (const child of container.childNodes) {
    container.removeChild(child);
  }

  // Create a new child element.
  const wrapper = document.createElement('a');
  wrapper.textContent = content;
  container.appendChild(wrapper);
}

async function main() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, ([tab]) => {
    if (!tab) {
      sendToPopup('Could not get current tab');
    }
    getYellKey(tab.url)
      .then(key => {
        const popupContent = `http://yellkey.com/${key}`;
        sendToPopup(popupContent);
      })
      .catch(err => sendToPopup(err));
  });
}

main();
