import { db } from "./db/index.js";
import { users, accounts, sessions, verificationTokens } from "./db/schema.js";
import { eq, and, lt } from "drizzle-orm";
import type { Adapter } from "@auth/core/adapters";

// Create a completely custom adapter to debug the session storage issue
export const customAdapter: Adapter = {
  async createSession(data: any) {
    try {
      console.log('🔐 Custom adapter: Creating session for user:', data.userId);
      console.log('🔐 Session data:', { 
        sessionToken: data.sessionToken?.substring(0, 20) + '...',
        userId: data.userId,
        expires: data.expires
      });
      
      // Ensure the session data is properly formatted
      const sessionData = {
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: new Date(data.expires)
      };
      
      // Manually create the session
      const result = await db.insert(sessions).values(sessionData).returning();
      console.log('✅ Session created manually:', result[0]?.sessionToken?.substring(0, 20) + '...');
      return result[0];
    } catch (error) {
      console.error('❌ Manual session creation failed:', error);
      throw error;
    }
  },
  
  async getSessionAndUser(sessionToken: string) {
    try {
      console.log('🔐 Custom adapter: Getting session and user for token:', sessionToken.substring(0, 20) + '...');
      
      // First, get the session
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken)
      });
      
      if (!session) {
        console.log('❌ Session not found in database');
        return null;
      }
      
      // Check if session is expired
      if (new Date() > session.expires) {
        console.log('❌ Session expired, cleaning up');
        await this.deleteSession(sessionToken);
        return null;
      }
      
      // Get the user
      const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId)
      });
      
      if (!user) {
        console.log('❌ User not found for session');
        return null;
      }
      
      console.log('✅ Session and user found:', { userId: user.id, email: user.email });
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        }
      };
    } catch (error) {
      console.error('❌ Error getting session and user:', error);
      return null;
    }
  },
  
  async updateSession(data: any) {
    try {
      console.log('🔐 Custom adapter: Updating session');
      
      const result = await db.update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning();
      
      console.log('✅ Session updated manually');
      return result[0];
    } catch (error) {
      console.error('❌ Manual session update failed:', error);
      throw error;
    }
  },
  
  async deleteSession(sessionToken: string) {
    try {
      console.log('🔐 Custom adapter: Deleting session');
      
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
      console.log('✅ Session deleted manually');
    } catch (error) {
      console.error('❌ Manual session deletion failed:', error);
    }
  },
  
  async createUser(user: any) {
    try {
      console.log('🔐 Custom adapter: Creating user');
      
      const result = await db.insert(users).values(user).returning();
      console.log('✅ User created manually');
      return result[0];
    } catch (error) {
      console.error('❌ Manual user creation failed:', error);
      throw error;
    }
  },
  
  async getUser(id: string) {
    try {
      console.log('🔐 Custom adapter: Getting user by ID');
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, id)
      });
      
      console.log('✅ User found:', !!user);
      return user;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },
  
  async getUserByEmail(email: string) {
    try {
      console.log('🔐 Custom adapter: Getting user by email');
      
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      
      console.log('✅ User found by email:', !!user);
      return user;
    } catch (error) {
      console.error('❌ Error getting user by email:', error);
      return null;
    }
  },
  
  async getUserByAccount(providerAccountId: any) {
    try {
      console.log('🔐 Custom adapter: Getting user by account');
      
      const account = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, providerAccountId.provider),
          eq(accounts.providerAccountId, providerAccountId.providerAccountId)
        )
      });
      
      if (!account) {
        console.log('❌ Account not found');
        return null;
      }
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, account.userId)
      });
      
      console.log('✅ User found by account:', !!user);
      return user;
    } catch (error) {
      console.error('❌ Error getting user by account:', error);
      return null;
    }
  },
  
  async updateUser(user: any) {
    try {
      console.log('🔐 Custom adapter: Updating user');
      
      const result = await db.update(users)
        .set(user)
        .where(eq(users.id, user.id))
        .returning();
      
      console.log('✅ User updated manually');
      return result[0];
    } catch (error) {
      console.error('❌ Manual user update failed:', error);
      throw error;
    }
  },
  
  async deleteUser(userId: string) {
    try {
      console.log('🔐 Custom adapter: Deleting user');
      
      await db.delete(users).where(eq(users.id, userId));
      console.log('✅ User deleted manually');
    } catch (error) {
      console.error('❌ Manual user deletion failed:', error);
    }
  },
  
  async linkAccount(account: any) {
    try {
      console.log('🔐 Custom adapter: Linking account');
      
      const result = await db.insert(accounts).values(account).returning();
      console.log('✅ Account linked manually');
      return result[0];
    } catch (error) {
      console.error('❌ Manual account linking failed:', error);
      throw error;
    }
  },
  
  async unlinkAccount(providerAccountId: any) {
    try {
      console.log('🔐 Custom adapter: Unlinking account');
      
      await db.delete(accounts).where(
        and(
          eq(accounts.provider, providerAccountId.provider),
          eq(accounts.providerAccountId, providerAccountId.providerAccountId)
        )
      );
      console.log('✅ Account unlinked manually');
    } catch (error) {
      console.error('❌ Manual account unlinking failed:', error);
    }
  },
  
  async createVerificationToken(token: any) {
    try {
      console.log('🔐 Custom adapter: Creating verification token');
      
      const result = await db.insert(verificationTokens).values(token).returning();
      console.log('✅ Verification token created manually');
      return result[0];
    } catch (error) {
      console.error('❌ Manual verification token creation failed:', error);
      throw error;
    }
  },
  
  async useVerificationToken(params: any) {
    try {
      console.log('🔐 Custom adapter: Using verification token');
      
      const token = await db.query.verificationTokens.findFirst({
        where: and(
          eq(verificationTokens.identifier, params.identifier),
          eq(verificationTokens.token, params.token)
        )
      });
      
      if (token) {
        // Delete the token after use
        await db.delete(verificationTokens).where(
          and(
            eq(verificationTokens.identifier, params.identifier),
            eq(verificationTokens.token, params.token)
          )
        );
        console.log('✅ Verification token used and deleted');
        return token;
      }
      
      console.log('❌ Verification token not found');
      return null;
    } catch (error) {
      console.error('❌ Error using verification token:', error);
      return null;
    }
  }
};
