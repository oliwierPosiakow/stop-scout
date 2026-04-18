export interface ZtmVehicle {
  id: string;
  delayInSeconds: number | null;
  estimatedTime: string;
  headsign: string;
  routeId: number;
  routeShortName: string;
  tripId: number;
  status: string;
  theoreticalTime: string;
  timestamp: string;
  trip: number;
  vehicleCode: number | null;
  vehicleId: number | null;
  scheduledTripStartTime: string;
  vehicleService: string | null;
}

export interface ZtmStop {
  stopId: number;
  stopName: string;
  stopDesc: string;
  stopLat: number;
  stopLon: number;
  type: string;
}

export interface FavoriteStop {
  stopId: number;
  name: string;
  notes?: string;
}
