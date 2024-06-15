const app = require('./app.js');
const { PORT_AI_SERVICE } = require('./config.js');

app.listen(PORT_AI_SERVICE);
console.log('Server running on port', PORT_AI_SERVICE);