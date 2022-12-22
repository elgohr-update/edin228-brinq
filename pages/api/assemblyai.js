import axios from 'axios'
import { timeout } from '../../utils/utils'

const assembly = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: `${process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY}`,
    'content-type': 'application/json',
  },
})

const assemblyUpload = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: `${process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY}`,
    'content-type': 'application/json',
    'transfer-encoding': 'chunked',
  },
})

export const postTranscriptBlob = async (_file) => {
  const getData = await assemblyUpload
    .post('/upload', _file)
    .then((res) => {
      return res.data.upload_url
    })
    .catch((err) => console.error(err))
  return getData
}

export const postTranscriptUrl = async (url) => {
  const getData = await assembly
    .post('/transcript', {
      audio_url: `${url}`,
      entity_detection: true,
      auto_highlights: true,
      redact_pii: true,
      redact_pii_policies: [
        'medical_process',
        'drug', 
        'medical_condition',
        'blood_type',
        'us_social_security_number',
        'credit_card_number',
        'credit_card_expiration',
        'credit_card_cvv',
        'drivers_license',
        'banking_information',
      ],
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => console.error(err))
  return getData
}

export const getTranscript = async (transcriptId) => {
  const getData = await assembly
    .get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`)
    .then((res) => {
      if (res.data) {
        return res.data
      }
    })
    .catch((err) => console.error(err))
  return getData
}

export const getTranscriptCompleted = async (transcriptId) => {
  const getData = await assembly
    .get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`)
    .then(async (response) => {
      let data = response.data
      while (data.status !== 'completed' && data.status !== 'error') {
        await timeout(1000)
        const response = await assembly.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`
        )

        data = response.data
      }
      return data
    })
    .catch((err) => console.error(err))
  return getData
}
