import { NextResponse } from "next/server"
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client"

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toArrayOrEmpty<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  return []
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: null, fallback: true })
  }

  try {
    const { id } = params
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("beneficiarios")
      .select("*")
      .eq("id", id)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json({ success: true, data: data ?? null })
  } catch (error) {
    console.error("[v0] Error in GET /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al obtener el beneficiario" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno" },
      { status: 503 },
    )
  }

  try {
    const { id } = params
    const data = await request.json()

    const fields = {
      fecha: data.fecha,
      hora: data.hora,
      caso_numero: data.casoNumero,
      forma_contacto: data.formaContacto,
      tipo_contacto: data.tipoContacto,
      lugar_contacto: data.lugarContacto,
      localidad: data.localidad,
      barrio: data.barrio,
      mismo_beneficiario: data.mismoBeneficiario,
      fuente_nombre: data.fuenteNombre,
      fuente_vinculo: data.fuenteVinculo,
      fuente_telefono: data.fuenteTelefono,
      nombre_apellido: data.nombreApellido,
      fecha_nacimiento: data.fechaNacimiento,
      genero: data.genero,
      direccion: data.direccion,
      telefono: data.telefono,
      grupo_etnico: data.grupoEtnico,
      poblaciones_especiales: data.poblacionesEspeciales,
      estado_civil: data.estadoCivil,
      numero_hijos: data.numeroHijos,
      convive_con: data.conviveCon,
      apoyo_social_personas: toNumberOrNull(data.apoyoSocialPersonas),
      apoyo_social_interes: toNumberOrNull(data.apoyoSocialInteres),
      apoyo_social_vecinos: toNumberOrNull(data.apoyoSocialAyudaVecinos),
      apoyo_social_puntaje: toNumberOrNull(data.apoyoSocialPuntaje),
      apoyo_social_nivel: data.apoyoSocialNivel || null,
      escolaridad: data.escolaridad,
      usa_computador: data.usaComputador,
      ocupacion: data.ocupacion,
      alimentacion: data.alimentacion,
      practica_deporte: data.practicaDeporte,
      cual_deporte: data.cualDeporte,
      participacion_comunitaria: data.participacionComunitaria,
      ha_participado: data.haParticipado,
      situaciones_salud: toArrayOrEmpty<string>(data.situacionesSalud),
      situaciones_consumo: toArrayOrEmpty<string>(data.situacionesConsumo),
      situaciones_entorno: toArrayOrEmpty<string>(data.situacionesEntorno),
      situaciones_economicas: toArrayOrEmpty<string>(data.situacionesEconomicas),
      situaciones_legales: toArrayOrEmpty<string>(data.situacionesLegales),
      peticiones_apoyo: toArrayOrEmpty<string>(data.peticionesApoyo),
      peticiones_necesidades: toArrayOrEmpty<string>(data.peticionesNecesidades),
      peticiones_capacitacion: toArrayOrEmpty<string>(data.peticionesCapacitacion),
      peticiones_asesoria: toArrayOrEmpty<string>(data.peticionesAsesoria),
      descripcion_caso: data.descripcionCaso,
      nombre_diligencia: data.nombreDiligencia,
      rol_diligencia: data.rolDiligencia,
      telefono_diligencia: data.telefonoDiligencia,
      emociones: toArrayOrEmpty<string | Record<string, unknown>>(data.emociones),
    }
    const supabase = getSupabaseServerClient()
    const { data: updated, error } = await supabase
      .from("beneficiarios")
      .update(fields)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: updated ?? null })
  } catch (error) {
    console.error("[v0] Error in PUT /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al actualizar el beneficiario" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno" },
      { status: 503 },
    )
  }

  try {
    const { id } = params
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("beneficiarios").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: "Beneficiario eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al eliminar el beneficiario" }, { status: 500 })
  }
}
