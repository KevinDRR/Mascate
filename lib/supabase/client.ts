import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const URL_KEYS = ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"] as const
const SERVICE_KEYS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_KEY",
  "NEXT_PUBLIC_SUPABASE_KEY",
] as const

type ResolvedConfig = { url: string; serviceKey: string }

let cachedClient: SupabaseClient | null = null
let cachedConfig: ResolvedConfig | null = null

function firstEnv(keys: readonly string[]) {
  for (const key of keys) {
    const raw = process.env[key]
    if (typeof raw === "string") {
      const trimmed = raw.trim()
      if (trimmed) {
        return trimmed
      }
    }
  }
  return null
}

function resolveConfig(): ResolvedConfig | null {
  if (cachedConfig) return cachedConfig

  const url = firstEnv(URL_KEYS)
  const serviceKey = firstEnv(SERVICE_KEYS)

  if (!url || !serviceKey) {
    return null
  }

  cachedConfig = { url, serviceKey }
  return cachedConfig
}

function ensureClient() {
  if (cachedClient) return cachedClient

  const config = resolveConfig()

  if (!config) {
    throw new Error("Supabase environment variables are not configured")
  }

  cachedClient = createClient(config.url, config.serviceKey, {
    auth: {
      persistSession: false,
    },
  })

  return cachedClient
}

export function getSupabaseServerClient() {
  return ensureClient()
}

export function isSupabaseConfigured() {
  return resolveConfig() !== null
}

export function getSupabaseConfig() {
  return resolveConfig()
}
