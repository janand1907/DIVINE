-- Seed: Demo content pages with sections
-- About Us page
INSERT INTO content_pages (id, slug, title, page_type, module, is_published, display_order, seo_title, seo_description, schema_type)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'about-us',
  'About Us',
  'general',
  NULL,
  true,
  1,
  'About Divine Travel - Premium Pilgrimage & Leisure Tours',
  'Learn about Divine Travel, Chennai''s trusted travel company for pilgrimage and leisure tours across India since 2010.',
  'AboutPage'
);

-- Contact page
INSERT INTO content_pages (id, slug, title, page_type, module, is_published, display_order, seo_title, seo_description, schema_type)
VALUES (
  'a0000001-0000-0000-0000-000000000002',
  'contact-us',
  'Contact Us',
  'general',
  NULL,
  true,
  2,
  'Contact Divine Travel - Get in Touch',
  'Reach out to Divine Travel for bookings, enquiries, and custom tour packages. Call, WhatsApp, or visit our Chennai office.',
  'ContactPage'
);

-- Corporate Tours page
INSERT INTO content_pages (id, slug, title, page_type, module, is_published, display_order, seo_title, seo_description, schema_type)
VALUES (
  'a0000001-0000-0000-0000-000000000003',
  'corporate-tours',
  'Corporate Tours',
  'landing',
  'packages',
  true,
  3,
  'Corporate Travel Solutions - Divine Travel',
  'Tailored corporate travel, team outings, offsite events, and executive retreats across India.',
  'WebPage'
);

-- Group Tours page
INSERT INTO content_pages (id, slug, title, page_type, module, is_published, display_order, seo_title, seo_description, schema_type)
VALUES (
  'a0000001-0000-0000-0000-000000000004',
  'group-tours',
  'Group Tours',
  'landing',
  'packages',
  true,
  4,
  'Group Tour Packages - Divine Travel',
  'Budget-friendly group tour packages for families, friends, colleges, and associations.',
  'WebPage'
);

-- ===== SECTIONS FOR ABOUT US =====
INSERT INTO page_sections (id, entity_type, entity_id, section_type, label, display_order, is_enabled, config) VALUES
('b0000001-0000-0000-0000-000000000001', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'hero_banner', 'Hero', 0, true,
  '{"heading":"About Divine Travel","subheading":"Your Trusted Travel Partner Since 2010","height":"medium","text_align":"center","overlay_opacity":0.5}'::jsonb),
('b0000001-0000-0000-0000-000000000002', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'rich_text', 'Our Story', 1, true,
  '{"html":"<h2>Our Story</h2><p>Founded in 2010 in Chennai, Divine Travel began as a small pilgrimage tour operator serving devotees traveling to Navagraha temples. Over the past decade, we have grown into a full-service travel company offering pilgrimage, leisure, corporate, and vehicle rental services across India.</p><p>With over 50,000 happy travelers and counting, our commitment to safety, comfort, and spiritual fulfillment remains unchanged. Every journey we craft is infused with care, local expertise, and a deep respect for the sacred traditions of our land.</p>","max_width":"narrow"}'::jsonb),
('b0000001-0000-0000-0000-000000000003', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'statistics', 'Our Numbers', 2, true,
  '{"background":"muted","stats":[{"value":"50,000+","label":"Happy Travelers"},{"value":"500+","label":"Tours Completed"},{"value":"14+","label":"Years Experience"},{"value":"4.9/5","label":"Customer Rating"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000004', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'feature_cards', 'Why Choose Us', 3, true,
  '{"columns":3,"cards":[{"title":"Expert Local Guides","description":"Our guides have deep knowledge of temples, history, and local culture.","icon":"Users"},{"title":"Premium Vehicles","description":"Well-maintained AC vehicles with experienced, courteous drivers.","icon":"Car"},{"title":"24/7 Support","description":"Round-the-clock assistance for any travel needs or emergencies.","icon":"Phone"},{"title":"Custom Itineraries","description":"Every tour is tailored to your preferences, pace, and budget.","icon":"Map"},{"title":"Best Price Guarantee","description":"Competitive pricing with no hidden costs or surprise charges.","icon":"IndianRupee"},{"title":"Safety First","description":"GPS-tracked vehicles, verified drivers, and comprehensive insurance.","icon":"Shield"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000005', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'testimonials', 'What Clients Say', 4, true,
  '{"source":"featured","limit":6,"layout":"grid"}'::jsonb),
('b0000001-0000-0000-0000-000000000006', 'content_page', 'a0000001-0000-0000-0000-000000000001', 'cta_banner', 'CTA', 5, true,
  '{"heading":"Ready to Start Your Journey?","subheading":"Let us plan the perfect trip for you and your loved ones.","button_text":"Plan My Trip","button_url":"/contact","background":"primary","include_whatsapp":true}'::jsonb);

-- ===== SECTIONS FOR CONTACT US =====
INSERT INTO page_sections (id, entity_type, entity_id, section_type, label, display_order, is_enabled, config) VALUES
('b0000001-0000-0000-0000-000000000010', 'content_page', 'a0000001-0000-0000-0000-000000000002', 'hero_banner', 'Hero', 0, true,
  '{"heading":"Get in Touch","subheading":"We would love to hear from you. Reach out for bookings, custom quotes, or any questions.","height":"small","text_align":"center"}'::jsonb),
('b0000001-0000-0000-0000-000000000011', 'content_page', 'a0000001-0000-0000-0000-000000000002', 'enquiry_form', 'Contact Form', 1, true,
  '{"form_key":"contact","layout":"card"}'::jsonb),
