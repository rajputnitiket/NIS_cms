import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcrypt';
import sql from 'mssql';
import { sqlConfig } from "@/dbConfig/db";

async function getUser(email: string): Promise<User | undefined> {
    try {

        await sql.connect(sqlConfig);

        const user = await sql.query<User>`SELECT * FROM users WHERE email=${email}`;
        return user.recordset[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});