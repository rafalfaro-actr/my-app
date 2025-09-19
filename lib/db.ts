import * as schema1 from '@/lib/models/user';
import * as schema2 from '@/lib/models/membership';
import * as schema3 from '@/lib/models/role';
import { drizzle } from 'drizzle-orm/node-postgres';

const POSTGRES_DB_URI = process.env.POSTGRES_DB_URI!;

export const connect = async () => {
    const db = drizzle(POSTGRES_DB_URI, { schema: { ...schema1, ...schema2, ...schema3 } })

    try {
        await db.$client.connect()
        return db
    } catch(e: any){
        console.error(e)
        throw new Error(e)
    }
}