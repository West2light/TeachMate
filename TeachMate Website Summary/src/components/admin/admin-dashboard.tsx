"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import UserManagementTable from "./user-management-table"
import UserFilters from "./user-filters"
import { MOCK_USERS, type User } from "@data/mockData.ts"
import { Users, MessageSquare } from "lucide-react"

export default function AdminDashboard() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>(MOCK_USERS)
    const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [reportFilter, setReportFilter] = useState<string>("all")

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
        let filtered = users

        // Search filter
        if (search) {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase()),
            )
        }

        // Status filter
        if (status !== "all") {
            filtered = filtered.filter((user) => user.status === status)
        }

        // Report filter
        if (report === "reported") {
            filtered = filtered.filter((user) => user.isReported)
        } else if (report === "not-reported") {
            filtered = filtered.filter((user) => !user.isReported)
        }

        setFilteredUsers(filtered)
    }

    const handleUserStatusChange = (userId: string, newStatus: "active" | "inactive" | "banned") => {
        const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        setUsers(updatedUsers)
        applyFilters(searchQuery, statusFilter, reportFilter)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">User Management & Reports</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 flex gap-4">
                    <Button variant="ghost" className="gap-2 rounded-none border-b-2 border-primary">
                        <Users className="w-4 h-4" />
                        Users
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/groups")}
                        className="gap-2 rounded-none border-b-2 border-transparent hover:border-primary"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Groups
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters Section */}
                <UserFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    reportFilter={reportFilter}
                    onSearchChange={handleSearch}
                    onStatusFilterChange={handleStatusFilter}
                    onReportFilterChange={handleReportFilter}
                />

                {/* Users Table */}
                <UserManagementTable users={filteredUsers} onStatusChange={handleUserStatusChange} />
            </main>
        </div>
    )
}
