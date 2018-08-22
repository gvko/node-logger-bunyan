# Nodejs Logger eSmiley

## About
A wrapper of the Bunyan logger library, modified to suit eSmiley's needs.

### Installation
`npm i ssh://git@bitbucket.esmiley.dk:7999/test/node-logger-esmiley.git`

### Initialization
```javascript
import * as logger from 'node-logger-esmiley';
logger.init('service-example');
```

Note: if you intend to pipe the logs to a LaaS, then either:
1. Provide the access key as a node process env variable
2. Provide it as a second parameter to the `init` function


