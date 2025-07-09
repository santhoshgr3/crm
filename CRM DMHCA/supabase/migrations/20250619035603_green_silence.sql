/*
  # Insert Sample Data for DMHCA CRM

  1. Sample Data
    - Insert counselors
    - Insert courses
    - Insert leads with various statuses
    - Insert follow-ups
    - Insert WhatsApp messages

  2. Data Coverage
    - Multiple lead statuses for testing Kanban board
    - Various course interests
    - Different counselor assignments
    - WhatsApp message history
    - Follow-up records
*/

-- Insert sample counselors
INSERT INTO counselors (id, name, email, phone, department, is_active, preferred_language, whatsapp_number) VALUES
('c1', 'Dr. Priya Sharma', 'priya.sharma@dmhca.edu', '+91 9876543210', 'Admissions', true, 'en', '+91 9876543210'),
('c2', 'Mr. Rajesh Kumar', 'rajesh.kumar@dmhca.edu', '+91 9876543211', 'Student Affairs', true, 'hi', '+91 9876543211'),
('c3', 'Ms. Sunita Reddy', 'sunita.reddy@dmhca.edu', '+91 9876543212', 'Course Coordinator', true, 'te', '+91 9876543212'),
('c4', 'Dr. Amit Patel', 'amit.patel@dmhca.edu', '+91 9876543213', 'Fellowship Programs', true, 'en', '+91 9876543213');

-- Insert sample courses
INSERT INTO courses (id, name, category, price, duration, eligibility, description, is_active) VALUES
('course1', 'Fellowship in Emergency Medicine', 'Fellowship', 450000, '2 Years', 'MBBS with 1 year experience', 'Comprehensive fellowship program in emergency medicine with hands-on training', true),
('course2', 'Fellowship in Critical Care Medicine', 'Fellowship', 500000, '2 Years', 'MD/MS or DNB', 'Advanced training in intensive care unit management and critical care protocols', true),
('course3', 'Fellowship in Interventional Cardiology', 'Fellowship', 650000, '1 Year', 'DM Cardiology or equivalent', 'Specialized training in cardiac interventional procedures', true),
('course4', 'Fellowship in Trauma Surgery', 'Fellowship', 480000, '18 Months', 'MS General Surgery', 'Comprehensive trauma surgery training with emergency protocols', true),
('course5', 'Fellowship in Pediatric Surgery', 'Fellowship', 520000, '2 Years', 'MS General Surgery with pediatric experience', 'Specialized pediatric surgical procedures and patient care', true),
('course6', 'PG Diploma in Hospital Administration', 'PG Diploma', 180000, '1 Year', 'MBBS or MBA', 'Healthcare management and hospital administration skills', true),
('course7', 'PG Diploma in Medical Ethics', 'PG Diploma', 120000, '6 Months', 'MBBS or healthcare background', 'Ethics in medical practice and healthcare delivery', true),
('course8', 'PG Diploma in Public Health', 'PG Diploma', 150000, '1 Year', 'MBBS or health sciences degree', 'Community health management and public health policies', true),
('course9', 'PG Diploma in Clinical Research', 'PG Diploma', 200000, '1 Year', 'MBBS, BDS, or life sciences graduate', 'Clinical trial management and research methodologies', true),
('course10', 'Basic Life Support (BLS) Certification', 'Certification', 5000, '2 Days', 'Healthcare professionals', 'Essential life-saving techniques and emergency response', true),
('course11', 'Advanced Cardiac Life Support (ACLS)', 'Certification', 12000, '3 Days', 'BLS certified healthcare professionals', 'Advanced cardiovascular emergency procedures', true),
('course12', 'Pediatric Advanced Life Support (PALS)', 'Certification', 15000, '2 Days', 'ACLS certified with pediatric experience', 'Pediatric emergency care and resuscitation techniques', true);

