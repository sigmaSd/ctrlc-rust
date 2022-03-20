import { setHandler } from "./src/ctrlc-rust.ts";

const ctrlcWorker = setHandler(() => {
  console.log("bye world");
});

console.log("sleeping");
Deno.sleepSync(5000);
console.log("done");
ctrlcWorker.terminate();
