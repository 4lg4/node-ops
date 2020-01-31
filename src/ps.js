import exec from "./exec";

// TODO: change this command based on OS
const COMMAND = "ps axc";

// example
// PID     TT   STAT   TIME      COMMAND
// 24128   ??   S      0:00.09   pritunl-openvpn
export async function list(raw) {
  try {
    const processes = (await exec(COMMAND)).split(/\n/m).slice(1);

    if (raw) {
      return processes;
    }

    return processes.map(p => {
      const opts = p.split(/\s+/g);

      return {
        pid: opts[0],
        tt: opts[1],
        stat: opts[2],
        time: opts[3],
        command: opts[4]
      };
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function get(search = "") {
  if (!search) {
    throw new Error("Search parameter is required");
  }

  const processes = await list(true);
  const filteredProcess = processes.filter(process => process.match(search));

  return filteredProcess.map(p => {
    const opts = p.split(/\s+/g);

    return {
      pid: opts[0],
      tt: opts[1],
      stat: opts[2],
      time: opts[3],
      command: opts[4]
    };
  });
}

window.ps = {
  list,
  get
};

export default {
  list,
  get
};
