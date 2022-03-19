import { setHandler } from "https://raw.githubusercontent.com/sigmaSd/ctrlc-rust/master/src/ctrlc-rust.ts";

const _ctrlcGuard = setHandler(() => {
  console.log("bye world");
});

async function someOtherWork() {
  while (true) {
    console.log("Doing some other work");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

await someOtherWork();
