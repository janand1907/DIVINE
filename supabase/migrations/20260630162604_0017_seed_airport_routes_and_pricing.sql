
-- Transfer vehicle types
INSERT INTO transfer_vehicle_types (id, slug, name, seats, luggage_pieces, image, description, is_active, display_order)
VALUES
('ac019001-0000-4000-8000-000000000001', 'sedan', 'Sedan (Dzire/Etios)', 4, 3,
 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Comfortable sedan for up to 4 passengers. Best value for small groups and couples.', true, 1),
('ac019002-0000-4000-8000-000000000002', 'suv', 'SUV (Innova/Crysta)', 7, 5,
 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Spacious SUV for families of up to 7. Ample luggage space for airport transfers.', true, 2),
('ac019003-0000-4000-8000-000000000003', 'tempo-traveller', 'Tempo Traveller (12-17 Seater)', 14, 10,
 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Perfect for pilgrim groups and large families. Air-conditioned with push-back seats.', true, 3),
('ac019004-0000-4000-8000-000000000004', 'luxury', 'Luxury (Mercedes/BMW)', 4, 2,
 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Premium luxury vehicles for VIP and corporate airport transfers.', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Additional airport routes
INSERT INTO airport_routes (id, slug, from_city, to_city, distance_km, duration_hours, vehicles, description, is_active, route_type, is_return_available, popular_rank, cover_image)
VALUES
-- Chennai Airport routes
('ae020001-0000-4000-8000-000000000001', 'chennai-airport-to-madurai', 'Chennai Airport (MAA)', 'Madurai', 462, 7.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":5800},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":8500},{"vehicle_type":"Tempo Traveller","seats":14,"price":13000}]',
 'Airport transfer from Chennai International Airport to Madurai. Covers key pilgrimage cities like Trichy en route.', true, 'airport-to-city', true, 3,
 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020002-0000-4000-8000-000000000002', 'chennai-airport-to-rameswaram', 'Chennai Airport (MAA)', 'Rameswaram', 573, 9,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":7200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":10500},{"vehicle_type":"Tempo Traveller","seats":14,"price":16000}]',
 'Direct airport transfer from Chennai to the sacred Ramanathaswamy Temple town of Rameswaram.', true, 'airport-to-city', true, 4,
 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020003-0000-4000-8000-000000000003', 'chennai-airport-to-pondicherry', 'Chennai Airport (MAA)', 'Pondicherry', 155, 2.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":2200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":3200},{"vehicle_type":"Tempo Traveller","seats":14,"price":5000}]',
 'Comfortable airport transfer from Chennai to the French Quarter city of Pondicherry.', true, 'airport-to-city', true, 5,
 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020004-0000-4000-8000-000000000004', 'chennai-airport-to-kanchipuram', 'Chennai Airport (MAA)', 'Kanchipuram', 72, 1.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":1200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":1800},{"vehicle_type":"Tempo Traveller","seats":14,"price":2800}]',
 'Quick transfer to the temple city of Kanchipuram, one of India''s seven moksha-puri cities.', true, 'airport-to-city', true, 6,
 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020005-0000-4000-8000-000000000005', 'chennai-airport-to-coimbatore', 'Chennai Airport (MAA)', 'Coimbatore', 498, 7,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":6200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":9200},{"vehicle_type":"Tempo Traveller","seats":14,"price":14000}]',
 'Long-distance transfer from Chennai Airport to Coimbatore, gateway to the Nilgiris hill stations.', true, 'airport-to-city', true, 7,
 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Bengaluru Airport routes
('ae020006-0000-4000-8000-000000000006', 'bangalore-airport-to-mysore', 'Bengaluru Airport (BLR)', 'Mysore', 170, 3,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":2800},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":4200},{"vehicle_type":"Tempo Traveller","seats":14,"price":6500}]',
 'Airport transfer from Kempegowda International Airport Bengaluru to the heritage city of Mysore.', true, 'airport-to-city', true, 2,
 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020007-0000-4000-8000-000000000007', 'bangalore-airport-to-coorg', 'Bengaluru Airport (BLR)', 'Coorg', 270, 4.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":4000},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":6000},{"vehicle_type":"Tempo Traveller","seats":14,"price":9500}]',
 'Direct airport transfer to the Coffee Capital of India — Coorg, nestled in the Western Ghats.', true, 'airport-to-city', true, 5,
 'https://images.pexels.com/photos/2387416/pexels-photo-2387416.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020008-0000-4000-8000-000000000008', 'bangalore-airport-to-ooty', 'Bengaluru Airport (BLR)', 'Ooty', 280, 5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":4200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":6300},{"vehicle_type":"Tempo Traveller","seats":14,"price":9800}]',
 'Transfer from Bengaluru Airport to Ooty (Udhagamandalam), the Queen of Hill Stations in the Nilgiris.', true, 'airport-to-city', true, 6,
 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Hyderabad Airport routes
