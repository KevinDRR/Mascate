"use client"

import { useState } from "react"
import { cn, safeParseJson } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Database, Calendar, User, Phone, MapPin, Search, Eye, Pencil, Trash2 } from "lucide-react"
import { BeneficiaryFormEdit } from "./beneficiary-form-edit"

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
  emociones: string[]
  fecha_nacimiento: string
  direccion: string
  grupo_etnico: string
  estado_civil: string
  numero_hijos: string
  convive_con: string
  apoyo_social_personas: number | null
  apoyo_social_interes: number | null
  apoyo_social_vecinos: number | null
  apoyo_social_puntaje: number | null
  apoyo_social_nivel: string | null
  escolaridad: string
  usa_computador: string
  ocupacion: string
  alimentacion: string
  practica_deporte: string
  cual_deporte: string
  participacion_comunitaria: string
  ha_participado: string
  mismo_beneficiario: string
  fuente_nombre: string
  fuente_vinculo: string
  fuente_telefono: string
  lugar_contacto: string
  telefono_diligencia: string
}

interface RegistrosClientProps {
  beneficiarios: Beneficiario[]
  error: any
}

type EmotionPalette = {
  card: string
  badge: string
  indicator: string
}

type ParsedEmotion = {
  label: string
  palette: EmotionPalette
}

const defaultEmotionPalette: EmotionPalette = {
  card: "border-l-4 border-l-transparent",
  badge: "bg-purple-50 text-purple-700 border-purple-200",
  indicator: "bg-muted-foreground/60",
}

const emotionPaletteEntries: Array<{ keys: string[]; palette: EmotionPalette }> = [
  {
    keys: ["Alegría", "Serenidad", "Éxtasis", "Felicidad", "Gozo"],
    palette: {
      card: "bg-yellow-50 border-l-4 border-l-yellow-500",
      badge: "bg-yellow-100 text-yellow-900 border-yellow-300",
      indicator: "bg-yellow-400",
    },
  },
  {
    keys: ["Confianza", "Aceptación", "Admiración", "Esperanza"],
    palette: {
      card: "bg-emerald-50 border-l-4 border-l-emerald-500",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      indicator: "bg-emerald-400",
    },
  },
  {
    keys: ["Miedo", "Aprensión", "Terror", "Ansiedad", "Pánico"],
    palette: {
      card: "bg-green-50 border-l-4 border-l-green-700",
      badge: "bg-green-100 text-green-800 border-green-300",
      indicator: "bg-green-600",
    },
  },
  {
    keys: ["Sorpresa", "Distracción", "Asombro", "Confusión"],
    palette: {
      card: "bg-cyan-50 border-l-4 border-l-cyan-500",
      badge: "bg-cyan-100 text-cyan-800 border-cyan-300",
      indicator: "bg-cyan-500",
    },
  },
  {
    keys: ["Tristeza", "Pensativo", "Pena", "Soledad", "Melancolía"],
    palette: {
      card: "bg-blue-50 border-l-4 border-l-blue-600",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      indicator: "bg-blue-500",
    },
  },
  {
    keys: ["Disgusto", "Aburrimiento", "Aversión", "Rechazo"],
    palette: {
      card: "bg-purple-50 border-l-4 border-l-purple-600",
      badge: "bg-purple-100 text-purple-800 border-purple-300",
      indicator: "bg-purple-500",
    },
  },
  {
    keys: ["Ira", "Molestia", "Furia", "Rabia"],
    palette: {
      card: "bg-red-50 border-l-4 border-l-red-600",
      badge: "bg-red-100 text-red-800 border-red-300",
      indicator: "bg-red-500",
    },
  },
  {
    keys: ["Anticipación", "Interés", "Vigilancia", "Expectativa"],
    palette: {
      card: "bg-orange-50 border-l-4 border-l-orange-500",
      badge: "bg-orange-100 text-orange-800 border-orange-300",
      indicator: "bg-orange-500",
    },
  },
]

