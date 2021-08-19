import { initExpressApp } from './app';

async function main() {
  const port = process.env.PORT ?? 3000;
  const app = await initExpressApp();
  app.listen(port, () => {
    console.log(`listening ${port}`);
  });
}

main().catch(console.error);
