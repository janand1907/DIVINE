-- Add display_order to enquiry_form_configs
ALTER TABLE enquiry_form_configs ADD COLUMN IF NOT EXISTS display_order int NOT NULL DEFAULT 0;

-- Seed enquiry form configs
INSERT INTO enquiry_form_configs (form_key, title, description, submit_label, success_message, lead_source, lead_priority, module, display_order, fields) VALUES
(
  'contact',
  'General Contact Form',
  'Default contact enquiry form',
  'Send Message',
  'Thank you for reaching out! We will get back to you within 24 hours.',
  'contact',
  'medium',
  'contact',
  1,
  '[
    {"name":"name","label":"Full Name","type":"text","required":true,"placeholder":"Your name"},
    {"name":"mobile","label":"Mobile Number","type":"tel","required":true,"placeholder":"+91 XXXXX XXXXX"},
    {"name":"email","label":"Email Address","type":"email","required":false,"placeholder":"you@example.com"},
    {"name":"destination","label":"Destination / Interest","type":"text","required":false,"placeholder":"e.g., Tirupati, Vaishno Devi"},
    {"name":"message","label":"Your Message","type":"textarea","required":false,"placeholder":"Tell us about your travel plans..."}
  ]'::jsonb
),
(
  'package-inquiry',
  'Package Enquiry Form',
  'Enquiry form for tour packages',
  'Request Quote',
  'Thank you for your interest! Our travel expert will call you within 2 hours.',
  'package-inquiry',
  'high',
  'packages',
  2,
  '[
    {"name":"name","label":"Full Name","type":"text","required":true,"placeholder":"Your name"},
    {"name":"mobile","label":"Mobile Number","type":"tel","required":true,"placeholder":"+91 XXXXX XXXXX"},
    {"name":"email","label":"Email Address","type":"email","required":false,"placeholder":"you@example.com"},
    {"name":"travel_date","label":"Travel Date","type":"date","required":false},
    {"name":"adults","label":"Number of Adults","type":"number","required":false,"min":1,"max":50},
    {"name":"children","label":"Number of Children","type":"number","required":false,"min":0,"max":20},
    {"name":"message","label":"Special Requirements","type":"textarea","required":false,"placeholder":"Any special requirements or questions?"}
  ]'::jsonb
),
(
  'vehicle-inquiry',
  'Vehicle Rental Enquiry',
  'Enquiry form for vehicle rentals',
  'Book Vehicle',
  'Booking request received! We will confirm availability and pricing shortly.',
  'vehicle-inquiry',
  'high',
  'vehicles',
  3,
  '[
    {"name":"name","label":"Full Name","type":"text","required":true,"placeholder":"Your name"},
    {"name":"mobile","label":"Mobile Number","type":"tel","required":true,"placeholder":"+91 XXXXX XXXXX"},
    {"name":"pickup_date","label":"Pickup Date","type":"date","required":false},
    {"name":"pickup_location","label":"Pickup Location","type":"text","required":false,"placeholder":"e.g., Chennai Airport"},
    {"name":"drop_location","label":"Drop Location","type":"text","required":false,"placeholder":"e.g., Tirupati"},
    {"name":"message","label":"Additional Details","type":"textarea","required":false}
  ]'::jsonb
),
(
  'transfer-inquiry',
  'Airport Transfer Enquiry',
  'Enquiry form for airport transfers',
  'Book Transfer',
  'Transfer booking received! We will confirm details within 30 minutes.',
  'transfer-inquiry',
  'high',
  'transfers',
  4,
  '[
    {"name":"name","label":"Full Name","type":"text","required":true,"placeholder":"Your name"},
    {"name":"mobile","label":"Mobile Number","type":"tel","required":true,"placeholder":"+91 XXXXX XXXXX"},
    {"name":"travel_date","label":"Travel Date","type":"date","required":false},
    {"name":"flight_number","label":"Flight Number","type":"text","required":false,"placeholder":"e.g., 6E 201"},
    {"name":"adults","label":"Passengers","type":"number","required":false,"min":1,"max":12},
    {"name":"message","label":"Additional Notes","type":"textarea","required":false}
  ]'::jsonb
),
(
  'quick-quote',
  'Quick Quote Form',
  'Fast enquiry for a travel quote',
  'Get Free Quote',
  'Your quote request is in! Expect a call from our team within 1 hour.',
  'quick-quote',
  'high',
  null,
  5,
  '[
    {"name":"name","label":"Name","type":"text","required":true,"placeholder":"Your name"},
    {"name":"mobile","label":"Mobile","type":"tel","required":true,"placeholder":"+91 XXXXX XXXXX"},
    {"name":"destination","label":"Destination","type":"text","required":false,"placeholder":"Where do you want to go?"},
    {"name":"travel_date","label":"Travel Date","type":"date","required":false},
    {"name":"adults","label":"Persons","type":"number","required":false,"min":1}
  ]'::jsonb
);

-- Seed hotel cities
INSERT INTO hotel_cities (slug, name, state, region, display_order, is_published, description) VALUES
('tirupati', 'Tirupati', 'Andhra Pradesh', 'South India', 1, true, 'Home to Sri Venkateswara Temple, the most visited pilgrimage site in the world.'),
('chennai', 'Chennai', 'Tamil Nadu', 'South India', 2, true, 'The gateway to South India, offering hotels near airport, railway station and popular attractions.'),
('madurai', 'Madurai', 'Tamil Nadu', 'South India', 3, true, 'City of temples — Meenakshi Amman Temple and vibrant culture.'),
('rameswaram', 'Rameswaram', 'Tamil Nadu', 'South India', 4, true, 'Sacred pilgrimage island with Ramanathaswamy Temple.'),
('kanchipuram', 'Kanchipuram', 'Tamil Nadu', 'South India', 5, true, 'City of thousand temples and famous silk sarees.'),
('mahabalipuram', 'Mahabalipuram', 'Tamil Nadu', 'South India', 6, true, 'UNESCO World Heritage Site with stunning shore temples.'),
('pondicherry', 'Pondicherry', 'Puducherry', 'South India', 7, true, 'French colonial charm meets Tamil culture and Auroville.'),
('bangalore', 'Bangalore', 'Karnataka', 'South India', 8, true, 'India''s Silicon Valley — perfect for tech travellers and heritage seekers.'),
('mysore', 'Mysore', 'Karnataka', 'South India', 9, true, 'City of palaces, silk and sandal — home to the magnificent Mysore Palace.'),
('ooty', 'Ooty', 'Tamil Nadu', 'South India', 10, true, 'Queen of Hill Stations in the Nilgiri mountains.'),
('kodaikanal', 'Kodaikanal', 'Tamil Nadu', 'South India', 11, true, 'Princess of Hill Stations with stunning lake and valleys.'),
('trichy', 'Trichy (Tiruchirappalli)', 'Tamil Nadu', 'South India', 12, true, 'Rock Fort Temple city at the confluence of Kaveri and Kollidam rivers.');
