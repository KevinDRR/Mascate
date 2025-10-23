import { BeneficiaryForm } from "@/components/beneficiary-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <div className="flex justify-end gap-2 mb-4">
            <Button asChild variant="outline">
              <Link href="/registros" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Ver Registros
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/reportes" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Ver Reportes
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Formulario de Registro de Contacto</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Sistema de registro de beneficiarios y seguimiento de casos
          </p>
        </div>
        <BeneficiaryForm />
      </div>
    </main>
  )
}
