import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cachedClient: SupabaseClient | null = null

function ensureClient() {
  if (cachedClient) return cachedClient

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are not configured")
  }

  cachedClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  })

  return cachedClient
}

export function getSupabaseServerClient() {
  return ensureClient()
}
