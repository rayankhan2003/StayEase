"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

const feedbacks = [
  {
    id: 1,
    guest: {
      name: "Alex Johnson",
      image: "/placeholder.svg",
    },
    rating: 5,
    comment: "Excellent service and beautiful rooms. Will definitely come back!",
    date: "2 days ago",
  },
  {
    id: 2,
    guest: {
      name: "Sarah Williams",
      image: "/placeholder.svg",
    },
    rating: 4,
    comment: "Great location and friendly staff. The breakfast could be improved.",
    date: "1 week ago",
  },
  {
    id: 3,
    guest: {
      name: "Michael Brown",
      image: "/placeholder.svg",
    },
    rating: 5,
    comment: "Perfect stay! The spa facilities were amazing and the staff was very attentive.",
    date: "2 weeks ago",
  },
]

export function GuestFeedback() {
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={feedback.guest.image || "/placeholder.svg"} alt={feedback.guest.name} />
                <AvatarFallback>{feedback.guest.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{feedback.guest.name}</h4>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>
                <div className="flex my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{feedback.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
