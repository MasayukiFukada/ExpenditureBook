import { JSONFilePreset } from 'lowdb/node'
import { DBData } from '@/types'
import path from 'path'
import fs from 'fs'

const DB_FILE = 'db/db.json'
const MIGRATED_DATA_FILE = 'db/migrated_data.json'

export async function getDb() {
  const dbPath = path.resolve(process.cwd(), DB_FILE)
  const dbDir = path.dirname(dbPath)
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  // db.json が存在しない場合、migrated_data.json から作成する
  if (!fs.existsSync(dbPath)) {
    const migratedDataPath = path.resolve(process.cwd(), MIGRATED_DATA_FILE)
    if (fs.existsSync(migratedDataPath)) {
      const migratedData = JSON.parse(fs.readFileSync(migratedDataPath, 'utf-8'))
      const initialData: DBData = { monthly: migratedData }
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2))
    }
  }

  const defaultData: DBData = { monthly: [] }
  const db = await JSONFilePreset<DBData>(dbPath, defaultData)
  return db
}