function normalizeEmotionKey(value?: string | null) {
  if (!value) return ""
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

const emotionPaletteMap = new Map<string, EmotionPalette>()

emotionPaletteEntries.forEach(({ keys, palette }) => {
  keys.forEach((key) => {
    emotionPaletteMap.set(normalizeEmotionKey(key), palette)
  })
})

function getEmotionPalette(value?: string | null) {
  if (!value) return defaultEmotionPalette
  return emotionPaletteMap.get(normalizeEmotionKey(value)) ?? defaultEmotionPalette
}

function parseEmotionData(value: unknown): ParsedEmotion[] {
  const parsedValue = Array.isArray(value) ? value : safeParseJson<unknown>(value)
  const arrayValue = Array.isArray(parsedValue) ? parsedValue : []
  const result: ParsedEmotion[] = []

  arrayValue.forEach((item) => {
    if (typeof item === "string") {
      result.push({ label: item, palette: getEmotionPalette(item) })
      return
    }

    if (item && typeof item === "object") {
      const candidate = item as Record<string, unknown>
      const emotionName = typeof candidate.emocion === "string" ? candidate.emocion : undefined
      const intensity = typeof candidate.intensidad === "string" ? candidate.intensidad : undefined
      const label = emotionName && intensity ? `${emotionName} (${intensity})` : intensity ?? emotionName

      if (label) {
        result.push({ label, palette: getEmotionPalette(emotionName ?? intensity) })
      }
    }
  })

  return result
}

export function RegistrosClient({ beneficiarios: initialBeneficiarios, error }: RegistrosClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [beneficiarios, setBeneficiarios] = useState(initialBeneficiarios)
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [beneficiarioToDelete, setBeneficiarioToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      beneficiario.nombre_apellido?.toLowerCase().includes(searchLower) ||
      beneficiario.caso_numero?.toLowerCase().includes(searchLower) ||
      beneficiario.telefono?.toLowerCase().includes(searchLower) ||
      beneficiario.localidad?.toLowerCase().includes(searchLower) ||
      beneficiario.barrio?.toLowerCase().includes(searchLower) ||
      beneficiario.nombre_diligencia?.toLowerCase().includes(searchLower)
    )
  })

  const handleView = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setViewDialogOpen(true)
  }

  const handleEdit = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setBeneficiarioToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!beneficiarioToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/beneficiarios/${beneficiarioToDelete}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el beneficiario")
      }

      setBeneficiarios((prev) => prev.filter((b) => b.id !== beneficiarioToDelete))
      setDeleteDialogOpen(false)
      setBeneficiarioToDelete(null)
    } catch (error) {
      console.error("[v0] Error deleting beneficiario:", error)
      alert(error instanceof Error ? error.message : "Error al eliminar el beneficiario")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = (updatedBeneficiario: Beneficiario) => {
    setBeneficiarios((prev) => prev.map((b) => (b.id === updatedBeneficiario.id ? updatedBeneficiario : b)))
    setEditDialogOpen(false)
    setSelectedBeneficiario(null)
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre, caso #, teléfono, localidad, barrio o profesional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2">
            Mostrando {filteredBeneficiarios.length} de {beneficiarios.length} registros
          </p>
        )}
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error al cargar los registros: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {!beneficiarios || beneficiarios.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay registros disponibles</p>
          </CardContent>
        </Card>
      ) : filteredBeneficiarios.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron registros que coincidan con tu búsqueda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBeneficiarios.map((beneficiario: Beneficiario) => {
            const emotionEntries = parseEmotionData(beneficiario.emociones as unknown)
            const primaryPalette = emotionEntries[0]?.palette ?? defaultEmotionPalette

            const poblaciones_especiales = Array.isArray(beneficiario.poblaciones_especiales)
              ? (beneficiario.poblaciones_especiales as string[])
              : safeParseJson<string[]>(beneficiario.poblaciones_especiales) || []

            const situaciones_salud = Array.isArray(beneficiario.situaciones_salud)
              ? (beneficiario.situaciones_salud as string[])
              : safeParseJson<string[]>(beneficiario.situaciones_salud) || []

            const situaciones_consumo = Array.isArray(beneficiario.situaciones_consumo)
              ? (beneficiario.situaciones_consumo as string[])
              : safeParseJson<string[]>(beneficiario.situaciones_consumo) || []

            const situaciones_entorno = Array.isArray(beneficiario.situaciones_entorno)
              ? (beneficiario.situaciones_entorno as string[])
              : safeParseJson<string[]>(beneficiario.situaciones_entorno) || []

            const situaciones_economicas = Array.isArray(beneficiario.situaciones_economicas)
              ? (beneficiario.situaciones_economicas as string[])
              : safeParseJson<string[]>(beneficiario.situaciones_economicas) || []

            const situaciones_legales = Array.isArray(beneficiario.situaciones_legales)
              ? (beneficiario.situaciones_legales as string[])
              : safeParseJson<string[]>(beneficiario.situaciones_legales) || []

            const peticiones_apoyo = Array.isArray(beneficiario.peticiones_apoyo)
              ? (beneficiario.peticiones_apoyo as string[])
              : safeParseJson<string[]>(beneficiario.peticiones_apoyo) || []

            const peticiones_necesidades = Array.isArray(beneficiario.peticiones_necesidades)
              ? (beneficiario.peticiones_necesidades as string[])
              : safeParseJson<string[]>(beneficiario.peticiones_necesidades) || []

            const peticiones_capacitacion = Array.isArray(beneficiario.peticiones_capacitacion)
              ? (beneficiario.peticiones_capacitacion as string[])
              : safeParseJson<string[]>(beneficiario.peticiones_capacitacion) || []

            const peticiones_asesoria = Array.isArray(beneficiario.peticiones_asesoria)
              ? (beneficiario.peticiones_asesoria as string[])
              : safeParseJson<string[]>(beneficiario.peticiones_asesoria) || []

            const situaciones_all = [
              ...situaciones_salud,
              ...situaciones_consumo,
              ...situaciones_entorno,
              ...situaciones_economicas,
              ...situaciones_legales,
            ]

            const apoyo_social_nivel =
              typeof beneficiario.apoyo_social_nivel === "string" && beneficiario.apoyo_social_nivel
                ? beneficiario.apoyo_social_nivel
                : null
            const apoyo_social_puntaje =
              beneficiario.apoyo_social_puntaje !== null && beneficiario.apoyo_social_puntaje !== undefined
                ? Number(beneficiario.apoyo_social_puntaje)
                : null

            return (
              <Card key={beneficiario.id} className={cn("hover:shadow-lg transition-shadow", primaryPalette.card)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full", primaryPalette.indicator)} aria-hidden="true" />
                        <CardTitle className="text-xl">{beneficiario.nombre_apellido}</CardTitle>
                        <Badge variant="outline">Caso #{beneficiario.caso_numero}</Badge>
                        {beneficiario.tipo_contacto && (
                          <Badge variant={beneficiario.tipo_contacto === "primer-contacto" ? "default" : "secondary"}>
                            {beneficiario.tipo_contacto}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(beneficiario.fecha)} - {formatTime(beneficiario.hora)}
                        </span>
                        {beneficiario.telefono && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {beneficiario.telefono}
                          </span>
                        )}
                        {(beneficiario.localidad || beneficiario.barrio) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {[beneficiario.localidad, beneficiario.barrio].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(beneficiario)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(beneficiario)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(beneficiario.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Género:</span> {beneficiario.genero || "No especificado"}
                    </div>
                    <div>
                      <span className="font-semibold">Forma de contacto:</span> {beneficiario.forma_contacto || "No especificado"}
                    </div>
                  </div>

                  {apoyo_social_nivel && apoyo_social_puntaje !== null && (
                    <div className="pt-2">
                      <p className="font-semibold text-sm mb-1">Apoyo social percibido</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {apoyo_social_nivel} · Puntaje {apoyo_social_puntaje}/15
                      </Badge>
                    </div>
                  )}

                  {emotionEntries.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2">Emociones identificadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {emotionEntries.map((emotion, index) => (
                          <Badge
                            key={`${emotion.label}-${index}`}
                            variant="secondary"
                            className={cn("border", emotion.palette.badge)}
                          >
                            {emotion.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {poblaciones_especiales && poblaciones_especiales.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2">Poblaciones especiales:</p>
                      <div className="flex flex-wrap gap-2">
                        {poblaciones_especiales.map((poblacion: string) => (
                          <Badge key={poblacion} variant="secondary">
                            {poblacion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {situaciones_all.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2">Situaciones presentes:</p>
                      <div className="flex flex-wrap gap-2">
                        {situaciones_all.map((situacion: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {situacion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(peticiones_apoyo.length || peticiones_necesidades.length || peticiones_capacitacion.length || peticiones_asesoria.length) > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2">Peticiones y necesidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {[...peticiones_apoyo, ...peticiones_necesidades, ...peticiones_capacitacion, ...peticiones_asesoria].map((peticion: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {peticion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {beneficiario.descripcion_caso && (
                    <div className="pt-4 border-t">
                      <p className="font-semibold text-sm mb-2">Descripción del caso:</p>
                      <p className="text-sm text-muted-foreground">{beneficiario.descripcion_caso}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      Diligenciado por: <span className="font-medium">{beneficiario.nombre_diligencia}</span> (
                      {beneficiario.rol_diligencia})
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Beneficiario</DialogTitle>
            <DialogDescription>Información completa del caso #{selectedBeneficiario?.caso_numero}</DialogDescription>
          </DialogHeader>
          {selectedBeneficiario && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Nombre:</span> {selectedBeneficiario.nombre_apellido}
                </div>
                <div>
                  <span className="font-semibold">Caso #:</span> {selectedBeneficiario.caso_numero}
                </div>
                <div>
                  <span className="font-semibold">Fecha:</span> {formatDate(selectedBeneficiario.fecha)}
                </div>
                <div>
                  <span className="font-semibold">Hora:</span> {formatTime(selectedBeneficiario.hora)}
                </div>
                <div>
                  <span className="font-semibold">Teléfono:</span> {selectedBeneficiario.telefono || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Género:</span> {selectedBeneficiario.genero || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Localidad:</span> {selectedBeneficiario.localidad || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Barrio:</span> {selectedBeneficiario.barrio || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Estado Civil:</span> {selectedBeneficiario.estado_civil || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Ocupación:</span> {selectedBeneficiario.ocupacion || "N/A"}
                </div>
              </div>

              {selectedBeneficiario.descripcion_caso && (
                <div>
                  <p className="font-semibold text-sm mb-2">Descripción del caso:</p>
                  <p className="text-sm text-muted-foreground">{selectedBeneficiario.descripcion_caso}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="font-semibold text-sm mb-2">Diligenciado por:</p>
                <p className="text-sm">
                  {selectedBeneficiario.nombre_diligencia} - {selectedBeneficiario.rol_diligencia}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Beneficiario</DialogTitle>
            <DialogDescription>Modifica la información del caso #{selectedBeneficiario?.caso_numero}</DialogDescription>
          </DialogHeader>
          {selectedBeneficiario && (
            <BeneficiaryFormEdit
              beneficiario={selectedBeneficiario}
              onSuccess={handleEditSuccess as any}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro del beneficiario de la base de
              datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
