import express from 'express';
import router from "./routes/api" 
    

//TODO
/*
- All job CRUD
- fix mess
*/

//fix issues
export const app: express.Application = express();
app.use('/api', router);
app.use(express.json);

const port = process.env.PORT||3000;

app.set("port", port);

app.listen(port);
