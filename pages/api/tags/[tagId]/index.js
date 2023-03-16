import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  const baseUrl = `${process.env.FETCHBASE_URL}/tags/${query.tagId}`
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      if (results) {
        res.status(200).json(results.body)
      }
    } else if (req.method === 'PUT') {
      const results = await fetch(baseUrl, {
        method: 'PUT',
        body: req.body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      if (results) {
        res.status(200).json(results.body)
      }
    } else if (req.method === 'DELETE') {
        const results = await fetch(baseUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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
