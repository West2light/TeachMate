"use client"

import { MOCK_USERS, MOCK_REPORTS } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface UserReportModalProps {
    userId: string
    isOpen: boolean
    onClose: () => void
}

export default function UserReportModal({ userId, isOpen, onClose }: UserReportModalProps) {
    const user = MOCK_USERS.find((u) => u.id === userId)
    const userReports = MOCK_REPORTS.filter((r) => r.userId === userId)

    if (!user) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "resolved":
                return "bg-green-100 text-green-800"
            case "dismissed":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Reports for {user.username}</DialogTitle>
                    <DialogDescription>Total reports: {userReports.length}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userReports.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No reports found</p>
                    ) : (
                        userReports.map((report) => (
                            <div key={report.id} className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm">{report.reason}</p>
                                        <p className="text-sm text-muted-foreground">{report.description}</p>
                                    </div>
                                    <Badge className={getStatusColor(report.status)}>
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Reported: {report.reportedAt}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
