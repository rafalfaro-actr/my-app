import { connect } from "@/lib/db"
import { users } from "@/lib/models/user"
import { randomUUID } from "crypto";
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
        
        if(!Array.isArray(body)){
            const newUser = {id: randomUUID(), name: body.name}
            await db.insert(users).values(newUser)
        } else{
            const newUsers = body.map(x => { return {id: randomUUID(), name: x.name}})
            await db.insert(users).values(newUsers)
        }
        

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
        return new NextResponse("Error modifying users", {status: 500})
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")!

        const db = await connect();
        // TODO: Validations
        const deletedCar = await db.delete(users)
            .where(eq(users.id, id))
            .returning();

        return new NextResponse("Deleted: " + JSON.stringify(deletedCar), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error deleting users", {status: 500})
    }
}