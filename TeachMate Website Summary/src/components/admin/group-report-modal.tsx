"use client"

import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_GROUP_REPORTS, type GroupChat } from "@/lib/mock-data"
import { useState } from "react"

interface GroupReportModalProps {
    group: GroupChat
    isOpen: boolean
    onClose: () => void
}

export default function GroupReportModal({ group, isOpen, onClose }: GroupReportModalProps) {
    const [reportStatuses, setReportStatuses] = useState<Record<string, string>>({})

    const groupReports = MOCK_GROUP_REPORTS.filter((r) => r.groupId === group.id)

    if (!isOpen) return null

    const handleStatusChange = (reportId: string, newStatus: string) => {
        setReportStatuses((prev) => ({
            ...prev,
            [reportId]: newStatus,
        }))
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-card">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <h2 className="text-lg font-semibold">Group Reports</h2>
                            <p className="text-sm text-muted-foreground">{group.name}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Reports List */}
                <div className="p-6 space-y-4">
                    {groupReports.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No reports for this group</p>
                    ) : (
                        groupReports.map((report) => (
                            <div key={report.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-sm">{report.reason}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Reported by {report.reportedBy} on {report.reportedAt}
                                        </p>
                                    </div>
                                    <Select
                                        value={reportStatuses[report.id] || report.status}
                                        onValueChange={(value) => handleStatusChange(report.id, value)}
                                    >
                                        <SelectTrigger className="w-32 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="dismissed">Dismissed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-sm text-muted-foreground">{report.description}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-6 border-t sticky bottom-0 bg-card">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
