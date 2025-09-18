import { connect } from "@/lib/db"
import { users } from "@/lib/models/user"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const db = await connect();
        const result = await db.select().from(users);

        return new NextResponse(JSON.stringify(result), {status: 200})
    } catch (e){
        console.error(e)
    }
}