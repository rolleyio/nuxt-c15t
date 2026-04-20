import {
  defineEventHandler,
  proxyRequest,
  getRequestURL,
  createError,
} from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * Same-origin proxy to the c15t backend.
 *
 * Users opt in via `c15t.serverProxy: true`. Paths under `serverProxyPath`
 * (default `/api/c15t`) get forwarded to `backendURL`, preserving method,
 * headers, and body. This lets the client talk to a first-party origin
 * so cookies aren't subject to third-party storage restrictions.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig().public.c15t as {
    backendURL: string
    serverProxyPath: string
    serverProxy: boolean
  }

  if (!config.serverProxy || !config.backendURL) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const reqUrl = getRequestURL(event)
  const prefix = config.serverProxyPath || '/api/c15t'
  const subPath = reqUrl.pathname.startsWith(prefix)
    ? reqUrl.pathname.slice(prefix.length)
    : reqUrl.pathname

  const target = new URL(subPath + reqUrl.search, config.backendURL).toString()

  return proxyRequest(event, target, {
    // Strip hop-by-hop; preserve cookies so consent state round-trips.
    headers: {
      host: new URL(config.backendURL).host,
    },
  })
})
