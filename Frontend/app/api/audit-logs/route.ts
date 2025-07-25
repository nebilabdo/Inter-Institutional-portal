import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || undefined
    const entityType = searchParams.get("entityType") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const auditLogs = await DatabaseService.getAuditLogs({ userId, entityType, limit })

    return NextResponse.json({
      success: true,
      data: auditLogs,
      count: auditLogs.length,
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const auditLog = await DatabaseService.createAuditLog({
      userId: body.userId,
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      details: body.details || {},
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
    })

    return NextResponse.json({
      success: true,
      data: auditLog,
    })
  } catch (error) {
    console.error("Error creating audit log:", error)
    return NextResponse.json({ success: false, error: "Failed to create audit log" }, { status: 500 })
  }
}
