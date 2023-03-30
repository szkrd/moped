/**
 * Adds default protocol (https://) to a url if it has no protocol;
 */
export const addDefaultUriProtocol = (link: string, defaultProto = 'https') => {
  if (link.startsWith('//')) return `${defaultProto}:${link}`;
  if (link && link.trim() && !/^(https?|ftp):\/\//.test(link) && !link.includes('://')) {
    link = `${defaultProto}://` + link;
  }
  return link;
};
