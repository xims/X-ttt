const JSDOMEnvironment = require('jest-environment-jsdom');

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    
    if (this.global.window) {
      Object.defineProperty(this.global.window, 'localStorage', {
        value: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
        writable: true
      });
    }

    if (this.global) {
      this.global.localStorage = this.global.window.localStorage;
    }
  }
}

module.exports = CustomEnvironment; 