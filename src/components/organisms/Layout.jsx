import React from "react"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { useAuth } from "@/layouts/Root"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Layout = () => {
  const { user, isAuthenticated } = useSelector(state => state.user)
  const { logout } = useAuth()

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout()
    }
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-600 -mt-1">Stay organized and productive</p>
              </div>
            </div>
            
            {/* User Info & Logout */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-600">{user.emailAddress}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout