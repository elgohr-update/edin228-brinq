import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers:[
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            async authorize(credentials, req) {
                const baseUrl = `${process.env.FETCHBASE_URL}/login/access-token`
                const formBody = Object.keys(credentials).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(credentials[key])).join('&');
                const res = await fetch(baseUrl, {
                    method: 'POST',
                    body: formBody,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                })
                const token = await res.json()
                if (token) {
                    const baseUrl2 = `${process.env.FETCHBASE_URL}/users/me`
                    const res2 = await fetch(baseUrl2, {
                        method: 'GET',
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token.access_token}`
                        }
                    })
                    const user = await res2.json()
                    const setUser = {...user,accessToken:token.access_token,picture:user.image_file, image:user.image_file}
                // Any object returned will be saved in `user` property of the JWT
                    return setUser
                } else {
                // If you return null then an error will be displayed advising the user to check their details.
                    return null
        
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ], 
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
        verifyRequest: '/login',
        newUser: null,
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async jwt({ token, user, account }) {
          // Initial sign in
          if (account) {
            token.accessToken = user.accessToken
            token.user = user
            token.exp = token.exp
          }
          return token
    
        //   // Return previous token if the access token has not expired yet
        //   if (Date.now() < token.accessTokenExpires) {
        //     return token;
        //   }
    
        //   // Access token has expired, try to update it
        //   return refreshAccessToken(token);
        },
        async session({ session, token, user }) {
            session.user = token.user
            session.exp = token.exp
            session.accessToken = token.accessToken;
            session.error = token.error;
            return session;
        },
    },
})