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
        return new NextResponse("Error fetching users", {status: 500})
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const db = await connect();
        
        await db.insert(users).values(body)

        return new NextResponse("Inserted", {status: 201})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting users", {status: 500})
    }
}