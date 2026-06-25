import { AirportRouteForm } from '@/components/admin/airport-route-form';

export default function NewAirportRoutePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">New Airport Transfer Route</h2>
        <p className="text-sm text-muted-foreground">Add a new city-to-city transfer route with vehicle pricing</p>
      </div>
      <AirportRouteForm />
    </div>
  );
}
