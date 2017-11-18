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

function getShoutKey(url) {
  const requestURL = `http://shoutkey.com/new?url=${url}`;
  return fetch(requestURL)
    .then(response => response.text())
    .then(text => {
      // Create a document fragment so we can parse out the result.
      const frag = document.createRange().createContextualFragment(text);
      const link = frag.querySelector('.hero-unit h1 a');
      if (link) {
        return link.href;
      } else {
        throw new Error(
          'Could not parse ShoutKey from HTML response. Maybe the selector needs to be updated?'
        );
      }
    })
    .catch(err => {
      throw new Error(
        'Could not fetch from ShoutKey URL. Maybe the URL needs to be updated?'
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
    const key = await getShoutKey(currentURL);
    // Display the key in the popup.
    popupContent = key;
  } catch (err) {
    // Display the error message in the popup.
    popupContent = err.message;
  }
  sendToPopup(popupContent);
}

main();
