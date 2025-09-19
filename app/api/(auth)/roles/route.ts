import { connect } from "@/lib/db"
import { roles } from "@/lib/models/role"
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const db = await connect();
        const result = await db.select().from(roles);

        return new NextResponse(JSON.stringify(result), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error fetching roles: " + e, {status: 500})
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const db = await connect();
        
        if(!Array.isArray(body)){
            const newRole = {id: randomUUID(), name: body.name}
            await db.insert(roles).values(newRole)
        } else{
            const newRoles = body.map(x => { return {id: randomUUID(), name: x.name}})
            await db.insert(roles).values(newRoles)
        }
        

        return new NextResponse("Inserted: " + JSON.stringify(body), {status: 201})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting roles: " + e, {status: 500})
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const {id, name} = body

        const db = await connect();
        // TODO: Validations
        const updatedRole = await db.update(roles)
            .set({ name: name })
            .where(eq(roles.id, id))
            .returning();

        return new NextResponse("Updated: " + JSON.stringify(updatedRole), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error modifying roles: " + e, {status: 500})
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")!

        const db = await connect();
        // TODO: Validations
        const deletedCar = await db.delete(roles)
            .where(eq(roles.id, id))
            .returning();

        return new NextResponse("Deleted: " + JSON.stringify(deletedCar), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error deleting roles: " + e, {status: 500})
    }
}