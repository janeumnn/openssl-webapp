import OpenSSL from './openssl';
import { Subject } from 'rxjs';

class Command {
  constructor() {
    this.resultSubject = new Subject();
  }

  get resultAsObservable() {
    return this.resultSubject.asObservable();
  }

  getByteArray(file) {
    const fileReader = new FileReader();
    return new Promise(function (resolve, reject) {
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (event) {
        const array = new Uint8Array(event.target.result);
        const fileByteArray = [];
        for (let i = 0; i < array.length; i++) {
          fileByteArray.push(array[i]);
        }
        resolve(array);
      };
      fileReader.onerror = reject;
    });
  }

  /**
   * @param {string} args OpenSSL Command
   * @param {(string|File[])} data Command data to process
   */
  run(args, data) {
    let inputText = false;
    let inputFiles = false;
    let writeFiles = [];

    if (args && !(Object.prototype.toString.call(args) === '[object String]')) {
      return;
    }
    if (data && Object.prototype.toString.call(data) === '[object String]') {
      inputText = true;
    }
    if (data && Object.prototype.toString.call(data) === '[object Array]') {
      inputFiles = true;
      data.forEach((file) => {
        this.getByteArray(file).then((byteArray) => {
          writeFiles.push({ name: file.name, buffer: byteArray });
        });
      });
    }

    let output = {
      stdout: '',
      stderr: '',
      text: null,
      file: null,
    };

    const moduleObj = {
      print: function (line) {
        output.stdout += line + '\n';
      },
      printErr: function (line) {
        output.stderr += line + '\n';
      },
    };

    const argsArray = this.convertArgsToArray(args);

    OpenSSL(moduleObj).then((module) => {
      if (inputText) {
        module['FS'].writeFile(this.getFileInParameter(argsArray), data);
      } else if (inputFiles) {
        writeFiles.forEach((file) => {
          module['FS'].writeFile(file.name, file.buffer);
        });
      }

      module.callMain(argsArray);

      if (inputText) {
        output.text = module['FS'].readFile(this.getFileOutParameter(argsArray), {
          encoding: 'utf8',
        });
      } else if (this.getFileOutParameter(argsArray)) {
        const readFileBuffer = module['FS'].readFile(this.getFileOutParameter(argsArray), {
          encoding: 'binary',
        });
        output.file = new File([readFileBuffer], this.getFileOutParameter(argsArray), {
          type: 'application/octet-stream',
        });
      }

      this.resultSubject.next(output);
    });
  }

  convertArgsToArray(args) {
    return args.split(/[\s]{1,}/g).filter(Boolean);
  }

  getFileInParameter(argsArray) {
    return argsArray[argsArray.indexOf('-in') + 1];
  }

  getFileOutParameter(argsArray) {
    if (argsArray[argsArray.indexOf('-out')]) {
      return argsArray[argsArray.indexOf('-out') + 1];
    } else {
      return null;
    }
  }
}

export default Command;
