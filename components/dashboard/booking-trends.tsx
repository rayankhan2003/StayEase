"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan 1",
    bookings: 45,
  },
  {
    date: "Jan 5",
    bookings: 52,
  },
  {
    date: "Jan 10",
    bookings: 49,
  },
  {
    date: "Jan 15",
    bookings: 63,
  },
  {
    date: "Jan 20",
    bookings: 58,
  },
  {
    date: "Jan 25",
    bookings: 72,
  },
  {
    date: "Jan 30",
    bookings: 85,
  },
]

export function BookingTrends() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#adfa1d" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
