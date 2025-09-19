import { connect } from "@/lib/db"
import { users } from "@/lib/models/user"
import { eq } from "drizzle-orm";
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

        return new NextResponse("Inserted: " + JSON.stringify(body), {status: 201})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting users", {status: 500})
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const {id, name} = body

        const db = await connect();
        // TODO: Validations
        const updatedUser = await db.update(users)
            .set({ name: name })
            .where(eq(users.id, id))
            .returning();

        return new NextResponse("Updated: " + JSON.stringify(updatedUser), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting users", {status: 500})
    }
}