import OpenSSL from './openssl';
import { Subject } from 'rxjs';

class Command {
  constructor() {
    this.resultSubject = new Subject();
  }

  get result() {
    return this.resultSubject;
  }

  run(args, text = '') {
    let output = {
      stdout: '',
      stderr: '',
      content: '',
    };

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
      }
      module.callMain(this.convertArgsToArray(args));
      if (text) {
        output.content = module['FS'].readFile('enc', { encoding: 'utf8' });
      }
      this.resultSubject.next(output);
    });
  }

  convertArgsToArray(args) {
    return args.split(/[\s]{1,}/g).filter(Boolean);
  }
}

export default Command;