-- Insert sample leads with various statuses
INSERT INTO leads (id, name, email, phone, course_interest, source, status, assigned_counselor, priority, location, notes, whatsapp_number, preferred_language) VALUES
('lead1', 'Dr. Ananya Nair', 'ananya.nair@email.com', '+91 9876543220', 'Fellowship in Emergency Medicine', 'Website', 'Hot', 'c1', 'High', 'Mumbai', 'Very interested, has relevant experience in emergency medicine', '+91 9876543220', 'en'),
('lead2', 'Dr. Vikram Singh', 'vikram.singh@email.com', '+91 9876543221', 'Fellowship in Critical Care Medicine', 'Referral', 'Warm', 'c2', 'Medium', 'Delhi', 'Considering multiple options, needs more information', '+91 9876543221', 'hi'),
('lead3', 'Dr. Meera Gupta', 'meera.gupta@email.com', '+91 9876543222', 'PG Diploma in Hospital Administration', 'Social Media', 'Follow-Up Needed', 'c1', 'Medium', 'Bangalore', 'Needs more information about career prospects', '+91 9876543222', 'en'),
('lead4', 'Dr. Arjun Reddy', 'arjun.reddy@email.com', '+91 9876543223', 'Fellowship in Interventional Cardiology', 'Conference', 'Hot', 'c4', 'High', 'Hyderabad', 'Excellent background, ready to proceed with admission', '+91 9876543223', 'te'),
('lead5', 'Dr. Kavitha Menon', 'kavitha.menon@email.com', '+91 9876543224', 'PG Diploma in Clinical Research', 'Email Campaign', 'Cold', 'c3', 'Low', 'Chennai', 'Initial inquiry, limited engagement so far', '+91 9876543224', 'en'),
('lead6', 'Dr. Rohit Sharma', 'rohit.sharma@email.com', '+91 9876543225', 'Fellowship in Trauma Surgery', 'Website', 'Converted', 'c2', 'High', 'Pune', 'Successfully enrolled, payment completed', '+91 9876543225', 'hi'),
('lead7', 'Dr. Sneha Joshi', 'sneha.joshi@email.com', '+91 9876543226', 'ACLS Certification', 'Referral', 'Warm', 'c1', 'Medium', 'Ahmedabad', 'Interested in group enrollment for hospital staff', '+91 9876543226', 'en'),
('lead8', 'Dr. Rajesh Patel', 'rajesh.patel@email.com', '+91 9876543227', 'PG Diploma in Medical Ethics', 'Cold Call', 'Not Interested', 'c3', 'Low', 'Surat', 'Not currently looking for additional qualifications', '+91 9876543227', 'en'),
('lead9', 'Dr. Priyanka Desai', 'priyanka.desai@email.com', '+91 9876543228', 'Fellowship in Pediatric Surgery', 'Website', 'Follow-Up Needed', 'c4', 'High', 'Jaipur', 'Excellent candidate, awaiting final decision', '+91 9876543228', 'en'),
('lead10', 'Dr. Anil Kumar', 'anil.kumar@email.com', '+91 9876543229', 'BLS Certification', 'Social Media', 'Hot', 'c2', 'Medium', 'Lucknow', 'Quick decision maker, ready to enroll immediately', '+91 9876543229', 'hi'),
('lead11', 'Dr. Deepika Rao', 'deepika.rao@email.com', '+91 9876543230', 'PG Diploma in Public Health', 'Website', 'Warm', 'c1', 'Medium', 'Kochi', 'Working in rural health, very motivated', '+91 9876543230', 'en'),
('lead12', 'Dr. Suresh Babu', 'suresh.babu@email.com', '+91 9876543231', 'Fellowship in Critical Care Medicine', 'Conference', 'Hot', 'c3', 'High', 'Visakhapatnam', 'ICU specialist looking to upgrade skills', '+91 9876543231', 'te'),
('lead13', 'Dr. Ravi Krishnan', 'ravi.krishnan@email.com', '+91 9876543232', 'PALS Certification', 'Referral', 'Cold', 'c4', 'Low', 'Coimbatore', 'Pediatrician interested in emergency training', '+91 9876543232', 'en'),
('lead14', 'Dr. Lakshmi Devi', 'lakshmi.devi@email.com', '+91 9876543233', 'Fellowship in Emergency Medicine', 'Email Campaign', 'Lost', 'c1', 'Medium', 'Madurai', 'Decided to pursue different specialization', '+91 9876543233', 'en'),
('lead15', 'Dr. Manoj Tiwari', 'manoj.tiwari@email.com', '+91 9876543234', 'PG Diploma in Hospital Administration', 'Website', 'Converted', 'c2', 'High', 'Indore', 'Hospital administrator, successfully enrolled', '+91 9876543234', 'hi');

