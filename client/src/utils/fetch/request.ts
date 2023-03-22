import { config } from '../../modules/config';
import { queryString } from '../url/queryString';

const urlPrefix = `${config.apiUrl}/api`;

const parseJson = (response: unknown) => {
  let parsed;
  try {
    parsed = JSON.parse(response as any);
  } catch {
    // ok MAY be confused with the response.ok, so let me have a "json" flag
    return { ok: false, json: false, response };
  }
  return parsed;
};

interface AbortablePromise<T> extends Promise<T> {
  abort?: () => void;
}

export type TQueryObject = Record<string, string | number | boolean>;

export interface IRequestOptions extends RequestInit {
  /** Anything that should be JSON stringified; if set, overwrites the body payload. */
  data?: any | BodyInit;
  /** Url query part, with proper escape; array resolution is NOT supported. */
  query?: TQueryObject;
  /** An object literal with string values (but NOT a string tuple or a Headers instance). */
  headers?: Record<string, string>;
  /** Auth bearer token */
  token?: string;
}

/**
 * A small fetch wrapper, that prefers json requests and responses.
 * It will always try to parse the response (be that an error or a success
 * message, if it fails then the response object will be `ok: false` with
 * an additional `json: false`).
 * @param url      full url or api path
 * @param options  fetch's request init with some convenience props added
 */
export function request(url: string, options: IRequestOptions = {}) {
  const optHeaders: Record<string, string> = { ...(options.headers ?? {}) };
  const fetchOptions: RequestInit = {
    // sane defaults from MDN
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    ...options,
  };

  // url with api prefix and query params
  const qs = options.query ? queryString.from(options.query) : '';
  const qsWithPrefix = qs ? `?${qs}` : '';
  if (!url.startsWith('http')) url = urlPrefix + url;
  url += qsWithPrefix;

  // sending data
  if (options.data !== undefined) {
    if (options.data?.constructor !== Object && !Array.isArray(options.data)) {
      throw new Error('Data must be a plain object or array. Use body for everything else.');
    }
    fetchOptions.body = JSON.stringify(options.data);
    delete (fetchOptions as any).data;
    if (!fetchOptions.method) fetchOptions.method = 'POST';
  }

  // header defaults
  const jsonType = 'application/json';
  if (!optHeaders['Content-Type']) optHeaders['Content-Type'] = jsonType;
  if (!optHeaders['Accept']) optHeaders['Accept'] = jsonType;
  const authToken = options.token ?? sessionStorage.getItem('token');
  if (authToken) {
    optHeaders.Authorization = `Bearer ${authToken}`;
    if (options.token) delete (fetchOptions as any).token;
  }
  fetchOptions.headers = optHeaders;

  // abort support
  let abortController: AbortController | undefined;
  if (!fetchOptions.signal) {
    abortController = new AbortController();
    fetchOptions.signal = abortController.signal;
  }

  const prom: AbortablePromise<Response> = fetch(url, fetchOptions);
  if (abortController) prom.abort = () => abortController?.abort();
  return prom
    .then((response) => {
      if (!response.ok) {
        // this way we can deal with non json responses
        // (like a plain text "server dead" message from nginx);
        // (if backend treats 404 as a no result, then of course we may
        // want to deal with that here, for example elastic search is like that)
        return response.text().then((body) => {
          throw { ...parseJson(body), status: response.status };
        });
      }
      // fetch will die if it tries to parse the json itself, we don't want that
      return response.text();
    })
    .then((responseText) => {
      try {
        return JSON.parse(responseText);
      } catch (err) {
        // we pipe the object proper, no need for another Error wrapping
        return Promise.reject({ ok: false, json: false, response: responseText });
      }
    })
    .catch((error) => {
      let details = '';
      if (error && typeof error === 'object' && error.status) {
        details = ` (status ${error.status})`;
      }
      console.error(`[request] fetch error${details}:`, error);
      throw error;
    });
}
