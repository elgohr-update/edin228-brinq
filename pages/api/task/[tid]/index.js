import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  const baseUrl = `${process.env.FETCHBASE_URL}/tasks/${query.tid}?completed=${query.completed}&na=${query.na}`
  try {
    if (req.method === 'GET') {
      return null
    } else if (req.method === 'POST') {
      const results = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: req.body,
      })
      if (results) {
        res.status(200).json(results.body)
      }
    } else if (req.method === 'PUT') {
      const results = await fetch(baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        }
      })
      if (results) {
        res.status(200).json(results.body)
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
