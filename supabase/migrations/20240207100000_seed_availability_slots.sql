-- Seed availability slots for the next 30 days so "Check Availability" returns results.
-- Two slots per day (10:00 and 14:00) for all published tours.
INSERT INTO availability_slots (tour_id, slot_date, slot_time, max_guests, booked_guests)
SELECT t.id, d.d::date, s.slot_time, 15, 0
FROM tours t
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + 30, '1 day'::interval) AS d(d)
CROSS JOIN (VALUES ('10:00'::time), ('14:00'::time)) AS s(slot_time)
WHERE t.published = true
ON CONFLICT (tour_id, slot_date, slot_time) DO NOTHING;
