
![Console image](https://storage.googleapis.com/anvilapp/npm-pictures/react-native-debugger/console.jpg)

### Installation
```js
npm install -g @anvilapp/react-native-debugger-server
npm install @anvilapp/react-native-debugger-client --save-dev
```
or 
```js
yarn global add @anvilapp/react-native-debugger-server
yarn add @anvilapp/react-native-debugger-client --dev
```

### Usage
Run debugger server
```js
rndebugger
```
or with params
```js
rndebugger --port=8788 --socketPort=8787
```
Open http://localhost:8788/debugger in your browser

Add to index.js
```js
import {runDebugger} from '@anvilapp/react-native-debugger-client'; // Add to the top
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

if (__DEV__) {
    const your_ip_address = '192.168.88.15:8787'; // default port is 8787
    runDebugger(your_ip_address);
}

AppRegistry.registerComponent(appName, () => App);

console.log('Something...');
```

### Supported methods
```js
console.clear
console.count
console.dir
console.dirxml
console.error
console.group
console.groupCollapsed
console.groupEnd
console.info
console.log
console.table
console.time
console.timeEnd
console.warn
```
