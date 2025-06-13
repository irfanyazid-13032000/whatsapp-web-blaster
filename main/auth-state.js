const fs = require('fs');

function useSingleFileAuthState(filename) {
  let state = {
    creds: undefined,
    keys: {}
  };

  // load file jika ada
  if (fs.existsSync(filename)) {
    try {
      const data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }));
      state = data;
    } catch (e) {
      console.error('Gagal baca auth file:', e);
    }
  }

  const saveState = () => {
    fs.writeFileSync(filename, JSON.stringify(state, null, 2));
  };

  return { state, saveState };
}

module.exports = { useSingleFileAuthState };
