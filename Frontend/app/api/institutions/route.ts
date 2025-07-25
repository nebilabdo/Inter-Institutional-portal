import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const type = searchParams.get("type") || undefined

    const institutions = await DatabaseService.getInstitutions({ status, type })

    return NextResponse.json({
      success: true,
      data: institutions,
      count: institutions.length,
    })
  } catch (error) {
    console.error("Error fetching institutions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch institutions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "focalPersonName", "focalPersonEmail", "organizationType", "address"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const institution = await DatabaseService.createInstitution({
      name: body.name,
      focalPersonName: body.focalPersonName,
      focalPersonEmail: body.focalPersonEmail,
      focalPersonPhone: body.focalPersonPhone,
      organizationType: body.organizationType,
      address: body.address,
      description: body.description,
      status: "pending",
    })

    // Create audit log
    await DatabaseService.createAuditLog({
      userId: "system",
      action: "CREATE_INSTITUTION",
      entityType: "Institution",
      entityId: institution.id,
      details: { institutionName: institution.name, organizationType: institution.organizationType },
    })

    return NextResponse.json({
      success: true,
      data: institution,
      message: "Institution registered successfully",
    })
  } catch (error) {
    console.error("Error creating institution:", error)
    return NextResponse.json({ success: false, error: "Failed to create institution" }, { status: 500 })
  }
}
