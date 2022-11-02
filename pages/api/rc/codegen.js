const crypto = require('crypto')
const base64url = require('base64url')

export const runCodeGen = () => {
  const code_verifier = base64url(crypto.pseudoRandomBytes(32))

  const code_challenge = crypto
    .createHash('sha256')
    .update(code_verifier)
    .digest("base64")

  const code_challenge_str = base64url.fromBase64(code_challenge)
  console.log('code_verifier', code_verifier)
  console.log('challenge', code_challenge_str)
}
