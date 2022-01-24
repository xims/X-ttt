# XTTT

A simple example of a full multiplayer game web app built with React.js and Node.js stack

## Quick start

The following command will create a build folder and copy it to xttt-server/public and serve it on http://localhost:3001

```sh
cd xttt-client
npm run b-sl
```

---

### Key changes from xims/X-ttt fork

-   fixes... npm i && npm run!
-   webpack builds html file during build time
-   webpack includes ws_conf.xml from src/ during build time
-   webpack copys src/static/images/\* during build time
-   webpack creates build folder
-   project tidy, gitignore, naming conventions..
-   xttt-server player migrated to class with default export
-   handle socket error on client - expose single player UI btn
-   handle game waiting state on client

---

## Major libraries used on front end:

-   react
-   webpack
-   babel
-   react-router
-   ampersand
-   sass
-   jest

---

## Major libraries used on server:

-   node.js
-   socket io
-   express

---

### Folder structure:

-   **xttt-server** - server side and compiled front end
-   **xttt-client** - React development source and testing

---

### View it online at

## https://x-ttt.herokuapp.com/

#### Configurable with external XML file -

https://x-ttt.herokuapp.com/ws_conf.xml

---

## **...For demonstration purposes only! 👨‍💻👩‍💻**
