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
  const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
    type: "module",
    deno: {
      namespace: true,
    },
  });
  worker.postMessage({
    f: f.toString(),
    pollTime,
  });
  return worker;
}
