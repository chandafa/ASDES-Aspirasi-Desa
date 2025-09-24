import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Report, User } from "@/lib/types";
import Link from "next/link";

interface RecentReportsProps {
    reports: Report[];
    users: User[];
}

export function RecentReports({ reports, users }: RecentReportsProps) {
    const recentReports = reports
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5); // Display latest 5 reports

  return (
    <div className="space-y-4">
        {recentReports.length > 0 ? recentReports.map((report) => {
            const user = users.find(u => u.uid === report.createdBy);
            return (
                <Link key={report.id} href={`/report/${report.id}`} className="block hover:bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.avatarUrl} alt="Avatar" />
                            <AvatarFallback>{user?.name.charAt(0) || 'W'}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none truncate">{report.title}</p>
                            <p className="text-sm text-muted-foreground">{user?.name || 'Warga'}</p>
                        </div>
                        <div className="ml-auto font-medium capitalize text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</div>
                    </div>
                </Link>
            )
        }) : (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada laporan terbaru.</p>
        )}
    </div>
  )
}
