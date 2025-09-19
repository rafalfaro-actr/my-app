import { connect } from "@/lib/db"
import { roles } from "@/lib/models/role"
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/roles:
 *   get:
 *     description: Returns the roles
 *     responses:
 *       200:
 *         description: Roles!
 */
export const GET = async () => {
    try {
        const db = await connect();
        const result = await db.query.roles.findMany();

        return new NextResponse(JSON.stringify(result), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error fetching roles: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/roles:
 *   post:
 *     description: Create roles
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           examples:
 *             one:
 *               value:
 *                 {"name": "admin"}          
 *             many:
 *               value:
 *                 [{"name": "admin"},{"name": "visitor"}]
 *     responses:
 *       201:
 *         description: Role Created!
 */
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const db = await connect();
        
        if(!Array.isArray(body)){
            const newRole = {...body}
            newRole.id = randomUUID()
            await db.insert(roles).values(newRole)
        } else{
            const newRoles = body.map(x => { 
                const newBody = {...x}
                newBody.id = randomUUID()
                return newBody
            })
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

        const db = await connect();
        // TODO: Validations
        const newBody = {...body}
        delete newBody.id

        const updatedRole = await db.update(roles)
            .set(newBody)
            .where(eq(roles.id, body.id))
            .returning();

        return new NextResponse("Updated: " + JSON.stringify(updatedRole), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error modifying roles: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/roles:
 *   delete:
 *     description: Delete role    
 *     parameters:
 *       - name: id
 *         in: query
 *         examples:
 *           uuid:
 *             value: 08a91dc8-4d19-4c10-9436-c7d9265dbba1
 *     responses:
 *       200:
 *         description: Role Deleted!
 */
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")!

        const db = await connect();
        // TODO: Validations
        const deletedRole = await db.delete(roles)
            .where(eq(roles.id, id))
            .returning();

        return new NextResponse("Deleted: " + JSON.stringify(deletedRole), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error deleting roles: " + e, {status: 500})
    }
}