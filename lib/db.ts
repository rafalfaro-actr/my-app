import * as user from '@/lib/models/user';
import * as membership from '@/lib/models/membership';
import * as role from '@/lib/models/role';
import { drizzle } from 'drizzle-orm/node-postgres';

const POSTGRES_DB_URI = process.env.POSTGRES_DB_URI!;

export const connect = async () => {
    const db = drizzle(POSTGRES_DB_URI, { schema: { ...user, ...membership, ...role } })

    try {
        await db.$client.connect()
        return db
    } catch(e: any){
        console.error(e)
        throw new Error(e)
    }
}