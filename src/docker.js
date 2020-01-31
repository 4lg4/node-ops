import exec from "../core/exec";

export function start() {
  return new Promise((resolve, reject) => {
    exec({
      command: `open --background -a Docker && while ! docker system info > /dev/null 2>&1; do sleep 1; done`,
      pipe: ({ data, type }) => {
        if (type === "err") {
          return reject(data);
        }

        if (type === "close") {
          return resolve(true);
        }
      }
    });
  });
}

export async function check() {
  let beforeClose;

  return new Promise((resolve, reject) => {
    exec({
      command: `docker system info; echo $?`,
      pipe: ({ data, type }) => {
        if (type === "err") {
          return reject(false);
        }

        // TODO: improve this code
        if (type === "close") {
          if (beforeClose == 0) {
            return resolve(true);
          }
        } else {
          beforeClose = data;
        }
      }
    });
  });
}

// TODO: stop docker function
// com.docker.osx.hyperkit

window.check = check;
window.start = start;
