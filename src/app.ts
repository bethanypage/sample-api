import express = require('express');
import router from "./routes/api" 
    

//TODO
/*
- Check client CRUD
- All job CRUD
- fix mess
- connection string???

*/

//fix issues
export const app: express.Application = express();
app.use('/api', router);
app.use(express.json);

const port = process.env.PORT||3000;

app.set("port", port);

app.listen(port);