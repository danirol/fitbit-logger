import { openSync, closeSync, writeSync } from "fs";
import { outbox } from "file-transfer";

// log something
// append it to file
// at some point send it as file transfer

var fileName = "fitbit-logger"
var logFileEmpty = true
var doConsoleLog = false

const init = (options) => {
  options = options || {}

  if (options.doConsoleLog) {
    doConsoleLog = true
  }

  // clears the log file
  file = openSync(fileName, "w")
  closeSync(file)

  if (options.automaticInterval > 0) {
    setInterval(() => {
      if (!logFileEmpty) {
        logFileEmpty = true
        sendLogFileToCompanion()
      }
    }, options.automaticInterval);
  }
}

const log = (value) => {
  if (doConsoleLog) {
    console.log(value)
  }

  logFileEmpty = false
  file = openSync(fileName, "a")

  value = "App " + Date.now() + " " + value
  buffer = encodeToArrayBuffer(value)
  writeSync(file, buffer)
  closeSync(file)
}

const sendLogFileToCompanion = () => {
  outbox
    .enqueueFile(fileName)
    .then((ft) => {
      // console.log(`Transfer of $‌{ft.name} successfully queued.`);
    })
    .catch((error) => {
      console.log("fitbit-logger: send to companion failed " + error);
    })
}

const encodeToArrayBuffer = (str) => {
  var binstr = unescape(encodeURIComponent(str)),
    arr = new Uint8Array(binstr.length);
  const split = binstr.split('');
  for (let i = 0; i < split.length; i++) {
    arr[i] = split[i].charCodeAt(0);
  }
  return arr;
};

const fitlogger = {
  init: init,
  log: log
}

export default fitlogger