import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Access-Control-Request-Private-Network',
    'Access-Control-Allow-Private-Network': 'true',
    'Access-Control-Max-Age': '86400',
  })

  // OPTIONS プリフライトリクエストには 204 No Content を即座に返す
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers })
  }

  const response = NextResponse.next()
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
