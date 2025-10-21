"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft } from "lucide-react"
import GroupManagementTable from "@/components/admin/group-management-table"
import GroupFilters from "@/components/admin/group-filters"
import { MOCK_GROUPS, type GroupChat } from "@/lib/mock-data"

export default function GroupManagementPage() {
    const router = useRouter()
    const [groups, setGroups] = useState<GroupChat[]>(MOCK_GROUPS)
    const [filteredGroups, setFilteredGroups] = useState<GroupChat[]>(MOCK_GROUPS)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [reportFilter, setReportFilter] = useState<string>("all")

    useEffect(() => {
        const adminSession = localStorage.getItem("adminSession")
        if (!adminSession) {
            router.push("/admin/login")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("adminSession")
        router.push("/admin/login")
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        applyFilters(query, statusFilter, reportFilter)
    }

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status)
        applyFilters(searchQuery, status, reportFilter)
    }

    const handleReportFilter = (filter: string) => {
        setReportFilter(filter)
        applyFilters(searchQuery, statusFilter, filter)
    }

    const applyFilters = (search: string, status: string, report: string) => {
        let filtered = groups

        // Search filter
        if (search) {
            filtered = filtered.filter(
                (group) =>
                    group.name.toLowerCase().includes(search.toLowerCase()) ||
                    group.description.toLowerCase().includes(search.toLowerCase()),
            )
        }

        // Status filter
        if (status !== "all") {
            filtered = filtered.filter((group) => group.status === status)
        }

        // Report filter
        if (report === "reported") {
            filtered = filtered.filter((group) => group.isReported)
        } else if (report === "not-reported") {
            filtered = filtered.filter((group) => !group.isReported)
        }

        setFilteredGroups(filtered)
    }

    const handleGroupStatusChange = (groupId: string, newStatus: "active" | "inactive" | "archived") => {
        const updatedGroups = groups.map((group) => (group.id === groupId ? { ...group, status: newStatus } : group))
        setGroups(updatedGroups)
        applyFilters(searchQuery, statusFilter, reportFilter)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Group Management</h1>
                            <p className="text-sm text-muted-foreground">Manage chat groups & reports</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters Section */}
                <GroupFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    reportFilter={reportFilter}
                    onSearchChange={handleSearch}
                    onStatusFilterChange={handleStatusFilter}
                    onReportFilterChange={handleReportFilter}
                />

                {/* Groups Table */}
                <GroupManagementTable groups={filteredGroups} onStatusChange={handleGroupStatusChange} />
            </main>
        </div>
    )
}
