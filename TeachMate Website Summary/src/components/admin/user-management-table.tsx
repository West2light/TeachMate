"use client"

import { useState } from "react"
import type { User } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, MoreVertical, AlertCircle } from "lucide-react"
import UserReportModal from "./user-report-modal"

interface UserManagementTableProps {
    users: User[]
    onStatusChange: (userId: string, newStatus: "active" | "inactive" | "banned") => void
}

export default function UserManagementTable({ users, onStatusChange }: UserManagementTableProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [showReportModal, setShowReportModal] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-gray-100 text-gray-800"
            case "banned":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleViewReports = (userId: string) => {
        setSelectedUserId(userId)
        setShowReportModal(true)
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-center">Reports</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell className="text-sm">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(user.status)}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                                    <TableCell className="text-sm">{user.lastActive}</TableCell>
                                    <TableCell className="text-center">
                                        {user.isReported ? (
                                            <button
                                                onClick={() => handleViewReports(user.id)}
                                                className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                            >
                                                <Bell className="w-4 h-4" />
                                                <span className="text-sm font-semibold">{user.reportCount}</span>
                                            </button>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {user.status !== "active" && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(user.id, "active")}>
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                                {user.status !== "inactive" && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(user.id, "inactive")}>
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                )}
                                                {user.status !== "banned" && (
                                                    <DropdownMenuItem
                                                        onClick={() => onStatusChange(user.id, "banned")}
                                                        className="text-destructive"
                                                    >
                                                        Ban User
                                                    </DropdownMenuItem>
                                                )}
                                                {user.isReported && (
                                                    <DropdownMenuItem onClick={() => handleViewReports(user.id)}>
                                                        <AlertCircle className="w-4 h-4 mr-2" />
                                                        View Reports
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Report Modal */}
            {selectedUserId && (
                <UserReportModal
                    userId={selectedUserId}
                    isOpen={showReportModal}
                    onClose={() => {
                        setShowReportModal(false)
                        setSelectedUserId(null)
                    }}
                />
            )}
        </>
    )
}
