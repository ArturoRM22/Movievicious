import app from './app.js';
import {PORT_AI_SERVICE} from './config.js';

app.listen(PORT_AI_SERVICE);
console.log('Sever running on port', PORT_AI_SERVICE);