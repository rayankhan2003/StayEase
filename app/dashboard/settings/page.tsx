import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsForm } from "@/components/dashboard/settings/settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" description="Manage your hotel settings" />
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Settings</CardTitle>
              <CardDescription>Configure global settings for your hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage your hotel staff and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Staff management content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Manage your billing and payment settings</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Billing settings content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Notification settings content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
