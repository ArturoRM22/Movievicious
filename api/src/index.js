const app = require('./app.js');
const { PORT } = require('./config.js');
/* const { callHealthEndpoint } = require('./app.js'); */

app.listen(PORT);
console.log('Server running on port', PORT);
/* callHealthEndpoint(PORT); */