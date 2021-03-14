const buildEnc = (enc) => {
  const command = ['enc'];
  for (const key of Object.keys(enc)) {
    switch (key) {
      case 'e':
        if (enc.e) command.push('-e');
        break;
      case 'd':
        if (enc.d) command.push('-d');
        break;
      case 'cipher':
        command.push(`-${enc.cipher}`);
        break;
      case 'inFile':
        if (!enc.text) command.push(`-in ${enc.inFile}`);
        else command.push('-in input');
        break;
      case 'outFile':
        if (!enc.text) command.push(`-out ${enc.outFile}`);
        else command.push('-out output');
        break;
      case 'k':
        if (enc.k) command.push('-k');
        break;
      case 'kVal':
        if (enc.k) command.push(enc.kVal);
        break;
      case 'kfile':
        if (enc.kfile) command.push('-kfile');
        break;
      case 'kValFile':
        if (enc.kfile) command.push(enc.kValFile);
        break;
      case 'pbkdf2':
        if (enc.pbkdf2) command.push('-pbkdf2');
        break;
      case 'iv':
        if (enc.iv) command.push('-iv');
        break;
      case 'ivVal':
        if (enc.iv) command.push(enc.ivVal);
        break;
      case 'a':
        if (enc.a) command.push('-a');
        break;
      default:
        break;
    }
  }
  return command.join(' ');
};

const buildGenrsa = (genrsa) => {
  const command = ['genrsa'];
  for (const key of Object.keys(genrsa)) {
    switch (key) {
      case 'outFile':
        command.push(`-out ${genrsa.outFile}`);
        break;
      case 'numbits':
        command.push(genrsa.numbits);
        break;
      default:
        break;
    }
  }
  return command.join(' ');
};

const buildRsa = (rsa) => {
  const command = ['rsa'];
  for (const key of Object.keys(rsa)) {
    switch (key) {
      case 'pubin':
        if (rsa.pubin) command.push('-pubin');
        break;
      case 'in':
        command.push(`-in ${rsa.in}`);
        break;
      case 'pubout':
        if (rsa.pubout) command.push('-pubout');
        break;
      case 'out':
        if (rsa.out) command.push('-out');
        break;
      case 'outFile':
        if (rsa.out) command.push(rsa.outFile);
        break;
      default:
        break;
    }
  }
  return command.join(' ');
};

const buildDgst = (dgst) => {
  const command = ['dgst'];
  for (const key of Object.keys(dgst)) {
    switch (key) {
      case 'algorithm':
        command.push(`-${dgst.algorithm}`);
        break;
      case 'file':
        command.push(dgst.file);
        break;
      default:
        break;
    }
  }
  return command.join(' ');
};

export { buildEnc, buildGenrsa, buildRsa, buildDgst };