-- Insert sample follow-ups
INSERT INTO follow_ups (id, lead_id, date, note, counselor, next_reminder_date, completed, whatsapp_sent) VALUES
('f1', 'lead1', '2024-12-15 10:00:00+00', 'Discussed course details and career prospects. Very positive response from Dr. Ananya.', 'Dr. Priya Sharma', '2024-12-20 10:00:00+00', true, true),
('f2', 'lead2', '2024-12-14 14:30:00+00', 'Sent course brochure and fee structure. Awaiting response from Dr. Vikram.', 'Mr. Rajesh Kumar', '2024-12-18 14:30:00+00', true, true),
('f3', 'lead3', '2024-12-13 11:15:00+00', 'Scheduled call to discuss admission requirements and career opportunities.', 'Dr. Priya Sharma', '2024-12-17 11:15:00+00', false, false),
('f4', 'lead4', '2024-12-15 09:45:00+00', 'Provided detailed curriculum and faculty information. Very interested candidate.', 'Dr. Amit Patel', '2024-12-19 09:45:00+00', true, true),
('f5', 'lead9', '2024-12-12 16:20:00+00', 'Discussed pediatric surgery fellowship requirements. Excellent background.', 'Dr. Amit Patel', '2024-12-16 16:20:00+00', true, true),
('f6', 'lead10', '2024-12-11 13:30:00+00', 'BLS certification inquiry. Ready to enroll for next batch.', 'Mr. Rajesh Kumar', '2024-12-15 13:30:00+00', true, false),
('f7', 'lead11', '2024-12-10 15:45:00+00', 'Public health diploma discussion. Working in rural areas, very motivated.', 'Dr. Priya Sharma', '2024-12-14 15:45:00+00', true, true),
('f8', 'lead12', '2024-12-09 12:00:00+00', 'Critical care fellowship consultation. ICU experience is excellent.', 'Ms. Sunita Reddy', '2024-12-13 12:00:00+00', true, true);

-- Insert sample WhatsApp messages
INSERT INTO whatsapp_messages (id, lead_id, phone_number, message, message_type, status, sent_at, delivered_at, read_at) VALUES
('w1', 'lead1', '+91 9876543220', 'Hello Dr. Ananya! Thank you for your interest in our Fellowship in Emergency Medicine. I am Dr. Priya Sharma from DMHCA admissions team.', 'outgoing', 'read', '2024-12-15 10:00:00+00', '2024-12-15 10:01:00+00', '2024-12-15 10:05:00+00'),
('w2', 'lead1', '+91 9876543220', 'Thank you Dr. Sharma! I am very excited about this opportunity. Could you please share more details about the curriculum?', 'incoming', 'read', '2024-12-15 10:06:00+00', '2024-12-15 10:06:00+00', '2024-12-15 10:07:00+00'),
('w3', 'lead1', '+91 9876543220', 'Absolutely! Our fellowship covers emergency procedures, trauma management, critical care basics, and includes 6 months of hands-on training in our emergency department. Would you like me to send the detailed brochure?', 'outgoing', 'read', '2024-12-15 10:08:00+00', '2024-12-15 10:09:00+00', '2024-12-15 10:12:00+00'),
('w4', 'lead1', '+91 9876543220', 'Yes please! Also, what are the admission requirements and when is the next intake?', 'incoming', 'read', '2024-12-15 10:13:00+00', '2024-12-15 10:13:00+00', '2024-12-15 10:14:00+00'),
('w5', 'lead2', '+91 9876543221', 'नमस्ते डॉ. विक्रम! DMHCA में आपका स्वागत है। मैं राजेश कुमार हूं। Critical Care Medicine Fellowship के बारे में आपकी रुचि के लिए धन्यवाद।', 'outgoing', 'delivered', '2024-12-14 14:30:00+00', '2024-12-14 14:31:00+00', null),
('w6', 'lead2', '+91 9876543221', 'धन्यवाद राजेश जी! कृपया फीस और अवधि के बारे में जानकारी भेजें।', 'incoming', 'read', '2024-12-14 14:35:00+00', '2024-12-14 14:35:00+00', '2024-12-14 14:36:00+00'),
('w7', 'lead4', '+91 9876543223', 'హలో డాక్టర్ అర్జున్! DMHCA నుండి అమిత్ పటేల్ మాట్లాడుతున్నాను. Interventional Cardiology Fellowship గురించి మీ ఆసక్తికి ధన్యవాదాలు.', 'outgoing', 'read', '2024-12-15 09:45:00+00', '2024-12-15 09:46:00+00', '2024-12-15 09:50:00+00'),
('w8', 'lead4', '+91 9876543223', 'Thank you Dr. Patel! I am very interested. Can we schedule a call to discuss the program details?', 'incoming', 'read', '2024-12-15 09:52:00+00', '2024-12-15 09:52:00+00', '2024-12-15 09:53:00+00'),
('w9', 'lead6', '+91 9876543225', 'बधाई हो डॉ. रोहित! आपका Trauma Surgery Fellowship में एडमिशन कन्फर्म हो गया है। कल orientation के लिए आना है।', 'outgoing', 'read', '2024-12-10 16:00:00+00', '2024-12-10 16:01:00+00', '2024-12-10 16:05:00+00'),
('w10', 'lead6', '+91 9876543225', 'बहुत धन्यवाद! मैं कल 9 बजे पहुंच जाऊंगा। क्या कोई डॉक्यूमेंट लाना है?', 'incoming', 'read', '2024-12-10 16:06:00+00', '2024-12-10 16:06:00+00', '2024-12-10 16:07:00+00'),
('w11', 'lead7', '+91 9876543226', 'Hello Dr. Sneha! Thank you for your interest in ACLS Certification. We have group discounts available for hospital teams. How many participants are you planning?', 'outgoing', 'delivered', '2024-12-12 11:20:00+00', '2024-12-12 11:21:00+00', null),
('w12', 'lead10', '+91 9876543229', 'डॉ. अनिल जी, BLS Certification के लिए अगला बैच 25 दिसंबर से शुरू हो रहा है। क्या आप रजिस्टर करना चाहेंगे?', 'outgoing', 'read', '2024-12-11 13:30:00+00', '2024-12-11 13:31:00+00', '2024-12-11 13:35:00+00'),
('w13', 'lead10', '+91 9876543229', 'हां जी! मैं रजिस्टर करना चाहता हूं। पेमेंट कैसे करूं?', 'incoming', 'read', '2024-12-11 13:36:00+00', '2024-12-11 13:36:00+00', '2024-12-11 13:37:00+00'),
('w14', 'lead11', '+91 9876543230', 'Hello Dr. Deepika! Your background in rural health makes you an excellent candidate for our Public Health diploma. The program focuses on community health management.', 'outgoing', 'read', '2024-12-10 15:45:00+00', '2024-12-10 15:46:00+00', '2024-12-10 15:50:00+00'),
('w15', 'lead12', '+91 9876543231', 'డాక్టర్ సురేష్! మీ ICU అనుభవం చాలా బాగుంది. Critical Care Fellowship మీకు చాలా ఉపయోగకరంగా ఉంటుంది. వివరాలు పంపుతున్నాను.', 'outgoing', 'delivered', '2024-12-09 12:00:00+00', '2024-12-09 12:01:00+00', null);

