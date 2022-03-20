import { Bolt } from "https://deno.land/x/bolt@0.1.7/src/bolt.ts";

self.onmessage = async (e) => {
  const dylib = await initFn();
  dylib.symbols.set_handler();
  const { f, pollTime } = e.data;
  pollFn(new Function("return " + f)(), pollTime, dylib);
};

const pollFn = async (f, pollTime, dylib) => {
  while (true) {
    if (dylib.symbols.ctrlc_hit()) {
      f();
      dylib.symbols.reset_flag();
    }
    await new Promise((resolve) => setTimeout(resolve, pollTime));
  }
};

async function initFn() {
  const ctrlc = {
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

  const dylib = Deno.dlopen(libCtrlc, {
    "set_handler": { parameters: [], result: "void" },
    "ctrlc_hit": { parameters: [], result: "u8" },
    "reset_flag": { parameters: [], result: "void" },
  });
  return dylib;
}
