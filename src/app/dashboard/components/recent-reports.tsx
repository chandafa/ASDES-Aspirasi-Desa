import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { reports, users as mockUsers } from "@/lib/data";

export function RecentReports() {
    const userReports = reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8">
        {userReports.map((report) => {
            const user = mockUsers.find(u => u.uid === report.createdBy);
            return (
                <div key={report.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatarUrl} alt="Avatar" />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.category}</p>
                    </div>
                    <div className="ml-auto font-medium capitalize text-sm">{report.status}</div>
                </div>
            )
        })}
    </div>
  )
}
