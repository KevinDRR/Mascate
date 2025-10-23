import { query } from "@/lib/mysql/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, ArrowLeft } from "lucide-react"
import { RegistrosClient } from "@/components/registros-client"

interface Beneficiario {
  id: string
  created_at: string
  fecha: string
  hora: string
  caso_numero: string
  nombre_apellido: string
  telefono: string
  genero: string
  localidad: string
  barrio: string
  forma_contacto: string
  tipo_contacto: string
  nombre_diligencia: string
  rol_diligencia: string
  descripcion_caso: string
  poblaciones_especiales: string[]
  situaciones_salud: string[]
  situaciones_consumo: string[]
  situaciones_entorno: string[]
  situaciones_economicas: string[]
  situaciones_legales: string[]
  peticiones_apoyo: string[]
  peticiones_necesidades: string[]
  peticiones_capacitacion: string[]
  peticiones_asesoria: string[]
}

export default async function RegistrosPage() {
  const beneficiarios = await query("SELECT * FROM beneficiarios ORDER BY created_at DESC")
  const error = null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-4">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Formulario
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-balance">Registros de Beneficiarios</h1>
              <p className="text-muted-foreground mt-1">Base de datos de contactos y seguimiento</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{beneficiarios?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total de registros</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {beneficiarios?.filter((b) => b.tipo_contacto === "primer-contacto").length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Primeros contactos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {beneficiarios?.filter((b) => b.tipo_contacto === "seguimiento").length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Seguimientos</p>
            </CardContent>
          </Card>
        </div>

        <RegistrosClient beneficiarios={beneficiarios || []} error={error} />
      </div>
    </div>
  )
}
