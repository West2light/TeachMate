"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const adminSession = localStorage.getItem("adminSession")
        if (!adminSession) {
            router.push("/admin/login")
        } else {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [router])

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!isAuthenticated) {
        return null
    }

    return <AdminDashboard />
}
