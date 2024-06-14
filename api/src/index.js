import app from './app.js';
import {PORT} from './config.js';
/* import { callHealthEndpoint } from './app.js'; */

app.listen(PORT);
console.log('Sever running on port', PORT);
/* callHealthEndpoint(PORT);  */