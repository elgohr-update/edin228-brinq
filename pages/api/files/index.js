import { getSession } from 'next-auth/react'
import { axios } from 'axios'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  const baseUrl = query.comment_id
    ? `${process.env.FETCHBASE_URL}/files/?comment_id=${query.comment_id}`
    : query.client_id
    ? `${process.env.FETCHBASE_URL}/files/?client_id=${query.client_id}`
    : query.note_id
    ? `${process.env.FETCHBASE_URL}/files/?note_id=${query.note_id}`
    : query.deal_id
    ? `${process.env.FETCHBASE_URL}/files/?deal_id=${query.deal_id}`
    : null
  try {
    if (req.method === 'GET') {
      return null
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
