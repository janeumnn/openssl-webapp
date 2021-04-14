import OpenSSL from './openssl';
import { Subject } from 'rxjs';

class Command {
  constructor() {
    const baseUrl = window.CTO_Globals?.pluginRoot || window.location.href;
    this.wasmModule = fetch(`${baseUrl}/openssl.wasm`)
      .then((response) => response.arrayBuffer())
      .then((bytes) => {
        return WebAssembly.compile(bytes);
      });
    this.resultSubject = new Subject();
  }

  get resultAsObservable() {
    return this.resultSubject.asObservable();
  }

  async getByteArray(file) {
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
   * @param {File[]} files Command files to process
   * @param {string} text Command text to process
   */
  async run(args, files = null, text = '') {
    let inputText = false;
    let inputFiles = false;
    let writeFiles = [];

    const argsArray = this.convertArgsToArray(args);

    if (args && !(Object.prototype.toString.call(args) === '[object String]')) {
      return;
    }
    if (text && Object.prototype.toString.call(text) === '[object String]') {
      inputText = true;
    }
    if (files && Object.prototype.toString.call(files) === '[object Array]') {
      inputFiles = true;
      const filteredFiles = this.filterInputFiles(argsArray, files);
      for (const file of filteredFiles) {
        const byteArray = await this.getByteArray(file);
        writeFiles.push({ name: file.name, buffer: byteArray });
      }
    }

    let output = {
      stdout: '',
      stderr: '',
      file: null,
    };

    const wasmModule = this.wasmModule;
    const moduleObj = {
      thisProgram: 'openssl',
      instantiateWasm: function (imports, successCallback) {
        wasmModule.then((module) => {
          WebAssembly.instantiate(module, imports).then(successCallback);
        });
        return {};
      },
      print: function (line) {
        output.stdout += line + '\n';
      },
      printErr: function (line) {
        output.stderr += line + '\n';
      },
    };

    OpenSSL(moduleObj)
      .then((instance) => {
        if (inputText) {
          instance['FS'].writeFile(this.getFileInParameter(argsArray), text);
        }
        if (inputFiles) {
          writeFiles.forEach((file) => {
            instance['FS'].writeFile(file.name, file.buffer);
          });
        }

        instance.callMain(argsArray);

        if (this.getFileOutParameter(argsArray)) {
          const readFileBuffer = instance['FS'].readFile(this.getFileOutParameter(argsArray), {
            encoding: 'binary',
          });
          output.file = new File([readFileBuffer], this.getFileOutParameter(argsArray), {
            type: 'application/octet-stream',
          });
        }
      })
      .catch((error) => (output.stderr = `${error.name}: ${error.message}`))
      .finally(() => this.resultSubject.next(output));
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

  filterInputFiles(argsArray, inputFiles) {
    const filtered = argsArray.map((value) => (value.includes('file:') ? value.slice(5) : value));
    const matches = inputFiles.filter((file) => filtered.includes(file.name, 1));
    return matches.length
      ? inputFiles.filter((file) => matches.map((file) => file.name).includes(file.name))
      : [];
  }
}

export default Command;
