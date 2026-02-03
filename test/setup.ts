import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
})

// Augment global types for JSDOM globals
declare global {
  var document: Document;
  var window: Window & typeof globalThis;
  var navigator: Navigator;
}

global.document = dom.window.document
global.window = dom.window as unknown as Window & typeof globalThis

// Use Object.defineProperty to set navigator (works with modern Node.js)
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true
})
