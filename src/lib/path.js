// lib/paths.js
import { app } from 'electron'
import path from 'path'

export const getAuthFilePath = () => {
  return path.join(app.getPath('userData'), 'auth_info.json')
}

export const getContactFilePath = () => {
  return path.join(app.getPath('userData'), 'contacts.json')
}
