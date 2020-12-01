/* eslint-disable @typescript-eslint/ban-types */

/**
 * Hacked together typings for ZAFClient. May be incorrect!
 * @see https://developer.zendesk.com/apps/docs/core-api/client_api
 */
interface ZafMetadata {
  appId: number;
  name: string;
  installationId: number;
  version: string;
  settings: {
    title: string;
  };
}

/**
 * Hacked together typings for ZAFClient. May be incorrect!
 * @see https://developer.zendesk.com/apps/docs/core-api/client_api
 */
interface ZafContext {
  instanceGuid: string;
  product: string;
  account: {
    subdomain: string;
  };
  location: 'ticket_sidebar';
  ticketId: number;
}

/**
 * Hacked together typings for ZAFClient. May be incorrect!
 * @see https://developer.zendesk.com/apps/docs/core-api/client_api
 */
type ZafHandler = (e: unknown) => void;

/**
 * Hacked together typings for ZAFClient. May be incorrect!
 * @see https://developer.zendesk.com/apps/docs/core-api/client_api
 */
interface ZafRequestOptions {
  accepts?: object;
  autoRetry?: boolean;
  cache?: boolean;
  contentType?: boolean | string;
  cors?: boolean;
  crossDomain?: boolean;
  data?: object | string | [];
  dataType?: 'text' | 'json';
  headers?: object;
  httpCompleteResponse?: boolean;
  ifModified?: boolean;
  jwt?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  mimeType?: string;
  password?: string;
  secure?: boolean;
  timeout?: number;
  traditional?: boolean;
  type?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url?: string;
  username?: string;
  xhrFields?: object;
}

declare namespace ZAFClient {
  function init(): ZafClientActual | false;

  /**
   * Hacked together typings for ZAFClient. May be incorrect!
   * @see https://developer.zendesk.com/apps/docs/core-api/client_api
   */
  interface ZafClientActual {
    context(): Promise<ZafContext>;
    get<T>(key: keyof T): Promise<T>;
    get<K extends string>(key: K): Promise<Record<K, unknown>>;
    get<K extends string>(keys: K[]): Promise<Record<K, unknown>>;
    set<K extends string, V>(key: K, value: V): Promise<Record<K, V>>;
    set<K extends string, V>(object: Record<K, V>): Promise<Record<K, V>>;
    has(eventName: string, handler: ZafHandler): boolean;
    instance(instanceGuid: string): ZafClientActual;
    metadata(): Promise<ZafMetadata>;
    off(name: string, handler: ZafHandler): void;
    on(name: string, handler: ZafHandler): void;
    request(options: ZafRequestOptions): Promise<unknown>;
    trigger(name: string, data: unknown): void;

    invoke(operation: 'resize', o: { width: string, height: string }): Promise<unknown>;
    invoke(operation: 'routeTo', appLocation: string, appName: string, paramPath: string): Promise<unknown>;
    invoke(name: string, ...args: unknown[]): Promise<unknown>;
    invoke(pathToArgsObject: { [name: string]: unknown[] }): Promise<unknown[]>;
  }
}