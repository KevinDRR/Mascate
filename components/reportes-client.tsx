"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, MapPin, Heart, AlertCircle, FileText } from "lucide-react"
import { safeParseJson } from "@/lib/utils"
import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface Beneficiario {
  id: string
  caso_numero: string
  nombre_apellido: string
  genero: string
  fecha_nacimiento: string
  localidad: string
  situaciones_salud: string[]
  situaciones_consumo: string[]
  situaciones_entorno: string[]
  situaciones_economicas: string[]
  situaciones_legales: string[]
  peticiones_apoyo: string[]
  peticiones_necesidades: string[]
  peticiones_capacitacion: string[]
  peticiones_asesoria: string[]
  ocupacion: string
  escolaridad: string
  estado_civil: string
  created_at: string
}

interface ReportesClientProps {
  beneficiarios: Beneficiario[]
}

function ensureStringArray(value: unknown): string[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : item == null ? "" : String(item)))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === "string") {
    const parsed = safeParseJson<unknown>(value.trim())
    if (Array.isArray(parsed)) {
      return ensureStringArray(parsed)
    }
    return value.trim() ? [value.trim()] : []
  }

  const parsed = safeParseJson<unknown>(value)
  if (Array.isArray(parsed)) {
    return ensureStringArray(parsed)
  }

  return []
}

