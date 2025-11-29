import { NextResponse } from "next/server"
import { query } from "@/lib/mysql/client"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const beneficiarioData = [
      data.fecha,
      data.hora,
      data.casoNumero,
      data.formaContacto,
      data.tipoContacto,
      data.lugarContacto,
      data.localidad,
      data.barrio,
      data.mismoBeneficiario,
      data.fuenteNombre,
      data.fuenteVinculo,
      data.fuenteTelefono,
      data.nombreApellido,
      data.fechaNacimiento,
      data.genero,
      data.direccion,
      data.telefono,
      data.grupoEtnico,
      JSON.stringify(data.poblacionesEspeciales || []),
      data.estadoCivil,
      data.numeroHijos,
      data.conviveCon,
      data.apoyoSocialPersonas ? Number(data.apoyoSocialPersonas) : null,
      data.apoyoSocialInteres ? Number(data.apoyoSocialInteres) : null,
      data.apoyoSocialAyudaVecinos ? Number(data.apoyoSocialAyudaVecinos) : null,
      typeof data.apoyoSocialPuntaje === "number"
        ? data.apoyoSocialPuntaje
        : data.apoyoSocialPuntaje
          ? Number(data.apoyoSocialPuntaje)
          : null,
      data.apoyoSocialNivel || null,
      data.escolaridad,
      data.usaComputador,
      data.ocupacion,
      data.alimentacion,
      data.practicaDeporte,
      data.cualDeporte,
      data.participacionComunitaria,
      data.haParticipado,
      JSON.stringify(data.situacionesSalud || []),
      JSON.stringify(data.situacionesConsumo || []),
      JSON.stringify(data.situacionesEntorno || []),
      JSON.stringify(data.situacionesEconomicas || []),
      JSON.stringify(data.situacionesLegales || []),
      JSON.stringify(data.peticionesApoyo || []),
      JSON.stringify(data.peticionesNecesidades || []),
      JSON.stringify(data.peticionesCapacitacion || []),
      JSON.stringify(data.peticionesAsesoria || []),
      data.descripcionCaso,
      data.nombreDiligencia,
      data.rolDiligencia,
      data.telefonoDiligencia,
      JSON.stringify(data.emociones || []),
    ]

    const sql = `INSERT INTO beneficiarios (
      fecha,hora,caso_numero,forma_contacto,tipo_contacto,lugar_contacto,localidad,barrio,mismo_beneficiario,
      fuente_nombre,fuente_vinculo,fuente_telefono,nombre_apellido,fecha_nacimiento,genero,direccion,telefono,
      grupo_etnico,poblaciones_especiales,estado_civil,numero_hijos,convive_con,apoyo_social_personas,apoyo_social_interes,
      apoyo_social_vecinos,apoyo_social_puntaje,apoyo_social_nivel,escolaridad,usa_computador,
      ocupacion,alimentacion,practica_deporte,cual_deporte,participacion_comunitaria,ha_participado,
      situaciones_salud,situaciones_consumo,situaciones_entorno,situaciones_economicas,situaciones_legales,
      peticiones_apoyo,peticiones_necesidades,peticiones_capacitacion,peticiones_asesoria,descripcion_caso,
      nombre_diligencia,rol_diligencia,telefono_diligencia,emociones
    ) VALUES (${beneficiarioData.map(() => "?").join(",")})`

    await query(sql, beneficiarioData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in POST /api/beneficiarios:", error)
    return NextResponse.json({ error: "Error al guardar el beneficiario" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rows = await query("SELECT * FROM beneficiarios ORDER BY created_at DESC")
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error("[v0] Error in GET /api/beneficiarios:", error)
    return NextResponse.json({ error: "Error al obtener los beneficiarios" }, { status: 500 })
  }
}