('ae020009-0000-4000-8000-000000000009', 'hyderabad-airport-to-tirupati', 'Hyderabad Airport (HYD)', 'Tirupati', 580, 8,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":7200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":10500},{"vehicle_type":"Tempo Traveller","seats":14,"price":16000}]',
 'Airport transfer from Rajiv Gandhi International Airport Hyderabad to Tirupati pilgrim destination.', true, 'airport-to-city', true, 3,
 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020010-0000-4000-8000-000000000010', 'hyderabad-airport-to-srisailam', 'Hyderabad Airport (HYD)', 'Srisailam', 210, 3.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":3200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":4800},{"vehicle_type":"Tempo Traveller","seats":14,"price":7500}]',
 'Transfer to Srisailam, one of the 12 Jyotirlinga shrines and an important Shakti Peetha.', true, 'airport-to-city', true, 4,
 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Coimbatore Airport routes
('ae020011-0000-4000-8000-000000000011', 'coimbatore-airport-to-ooty', 'Coimbatore Airport (CJB)', 'Ooty', 86, 2,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":1400},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":2100},{"vehicle_type":"Tempo Traveller","seats":14,"price":3500}]',
 'Quick transfer from Coimbatore Airport up to the Nilgiri hills to Ooty.', true, 'airport-to-city', true, 1,
 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020012-0000-4000-8000-000000000012', 'coimbatore-airport-to-munnar', 'Coimbatore Airport (CJB)', 'Munnar', 115, 2.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":1800},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":2700},{"vehicle_type":"Tempo Traveller","seats":14,"price":4200}]',
 'Transfer from Coimbatore Airport to Munnar, Kerala''s famous tea garden hill station.', true, 'airport-to-city', true, 2,
 'https://images.pexels.com/photos/2387416/pexels-photo-2387416.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020013-0000-4000-8000-000000000013', 'coimbatore-airport-to-palani', 'Coimbatore Airport (CJB)', 'Palani', 65, 1.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":1100},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":1650},{"vehicle_type":"Tempo Traveller","seats":14,"price":2600}]',
 'Transfer to Palani Murugan Temple, one of the six abodes (Arupadai Veedu) of Lord Murugan.', true, 'airport-to-city', true, 3,
 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Trichy Airport routes
('ae020014-0000-4000-8000-000000000014', 'trichy-airport-to-kumbakonam', 'Trichy Airport (TRZ)', 'Kumbakonam', 90, 1.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":1500},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":2200},{"vehicle_type":"Tempo Traveller","seats":14,"price":3500}]',
 'Transfer from Trichy Airport to Kumbakonam, the temple city and starting point for Navagraha circuit.', true, 'airport-to-city', true, 1,
 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020015-0000-4000-8000-000000000015', 'trichy-airport-to-rameswaram', 'Trichy Airport (TRZ)', 'Rameswaram', 220, 3.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":3200},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":4800},{"vehicle_type":"Tempo Traveller","seats":14,"price":7500}]',
 'Transfer from Trichy Airport to Rameswaram, one of the Char Dham pilgrimage sites.', true, 'airport-to-city', true, 2,
 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Madurai Airport routes
('ae020016-0000-4000-8000-000000000016', 'madurai-airport-to-kanyakumari', 'Madurai Airport (IXM)', 'Kanyakumari', 250, 4,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":3500},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":5200},{"vehicle_type":"Tempo Traveller","seats":14,"price":8000}]',
 'Transfer from Madurai Airport to Kanyakumari, the southernmost tip of India.', true, 'airport-to-city', true, 1,
 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ae020017-0000-4000-8000-000000000017', 'madurai-airport-to-rameswaram', 'Madurai Airport (IXM)', 'Rameswaram', 170, 2.5,
 '[{"vehicle_type":"Sedan (Dzire/Etios)","seats":4,"price":2600},{"vehicle_type":"SUV (Innova/Crysta)","seats":7,"price":3900},{"vehicle_type":"Tempo Traveller","seats":14,"price":6000}]',
 'Transfer from Madurai Airport to Rameswaram — the island temple city connected by Pamban Bridge.', true, 'airport-to-city', true, 2,
 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=800')

