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

##For demonstration purposes only.

=================================================================

To test the project locally

1. Make sure you are running **Node 16** as *node-sass* will no longer build in newer versions of NodeJS
      
2. Install server dependencies
    `cd WS && npm install`

3. Install UI app dependencies
    `cd react_ws_src && npm install`

4. Run the Node server
    `cd WS && npm start`

5. Run the front end app
    `cd react_ws_src/ && npm start` 