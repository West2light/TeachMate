"use client"

import { useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GroupReportModal from "./group-report-modal"
import type { GroupChat } from "@/lib/mock-data"

interface GroupManagementTableProps {
    groups: GroupChat[]
    onStatusChange: (groupId: string, newStatus: "active" | "inactive" | "archived") => void
}

export default function GroupManagementTable({ groups, onStatusChange }: GroupManagementTableProps) {
    const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-yellow-100 text-yellow-800"
            case "archived":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleReportClick = (group: GroupChat) => {
        setSelectedGroup(group)
        setIsReportModalOpen(true)
    }

    return (
        <>
            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-6 py-3 text-left text-sm font-semibold">Group Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Members</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Reports</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr key={group.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium">{group.name}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-xs">{group.description}</td>
                                    <td className="px-6 py-4 text-sm">{group.memberCount}</td>
                                    <td className="px-6 py-4 text-sm">{group.createdAt}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <Select
                                            value={group.status}
                                            onValueChange={(value) => onStatusChange(group.id, value as "active" | "inactive" | "archived")}
                                        >
                                            <SelectTrigger className="w-32 h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {group.isReported ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleReportClick(group)}
                                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Bell className="w-4 h-4 fill-red-600" />
                                                {group.reportCount}
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground">0</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <ChevronDown className="w-4 h-4" />
                                            More
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {groups.length === 0 && (
                    <div className="px-6 py-12 text-center text-muted-foreground">No groups found matching your filters.</div>
                )}
            </div>

            {selectedGroup && (
                <GroupReportModal
                    group={selectedGroup}
                    isOpen={isReportModalOpen}
                    onClose={() => {
                        setIsReportModalOpen(false)
                        setSelectedGroup(null)
                    }}
                />
            )}
        </>
    )
}
