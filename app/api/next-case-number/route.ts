import { NextResponse } from "next/server"
import { query } from "@/lib/mysql/client"

export async function GET() {
  try {
    // Get the highest case number
    const rows = await query("SELECT caso_numero FROM beneficiarios ORDER BY CAST(caso_numero AS UNSIGNED) DESC LIMIT 1")
    const nextCaseNumber = rows && rows.length > 0 ? Number.parseInt(rows[0].caso_numero) + 1 : 1

    return NextResponse.json({ success: true, nextCaseNumber })
  } catch (error) {
    console.error("[v0] Error in GET /api/next-case-number:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
