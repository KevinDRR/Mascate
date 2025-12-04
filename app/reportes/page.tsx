import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ReportesClient } from "@/components/reportes-client"
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ReportesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Datos no disponibles</h1>
            <p className="text-muted-foreground mb-6">
              Supabase no está configurado en este entorno, por lo que no se pueden mostrar estadísticas.
            </p>
            <Button asChild>
              <Link href="/">Volver al formulario</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("beneficiarios")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Formulario
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/registros">Ver Registros</Link>
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Reportes Estadísticos</h1>
            <p className="text-muted-foreground text-lg text-pretty">
              Análisis y estadísticas de los beneficiarios registrados
            </p>
          </div>
          <ReportesClient beneficiarios={data ?? []} />
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] Error fetching beneficiarios for reportes:", error)
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error al cargar los datos</h1>
            <p className="text-muted-foreground mb-6">
              No se pudo establecer conexión con la base de datos en el entorno actual
            </p>
            <Button asChild>
              <Link href="/">Volver al formulario</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }
}
