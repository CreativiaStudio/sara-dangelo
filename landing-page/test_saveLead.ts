import { saveLead } from './app/actions/saveLead';

async function run() {
  console.log("Testing saveLead...");
  const res = await saveLead("test@example.com");
  console.log("Result:", res);
}

run();
