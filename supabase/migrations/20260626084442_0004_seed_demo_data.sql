-- Seed comprehensive demo data for Divine Travel platform
-- All UUIDs use valid hex characters

-- ============================================================
-- VEHICLE CATEGORIES
-- ============================================================
INSERT INTO vehicle_categories (id, slug, name, description, display_order, is_published) VALUES
  ('a0c00001-0000-4000-8000-000000000001', 'sedan', 'Sedan', 'Comfortable sedans for city and short trips', 1, true),
  ('a0c00002-0000-4000-8000-000000000002', 'suv', 'SUV', 'Spacious SUVs for family travel and long routes', 2, true),
  ('a0c00003-0000-4000-8000-000000000003', 'tempo-traveller', 'Tempo Traveller', 'Large vehicles for group pilgrimages and tours', 3, true);

-- ============================================================
-- DESTINATIONS
-- ============================================================
INSERT INTO destinations (id, slug, name, region, description, cover_image, is_published, display_order) VALUES
  ('b1d00001-0000-4000-8000-000000000001', 'tirupati', 'Tirupati', 'domestic', 'The sacred city of Lord Venkateswara, one of the most visited pilgrimage sites in India.', 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 1),
  ('b1d00002-0000-4000-8000-000000000002', 'chennai', 'Chennai', 'domestic', 'The gateway to South India with vibrant culture, Marina Beach, and historic temples.', 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 2),
  ('b1d00003-0000-4000-8000-000000000003', 'pondicherry', 'Pondicherry', 'domestic', 'A charming coastal town blending French heritage with South Indian culture.', 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 3),
  ('b1d00004-0000-4000-8000-000000000004', 'madurai', 'Madurai', 'domestic', 'Home of the magnificent Meenakshi Temple and rich Tamil heritage.', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 4),
  ('b1d00005-0000-4000-8000-000000000005', 'ooty', 'Ooty', 'domestic', 'Queen of the Nilgiris offering misty mountains, tea estates, and cool retreats.', 'https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 5),
  ('b1d00006-0000-4000-8000-000000000006', 'sri-lanka', 'Sri Lanka', 'international', 'Tropical island nation with ancient ruins, pristine beaches, and lush tea country.', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 1),
  ('b1d00007-0000-4000-8000-000000000007', 'singapore', 'Singapore', 'international', 'The Lion City featuring world-class attractions, stunning architecture, and diverse cuisine.', 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 2),
  ('b1d00008-0000-4000-8000-000000000008', 'bali', 'Bali', 'international', 'Island of the Gods with terraced rice paddies, sacred temples, and vibrant arts scene.', 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1260', true, 3);

-- ============================================================
-- PACKAGES
-- ============================================================
INSERT INTO packages (id, slug, title, destination_id, duration_days, duration_nights, highlights, overview, inclusions, exclusions, starting_price, cover_image, is_featured, is_published, tour_type, badge_text) VALUES
  ('c2e00001-0000-4000-8000-000000000001', 'tirupati-darshan-2d', 'Tirupati Darshan Express', 'b1d00001-0000-4000-8000-000000000001', 2, 1,
   '{"VIP Darshan at Tirumala","Accommodation near temple","AC transport from Chennai","Laddu prasadam included"}',
   'Experience the divine blessings of Lord Venkateswara with our well-organised 2-day Tirupati darshan package from Chennai.',
   '{"AC vehicle throughout","1 night hotel stay","VIP darshan ticket","Breakfast and dinner","Driver allowance","Toll and parking"}',
   '{"Personal expenses","Donations at temple","Lunch","Camera fee"}',
   4999, 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800', true, true, 'pilgrimage', 'Best Seller'),

  ('c2e00002-0000-4000-8000-000000000002', 'pondicherry-weekend-3d', 'Pondicherry Weekend Escape', 'b1d00003-0000-4000-8000-000000000003', 3, 2,
   '{"French Quarter walking tour","Auroville visit","Paradise Beach","Promenade cycling"}',
   'A perfect weekend getaway to the serene coastal town of Pondicherry with French colonial charm and spiritual ambience.',
   '{"AC vehicle from Chennai","2 nights seaside hotel","Daily breakfast","Sightseeing as per itinerary","Driver allowance","Toll charges"}',
   '{"Personal expenses","Water sports","Lunch and dinner","Entry fees"}',
   7999, 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800', true, true, 'leisure', 'Popular'),

  ('c2e00003-0000-4000-8000-000000000003', 'ooty-kodaikanal-5d', 'Ooty & Kodaikanal Hill Retreat', 'b1d00005-0000-4000-8000-000000000005', 5, 4,
   '{"Botanical Gardens Ooty","Tea estate visit","Kodaikanal Lake boating","Coakers Walk","Dolphin Nose viewpoint"}',
   'Escape the heat with our dual hill station package covering the best of Ooty and Kodaikanal.',
   '{"AC vehicle throughout","4 nights hotel (2 each)","Daily breakfast","Sightseeing transfers","Driver allowance","Toll and parking"}',
   '{"Personal expenses","Boating charges","Entry fees","Lunch and dinner"}',
   14999, 'https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg?auto=compress&cs=tinysrgb&w=800', true, true, 'leisure', NULL),

  ('c2e00004-0000-4000-8000-000000000004', 'sri-lanka-6d', 'Sri Lanka Heritage & Beach', 'b1d00006-0000-4000-8000-000000000006', 6, 5,
   '{"Sigiriya Rock Fortress","Kandy Temple of Tooth","Galle Fort","Ella Nine Arches Bridge","Mirissa whale watching"}',
   'Discover the best of Sri Lanka from ancient kingdoms to tropical beaches in this carefully curated 6-day tour.',
   '{"Return flights","5 nights hotel","Daily breakfast","Private vehicle with driver","Visa assistance","Airport transfers"}',
   '{"Personal expenses","Lunch and dinner","Entry fees at monuments","Travel insurance"}',
   34999, 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800', true, true, 'international', 'New'),

  ('c2e00005-0000-4000-8000-000000000005', 'singapore-4d', 'Singapore City Explorer', 'b1d00007-0000-4000-8000-000000000007', 4, 3,
   '{"Marina Bay Sands","Sentosa Island","Gardens by the Bay","Universal Studios","Night Safari"}',
   'Experience the magic of Singapore with this action-packed 4-day tour covering all major attractions.',
   '{"Return flights","3 nights hotel near Orchard","Daily breakfast","Airport transfers","City tour","Sentosa day pass"}',
   '{"Personal expenses","Universal Studios ticket","Lunch and dinner","Shopping"}',
   44999, 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=800', true, true, 'international', NULL),

  ('c2e00006-0000-4000-8000-000000000006', 'madurai-rameswaram-3d', 'Madurai & Rameswaram Pilgrimage', 'b1d00004-0000-4000-8000-000000000004', 3, 2,
   '{"Meenakshi Temple ceremony","Rameswaram Jyotirlinga","Dhanushkodi ghost town","Pamban Bridge"}',
   'A spiritually enriching pilgrimage covering the ancient Meenakshi Temple and the sacred island of Rameswaram.',
   '{"AC vehicle throughout","2 nights hotel","Daily breakfast","Temple guide","Driver allowance","Toll charges"}',
   '{"Personal expenses","Donations","Pooja charges","Lunch and dinner"}',
   6499, 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800', false, true, 'pilgrimage', NULL);

-- ============================================================
-- VEHICLES
-- ============================================================
INSERT INTO vehicles (id, slug, name, category_id, seats, luggage_capacity, price_per_km, price_per_day, starting_price, images, cover_image, description, features, is_ac, is_featured, is_published, fuel_type, transmission) VALUES
  ('d3f00001-0000-4000-8000-000000000001', 'toyota-innova-crysta', 'Toyota Innova Crysta', 'a0c00002-0000-4000-8000-000000000002', 7, 3, 16, 3500, 2500,
   '{"https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800"}',
   'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
   'The Toyota Innova Crysta is our most popular choice for family trips and pilgrimages. Spacious, comfortable, and reliable for long-distance travel across South India.',
   '{"Captain seats","Rear AC","USB charging","Ample boot space","Push-back recline","Music system"}',
   true, true, true, 'Diesel', 'Automatic'),

  ('d3f00002-0000-4000-8000-000000000002', 'swift-dzire', 'Maruti Swift Dzire', 'a0c00001-0000-4000-8000-000000000001', 4, 2, 12, 2200, 1800,
   '{"https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800"}',
   'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
   'The Maruti Swift Dzire is an economical and comfortable sedan, perfect for airport transfers and short city-to-city trips. Great fuel efficiency and smooth ride.',
   '{"Comfortable seating","AC with climate control","Music system","USB charging","Good boot space"}',
   true, false, true, 'Petrol', 'Manual'),

  ('d3f00003-0000-4000-8000-000000000003', 'tempo-traveller-12', '12-Seater Tempo Traveller', 'a0c00003-0000-4000-8000-000000000003', 12, 12, 22, 5500, 4500,
   '{"https://images.pexels.com/photos/2676593/pexels-photo-2676593.jpeg?auto=compress&cs=tinysrgb&w=800"}',
   'https://images.pexels.com/photos/2676593/pexels-photo-2676593.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Ideal for group pilgrimages, corporate outings, and family reunions. Our 12-seater Tempo Traveller offers generous legroom, individual push-back seats, and overhead storage.',
   '{"Push-back seats","Individual AC vents","Overhead storage","Curtains","PA system","First aid kit","Ice box"}',
   true, true, true, 'Diesel', 'Manual'),

  ('d3f00004-0000-4000-8000-000000000004', 'toyota-etios', 'Toyota Etios', 'a0c00001-0000-4000-8000-000000000001', 4, 2, 11, 2000, 1500,
   '{"https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=800"}',
   'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=800',
   'A reliable and fuel-efficient sedan from Toyota, popular for airport pickups and day rentals. Known for its sturdy build and spacious interior.',
   '{"AC","Power steering","Central locking","Music system","Spacious boot"}',
   true, false, true, 'Diesel', 'Manual');

-- ============================================================
-- AIRPORT ROUTES
-- ============================================================
INSERT INTO airport_routes (id, slug, from_city, to_city, distance_km, duration_hours, vehicles, description, is_active, pickup_area, drop_area, route_type, is_return_available, popular_rank) VALUES
  ('e4a00001-0000-4000-8000-000000000001', 'chennai-airport-to-tirupati', 'Chennai Airport', 'Tirupati', 135, 2.5,
   '[{"vehicle_type": "Sedan (Dzire/Etios)", "seats": 4, "price": 2800}, {"vehicle_type": "Innova Crysta", "seats": 7, "price": 4200}, {"vehicle_type": "Tempo Traveller", "seats": 12, "price": 6500}]'::jsonb,
   'Comfortable AC transfer from Chennai International Airport (MAA) directly to Tirupati. Our drivers meet you at arrivals with a name board. Perfect for pilgrims heading to Tirumala.',
   true, 'Chennai Airport (MAA)', 'Tirupati City / Tirumala', 'airport_pickup', true, 1),

  ('e4a00002-0000-4000-8000-000000000002', 'tirupati-to-chennai-airport', 'Tirupati', 'Chennai Airport', 135, 2.5,
   '[{"vehicle_type": "Sedan (Dzire/Etios)", "seats": 4, "price": 2800}, {"vehicle_type": "Innova Crysta", "seats": 7, "price": 4200}]'::jsonb,
   'Reliable drop service from Tirupati or Tirumala to Chennai International Airport. We ensure you reach well before your flight departure.',
   true, 'Tirupati City / Tirumala', 'Chennai Airport (MAA)', 'airport_drop', true, 2),

  ('e4a00003-0000-4000-8000-000000000003', 'bangalore-airport-to-tirupati', 'Bangalore Airport', 'Tirupati', 250, 4.5,
   '[{"vehicle_type": "Sedan (Dzire/Etios)", "seats": 4, "price": 4500}, {"vehicle_type": "Innova Crysta", "seats": 7, "price": 6800}, {"vehicle_type": "Tempo Traveller", "seats": 12, "price": 9500}]'::jsonb,
   'Direct transfer from Kempegowda International Airport (BLR) to Tirupati. Scenic route via the Eastern Ghats with a comfort stop midway.',
   true, 'Bangalore Airport (BLR)', 'Tirupati City / Tirumala', 'airport_pickup', true, 3);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (id, author_name, author_location, rating, content, tour_taken, is_published) VALUES
  ('f5b00001-0000-4000-8000-000000000001', 'Rajesh Kumar', 'Hyderabad', 5, 'Excellent service from start to finish. The driver was punctual, vehicle was spotless, and the Tirupati darshan was arranged perfectly. Will definitely book again for our next family trip.', 'Tirupati Darshan Express', true),
  ('f5b00002-0000-4000-8000-000000000002', 'Priya Sharma', 'Chennai', 5, 'Booked the Pondicherry weekend package for my birthday. Everything was seamless - the hotel was lovely, the itinerary was well-paced, and our driver Raju was so friendly and knowledgeable.', 'Pondicherry Weekend Escape', true),
  ('f5b00003-0000-4000-8000-000000000003', 'Venkatesh Reddy', 'Bangalore', 4, 'Used their airport transfer service from Bangalore to Tirupati. The Innova was comfortable for our family of 5, and the driver handled the ghat roads expertly. Good value for money.', 'Bangalore to Tirupati Transfer', true),
  ('f5b00004-0000-4000-8000-000000000004', 'Lakshmi Narasimhan', 'Coimbatore', 5, 'Our group of 10 booked the Tempo Traveller for a Rameswaram pilgrimage. The vehicle was well-maintained, AC worked perfectly, and Divine Travel handled all the logistics beautifully.', 'Madurai & Rameswaram Pilgrimage', true),
  ('f5b00005-0000-4000-8000-000000000005', 'Ananya Iyer', 'Mumbai', 5, 'The Sri Lanka tour exceeded all expectations. Hotels were great, the local driver was fantastic, and the itinerary covered everything from Sigiriya to the southern beaches. Highly recommend!', 'Sri Lanka Heritage & Beach', true),
  ('f5b00006-0000-4000-8000-000000000006', 'Suresh Babu', 'Vizag', 4, 'Quick and hassle-free airport pickup from Chennai. Driver was waiting with a name board and helped with luggage. The car was clean and ride was smooth. Great for business travelers.', 'Chennai Airport Transfer', true);

-- ============================================================
-- BLOGS
-- ============================================================
INSERT INTO blogs (id, slug, title, excerpt, content, cover_image, category, tags, author, reading_time_minutes, is_published, published_at) VALUES
  ('a6c00001-0000-4000-8000-000000000001', 'complete-guide-tirupati-darshan', 'Complete Guide to Tirupati Darshan: Tips, Routes & Booking', 'Everything you need to know about planning your Tirupati pilgrimage - from darshan types to travel routes and accommodation options.', 'Tirupati, home to the Sri Venkateswara Temple atop the seven hills of Tirumala, welcomes over 50,000 devotees daily. Planning your visit well in advance ensures a smooth and spiritually fulfilling experience.\n\n## Types of Darshan\n\nThere are several darshan options available:\n- **Sarva Darshan** (Free): Wait times can be 10-20 hours\n- **Special Entry Darshan**: Rs. 300 per person, 2-4 hour wait\n- **VIP Break Darshan**: For senior citizens and physically challenged\n\n## Best Time to Visit\n\nWeekdays (Tuesday-Thursday) are less crowded. Avoid public holidays, festival seasons (September-October), and weekends for shorter queues.\n\n## How to Reach\n\nFrom Chennai: 135 km via NH48 (2.5 hours)\nFrom Bangalore: 250 km via NH44 (4.5 hours)\nFrom Hyderabad: 560 km via NH65 (8 hours)\n\nWe recommend booking an AC cab for the most comfortable journey, especially if traveling with family or elderly members.', 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800', 'Travel Guide', '{"Tirupati","Pilgrimage","Darshan","Temple","Travel Tips"}', 'Divine Travel Team', 8, true, '2026-05-15'),

  ('a6c00002-0000-4000-8000-000000000002', 'best-weekend-getaways-from-chennai', '7 Best Weekend Getaways from Chennai Under 300 km', 'Discover the top weekend destinations within driving distance of Chennai - from beaches to hill stations to heritage towns.', 'Living in Chennai and looking for a quick escape? Here are seven fantastic destinations you can reach in under 5 hours by road.\n\n## 1. Pondicherry (170 km)\nFrench Quarter charm, pristine beaches, and excellent cafes make this the most popular weekend escape from Chennai.\n\n## 2. Mahabalipuram (60 km)\nUNESCO World Heritage shore temples, stone carvings, and a relaxed beach town vibe - perfect for a day trip or overnight stay.\n\n## 3. Tirupati (135 km)\nCombine spiritual darshan with a peaceful stay in the Eastern Ghats foothills.\n\n## 4. Yelagiri Hills (230 km)\nA lesser-known hill station with pleasant weather, boating, and trekking trails.\n\n## 5. Vellore (140 km)\nVisit the stunning Vellore Fort and the golden temple before heading to the Yelagiri foothills.\n\n## 6. Tranquebar (280 km)\nA hidden Danish colonial town with a quiet beach, ancient fort, and beautiful churches.\n\n## 7. Yercaud (220 km)\nThe jewel of Salem district with coffee plantations, lakes, and misty viewpoints.', 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800', 'Weekend Getaways', '{"Chennai","Weekend Trips","Road Trips","South India"}', 'Divine Travel Team', 6, true, '2026-06-01'),

  ('a6c00003-0000-4000-8000-000000000003', 'hiring-tempo-traveller-group-travel-tips', 'Hiring a Tempo Traveller? 5 Things to Know Before You Book', 'Essential tips for booking a tempo traveller for group trips, pilgrimages, and corporate outings in South India.', 'Group travel in South India is best done in a Tempo Traveller - spacious, air-conditioned, and designed for long journeys. But before you book, here are five things you should know.\n\n## 1. Choose the Right Size\n- 9-seater: For groups of 6-7 (extra luggage space)\n- 12-seater: For groups of 8-10 (balanced comfort)\n- 17-seater: For groups of 12-15 (most economical per person)\n\n## 2. Check the AC and Seats\nAlways ask for push-back seats with individual AC vents. Fixed seats are uncomfortable on journeys over 3 hours.\n\n## 3. Understand the Pricing\nMost operators charge per-km with a minimum daily distance (usually 250-300 km). Ask about driver bata, toll, parking, and night charges upfront.\n\n## 4. Plan Your Stops\nTempo Travellers need more time for fuel stops and have limited access to narrow hill roads. Plan your route accordingly.\n\n## 5. Book Early for Peak Season\nDuring Tirupati season (Sep-Mar) and school holidays, demand is very high. Book at least 2 weeks in advance for the best vehicles.', 'https://images.pexels.com/photos/2676593/pexels-photo-2676593.jpeg?auto=compress&cs=tinysrgb&w=800', 'Travel Tips', '{"Tempo Traveller","Group Travel","Tips","Vehicle Rental"}', 'Divine Travel Team', 5, true, '2026-06-10');

-- ============================================================
-- MODULE NAV POOL (auto-populated entries for navigation)
-- ============================================================
INSERT INTO module_nav_pool (id, module, entity_type, entity_id, label, url, cover_image, badge_text, is_published) VALUES
  -- Domestic destinations
  ('aab00001-0000-4000-8000-000000000001', 'domestic-tours', 'destination', 'b1d00001-0000-4000-8000-000000000001', 'Tirupati', '/domestic-tours/tirupati', 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  ('aab00002-0000-4000-8000-000000000002', 'domestic-tours', 'destination', 'b1d00002-0000-4000-8000-000000000002', 'Chennai', '/domestic-tours/chennai', 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  ('aab00003-0000-4000-8000-000000000003', 'domestic-tours', 'destination', 'b1d00003-0000-4000-8000-000000000003', 'Pondicherry', '/domestic-tours/pondicherry', 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  ('aab00004-0000-4000-8000-000000000004', 'domestic-tours', 'destination', 'b1d00004-0000-4000-8000-000000000004', 'Madurai', '/domestic-tours/madurai', NULL, NULL, true),
  ('aab00005-0000-4000-8000-000000000005', 'domestic-tours', 'destination', 'b1d00005-0000-4000-8000-000000000005', 'Ooty', '/domestic-tours/ooty', 'https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  -- International destinations
  ('aab00006-0000-4000-8000-000000000006', 'international-tours', 'destination', 'b1d00006-0000-4000-8000-000000000006', 'Sri Lanka', '/international-tours/sri-lanka', NULL, 'New', true),
  ('aab00007-0000-4000-8000-000000000007', 'international-tours', 'destination', 'b1d00007-0000-4000-8000-000000000007', 'Singapore', '/international-tours/singapore', 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  ('aab00008-0000-4000-8000-000000000008', 'international-tours', 'destination', 'b1d00008-0000-4000-8000-000000000008', 'Bali', '/international-tours/bali', 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  -- Vehicles
  ('aab00009-0000-4000-8000-000000000009', 'vehicle-rentals', 'vehicle', 'd3f00001-0000-4000-8000-000000000001', 'Toyota Innova Crysta', '/vehicle-rentals/toyota-innova-crysta', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, true),
  ('aab0000a-0000-4000-8000-000000000010', 'vehicle-rentals', 'vehicle', 'd3f00003-0000-4000-8000-000000000003', '12-Seater Tempo Traveller', '/vehicle-rentals/tempo-traveller-12', NULL, NULL, true),
  -- Airport routes
  ('aab0000b-0000-4000-8000-000000000011', 'airport-transfers', 'route', 'e4a00001-0000-4000-8000-000000000001', 'Chennai Airport to Tirupati', '/airport-transfers/chennai-airport-to-tirupati', NULL, 'Popular', true);
