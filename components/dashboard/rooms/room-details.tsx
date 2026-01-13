"use client";
import type { Room } from "@/lib/api/rooms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RoomDetailsProps {
  room: Room;
  onEdit: () => void;
  onClose: () => void;
}

export function RoomDetails({ room, onEdit, onClose }: RoomDetailsProps) {
  console.log(" room details ", room);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Room {room.number}</span>
            <Badge
              variant={
                room.status === "available"
                  ? "success"
                  : room.status === "occupied"
                  ? "default"
                  : "destructive"
              }
            >
              {room.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p>{room.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PKR",
                }).format(Number(room.price))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Max Guests
              </p>
              <p>{room.max_guests}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Branch ID
              </p>
              <p>{room.branch_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Branch Name
              </p>
              <p>{room.branches.name}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Amenities
            </p>
            <div className="flex flex-wrap gap-2">
              {room.amenities &&
                room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              {(!room.amenities || room.amenities.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No amenities listed
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit Room</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