('b0000001-0000-0000-0000-000000000012', 'content_page', 'a0000001-0000-0000-0000-000000000002', 'feature_cards', 'Ways to Reach Us', 2, true,
  '{"columns":3,"cards":[{"title":"Call Us","description":"+91 98765 43210 (9AM - 9PM IST)","icon":"Phone"},{"title":"WhatsApp","description":"Chat with us anytime for quick responses","icon":"MessageCircle"},{"title":"Visit Office","description":"123 Anna Salai, Chennai 600002","icon":"MapPin"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000013', 'content_page', 'a0000001-0000-0000-0000-000000000002', 'google_map', 'Our Location', 3, true,
  '{"embed_url":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8!2d80.27!3d13.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzAwLjAiTiA4MMKwMTYnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890","height":400,"address_label":"Divine Travel Office, Anna Salai, Chennai"}'::jsonb);

-- ===== SECTIONS FOR CORPORATE TOURS =====
INSERT INTO page_sections (id, entity_type, entity_id, section_type, label, display_order, is_enabled, config) VALUES
('b0000001-0000-0000-0000-000000000020', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'hero_banner', 'Hero', 0, true,
  '{"heading":"Corporate Travel Solutions","subheading":"Team outings, offsite events, executive retreats, and incentive trips — managed end-to-end.","height":"large","text_align":"center"}'::jsonb),
('b0000001-0000-0000-0000-000000000021', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'rich_text', 'Intro', 1, true,
  '{"html":"<h2>Tailored Corporate Experiences</h2><p>From small executive retreats to large team outings, Divine Travel designs seamless corporate travel experiences. We handle logistics, accommodations, activities, and transport so your team can focus on what matters — bonding, creativity, and results.</p>","max_width":"normal"}'::jsonb),
('b0000001-0000-0000-0000-000000000022', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'feature_cards', 'Services', 2, true,
  '{"columns":3,"cards":[{"title":"Team Outings","description":"Fun-filled day trips and weekend getaways for teams of any size.","icon":"Users"},{"title":"Offsite Events","description":"Conference and meeting venues with full logistics support.","icon":"Building2"},{"title":"Incentive Trips","description":"Reward top performers with memorable travel experiences.","icon":"Award"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000023', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'statistics', 'Track Record', 3, true,
  '{"background":"muted","stats":[{"value":"200+","label":"Corporate Clients"},{"value":"95%","label":"Repeat Rate"},{"value":"10,000+","label":"Employees Served"},{"value":"50+","label":"Destinations"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000024', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'testimonials', 'Client Testimonials', 4, true,
  '{"source":"featured","limit":3,"layout":"carousel"}'::jsonb),
('b0000001-0000-0000-0000-000000000025', 'content_page', 'a0000001-0000-0000-0000-000000000003', 'enquiry_form', 'Get a Quote', 5, true,
  '{"form_key":"contact","layout":"card"}'::jsonb);

-- ===== SECTIONS FOR GROUP TOURS =====
INSERT INTO page_sections (id, entity_type, entity_id, section_type, label, display_order, is_enabled, config) VALUES
('b0000001-0000-0000-0000-000000000030', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'hero_banner', 'Hero', 0, true,
  '{"heading":"Group Tour Packages","subheading":"Travel together, save together. Packages for families, friends, colleges, and associations.","height":"large","text_align":"center"}'::jsonb),
('b0000001-0000-0000-0000-000000000031', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'rich_text', 'Intro', 1, true,
  '{"html":"<h2>Group Travel Made Easy</h2><p>Planning travel for a large group can be overwhelming. Let Divine Travel handle everything — from vehicle selection and hotel bookings to restaurant reservations and activity planning. We offer special group rates that make quality travel accessible to everyone.</p>","max_width":"normal"}'::jsonb),
('b0000001-0000-0000-0000-000000000032', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'feature_cards', 'Why Group Tours', 2, true,
  '{"columns":3,"cards":[{"title":"Group Discounts","description":"Special pricing for groups of 10+ travelers.","icon":"Percent"},{"title":"Custom Itineraries","description":"Tailored plans based on group preferences and budget.","icon":"Map"},{"title":"Dedicated Coordinator","description":"A single point of contact for the entire group.","icon":"Headphones"}]}'::jsonb),
('b0000001-0000-0000-0000-000000000033', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'package_grid', 'Popular Group Packages', 3, true,
  '{"source":"featured","limit":6,"layout":"grid"}'::jsonb),
('b0000001-0000-0000-0000-000000000034', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'vehicle_grid', 'Vehicles for Groups', 4, true,
  '{"source":"all","limit":4}'::jsonb),
('b0000001-0000-0000-0000-000000000035', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'faq', 'FAQs', 5, true,
  '{"source":"manual","faqs":[{"question":"What is the minimum group size?","answer":"We offer group packages for 10 or more travelers. For smaller groups, our regular packages work great too."},{"question":"Can we customize the itinerary?","answer":"Absolutely! Every group tour is fully customizable. Tell us your preferences and we will design the perfect plan."},{"question":"Do you provide buses for large groups?","answer":"Yes, we have buses accommodating 20-50 passengers, along with tempo travelers and minibuses."},{"question":"How far in advance should we book?","answer":"We recommend booking at least 2-3 weeks in advance for group tours to ensure availability of preferred vehicles and hotels."}]}'::jsonb),
('b0000001-0000-0000-0000-000000000036', 'content_page', 'a0000001-0000-0000-0000-000000000004', 'enquiry_form', 'Plan Your Group Tour', 6, true,
  '{"form_key":"quick-quote","layout":"card"}'::jsonb);
