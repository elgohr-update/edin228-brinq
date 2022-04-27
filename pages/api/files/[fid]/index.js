import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  const baseUrl = `${process.env.FETCHBASE_URL}/files/${query.fid}/`
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
    } else if (req.method === 'POST') {
      const results = await fetch(baseUrl, {
        method: 'POST',
        body: req.body,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
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
