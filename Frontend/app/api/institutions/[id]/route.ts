import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import { NotificationService } from "@/lib/notifications"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, userId } = body

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const success = await DatabaseService.updateInstitutionStatus(params.id, status)

    if (!success) {
      return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 })
    }

    // Create audit log
    await DatabaseService.createAuditLog({
      userId: userId || "admin",
      action: status === "approved" ? "APPROVE_INSTITUTION" : "REJECT_INSTITUTION",
      entityType: "Institution",
      entityId: params.id,
      details: { newStatus: status },
    })

    // Send notification (in real app, get institution details first)
    await NotificationService.notifyInstitutionApproval(
      params.id,
      "Institution Name", // Would get from database
      status === "approved",
    )

    return NextResponse.json({
      success: true,
      message: `Institution ${status} successfully`,
    })
  } catch (error) {
    console.error("Error updating institution:", error)
    return NextResponse.json({ success: false, error: "Failed to update institution" }, { status: 500 })
  }
}
