import { connect } from "@/lib/db"
import { users } from "@/lib/models/user"
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns the users
 *     responses:
 *       200:
 *         description: Users!
 */
export const GET = async () => {
    try {
        const db = await connect();
        const result = await db.query.users.findMany({
            with: {
                memberships: {
                    columns: {
                        roleId: true
                    },
                    with: {
                        roleId: {
                            columns: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(result), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error fetching users: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Create users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           examples:
 *             one:
 *               value:
 *                 {"name": "Max Steel"}          
 *             many:
 *               value:
 *                 [{"name": "Hulk Hogan"},{"name": "Silvester Stalone"}]
 *     responses:
 *       201:
 *         description: User Created!
 */
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const db = await connect();
        
        if(!Array.isArray(body)){
            const newUser = {...body}
            newUser.id = randomUUID()
            await db.insert(users).values(newUser)
        } else{
            const newUsers = body.map(x => { 
                const newBody = {...x}
                newBody.id = randomUUID()
                return newBody
            })
            await db.insert(users).values(newUsers)
        }
        

        return new NextResponse("Inserted: " + JSON.stringify(body), {status: 201})
    } catch (e){
        console.error(e)
        return new NextResponse("Error inserting users: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/users:
 *   patch:
 *     description: Modify user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           examples:
 *             one:
 *               value:
 *                 {"id": "e798d970-5210-464e-8ce6-4b57991b2176", "name": "Silvester Stalone"}            
 *     responses:
 *       200:
 *         description: User Modified!
 */
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()

        const db = await connect();
        // TODO: Validations
        const newBody = {...body}
        delete newBody.id

        const updatedUser = await db.update(users)
            .set(newBody)
            .where(eq(users.id, body.id))
            .returning();

        return new NextResponse("Updated: " + JSON.stringify(updatedUser), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error modifying users: " + e, {status: 500})
    }
}

/**
 * @swagger
 * /api/users:
 *   delete:
 *     description: Delete user    
 *     parameters:
 *       - name: id
 *         in: query
 *         examples:
 *           uuid:
 *             value: df8b7c79-2d2c-4bc7-accf-7f4d917f9878
 *     responses:
 *       200:
 *         description: User Deleted!
 */
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")!

        const db = await connect();
        // TODO: Validations
        const deletedUser = await db.delete(users)
            .where(eq(users.id, id))
            .returning();

        return new NextResponse("Deleted: " + JSON.stringify(deletedUser), {status: 200})
    } catch (e){
        console.error(e)
        return new NextResponse("Error deleting users: " + e, {status: 500})
    }
}