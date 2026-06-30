
-- Popular Route Categories
INSERT INTO popular_route_categories (id, name, slug, description, display_order, is_visible)
VALUES
('ca022001-0000-4000-8000-000000000001', 'Chennai Airport Transfers', 'chennai-airport-transfers', 'All taxi routes from Chennai Airport (MAA) to major cities and pilgrimage destinations.', 1, true),
('ca022002-0000-4000-8000-000000000002', 'Bangalore Airport Transfers', 'bangalore-airport-transfers', 'All taxi routes from Bengaluru Airport (BLR) to major destinations across South India.', 2, true),
('ca022003-0000-4000-8000-000000000003', 'Coimbatore Airport Transfers', 'coimbatore-airport-transfers', 'Taxi transfers from Coimbatore Airport (CJB) to Ooty, Munnar, Palani, and nearby cities.', 3, true),
('ca022004-0000-4000-8000-000000000004', 'South India Pilgrimage Routes', 'south-india-pilgrimage-routes', 'Popular taxi routes between major pilgrimage temples and shrines across South India.', 4, true),
('ca022005-0000-4000-8000-000000000005', 'Tamil Nadu Local Routes', 'tamil-nadu-local-routes', 'Inter-city taxi routes within Tamil Nadu connecting major towns and cities.', 5, true),
('ca022006-0000-4000-8000-000000000006', 'Karnataka & Andhra Transfers', 'karnataka-andhra-transfers', 'Taxi routes across Karnataka and Andhra Pradesh including Tirupati, Mysore, and beyond.', 6, true),
('ca022007-0000-4000-8000-000000000007', 'Kerala Hill Station Routes', 'kerala-hill-station-routes', 'Scenic routes to Kerala''s backwaters, hill stations, and beach destinations.', 7, true),
('ca022008-0000-4000-8000-000000000008', 'Hyderabad Airport Transfers', 'hyderabad-airport-transfers', 'Taxi transfers from Rajiv Gandhi International Airport (HYD) across Telangana and South India.', 8, true),
('ca022009-0000-4000-8000-000000000009', 'Trichy & Madurai Routes', 'trichy-madurai-routes', 'Popular taxi routes from Trichy and Madurai airports and city centers to temple destinations.', 9, true),
('ca022010-0000-4000-8000-000000000010', 'North India Pilgrimage Routes', 'north-india-pilgrimage-routes', 'Sacred routes connecting Varanasi, Haridwar, Tirupati, Mathura, Vrindavan, and other North India shrines.', 10, true)
ON CONFLICT (slug) DO NOTHING;
