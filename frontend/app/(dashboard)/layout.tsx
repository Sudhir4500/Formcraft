// This layout only applies to /dashboard /forms /settings
// Add sidebar and topbar here later
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar goes here */}
            <main className="flex-1">{children}</main>
        </div>
    )
}