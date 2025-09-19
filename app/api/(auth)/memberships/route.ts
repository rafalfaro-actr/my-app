import { connect } from "@/lib/db"
import { memberships } from "@/lib/models/membership"
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     description: Returns the memberships
 *     responses:
 *       200:
 *         description: Memberships!
 */
export const GET = async () => {
    try {
        const db = await connect();
        const result = await db.query.memberships.findMany({
            with: {
                userId: true,
                roleId: true
            }
        });

        return new NextResponse(JSON.stringify(result), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error fetching memberships: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     description: Create memberships
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           examples:
 *             one:
 *               value:
 *                 {"userId": "6fdd3e02-422a-43c7-845e-4e378990517b", "roleId": "de310456-d81c-4055-955d-cdf490b2df85"}            
 *             many:
 *               value:
 *                 [{"userId": "6fdd3e02-422a-43c7-845e-4e378990517b", "roleId": "de310456-d81c-4055-955d-cdf490b2df85"},{"userId": "6fdd3e02-422a-43c7-845e-4e378990517b", "roleId": "de310456-d81c-4055-955d-cdf490b2df85"}]
 *     responses:
 *       200:
 *         description: Membership Created!
 */
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const db = await connect();
        
        if(!Array.isArray(body)){
            const newMembership = {...body}
            newMembership.id = randomUUID()
            await db.insert(memberships).values(newMembership)
        } else{
            const newMemberships = body.map(x => { 
                const newBody = {...x}
                newBody.id = randomUUID()
                return newBody
            })
            await db.insert(memberships).values(newMemberships)
        }
        

        return new NextResponse("Inserted: " + JSON.stringify(body), {status: 201})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting memberships: " + e, {status: 500})
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const newBody = {...body}
        delete newBody.id

        const db = await connect();
        // TODO: Validations
        const updatedMembership = await db.update(memberships)
            .set(newBody)
            .where(eq(memberships.id, body.id))
            .returning();

        return new NextResponse("Updated: " + JSON.stringify(updatedMembership), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error modifying memberships: " + e, {status: 500})
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")!

        const db = await connect();
        // TODO: Validations
        const deletedMembership = await db.delete(memberships)
            .where(eq(memberships.id, id))
            .returning();

        return new NextResponse("Deleted: " + JSON.stringify(deletedMembership), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error deleting memberships: " + e, {status: 500})
    }
}