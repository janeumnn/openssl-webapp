import Command from './command';
import { take } from 'rxjs/operators';

let inputFile;
let inputText;

beforeAll(() => {
  inputFile = new File(['This is a test'], 'testFile');
  inputText = 'This is a text';
});

describe('test if result observable emits values', () => {
  test('result has a stdout', (done) => {
    const command = new Command();
    command.run('version');
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.stdout).toBeTruthy();
      done();
    });
  });

  test('result has a stderr', (done) => {
    const command = new Command();
    command.run('help');
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.stderr).toBeTruthy();
      done();
    });
  });

  test('result has a text', (done) => {
    const command = new Command();
    command.run('enc -base64 -in file -out output', inputText);
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.text).toBeTruthy();
      done();
    });
  });

  test('result has a file', (done) => {
    const command = new Command();
    command.run(`enc -base64 -in ${inputFile.name} -out output`, Array.of(inputFile));
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.file).toBeTruthy();
      done();
    });
  });

  test('result has a file with a specific name', (done) => {
    const command = new Command();
    command.run(
      `enc -base64 -in ${inputFile.name} -out ${inputFile.name}.enc`,
      Array.of(inputFile)
    );
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.file.name).toBe(`${inputFile.name}.enc`);
      done();
    });
  });
});

describe('symmetric encryption methods with an input file', () => {
  test('aes-256-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(
      `enc -e -aes-256-cbc -k 1234 -in ${inputFile.name} -out ${inputFile.name}.enc`,
      Array.of(inputFile)
    );
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.file.name === `${inputFile.name}.enc`) {
        command.run(
          `enc -d -aes-256-cbc -k 1234 -in ${value.file.name} -out testFile`,
          Array.of(value.file)
        );
      }
      if (value.file.name === 'testFile') {
        expect(value.file.size).toEqual(inputFile.size);
        done();
      }
    });
  });

  test('camellia-256-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(
      `enc -e -camellia-256-cbc -k 1234 -in ${inputFile.name} -out ${inputFile.name}.enc`,
      Array.of(inputFile)
    );
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.file.name === `${inputFile.name}.enc`) {
        command.run(
          `enc -d -camellia-256-cbc -k 1234 -in ${value.file.name} -out testFile`,
          Array.of(value.file)
        );
      }
      if (value.file.name === 'testFile') {
        expect(value.file.size).toEqual(inputFile.size);
        done();
      }
    });
  });

  test('des3 encryption and decryption', (done) => {
    const command = new Command();
    command.run(
      `enc -e -des3 -k 1234 -in ${inputFile.name} -out ${inputFile.name}.enc`,
      Array.of(inputFile)
    );
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.file.name === `${inputFile.name}.enc`) {
        command.run(
          `enc -d -des3 -k 1234 -in ${value.file.name} -out testFile`,
          Array.of(value.file)
        );
      }
      if (value.file.name === 'testFile') {
        expect(value.file.size).toEqual(inputFile.size);
        done();
      }
    });
  });

  test('des-ede3-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(
      `enc -e -des-ede3-cbc -k 1234 -in ${inputFile.name} -out ${inputFile.name}.enc`,
      Array.of(inputFile)
    );
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.file.name === `${inputFile.name}.enc`) {
        command.run(
          `enc -d -des-ede3-cbc -k 1234 -in ${value.file.name} -out testFile`,
          Array.of(value.file)
        );
      }
      if (value.file.name === 'testFile') {
        expect(value.file.size).toEqual(inputFile.size);
        done();
      }
    });
  });
});

describe('symmetric encryption methods with an input text in a base64 format', () => {
  test('aes-256-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(`enc -e -a -aes-256-cbc -k 1234 -in file -out output`, inputText);
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.text !== inputText) {
        command.run(`enc -d -a -aes-256-cbc -k 1234 -in file -out output`, value.text);
      }
      if (value.text === inputText) {
        expect(value.text).toEqual(inputText);
        done();
      }
    });
  });

  test('camellia-256-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(`enc -e -a -camellia-256-cbc -k 1234 -in file -out output`, inputText);
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.text !== inputText) {
        command.run(`enc -d -a -camellia-256-cbc -k 1234 -in file -out output`, value.text);
      }
      if (value.text === inputText) {
        expect(value.text).toEqual(inputText);
        done();
      }
    });
  });

  test('des3 encryption and decryption', (done) => {
    const command = new Command();
    command.run(`enc -e -a -des3 -k 1234 -in file -out output`, inputText);
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.text !== inputText) {
        command.run(`enc -d -a -des3 -k 1234 -in file -out output`, value.text);
      }
      if (value.text === inputText) {
        expect(value.text).toEqual(inputText);
        done();
      }
    });
  });

  test('des-ede3-cbc encryption and decryption', (done) => {
    const command = new Command();
    command.run(`enc -e -a -des-ede3-cbc -k 1234 -in file -out output`, inputText);
    command.resultAsObservable.pipe(take(2)).subscribe((value) => {
      if (value.text !== inputText) {
        command.run(`enc -d -a -des-ede3-cbc -k 1234 -in file -out output`, value.text);
      }
      if (value.text === inputText) {
        expect(value.text).toEqual(inputText);
        done();
      }
    });
  });
});

describe('asymmetric rsa encryption', () => {
  test('rsa 2048 bit computation', (done) => {
    const command = new Command();
    command.run('genrsa 2048');
    command.resultAsObservable.pipe(take(1)).subscribe((value) => {
      expect(value.stdout).toBeTruthy();
      done();
    });
  });
});
