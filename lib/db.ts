import { drizzle } from 'drizzle-orm/node-postgres';

const POSTGRES_DB_URI = process.env.POSTGRES_DB_URI!;

export const connect = async () => {
    const db = drizzle(POSTGRES_DB_URI)

    try {
        await db.$client.connect()
        return db
    } catch(e: any){
        console.error(e)
        throw new Error(e)
    }
}