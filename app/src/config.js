import { randomUUID } from 'node:crypto'

const randomName = randomUUID().slice(0, 4)

const dbUser = process.env.DB_USER || 'root'
const dbPassword = process.env.DB_PASSWORD || 'example'
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || '27017'
const dbName = process.env.DB_NAME || `${randomName}-test`

const config = {
    dbName,
    dbURL: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}`,
    customerCol: 'customers'
}

export default config
