import express from 'express';
import router from "./routes/api" 
    
//fix issues
export const app: express.Application = express();
const port = process.env.PORT||3000;


app.use('/api', router);
app.use(express.json);
app.set("port", port);

app.listen(port);
