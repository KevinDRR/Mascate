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

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno" },
      { status: 503 },
    )
  }

  try {
    const data = await request.json()
    const supabase = getSupabaseServerClient()

    const payload = {
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
      poblaciones_especiales: toArrayOrEmpty<string>(data.poblacionesEspeciales),
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

    const { data: inserted, error: insertError } = await supabase
      .from("beneficiarios")
      .insert([payload])
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true, data: inserted })
  } catch (error) {
    console.error("[v0] Error in POST /api/beneficiarios:", error)
    return NextResponse.json({ error: "Error al guardar el beneficiario" }, { status: 500 })
  }
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: [], fallback: true })
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

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error("[v0] Error in GET /api/beneficiarios:", error)
    return NextResponse.json({ error: "Error al obtener los beneficiarios" }, { status: 500 })
  }
}
