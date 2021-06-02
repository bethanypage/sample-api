import express from 'express';
import router from "./routes/api" 
import {pool} from "./db"
    
//fix issues

export function initExpressApp():express.Application{

    const app = express();   
    
    app.use('/api', router);
    app.use(express.json);

    process.on('exit', code => {
        console.log(`Application exiting with code ${code}`);
      });
  
  process.once('SIGINT', () => systemShutdown('SIGINT'));
  process.once('SIGTERM', () => systemShutdown('SIGTERM'));
    return app;
}

export async function systemShutdown(code?: string): Promise<any> {
    if (code) console.log((`${code} event reached. Application closing.`));
    else console.log((`Application closing.`));
  
    try {
        //.close() -> .end()
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.log(err.toString());
      process.exit(1);
    }
  }