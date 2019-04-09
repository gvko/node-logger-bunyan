# Nodejs Logger

## About
A wrapper of the Bunyan logger library.

### Installation
`npm i git+ssh://git@github.com/gvko/node-logger.git`

### Initialization
```javascript
import * as logger from 'node-logger';
logger.init('example-service-name');
```

*NOTE*: if you intend to pipe the logs to a LaaS, then either:
1. Provide the access key as a node process env variable
2. Provide it as the `key` param in an object of the 2nd argument of the `init()` function