export function ReportesClient({ beneficiarios }: ReportesClientProps) {
  const estadisticas = useMemo(() => {
    const total = beneficiarios.length

    const generos = beneficiarios.reduce(
      (acc, b) => {
        const genero = b.genero || "No especificado"
        acc[genero] = (acc[genero] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const edades = beneficiarios
      .filter((b) => b.fecha_nacimiento)
      .map((b) => {
        const hoy = new Date()
        const nacimiento = new Date(b.fecha_nacimiento)
        return hoy.getFullYear() - nacimiento.getFullYear()
      })

    const rangoEdades = {
      "0-17": edades.filter((e) => e < 18).length,
      "18-29": edades.filter((e) => e >= 18 && e < 30).length,
      "30-49": edades.filter((e) => e >= 30 && e < 50).length,
      "50-64": edades.filter((e) => e >= 50 && e < 65).length,
      "65+": edades.filter((e) => e >= 65).length,
    }

    const localidades = beneficiarios.reduce(
      (acc, b) => {
        const localidad = b.localidad || "No especificado"
        acc[localidad] = (acc[localidad] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topLocalidades = Object.entries(localidades)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const todasSituaciones: string[] = []
    beneficiarios.forEach((b) => {
      const salud = ensureStringArray(b.situaciones_salud)
      const consumo = ensureStringArray(b.situaciones_consumo)
      const entorno = ensureStringArray(b.situaciones_entorno)
      const economicas = ensureStringArray(b.situaciones_economicas)
      const legales = ensureStringArray(b.situaciones_legales)

      todasSituaciones.push(
        ...salud,
        ...consumo,
        ...entorno,
        ...economicas,
        ...legales,
      )
    })

    const situacionesCount = todasSituaciones.reduce(
      (acc, s) => {
        if (!s) return acc
        acc[s] = (acc[s] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topSituaciones = Object.entries(situacionesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    const todasPeticiones: string[] = []
    beneficiarios.forEach((b) => {
      const apoyo = ensureStringArray(b.peticiones_apoyo)
      const necesidades = ensureStringArray(b.peticiones_necesidades)
      const capacitacion = ensureStringArray(b.peticiones_capacitacion)
      const asesoria = ensureStringArray(b.peticiones_asesoria)

      todasPeticiones.push(
        ...apoyo,
        ...necesidades,
        ...capacitacion,
        ...asesoria,
      )
    })

    const peticionesCount = todasPeticiones.reduce(
      (acc, p) => {
        if (!p) return acc
        acc[p] = (acc[p] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topPeticiones = Object.entries(peticionesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    const ocupaciones = beneficiarios.reduce(
      (acc, b) => {
        const ocupacion = b.ocupacion || "No especificado"
        acc[ocupacion] = (acc[ocupacion] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const escolaridades = beneficiarios.reduce(
      (acc, b) => {
        const escolaridad = b.escolaridad || "No especificado"
        acc[escolaridad] = (acc[escolaridad] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      generos,
      rangoEdades,
      topLocalidades,
      topSituaciones,
      topPeticiones,
      ocupaciones,
      escolaridades,
    }
  }, [beneficiarios])

  const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#ca8a04", "#dc2626"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Beneficiarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{estadisticas.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Localidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{estadisticas.topLocalidades.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Situaciones Identificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-accent" />
              <span className="text-3xl font-bold">{estadisticas.topSituaciones.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peticiones Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-accent" />
              <span className="text-3xl font-bold">{estadisticas.topPeticiones.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Distribución por Género</CardTitle>
              <CardDescription>Cantidad de beneficiarios por género</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(estadisticas.generos).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(estadisticas.generos).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {Object.entries(estadisticas.generos).map(([genero, count]) => (
              <div key={genero} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{genero}</span>
                <div className="flex items-center gap-3">
                  <div className="w-64 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / estadisticas.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-16 text-right">
                    {count} ({Math.round((count / estadisticas.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Distribución por Rango de Edad</CardTitle>
              <CardDescription>Cantidad de beneficiarios por grupo etario</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(estadisticas.rangoEdades).map(([name, value]) => ({
                  name: `${name} años`,
                  value,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {Object.entries(estadisticas.rangoEdades).map(([rango, count]) => (
              <div key={rango} className="flex items-center justify-between">
                <span className="text-sm font-medium">{rango} años</span>
                <div className="flex items-center gap-3">
                  <div className="w-64 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / estadisticas.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-16 text-right">
                    {count} ({Math.round((count / estadisticas.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Top 5 Localidades</CardTitle>
              <CardDescription>Localidades con mayor cantidad de beneficiarios</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estadisticas.topLocalidades.map(([name, value]) => ({ name, value }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {estadisticas.topLocalidades.map(([localidad, count]) => (
              <div key={localidad} className="flex items-center justify-between">
                <span className="text-sm font-medium">{localidad}</span>
                <div className="flex items-center gap-3">
                  <div className="w-64 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / estadisticas.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-16 text-right">
                    {count} ({Math.round((count / estadisticas.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-accent" />
            <div>
              <CardTitle>Top 10 Situaciones Más Comunes</CardTitle>
              <CardDescription>Situaciones identificadas con mayor frecuencia</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estadisticas.topSituaciones.map(([name, value]) => ({ name, value }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={180} />
                <Tooltip />
                <Bar dataKey="value" fill="#ea580c" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {estadisticas.topSituaciones.map(([situacion, count]) => (
              <div key={situacion} className="flex items-center justify-between">
                <span className="text-sm font-medium">{situacion}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(count / estadisticas.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-accent" />
            <div>
              <CardTitle>Top 10 Peticiones Más Frecuentes</CardTitle>
              <CardDescription>Apoyos y necesidades más solicitados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estadisticas.topPeticiones.map(([name, value]) => ({ name, value }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={180} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {estadisticas.topPeticiones.map(([peticion, count]) => (
              <div key={peticion} className="flex items-center justify-between">
                <span className="text-sm font-medium">{peticion}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(count / estadisticas.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Distribución por Ocupación</CardTitle>
              <CardDescription>Situación laboral de los beneficiarios</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(estadisticas.ocupaciones)
              .sort(([, a], [, b]) => b - a)
              .map(([ocupacion, count]) => (
                <div key={ocupacion} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{ocupacion}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / estadisticas.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">
                      {count} ({Math.round((count / estadisticas.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Distribución por Nivel de Escolaridad</CardTitle>
              <CardDescription>Nivel educativo de los beneficiarios</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(estadisticas.escolaridades)
              .sort(([, a], [, b]) => b - a)
              .map(([escolaridad, count]) => (
                <div key={escolaridad} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{escolaridad}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / estadisticas.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">
                      {count} ({Math.round((count / estadisticas.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
