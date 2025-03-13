# A simple example of a full multiplayer game web app built with React.js and Node.js stack

Major libraries used on front end:
- react
- webpack
- babel
- react-router
- ampersand
- sass
- jest

Major libraries used on server:
- node.js
- socket.io
- express

### Folder structure:
- **WS** - server side and compiled front end
- **react_ws_src** - React development source and testing

---

### View it online at 
https://x-ttt.herokuapp.com/

#### Configurable with external XML file - 
https://x-ttt.herokuapp.com/ws_conf.xml

---

### New Features:
- Chat with your opponent while playing
  - Messages appear instantly
  - See who sent what and when
  - New messages scroll into view automatically 
  - Keep messages short and sweet (500 chars max)
  - Simple and easy to use
  - Chatbox is resizable and collapsable

### Technical Challenges & Solutions:
I solved several key challenges while building the chat:

- Made messages instant using Socket.io
- Wrote thorough tests to catch bugs
- Integrated smoothly with the existing game
- Currently linting is broken since it was not a consideration in the test and was ignored given the timeframe
- Chatbox UI is not perfect but functional
- In a normal scenario i would move seperate small components into seperate file under parent component folder
- Some of the functions could move to either helpers or hooks dependindg on their nature

### Compatibility Challenges & Compromises:
- Updated Node.js to v12.22 to support modern JavaScript features
- Upgraded Babel configuration to handle optional chaining
- Made conscious decisions to:
  - Keep existing code structure intact
  - Add new features without refactoring old ones
  - Use warnings instead of errors for legacy patterns
- Testing environment adaptations:
  - Upgraded React to 16.8.0 to support hooks in components
  - Updated react-router to 4.3.1 for React 16 compatibility
  - Simplified Jest configuration to work with older codebase
  - Custom localStorage mocking for test environment
- Build system compromises:
  - Kept webpack 1.x for legacy compatibility
  - Added extract-text-webpack-plugin@1.0.1 for CSS handling
  - Maintained UglifyJS for production builds
  - Balanced bundle size vs browser compatibility

---

### Authors:
- Maxim Shklyar, kisla interactive, <maxim@kisla.com>
- Moditha Akalanka - Chat System Implementation

##For demonstration purposes only.
