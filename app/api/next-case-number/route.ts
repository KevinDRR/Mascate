import { NextResponse } from "next/server"
import { query } from "@/lib/mysql/client"
import { safeParseJson } from "@/lib/utils"

const fallbackState = {
  cachedCaseNumber: 1,
}

export async function GET() {
  try {
    const rows = await query("SELECT caso_numero FROM beneficiarios ORDER BY CAST(caso_numero AS UNSIGNED) DESC LIMIT 1")
    const nextCaseNumber = rows && rows.length > 0 ? Number.parseInt(rows[0].caso_numero) + 1 : 1

    return NextResponse.json({ success: true, nextCaseNumber })
  } catch (error) {
    console.error("[v0] Error in GET /api/next-case-number:", error)
    const parsedCached = safeParseJson<{ cachedCaseNumber?: number }>(process.env.NEXT_PUBLIC_BUILD_CACHE)
    const fallbackCase = parsedCached?.cachedCaseNumber ?? fallbackState.cachedCaseNumber
    fallbackState.cachedCaseNumber = fallbackCase + 1

    return NextResponse.json({ success: true, nextCaseNumber: fallbackCase, fallback: true })
  }
}