ON CONFLICT (slug) DO NOTHING;

-- Transfer pricing using the transfer_vehicle_types
INSERT INTO transfer_pricing (id, route_id, vehicle_type_id, base_price, return_price, extra_per_km, toll_extra, waiting_charge_per_hour, night_surcharge, is_active, display_order)
VALUES
-- Chennai to Madurai
('ad021001-0000-4000-8000-000000000001', 'ae020001-0000-4000-8000-000000000001', 'ac019001-0000-4000-8000-000000000001', 5800, 10500, 12, 200, 250, 500, true, 1),
('ad021002-0000-4000-8000-000000000002', 'ae020001-0000-4000-8000-000000000001', 'ac019002-0000-4000-8000-000000000002', 8500, 15500, 15, 200, 300, 700, true, 2),
('ad021003-0000-4000-8000-000000000003', 'ae020001-0000-4000-8000-000000000001', 'ac019003-0000-4000-8000-000000000003', 13000, 24000, 20, 300, 400, 1000, true, 3),
-- Chennai to Rameswaram
('ad021004-0000-4000-8000-000000000004', 'ae020002-0000-4000-8000-000000000002', 'ac019001-0000-4000-8000-000000000001', 7200, 13000, 12, 300, 250, 500, true, 1),
('ad021005-0000-4000-8000-000000000005', 'ae020002-0000-4000-8000-000000000002', 'ac019002-0000-4000-8000-000000000002', 10500, 19000, 15, 300, 300, 700, true, 2),
-- Bangalore to Mysore
('ad021006-0000-4000-8000-000000000006', 'ae020006-0000-4000-8000-000000000006', 'ac019001-0000-4000-8000-000000000001', 2800, 5000, 12, 150, 250, 500, true, 1),
('ad021007-0000-4000-8000-000000000007', 'ae020006-0000-4000-8000-000000000006', 'ac019002-0000-4000-8000-000000000002', 4200, 7500, 15, 150, 300, 700, true, 2),
-- Coimbatore to Ooty
('ad021008-0000-4000-8000-000000000008', 'ae020011-0000-4000-8000-000000000011', 'ac019001-0000-4000-8000-000000000001', 1400, 2500, 12, 100, 250, 300, true, 1),
('ad021009-0000-4000-8000-000000000009', 'ae020011-0000-4000-8000-000000000011', 'ac019002-0000-4000-8000-000000000002', 2100, 3800, 15, 100, 300, 500, true, 2),
-- Existing routes pricing
('ad021010-0000-4000-8000-000000000010', 'e4a00001-0000-4000-8000-000000000001', 'ac019001-0000-4000-8000-000000000001', 2800, 5000, 12, 200, 250, 500, true, 1),
('ad021011-0000-4000-8000-000000000011', 'e4a00001-0000-4000-8000-000000000001', 'ac019002-0000-4000-8000-000000000002', 4200, 7500, 15, 200, 300, 700, true, 2),
('ad021012-0000-4000-8000-000000000012', 'e4a00001-0000-4000-8000-000000000001', 'ac019003-0000-4000-8000-000000000003', 6500, 11500, 20, 300, 400, 1000, true, 3),
-- Bangalore to Tirupati
('ad021013-0000-4000-8000-000000000013', 'e4a00003-0000-4000-8000-000000000003', 'ac019001-0000-4000-8000-000000000001', 4500, 8000, 12, 250, 250, 500, true, 1),
('ad021014-0000-4000-8000-000000000014', 'e4a00003-0000-4000-8000-000000000003', 'ac019002-0000-4000-8000-000000000002', 6800, 12000, 15, 250, 300, 700, true, 2),
('ad021015-0000-4000-8000-000000000015', 'e4a00003-0000-4000-8000-000000000003', 'ac019003-0000-4000-8000-000000000003', 9500, 17000, 20, 350, 400, 1000, true, 3)
ON CONFLICT (id) DO NOTHING;
