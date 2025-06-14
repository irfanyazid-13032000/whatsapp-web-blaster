import fs from 'fs';
import path from 'path';

const CONTACTS_FILE = path.join(process.cwd(), 'contacts.json');

export function getContacts() {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) {
      fs.writeFileSync(CONTACTS_FILE, '[]', 'utf-8'); // bikin kosong kalau belum ada
    }
    const data = fs.readFileSync(CONTACTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[ERROR getContacts]', err);
    return [];
  }
}

export function saveContacts(contacts) {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ERROR saveContacts]', err);
  }
}
