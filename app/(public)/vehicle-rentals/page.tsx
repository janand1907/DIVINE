import { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Users, Briefcase, Wind, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/layout/section-heading';
import type { VehicleRow, VehicleCategoryRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/vehicle-rentals');
  return buildMetadata({
    path: '/vehicle-rentals',
    title: 'Vehicle Rentals',
    description: 'Hire Sedan, SUV, Urbania, Tempo Traveller or Bus for pilgrimage, corporate, and leisure travel across South India. Best rates, comfortable rides.',
    theme, site, seoPage,
  });
}

export default async function VehicleRentalsPage() {
  const supabase = createPublicClient();
  const [{ data: vehicles }, { data: categories }, { theme }] = await Promise.all([
    supabase.from('vehicles').select().eq('is_published', true).order('is_featured', { ascending: false }),
    supabase.from('vehicle_categories').select().eq('is_published', true).order('display_order'),
    fetchSeoContext('/vehicle-rentals'),
  ]);

  const allVehicles = (vehicles ?? []) as VehicleRow[];
  const allCategories = (categories ?? []) as VehicleCategoryRow[];
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const contactPhone = theme?.contact_phone ?? '+919876543210';

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30" />
        <div className="container-brand relative z-10 py-20 text-center text-white">
          <Badge className="mb-4 bg-primary/20 text-primary">Vehicle Rentals</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
            Comfortable Rides for<br />Every Journey
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Hire a car or vehicle for pilgrimages, airport transfers, family trips, or corporate travel. AC vehicles with experienced drivers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <a href={`tel:${contactPhone}`}>Call Now</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-muted/30 py-6">
        <div className="container-brand grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: '🚗', label: 'All AC Vehicles' },
            { icon: '👨‍✈️', label: 'Expert Drivers' },
            { icon: '📍', label: 'GPS Tracked' },
            { icon: '🌙', label: '24/7 Support' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicle list by category */}
      {allCategories.length > 0 ? (
        allCategories.map((cat) => {
          const catVehicles = allVehicles.filter((v) => v.category_id === cat.id);
          if (catVehicles.length === 0) return null;
          return (
            <section key={cat.id} className="py-16">
              <div className="container-brand">
                <SectionHeading title={cat.name} subtitle={cat.description ?? undefined} />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
              </div>
            </section>
          );
        })
      ) : allVehicles.length > 0 ? (
        <section className="py-16">
          <div className="container-brand">
            <SectionHeading title="Our Fleet" subtitle="Choose the right vehicle for your journey" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24 text-center">
          <div className="container-brand">
            <p className="text-muted-foreground">Vehicles coming soon. Contact us for availability.</p>
            <Button asChild className="mt-4"><Link href="/contact">Contact Us</Link></Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-dark py-20 text-white">
        <div className="container-brand text-center">
          <h2 className="font-heading text-3xl font-bold">Ready to Book Your Ride?</h2>
          <p className="mt-3 text-white/70">Call us or fill in the form and we&apos;ll get back to you within minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild><Link href="/contact">Book Now</Link></Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <a href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function VehicleCard({ vehicle }: { vehicle: VehicleRow }) {
  return (
    <Link
      href={`/vehicle-rentals/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-brand transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {vehicle.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.cover_image}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
            <span className="text-4xl">🚗</span>
          </div>
        )}
        {vehicle.is_featured && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="mr-1 h-3 w-3" /> Featured
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{vehicle.name}</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {vehicle.seats} Seats
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" /> {vehicle.luggage_capacity} Bags
          </div>
          {vehicle.is_ac && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="h-4 w-4" /> AC
            </div>
          )}
        </div>
        {vehicle.starting_price && (
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Starting from</span>
              <p className="font-heading text-xl font-bold text-primary">
                ₹{vehicle.starting_price.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">View Details</span>
          </div>
        )}
      </div>
    </Link>
  );
}
