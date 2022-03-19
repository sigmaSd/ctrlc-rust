import { Bolt, Crate } from "https://deno.land/x/bolt@0.1.5/src/bolt.ts";

const ctrlc: Crate = {
  name: "ctrlc",
  repo: {
    url: "https://github.com/sigmaSd/ctrlc-rust",
    relativePath: "./ctrlc-wrap",
  },
  path: "./ctrlc-wrap",
};

const bolt = new Bolt([ctrlc]);
await bolt.init();

const libCtrlc = bolt.getLib(ctrlc.name);

/**
 * Register signal handler for Ctrl-C.

 Starts a new dedicated signal handling thread. Should only be called once,
 typically at the start of your program.

 # Example
 ```ts
 setHandler(()=>{
   const _ctrlcGuard = console.log("Ctrl-C pressed");
   Deno.exit(0)
 });
 ```

 # Warning
 On Unix, any existing `SIGINT`, `SIGTERM` and `SIGHUP` or `SA_SIGINFO`
 posix signal handlers will be overwritten. On Windows, multiple handler routines are allowed,
 but they are called on a last-registered, first-called basis until the signal is handled.

 On Unix, signal dispositions and signal handlers are inherited by child processes created via
 `fork(2)` on, but not by child processes created via `execve(2)`.
 Signal handlers are not inherited on Windows.

 # Panics
 Will panic if another `ctrlc::set_handler()` handler exists or if a
 system error occurred while setting the handler.

 Any panic in the handler will not be caught and will cause the signal handler thread to stop.
**/
export function setHandler(f: () => void, pollTime = 100) {
  const dylib = Deno.dlopen(libCtrlc, {
    "set_handler": { parameters: [], result: "void" },
    "ctrlc_hit": { parameters: [], result: "u8" },
    "reset_flag": { parameters: [], result: "void" },
  });

  dylib.symbols.set_handler();
  const pollFn = async () => {
    while (true) {
      if (dylib.symbols.ctrlc_hit()) {
        f();
        dylib.symbols.reset_flag();
      }
      await new Promise((resolve) => setTimeout(resolve, pollTime));
    }
  };
  return pollFn();
}
