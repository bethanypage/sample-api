import { initExpressApp } from "./app";
const port = process.env.PORT||3000;
const app = initExpressApp();
app.listen(port, () =>
{
    console.log(`listening ${port}`);

});