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

  run(args, data) {
    let inputText;
    let inputFile;
    let writeFileBuffer;

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

    if (args && !(Object.prototype.toString.call(args) === '[object String]')) {
      return;
    } else if (data && Object.prototype.toString.call(data) === '[object String]') {
      inputText = data;
    } else if (data && Object.prototype.toString.call(data) === '[object File]') {
      inputFile = data;
      this.getByteArray(inputFile).then((byteArray) => {
        writeFileBuffer = byteArray;
      });
    }

    OpenSSL(moduleObj).then((module) => {
      if (inputText) {
        module['FS'].writeFile(this.getFileInParameter(argsArray), inputText);
      } else if (inputFile) {
        module['FS'].writeFile(this.getFileInParameter(argsArray), writeFileBuffer);
      }

      module.callMain(argsArray);

      if (inputText) {
        output.text = module['FS'].readFile(this.getFileOutParameter(argsArray), {
          encoding: 'utf8',
        });
      } else if (inputFile || this.getFileOutParameter(argsArray)) {
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
    if (!argsArray[argsArray.indexOf('-in')]) {
      return;
    } else {
      return argsArray[argsArray.indexOf('-in') + 1];
    }
  }

  getFileOutParameter(argsArray) {
    if (!argsArray[argsArray.indexOf('-out')]) {
      return;
    } else {
      return argsArray[argsArray.indexOf('-out') + 1];
    }
  }
}

export default Command;
