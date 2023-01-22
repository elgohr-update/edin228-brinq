import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const baseUrl = `${process.env.FETCHBASE_URL}/utils/ams360/test-wsapi-credentials`
  try {
    if (req.method === 'GET') {
      return null
    } else if (req.method === 'POST') {
      const results = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: req.body,
      })
      if (results) {
        res.status(200).json(results.body)
      }
    } else if (req.method === 'PUT') {
      return null
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
