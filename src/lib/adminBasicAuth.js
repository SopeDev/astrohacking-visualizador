function decodeBase64(value) {
  if (typeof atob === 'function') {
    return atob(value)
  }
  return Buffer.from(value, 'base64').toString('utf-8')
}

export function checkAdminBasicAuthHeader(authorizationHeader) {
  const user = process.env.ADMIN_BASIC_USER
  const pass = process.env.ADMIN_BASIC_PASSWORD
  if (!user || !pass) {
    return {
      ok: false,
      status: 503,
      message: 'Set ADMIN_BASIC_USER and ADMIN_BASIC_PASSWORD in the environment.',
    }
  }

  if (!authorizationHeader?.startsWith('Basic ')) {
    return { ok: false, status: 401 }
  }

  let decoded
  try {
    decoded = decodeBase64(authorizationHeader.slice(6))
  } catch {
    return { ok: false, status: 401 }
  }

  const sep = decoded.indexOf(':')
  if (sep < 0) {
    return { ok: false, status: 401 }
  }

  const authUser = decoded.slice(0, sep)
  const authPass = decoded.slice(sep + 1)
  return { ok: authUser === user && authPass === pass, status: 401 }
}
