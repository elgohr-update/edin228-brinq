import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  const baseUrl = query.task_id
    ? `${process.env.FETCHBASE_URL}/comments/?task_id=${query.task_id}`
    : query.quote_id
    ? `${process.env.FETCHBASE_URL}/comments/?quote_id=${query.quote_id}`
    : query.reply_id
    ? `${process.env.FETCHBASE_URL}/comments/?reply_id=${query.reply_id}`
    : null
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
      return null
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
