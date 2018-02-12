# Bartr

Exchange goods and services with people in your area

## Prerequisites
* Yarn
* Firebase
* Typescript

## Setup

1. `./node_modules/.bin/firebase login`
2. `./node_modules/.bin/firebase use --add`
    * Choose the "Bartr" project
3. Copy `firebase.config.js` and `.env` into the root directory

## Frontend Usage

1. `yarn`
2. `yarn build`
3. `yarn start`

## Backend Usage

1. `cd functions`
2. `yarn`
3. `yarn watch`
4. Open another terminal window
5. `yarn serve`


## Notes
* Frontend runs on port 3000 from webpack dev server
* Backend runs on port 5000 from firebase local functions
* Frontend proxies backend through `proxy` setting in `package.json`
* Run `yarn build` before deploying



### Made with the following:
* [`react`](https://github.com/facebook/react)
* [`redux`](https://github.com/reactjs/redux) (with [`react-redux`](https://github.com/reactjs/react-redux))
* [`react-router-redux`](https://github.com/reactjs/react-router-redux) (with [`react-router`](https://github.com/ReactTraining/react-router))
* [`firebase`](https://firebase.google.com)
