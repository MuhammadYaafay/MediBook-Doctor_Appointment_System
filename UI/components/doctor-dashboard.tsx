import { Calendar, Users, DollarSign, TrendingUp, Activity, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { apiRequest } from "@/utils/apiUtils"

interface DashboardData{
  total_patients: number
  completed_appointments: number
  cancelled_appointments: number
  revenue: number
  patients_growth: number
  appointments_growth: number
  revenue_growth: number
  total_appointments: number
  upcomingAppointments: Appointment[] 
  recentEarnings: Earning[] 
} 

interface Appointment{
  id: string
  patient_name: string
  appointment_date: string
  appointment_time: string
  status: string
  }

interface Earning{
  id: string
  patient_name: string
  appointment_date: string
  payment_amount: number
}

export function DoctorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>()

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashboardRes, earningsRes, appointmentsRes] = await Promise.all([
          apiRequest<DashboardData>('/api/doctor/dashboard', {
            method: 'GET',
            authenticated: true
          }),
          apiRequest<Earning[]>('/api/doctor/earnings', {
            method: 'GET',
            authenticated: true
          }),
          apiRequest<Appointment[]>('/api/doctor/appointments/list', {
            method: 'GET',
            authenticated: true
          })
        ]);

        setDashboardData(prev => ({
          ...prev,
          ...dashboardRes,
          recentEarnings: earningsRes,
          upcomingAppointments: appointmentsRes
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your doctor dashboard. Here's an overview of your practice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_patients}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{dashboardData?.patients_growth}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_appointments}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{dashboardData?.appointments_growth}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData && dashboardData.total_appointments > 0 ? Math.round((dashboardData.completed_appointments / dashboardData.total_appointments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span>{dashboardData?.completed_appointments} completed</span>
              <span className="mx-1">•</span>
              <span>{dashboardData?.cancelled_appointments} cancelled</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData?.revenue}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{dashboardData?.revenue_growth}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.upcomingAppointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{appointment.patient_name}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your recent appointment payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentEarnings?.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{earning.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(earning.appointment_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-500">${earning.payment_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
