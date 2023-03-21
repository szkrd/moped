/**
 * Adds default protocol (https://) to a url if it has no protocol;
 * falls back to "http" if the host is localhost.
 */
export const addDefaultUriProtocol = (link: string, defaultProto = 'https') => {
  if (window.location.hostname === 'localhost') defaultProto = 'http';
  if (link.startsWith('//')) return `${defaultProto}:${link}`;
  if (link && link.trim() && !/^(https?|ftp):\/\//.test(link) && !link.includes('://')) {
    link = `${defaultProto}://` + link;
  }
  return link;
};
