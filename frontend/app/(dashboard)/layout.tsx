// This layout only applies to /dashboard /forms /settings
// Add sidebar and topbar here later
import {Sidebar} from '@/components/ui/Sidebar'
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar>
                <main className="flex-1">{children}</main>
            </Sidebar>
        </div>
    )
}