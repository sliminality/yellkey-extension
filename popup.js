async function getCurrentURL() {
  const window = await browser.windows.getCurrent({
    populate: true,
  });
  const {tabs} = window;
  const activeTabs = tabs.filter(({active}) => active);
  if (!activeTabs || activeTabs.length !== 1) {
    throw new Error('Could not get any active tabs');
  }
  const [activeTab] = activeTabs;
  return activeTab.url;
}

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
  const currentURL = await getCurrentURL();
  let popupContent;
  try {
    const key = await getYellKey(currentURL);
    // Display the key in the popup.
    popupContent = `http://yellkey.com/${key}`;
  } catch (err) {
    // Display the error message in the popup.
    popupContent = err.message;
  }
  sendToPopup(popupContent);
}

main();
