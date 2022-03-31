import { getSession } from "next-auth/react"

export default async function handler(req, res) {
    const { query } = req
    const session = await getSession({req})
    const baseUrl = `${process.env.FETCHBASE_URL}/clients/${query.cid}?onlyInfo=${query.onlyInfo}`
    try {
        if (query.onlyInfo){
            let results = await fetch(`${process.env.FETCHBASE_URL}/clients/${query.cid}/info`, {
                method: 'GET',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                }
            })
            if (results) {
                res.status(200).json(results.body)
            }
        }
        else {
            let results = await fetch(`${process.env.FETCHBASE_URL}/clients/${query.cid}`, {
                method: 'GET',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                }
            })
            if (results) {
                res.status(200).json(results.body)
            }
        }
        
        
    }
    catch (err) {
        res.status(500).json({ error: 'failed to load data' })
    }
}