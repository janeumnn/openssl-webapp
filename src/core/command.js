import OpenSSL from './openssl';
import { Subject } from 'rxjs';

class Command {
  constructor() {
    this.resultSubject = new Subject();
  }

  get resultAsObservable() {
    return this.resultSubject.asObservable();
  }

  async run(args, text = null, file = null) {
    let output = {
      stdout: '',
      stderr: '',
      resultText: null,
      resultFile: null,
    };

    let writeFileBuffer;
    if (file) {
      writeFileBuffer = await file.arrayBuffer();
    }

    const moduleObj = {
      print: function (text) {
        output.stdout += text + '\n';
      },
      printErr: function (text) {
        output.stderr += text + '\n';
      },
    };

    OpenSSL(moduleObj).then((module) => {
      if (text) {
        module['FS'].writeFile('file', text);
      } else if (file) {
        module['FS'].writeFile('file', new Uint8Array(writeFileBuffer));
      }

      module.callMain(this.convertArgsToArray(args));

      if (text) {
        output.resultText = module['FS'].readFile('enc', { encoding: 'utf8' });
      } else if (file) {
        const readFileBuffer = module['FS'].readFile('output', { encoding: 'binary' });
        output.resultFile = new Blob([readFileBuffer], { type: 'application/octet-stream' });
      }

      this.resultSubject.next(output);
    });
  }

  convertArgsToArray(args) {
    return args.split(/[\s]{1,}/g).filter(Boolean);
  }
}

export default Command;
