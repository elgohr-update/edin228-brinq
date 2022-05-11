import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const baseUrl = `${process.env.FETCHBASE_URL}/summary/dashboard`
  try {
    if (req.method === 'GET') {
      const results = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      if (results) {
        res.status(200).json(results.body)
      }
    } 
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
