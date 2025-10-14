import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, FileText, Sparkles, Activity, Search, MoreVertical } from "lucide-react";

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Remove mock data - fetch from API
  const [stats] = useState({
    totalUsers: 1248,
    analysesToday: 89,
    improvementsUsed: 234,
    activeSessions: 42,
  });

  const [users] = useState([
    {
      id: "1",
      email: "john.doe@example.com",
      plan: "Free",
      analyses: 12,
      improvements: "2/3",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      plan: "Premium",
      analyses: 45,
      improvements: "Unlimited",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      email: "bob.wilson@example.com",
      plan: "Free",
      analyses: 5,
      improvements: "3/3",
      lastActive: "3 days ago",
    },
  ]);

  const [auditLogs] = useState([
    {
      id: "1",
      user: "john.doe@example.com",
      action: "Resume Analysis",
      status: "Success",
      timestamp: "2024-01-15 14:32:15",
    },
    {
      id: "2",
      user: "jane.smith@example.com",
      action: "Resume Improvement",
      status: "Success",
      timestamp: "2024-01-15 14:28:42",
    },
    {
      id: "3",
      user: "bob.wilson@example.com",
      action: "Resume Analysis",
      status: "Failed",
      timestamp: "2024-01-15 14:15:03",
    },
  ]);

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} showAuthButtons={false} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform usage and manage users</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={Users} label="Total Users" value={stats.totalUsers} trend="+12% this month" />
          <StatsCard icon={FileText} label="Analyses Today" value={stats.analysesToday} trend="+5 from yesterday" />
          <StatsCard icon={Sparkles} label="Improvements Used" value={stats.improvementsUsed} trend="234 this week" />
          <StatsCard icon={Activity} label="Active Sessions" value={stats.activeSessions} trend="Real-time" />
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <p className="text-sm text-muted-foreground">View and manage platform users</p>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-users"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Analyses</TableHead>
                      <TableHead>Improvements</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                        <TableCell className="font-medium" data-testid={`text-email-${user.id}`}>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.plan === "Premium" ? "default" : "secondary"} data-testid={`badge-plan-${user.id}`}>
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-analyses-${user.id}`}>{user.analyses}</TableCell>
                        <TableCell data-testid={`text-improvements-${user.id}`}>{user.improvements}</TableCell>
                        <TableCell className="text-muted-foreground" data-testid={`text-lastactive-${user.id}`}>
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" data-testid={`button-actions-${user.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Audit Logs</h2>
            <p className="text-sm text-muted-foreground">Track all platform activities</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} data-testid={`row-log-${log.id}`}>
                      <TableCell className="font-medium" data-testid={`text-log-user-${log.id}`}>{log.user}</TableCell>
                      <TableCell data-testid={`text-log-action-${log.id}`}>{log.action}</TableCell>
                      <TableCell>
                        <Badge
                          variant={log.status === "Success" ? "default" : "destructive"}
                          data-testid={`badge-log-status-${log.id}`}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground" data-testid={`text-log-time-${log.id}`}>
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
