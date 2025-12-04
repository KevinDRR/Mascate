import { NextResponse } from "next/server"
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, nextCaseNumber: 1, fallback: true })
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("beneficiarios")
      .select("caso_numero")
      .order("caso_numero", { ascending: false })
      .limit(1)

    if (error) {
      throw error
    }

    let nextCaseNumber = 1
    const currentCase = data?.[0]?.caso_numero

    if (typeof currentCase === "number") {
      nextCaseNumber = currentCase + 1
    } else if (typeof currentCase === "string") {
      const parsed = Number.parseInt(currentCase, 10)
      if (!Number.isNaN(parsed)) {
        nextCaseNumber = parsed + 1
      }
    }

    return NextResponse.json({ success: true, nextCaseNumber })
  } catch (error) {
    console.error("[v0] Error in GET /api/next-case-number:", error)
    return NextResponse.json({ success: true, nextCaseNumber: 1, fallback: true })
  }
}
