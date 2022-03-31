import { getSession } from "next-auth/react"

export default async function handler(req, res) {
    const { query } = req
    const session = await getSession({req})
    const baseUrl = `${process.env.FETCHBASE_URL}/search/?q=${query.q}`
    try {
        const results = await fetch(baseUrl, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            }
        })
        if (results) {
            // const combo = [...results.clients, ...results.contacts]
            res.status(200).json(results.body)
        }
        
    }
    catch (err) {
        res.status(500).json({ error: 'failed to load data' })
    }
}