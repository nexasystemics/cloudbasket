declare module 'puppeteer' {
  export interface Page {
    goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<void>
    $eval<T>(selector: string, pageFunction: (element: Element) => T): Promise<T>
    close(): Promise<void>
  }

  export interface Browser {
    newPage(): Promise<Page>
    close(): Promise<void>
  }

  interface PuppeteerInstance {
    launch(options?: { headless?: boolean; args?: string[] }): Promise<Browser>
  }

  const puppeteer: PuppeteerInstance
  export default puppeteer
}

declare module 'pg' {
  export class Pool {
    constructor(config?: { connectionString?: string })
    query(text: string, values?: readonly unknown[]): Promise<unknown>
  }
}
