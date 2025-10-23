"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ClipboardList, User, Users, GraduationCap, Heart, AlertCircle, FileText, UserCheck } from "lucide-react"
import { PlutchikWheel } from "./plutchik-wheel"

export function BeneficiaryForm() {
  const [formData, setFormData] = useState({
    // Sección 1: Datos de Registro
    fecha: "",
    hora: "",
    casoNumero: "",
    formaContacto: "",
    tipoContacto: "",
    lugarContacto: "",
    localidad: "",
    barrio: "",

    // Sección 2: Información del Beneficiario
    mismoBeneficiario: "",
    fuenteNombre: "",
    fuenteVinculo: "",
    fuenteTelefono: "",
    nombreApellido: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
    grupoEtnico: "",
    poblacionesEspeciales: [] as string[],

    // Sección 3: Entorno Familiar
    estadoCivil: "",
    numeroHijos: "",
    conviveCon: "",
    redesApoyo: [] as string[],

    // Sección 4: Educación y Ocupación
    escolaridad: "",
    usaComputador: "",
    ocupacion: "",

    // Sección 5: Bienestar
    apoyoSaludMental: "",
    alimentacion: "",
    practicaDeporte: "",
    cualDeporte: "",
    participacionComunitaria: "",
    haParticipado: "",

    // Sección 6: Situaciones Presentes
    situacionesSalud: [] as string[],
    situacionesConsumo: [] as string[],
    situacionesEntorno: [] as string[],
    situacionesEconomicas: [] as string[],
    situacionesLegales: [] as string[],

    // Sección 7: Peticiones
    peticionesApoyo: [] as string[],
    peticionesNecesidades: [] as string[],
    peticionesCapacitacion: [] as string[],
    peticionesAsesoria: [] as string[],

    // Sección 8: Descripción
    descripcionCaso: "",

    // Sección 9: Quien Diligencia
    nombreDiligencia: "",
    rolDiligencia: "",
    telefonoDiligencia: "",

    emociones: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const fetchNextCaseNumber = async () => {
      try {
        const response = await fetch("/api/next-case-number")
        const result = await response.json()

        if (result.success) {
          setFormData((prev) => ({
            ...prev,
            casoNumero: result.nextCaseNumber.toString(),
          }))
        }
      } catch (error) {
        console.error("[v0] Error fetching next case number:", error)
        // Si hay error, empezar desde 1
        setFormData((prev) => ({
          ...prev,
          casoNumero: "1",
        }))
      }
    }

    fetchNextCaseNumber()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Guardar género con primera letra en mayúscula
      const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "")
      const formDataToSend = {
        ...formData,
        genero: formData.genero ? capitalize(formData.genero) : "",
      }
      const response = await fetch("/api/beneficiarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el formulario")
      }

      console.log("[v0] Form submitted successfully:", result)
      setSubmitSuccess(true)
      alert("Formulario guardado exitosamente en la base de datos")

      // Reset form after successful submission
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert(error instanceof Error ? error.message : "Error al guardar el formulario")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección 1: Datos de Registro del Contacto */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>1. Datos de Registro del Contacto</CardTitle>
              <CardDescription>Información sobre el momento y forma del contacto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="casoNumero">Caso # (auto-generado, editable)</Label>
              <Input
                id="casoNumero"
                type="number"
                min="1"
                placeholder="Número de caso"
                value={formData.casoNumero}
                onChange={(e) => setFormData({ ...formData, casoNumero: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formaContacto">Forma de contacto</Label>
              <Select
                value={formData.formaContacto}
                onValueChange={(value) => setFormData({ ...formData, formaContacto: value })}
              >
                <SelectTrigger id="formaContacto">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-persona">En persona</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="videollamada">Videollamada</SelectItem>
                  <SelectItem value="correo">Correo electrónico</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoContacto">Tipo de contacto</Label>
              <Select
                value={formData.tipoContacto}
                onValueChange={(value) => setFormData({ ...formData, tipoContacto: value })}
              >
                <SelectTrigger id="tipoContacto">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primer-contacto">Primer contacto</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="cierre">Cierre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugarContacto">Lugar del contacto</Label>
              <Select
                value={formData.lugarContacto}
                onValueChange={(value) => setFormData({ ...formData, lugarContacto: value })}
              >
                <SelectTrigger id="lugarContacto">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="calle">Calle</SelectItem>
                  <SelectItem value="institucion">Institución</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad (Opcional)</Label>
              <Input
                id="localidad"
                type="text"
                placeholder="Localidad"
                value={formData.localidad}
                onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barrio">Barrio (Opcional)</Label>
              <Input
                id="barrio"
                type="text"
                placeholder="Barrio"
                value={formData.barrio}
                onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 2: Información del Beneficiario */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>2. Información del Beneficiario</CardTitle>
              <CardDescription>Datos personales y de contacto del beneficiario</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>¿La información la proporciona el mismo beneficiario?</Label>
            <RadioGroup
              value={formData.mismoBeneficiario}
              onValueChange={(value) => setFormData({ ...formData, mismoBeneficiario: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="beneficiario-si" />
                <Label htmlFor="beneficiario-si" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="beneficiario-no" />
                <Label htmlFor="beneficiario-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.mismoBeneficiario === "no" && (
            <div className="p-4 bg-muted rounded-lg space-y-4">
              <p className="text-sm font-medium">Datos de la fuente de información</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuenteNombre">Nombre</Label>
                  <Input
                    id="fuenteNombre"
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.fuenteNombre}
                    onChange={(e) => setFormData({ ...formData, fuenteNombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuenteVinculo">Vínculo</Label>
                  <Input
                    id="fuenteVinculo"
                    type="text"
                    placeholder="Relación con el beneficiario"
                    value={formData.fuenteVinculo}
                    onChange={(e) => setFormData({ ...formData, fuenteVinculo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuenteTelefono">Teléfono</Label>
                  <Input
                    id="fuenteTelefono"
                    type="tel"
                    placeholder="Teléfono de contacto"
                    value={formData.fuenteTelefono}
                    onChange={(e) => setFormData({ ...formData, fuenteTelefono: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreApellido">Nombre y Apellido</Label>
              <Input
                id="nombreApellido"
                type="text"
                placeholder="Nombre completo del beneficiario"
                value={formData.nombreApellido}
                onChange={(e) => setFormData({ ...formData, nombreApellido: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de nacimiento (Opcional)</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Género (Opcional)</Label>
              <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value })}>
                <SelectTrigger id="genero">
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
              <Label htmlFor="direccion">Dirección (Opcional)</Label>
              <Input
                id="direccion"
                type="text"
                placeholder="Dirección completa"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono (Opcional)</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grupoEtnico">Pertenencia a grupo étnico (Opcional)</Label>
            <Input
              id="grupoEtnico"
              type="text"
              placeholder="Especifique si pertenece a algún grupo étnico"
              value={formData.grupoEtnico}
              onChange={(e) => setFormData({ ...formData, grupoEtnico: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <Label>Poblaciones de especial interés (Opcional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Migración", "Discapacidad", "Adulto mayor", "Infancia", "Adolescencia", "LGBTIQ+"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`poblacion-${item}`}
                    checked={formData.poblacionesEspeciales.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("poblacionesEspeciales", item)}
                  />
                  <Label htmlFor={`poblacion-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Entorno Familiar y Social */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>3. Entorno Familiar y Social</CardTitle>
              <CardDescription>Información sobre la situación familiar y redes de apoyo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado civil</Label>
              <Select
                value={formData.estadoCivil}
                onValueChange={(value) => setFormData({ ...formData, estadoCivil: value })}
              >
                <SelectTrigger id="estadoCivil">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soltero">Soltero/a</SelectItem>
                  <SelectItem value="casado">Casado/a</SelectItem>
                  <SelectItem value="union-libre">Unión libre</SelectItem>
                  <SelectItem value="divorciado">Divorciado/a</SelectItem>
                  <SelectItem value="viudo">Viudo/a</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroHijos">Número de hijos(as)</Label>
              <Input
                id="numeroHijos"
                type="number"
                min="0"
                placeholder="0"
                value={formData.numeroHijos}
                onChange={(e) => setFormData({ ...formData, numeroHijos: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conviveCon">¿Con quién vive?</Label>
            <Select
              value={formData.conviveCon}
              onValueChange={(value) => setFormData({ ...formData, conviveCon: value })}
            >
              <SelectTrigger id="conviveCon">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padres">Padres</SelectItem>
                <SelectItem value="pareja">Pareja</SelectItem>
                <SelectItem value="hijos">Hijos</SelectItem>
                <SelectItem value="solo">Solo/a</SelectItem>
                <SelectItem value="familia-extendida">Familia extendida</SelectItem>
                <SelectItem value="amigos">Amigos</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Redes de apoyo con las que cuenta</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Familia", "Amigos", "Comunidad", "Institución", "Ninguna"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`red-${item}`}
                    checked={formData.redesApoyo.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("redesApoyo", item)}
                  />
                  <Label htmlFor={`red-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 4: Educación y Ocupación */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>4. Educación y Ocupación</CardTitle>
              <CardDescription>Nivel educativo y situación laboral</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="escolaridad">Último nivel de escolaridad alcanzado</Label>
            <Select
              value={formData.escolaridad}
              onValueChange={(value) => setFormData({ ...formData, escolaridad: value })}
            >
              <SelectTrigger id="escolaridad">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguno">Ninguno</SelectItem>
                <SelectItem value="primaria-incompleta">Primaria incompleta</SelectItem>
                <SelectItem value="primaria-completa">Primaria completa</SelectItem>
                <SelectItem value="secundaria-incompleta">Secundaria incompleta</SelectItem>
                <SelectItem value="secundaria-completa">Secundaria completa</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="tecnologico">Tecnológico</SelectItem>
                <SelectItem value="universitario-incompleto">Universitario incompleto</SelectItem>
                <SelectItem value="universitario-completo">Universitario completo</SelectItem>
                <SelectItem value="posgrado">Posgrado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>¿Sabe usar un computador?</Label>
            <RadioGroup
              value={formData.usaComputador}
              onValueChange={(value) => setFormData({ ...formData, usaComputador: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="computador-si" />
                <Label htmlFor="computador-si" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="computador-no" />
                <Label htmlFor="computador-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ocupacion">Ocupación actual</Label>
            <Select
              value={formData.ocupacion}
              onValueChange={(value) => setFormData({ ...formData, ocupacion: value })}
            >
              <SelectTrigger id="ocupacion">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trabajo-formal">Trabajo formal</SelectItem>
                <SelectItem value="trabajo-informal">Trabajo informal</SelectItem>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="sin-empleo">Sin empleo</SelectItem>
                <SelectItem value="hogar">Labores del hogar</SelectItem>
                <SelectItem value="pensionado">Pensionado</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sección 5: Bienestar y Estilo de Vida */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>5. Bienestar y Estilo de Vida</CardTitle>
              <CardDescription>Salud mental, alimentación y participación comunitaria</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apoyoSaludMental">Apoyo en salud mental</Label>
            <Select
              value={formData.apoyoSaludMental}
              onValueChange={(value) => setFormData({ ...formData, apoyoSaludMental: value })}
            >
              <SelectTrigger id="apoyoSaludMental">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nunca">Nunca ha recibido</SelectItem>
                <SelectItem value="pasado">Recibió en el pasado</SelectItem>
                <SelectItem value="actual">Recibe actualmente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Alimentación</Label>
            <RadioGroup
              value={formData.alimentacion}
              onValueChange={(value) => setFormData({ ...formData, alimentacion: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-o-mas" id="alimentacion-3" />
                <Label htmlFor="alimentacion-3" className="font-normal cursor-pointer">
                  Consume 3 o más comidas al día
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-o-menos" id="alimentacion-2" />
                <Label htmlFor="alimentacion-2" className="font-normal cursor-pointer">
                  Consume 2 o menos comidas al día
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>¿Practica algún deporte o pasatiempo?</Label>
            <RadioGroup
              value={formData.practicaDeporte}
              onValueChange={(value) => setFormData({ ...formData, practicaDeporte: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="deporte-si" />
                <Label htmlFor="deporte-si" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="deporte-no" />
                <Label htmlFor="deporte-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.practicaDeporte === "si" && (
            <div className="space-y-2">
              <Label htmlFor="cualDeporte">¿Cuál?</Label>
              <Input
                id="cualDeporte"
                type="text"
                placeholder="Especifique el deporte o pasatiempo"
                value={formData.cualDeporte}
                onChange={(e) => setFormData({ ...formData, cualDeporte: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>Participación comunitaria - ¿Conoce espacios comunitarios?</Label>
            <RadioGroup
              value={formData.participacionComunitaria}
              onValueChange={(value) => setFormData({ ...formData, participacionComunitaria: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="participa-si" />
                <Label htmlFor="participa-si" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="participa-no" />
                <Label htmlFor="participa-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.participacionComunitaria === "si" && (
            <div className="space-y-3">
              <Label>¿Ha participado?</Label>
              <RadioGroup
                value={formData.haParticipado}
                onValueChange={(value) => setFormData({ ...formData, haParticipado: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="ha-participado-si" />
                  <Label htmlFor="ha-participado-si" className="font-normal cursor-pointer">
                    Sí
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ha-participado-no" />
                  <Label htmlFor="ha-participado-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      <PlutchikWheel
        selectedEmotions={formData.emociones}
        onEmotionsChange={(emotions) => setFormData({ ...formData, emociones: emotions })}
      />

      {/* Sección 6: Situaciones Presentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>6. Situaciones Presentes</CardTitle>
              <CardDescription>Marque todas las situaciones que apliquen</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Salud Física y Mental</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Crisis psicológica",
                "Condición psiquiátrica",
                "Enfermedades crónicas",
                "Discapacidad",
                "VIH",
                "Embarazo",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`salud-${item}`}
                    checked={formData.situacionesSalud.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("situacionesSalud", item)}
                  />
                  <Label htmlFor={`salud-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Consumo de Sustancias</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["SPA legales (alcohol, tabaco)", "SPA ilegales", "Consumo por vía intravenosa"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`consumo-${item}`}
                    checked={formData.situacionesConsumo.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("situacionesConsumo", item)}
                  />
                  <Label htmlFor={`consumo-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Entorno y Convivencia</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Violencia intrafamiliar", "Violencia comunitaria", "Problemas de convivencia", "Habita la calle"].map(
                (item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`entorno-${item}`}
                      checked={formData.situacionesEntorno.includes(item)}
                      onCheckedChange={() => handleCheckboxChange("situacionesEntorno", item)}
                    />
                    <Label htmlFor={`entorno-${item}`} className="font-normal cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Situación Económica y Laboral</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Sin empleo", "Dificultades económicas", "Pobreza extrema", "Hambre"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`economica-${item}`}
                    checked={formData.situacionesEconomicas.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("situacionesEconomicas", item)}
                  />
                  <Label htmlFor={`economica-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Situación Legal y Educativa</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Problemas con la justicia", "Deserción escolar", "Analfabetismo"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`legal-${item}`}
                    checked={formData.situacionesLegales.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("situacionesLegales", item)}
                  />
                  <Label htmlFor={`legal-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 7: Peticiones y Necesidades */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>7. Peticiones y Necesidades</CardTitle>
              <CardDescription>Marque todos los apoyos solicitados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Apoyo Psicosocial y Salud</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Consejo", "Apoyo psicosocial", "Atención médica", "Medicamentos", "Atención psiquiátrica"].map(
                (item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`apoyo-${item}`}
                      checked={formData.peticionesApoyo.includes(item)}
                      onCheckedChange={() => handleCheckboxChange("peticionesApoyo", item)}
                    />
                    <Label htmlFor={`apoyo-${item}`} className="font-normal cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Necesidades Básicas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Alimentación", "Kit de higiene", "Alojamiento temporal", "Ropa"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`necesidad-${item}`}
                    checked={formData.peticionesNecesidades.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("peticionesNecesidades", item)}
                  />
                  <Label htmlFor={`necesidad-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Capacitación y Empleo</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Formación técnica", "Apoyo para conseguir empleo", "Apoyo escolar", "Alfabetización"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`capacitacion-${item}`}
                    checked={formData.peticionesCapacitacion.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("peticionesCapacitacion", item)}
                  />
                  <Label htmlFor={`capacitacion-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Asesoría Legal y Trámites</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Acceso a justicia", "Apoyo en trámites", "Documentación", "Asesoría legal"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`asesoria-${item}`}
                    checked={formData.peticionesAsesoria.includes(item)}
                    onCheckedChange={() => handleCheckboxChange("peticionesAsesoria", item)}
                  />
                  <Label htmlFor={`asesoria-${item}`} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 8: Descripción Abierta del Caso */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>8. Descripción Abierta del Caso</CardTitle>
              <CardDescription>Resumen de la situación y observaciones relevantes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="descripcionCaso">Descripción detallada</Label>
            <Textarea
              id="descripcionCaso"
              placeholder="Describa la situación del beneficiario, motivo del contacto y cualquier observación relevante..."
              value={formData.descripcionCaso}
              onChange={(e) => setFormData({ ...formData, descripcionCaso: e.target.value })}
              rows={6}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección 9: Datos de Quien Diligencia */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <UserCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>9. Datos de Quien Diligencia</CardTitle>
              <CardDescription>Información del profesional que completa el formulario</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreDiligencia">Nombre y apellido</Label>
              <Input
                id="nombreDiligencia"
                type="text"
                placeholder="Nombre completo"
                value={formData.nombreDiligencia}
                onChange={(e) => setFormData({ ...formData, nombreDiligencia: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rolDiligencia">Rol</Label>
              <Input
                id="rolDiligencia"
                type="text"
                placeholder="Cargo o función"
                value={formData.rolDiligencia}
                onChange={(e) => setFormData({ ...formData, rolDiligencia: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefonoDiligencia">Teléfono</Label>
              <Input
                id="telefonoDiligencia"
                type="tel"
                placeholder="Teléfono de contacto"
                value={formData.telefonoDiligencia}
                onChange={(e) => setFormData({ ...formData, telefonoDiligencia: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Envío */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.location.reload()} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="min-w-[200px]" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Enviar Formulario"}
        </Button>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
          ¡Formulario guardado exitosamente!
        </div>
      )}
    </form>
  )
}
