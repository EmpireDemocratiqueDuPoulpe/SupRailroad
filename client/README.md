# SupRailroad - Front-end app
This project was initiated with [Create React App](https://create-react-app.dev) and [React Truffle box](https://trufflesuite.com/boxes/react/).

## Index
- [Home](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/README.md)
	1. [Solidity contracts](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/README.md)
	2. [Oracle](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/oracle/README.md)
	3. [Front-end app - _you are here_](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/client/README.md)

## Installation
### Dependencies
Install the dependencies with the following command: `npm install`.

> **⚠️ WARNING**
> 
> By default, React Truffle box uses `react-scripts` v4.x to preserve the polyfills of Node.js core modules, which are
> required for `web3.js`. Unfortunately, we encountered errors that forced us to upgrade `react-scripts` to version 5.x.
> While the latter still works on most modern browsers, some older versions may experience problems or crashes related to
> missing polyfills. As we have no other solution, please use a modern and up-to-date browser (Chrome, Firefox, Opera, ...).

### Environnement
This site needs a MapboxGL API key, it's a maxi tool that we will use later. If you are the teacher who will evaluate our
work (hello), the `.env` file already exists in your archives. If we forgot or if you are not the teacher, you can create
a free account on [mapbox.com](https://www.mapbox.com/) to receive your API key. Once this is done, create an `.env` file
in the [client root folder](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/tree/main/client) containing the
following data:
```dotenv
# TODO: Move the following key to a dynamic placeholder (or this key will be exposed in the build files)
REACT_APP_MAPBOX_GL_KEY_MOVE_TO_DYNAMIC_PLACEHOLDER="YOUR API KEY HERE"
```

## Starting
After the truffle migration, start the client application with the following command: `npm start`. Your browser will open
a new tab. The first load may take a while.
> **📄 NOTE**
>
> It is possible that you see some modals in duplicate. This is not a bug, it is related to React.js and the strict mode
> in development. To put it simply, some pieces of code are executed twice to check for problems with cleanup functions.
> This causes some features to run their action twice, resulting in a duplicate modal message. See the [Strict Mode manual](https://reactjs.org/docs/strict-mode.html)
> for more information.

See [all available scripts for CRA](https://create-react-app.dev/docs/available-scripts).
