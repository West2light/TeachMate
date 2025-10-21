"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface UserFiltersProps {
    searchQuery: string
    statusFilter: string
    reportFilter: string
    onSearchChange: (query: string) => void
    onStatusFilterChange: (status: string) => void
    onReportFilterChange: (filter: string) => void
}

export default function UserFilters({
    searchQuery,
    statusFilter,
    reportFilter,
    onSearchChange,
    onStatusFilterChange,
    onReportFilterChange,
}: UserFiltersProps) {
    return (
        <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reports</label>
                        <Select value={reportFilter} onValueChange={onReportFilterChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="reported">Has Reports</SelectItem>
                                <SelectItem value="not-reported">No Reports</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
