"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Beneficiario {
  id: string
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
  redes_apoyo: string[]
  escolaridad: string
  usa_computador: string
  ocupacion: string
  apoyo_salud_mental: string
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

interface BeneficiaryFormEditProps {
  beneficiario: Beneficiario
  onSuccess: (updatedBeneficiario: Beneficiario) => void
  onCancel: () => void
}

export function BeneficiaryFormEdit({ beneficiario, onSuccess, onCancel }: BeneficiaryFormEditProps) {
  const [formData, setFormData] = useState({
    fecha: beneficiario.fecha,
    hora: beneficiario.hora,
    casoNumero: beneficiario.caso_numero,
    formaContacto: beneficiario.forma_contacto,
    tipoContacto: beneficiario.tipo_contacto,
    lugarContacto: beneficiario.lugar_contacto,
    localidad: beneficiario.localidad,
    barrio: beneficiario.barrio,
    mismoBeneficiario: beneficiario.mismo_beneficiario,
    fuenteNombre: beneficiario.fuente_nombre,
    fuenteVinculo: beneficiario.fuente_vinculo,
    fuenteTelefono: beneficiario.fuente_telefono,
    nombreApellido: beneficiario.nombre_apellido,
    fechaNacimiento: beneficiario.fecha_nacimiento,
    genero: beneficiario.genero,
    direccion: beneficiario.direccion,
    telefono: beneficiario.telefono,
    grupoEtnico: beneficiario.grupo_etnico,
    poblacionesEspeciales: beneficiario.poblaciones_especiales || [],
    estadoCivil: beneficiario.estado_civil,
    numeroHijos: beneficiario.numero_hijos,
    conviveCon: beneficiario.convive_con,
    redesApoyo: beneficiario.redes_apoyo || [],
    escolaridad: beneficiario.escolaridad,
    usaComputador: beneficiario.usa_computador,
    ocupacion: beneficiario.ocupacion,
    apoyoSaludMental: beneficiario.apoyo_salud_mental,
    alimentacion: beneficiario.alimentacion,
    practicaDeporte: beneficiario.practica_deporte,
    cualDeporte: beneficiario.cual_deporte,
    participacionComunitaria: beneficiario.participacion_comunitaria,
    haParticipado: beneficiario.ha_participado,
    situacionesSalud: beneficiario.situaciones_salud || [],
    situacionesConsumo: beneficiario.situaciones_consumo || [],
    situacionesEntorno: beneficiario.situaciones_entorno || [],
    situacionesEconomicas: beneficiario.situaciones_economicas || [],
    situacionesLegales: beneficiario.situaciones_legales || [],
    peticionesApoyo: beneficiario.peticiones_apoyo || [],
    peticionesNecesidades: beneficiario.peticiones_necesidades || [],
    peticionesCapacitacion: beneficiario.peticiones_capacitacion || [],
    peticionesAsesoria: beneficiario.peticiones_asesoria || [],
    descripcionCaso: beneficiario.descripcion_caso,
    nombreDiligencia: beneficiario.nombre_diligencia,
    rolDiligencia: beneficiario.rol_diligencia,
    telefonoDiligencia: beneficiario.telefono_diligencia,
    emociones: beneficiario.emociones || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "")
      const formDataToSend = { ...formData, genero: formData.genero ? capitalize(formData.genero) : "" }

      const response = await fetch(`/api/beneficiarios/${beneficiario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el formulario")
      }

      onSuccess(result.data)
    } catch (error) {
      console.error("[v0] Error updating form:", error)
      alert(error instanceof Error ? error.message : "Error al actualizar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [field]: newValues }
    })
  }

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombreApellido">Nombre y Apellido</Label>
            <Input
              id="edit-nombreApellido"
              type="text"
              value={formData.nombreApellido}
              onChange={(e) => setFormData({ ...formData, nombreApellido: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-casoNumero">Caso #</Label>
            <Input
              id="edit-casoNumero"
              type="number"
              value={formData.casoNumero}
              onChange={(e) => setFormData({ ...formData, casoNumero: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-fecha">Fecha</Label>
            <Input
              id="edit-fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-hora">Hora</Label>
            <Input
              id="edit-hora"
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-telefono">Teléfono</Label>
            <Input
              id="edit-telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-genero">Género</Label>
            <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value })}>
              <SelectTrigger id="edit-genero">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="no-binario">No binario</SelectItem>
                <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-localidad">Localidad</Label>
            <Input
              id="edit-localidad"
              type="text"
              value={formData.localidad}
              onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-barrio">Barrio</Label>
            <Input
              id="edit-barrio"
              type="text"
              value={formData.barrio}
              onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-descripcionCaso">Descripción del caso</Label>
          <Textarea
            id="edit-descripcionCaso"
            value={formData.descripcionCaso}
            onChange={(e) => setFormData({ ...formData, descripcionCaso: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombreDiligencia">Nombre (Diligencia)</Label>
            <Input
              id="edit-nombreDiligencia"
              type="text"
              value={formData.nombreDiligencia}
              onChange={(e) => setFormData({ ...formData, nombreDiligencia: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-rolDiligencia">Rol (Diligencia)</Label>
            <Input
              id="edit-rolDiligencia"
              type="text"
              value={formData.rolDiligencia}
              onChange={(e) => setFormData({ ...formData, rolDiligencia: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-telefonoDiligencia">Teléfono (Diligencia)</Label>
            <Input
              id="edit-telefonoDiligencia"
              type="tel"
              value={formData.telefonoDiligencia}
              onChange={(e) => setFormData({ ...formData, telefonoDiligencia: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}
