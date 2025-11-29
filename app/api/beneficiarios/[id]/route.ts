import { NextResponse } from "next/server"
import { query } from "@/lib/mysql/client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const rows = await query("SELECT * FROM beneficiarios WHERE id = ? LIMIT 1", [id])
    return NextResponse.json({ success: true, data: rows[0] ?? null })
  } catch (error) {
    console.error("[v0] Error in GET /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al obtener el beneficiario" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      apoyo_social_personas: data.apoyoSocialPersonas ? Number(data.apoyoSocialPersonas) : null,
      apoyo_social_interes: data.apoyoSocialInteres ? Number(data.apoyoSocialInteres) : null,
      apoyo_social_vecinos: data.apoyoSocialAyudaVecinos ? Number(data.apoyoSocialAyudaVecinos) : null,
      apoyo_social_puntaje:
        typeof data.apoyoSocialPuntaje === "number"
          ? data.apoyoSocialPuntaje
          : data.apoyoSocialPuntaje
            ? Number(data.apoyoSocialPuntaje)
            : null,
      apoyo_social_nivel: data.apoyoSocialNivel || null,
      escolaridad: data.escolaridad,
      usa_computador: data.usaComputador,
      ocupacion: data.ocupacion,
      alimentacion: data.alimentacion,
      practica_deporte: data.practicaDeporte,
      cual_deporte: data.cualDeporte,
      participacion_comunitaria: data.participacionComunitaria,
      ha_participado: data.haParticipado,
      situaciones_salud: data.situacionesSalud,
      situaciones_consumo: data.situacionesConsumo,
      situaciones_entorno: data.situacionesEntorno,
      situaciones_economicas: data.situacionesEconomicas,
      situaciones_legales: data.situacionesLegales,
      peticiones_apoyo: data.peticionesApoyo,
      peticiones_necesidades: data.peticionesNecesidades,
      peticiones_capacitacion: data.peticionesCapacitacion,
      peticiones_asesoria: data.peticionesAsesoria,
      descripcion_caso: data.descripcionCaso,
      nombre_diligencia: data.nombreDiligencia,
      rol_diligencia: data.rolDiligencia,
      telefono_diligencia: data.telefonoDiligencia,
      emociones: data.emociones,
    }

    const setClauses: string[] = []
    const values: any[] = []
    Object.entries(fields).forEach(([key, val]) => {
      if (typeof val !== "undefined") {
        setClauses.push(`${key} = ?`)
        values.push(val)
      }
    })

    if (setClauses.length === 0) {
      return NextResponse.json({ success: true, data: null })
    }

    const sql = `UPDATE beneficiarios SET ${setClauses.join(", ")} WHERE id = ?`
    values.push(id)

    await query(sql, values)
    const updated = await query("SELECT * FROM beneficiarios WHERE id = ? LIMIT 1", [id])
    return NextResponse.json({ success: true, data: updated[0] ?? null })
  } catch (error) {
    console.error("[v0] Error in PUT /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al actualizar el beneficiario" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await query("DELETE FROM beneficiarios WHERE id = ?", [id])
    return NextResponse.json({ success: true, message: "Beneficiario eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/beneficiarios/[id]:", error)
    return NextResponse.json({ error: "Error al eliminar el beneficiario" }, { status: 500 })
  }
}
