import { setHandler } from "https://deno.land/x/ctrlc_rust/mod.ts";

const ctrlcWorker = setHandler(() => {
  console.log("bye world");
});

console.log("sleeping");
Deno.sleepSync(5000);
console.log("done");
ctrlcWorker.terminate();
