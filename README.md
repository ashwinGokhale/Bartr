# Bartr

Exchange goods and services with people in your area

## Prerequisites
* Yarn
* Firebase
* Typescript

## Setup

1. `sh setup.sh`

## Frontend Usage

1. `yarn`
2. `yarn build`
3. `yarn start`

## Backend Usage

1. `cd backend`
2. `yarn`
3. `yarn watchServe`

## Functions Usage

1. `cd functions`
2. `yarn`
3. `yarn serve`

## Backend Unit Test

1. 'cd into backend for the following steps'
2. `yarn`
3. `yarn watchServe`
6. Open another terminal window
7. `yarn test`


## Notes
* Frontend runs on port 3000 from webpack dev server
* Backend runs on port 4000 from firebase local functions
* Frontend proxies backend through `proxy` setting in `package.json`
* Run `yarn build` before deploying



### Made with the following:
* [`react`](https://github.com/facebook/react)
* [`redux`](https://github.com/reactjs/redux) (with [`react-redux`](https://github.com/reactjs/react-redux))
* [`react-router-redux`](https://github.com/reactjs/react-router-redux) (with [`react-router`](https://github.com/ReactTraining/react-router))
* [`firebase`](https://firebase.google.com)
