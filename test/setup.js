import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
})

global.document = dom.window.document
global.window = dom.window

// Use Object.defineProperty to set navigator (works with modern Node.js)
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true
})