-- Update the updated_at timestamp for leads to reflect recent activity
UPDATE leads SET updated_at = '2024-12-15 14:20:00+00' WHERE id = 'lead1';
UPDATE leads SET updated_at = '2024-12-14 16:45:00+00' WHERE id = 'lead2';
UPDATE leads SET updated_at = '2024-12-13 13:30:00+00' WHERE id = 'lead3';
UPDATE leads SET updated_at = '2024-12-15 10:15:00+00' WHERE id = 'lead4';
UPDATE leads SET updated_at = '2024-12-12 09:20:00+00' WHERE id = 'lead5';
UPDATE leads SET updated_at = '2024-12-10 14:30:00+00' WHERE id = 'lead6';
UPDATE leads SET updated_at = '2024-12-14 11:45:00+00' WHERE id = 'lead7';
UPDATE leads SET updated_at = '2024-12-11 16:20:00+00' WHERE id = 'lead8';
UPDATE leads SET updated_at = '2024-12-13 15:10:00+00' WHERE id = 'lead9';
UPDATE leads SET updated_at = '2024-12-15 12:30:00+00' WHERE id = 'lead10';
UPDATE leads SET updated_at = '2024-12-14 17:15:00+00' WHERE id = 'lead11';
UPDATE leads SET updated_at = '2024-12-13 14:45:00+00' WHERE id = 'lead12';
UPDATE leads SET updated_at = '2024-12-12 10:30:00+00' WHERE id = 'lead13';
UPDATE leads SET updated_at = '2024-12-11 15:20:00+00' WHERE id = 'lead14';
UPDATE leads SET updated_at = '2024-12-10 13:40:00+00' WHERE id = 'lead15';

-- Legacy Supabase migration. Not required for AWS PostgreSQL. For reference only.