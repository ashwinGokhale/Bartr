yarn
cd backend
yarn
firebase use bartr
cd ..
cd functions
yarn
firebase use bartr
firebase functions:config:get > .runtimeconfig.json
cd ..