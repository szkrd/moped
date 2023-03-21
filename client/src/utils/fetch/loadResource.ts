function logMessage(resourceName: string, success = true) {
  //  if (!simpleLocalStorage.getItemRaw(DebugFlags.LogNetwork)) return;
  console.info('%c%s', 'color: blue', `↘ resource "${resourceName}" ${success ? 'loaded' : 'failed to load!'}`);
}

// David Walsh's simple resource loader wrapped with a promise
function load(tag: 'link' | 'script' | 'img') {
  return function (url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = document.createElement(tag);
      element.classList.add(`load-resource-${tag}`);
      let parent = 'body';
      let attr = 'src';

      element.onload = () => {
        logMessage(url, true);
        resolve();
      };
      element.onerror = () => {
        logMessage(url, false);
        reject(url);
      };

      switch (tag) {
        case 'script':
          (element as HTMLScriptElement).async = true;
          break;
        case 'link':
          (element as HTMLLinkElement).type = 'text/css';
          (element as HTMLLinkElement).rel = 'stylesheet';
          attr = 'href';
          parent = 'head';
      }

      element[attr] = url;
      document[parent].appendChild(element);
    });
  };
}

export const loadResource = {
  /** Load css dynamically using html link tag (appended to head) */
  css: load('link'),
  /** Load javascript dynamically using html script tag (appended to body) */
  js: load('script'),
  /** Load image dynamically using html img tag (appended to body) */
  img: load('img'),
};
