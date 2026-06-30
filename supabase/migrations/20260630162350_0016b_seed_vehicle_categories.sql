
INSERT INTO vehicle_categories (id, name, slug, description, display_order)
VALUES
('a0c00004-0000-4000-8000-000000000004', 'Hatchback', 'hatchback', 'Compact and economical vehicles for city trips and short outstation travel.', 0),
('a0c00005-0000-4000-8000-000000000005', 'Luxury', 'luxury', 'Premium and luxury vehicles for VIP transfers, weddings, and executive travel.', 4),
('a0c00006-0000-4000-8000-000000000006', 'Coach Bus', 'coach-bus', 'Large capacity coaches and buses for pilgrim groups and corporate travel.', 5)
ON CONFLICT (slug) DO NOTHING;
