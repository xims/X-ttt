import ReactGA from "react-ga";

// Override the console methods used by react-ga
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// Temporarily disable specific ReactGA logging
console.warn = function () {
  const args = Array.from(arguments);
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("[react-ga]")
  ) {
    // Skip react-ga warnings
    return;
  }
  originalConsoleWarn.apply(console, args);
};

console.info = function () {
  const args = Array.from(arguments);
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("[react-ga]")
  ) {
    // Skip react-ga info messages
    return;
  }
  originalConsoleInfo.apply(console, args);
};

// Create a wrapper that acts like the original ReactGA but silences debug output
const ga = {
  initialize: function (trackingId, options = {}) {
    // Force debug to false
    const cleanOptions = { ...options, debug: false };
    return ReactGA.initialize(trackingId, cleanOptions);
  },

  // Pass through all other methods
  pageview: function (path) {
    return ReactGA.pageview(path);
  },

  event: function (args) {
    return ReactGA.event(args);
  },

  // Add other methods as needed
  timing: function (args) {
    return ReactGA.timing(args);
  },

  exception: function (args) {
    return ReactGA.exception(args);
  },

  set: function (fieldsObject) {
    return ReactGA.set(fieldsObject);
  },
};

export default ga;
