"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface GroupFiltersProps {
    searchQuery: string
    statusFilter: string
    reportFilter: string
    onSearchChange: (query: string) => void
    onStatusFilterChange: (status: string) => void
    onReportFilterChange: (filter: string) => void
}

export default function GroupFilters({
    searchQuery,
    statusFilter,
    reportFilter,
    onSearchChange,
    onStatusFilterChange,
    onReportFilterChange,
}: GroupFiltersProps) {
    return (
        <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
            <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search groups by name or description..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1"
                />
                {searchQuery && (
                    <Button variant="ghost" size="sm" onClick={() => onSearchChange("")} className="h-9 w-9 p-0">
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={reportFilter} onValueChange={onReportFilterChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by reports" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        <SelectItem value="reported">Reported</SelectItem>
                        <SelectItem value="not-reported">Not Reported</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
