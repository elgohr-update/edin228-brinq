import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { query } = req
  const session = await getSession({ req })
  try {
    let results = await fetch(
      `${process.env.FETCHBASE_URL}/company/parent/${query.cid}/clients`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
    if (results) {
      res.status(200).json(results.body)
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
