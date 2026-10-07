const bcrypt = require('bcryptjs');
const db = require('./db');

async function seedData() {
  console.log('[Seed] Starting database seeding process...');

  try {
    const pool = db.pool;
    const conn = await pool.getConnection();

    // 1. Password Hashes
    const adminPass = await bcrypt.hash('admin123', 10);
    const policePass = await bcrypt.hash('police123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    // 2. Insert Users
    const usersData = [
      ['System Administrator', 'admin@traffic.gov.in', adminPass, '9876543210', 'Traffic Headquarters, City Center', 'admin', 'active'],
      ['Inspector R. Kumar', 'officer.kumar@police.gov.in', policePass, '9876543211', 'Central Police Station, Sector 4', 'police', 'active'],
      ['Sub-Inspector Priya Sharma', 'officer.priya@police.gov.in', policePass, '9876543212', 'West Traffic Division, Sector 9', 'police', 'active'],
      ['John Doe', 'john.doe@example.com', userPass, '9876543213', '12 Park Avenue, Metro City', 'citizen', 'active'],
      ['Sarah Smith', 'sarah.smith@example.com', userPass, '9876543214', '45 Green Ridge, South District', 'citizen', 'active']
    ];

    for (const user of usersData) {
      await conn.query(
        `INSERT INTO users (full_name, email, password_hash, phone, address, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password_hash=VALUES(password_hash), role=VALUES(role)`,
        user
      );
    }
    console.log('[Seed] Users inserted/updated successfully.');

    // Fetch user IDs
    const [adminRows] = await conn.query("SELECT id FROM users WHERE email = 'admin@traffic.gov.in'");
    const [police1Rows] = await conn.query("SELECT id FROM users WHERE email = 'officer.kumar@police.gov.in'");
    const [police2Rows] = await conn.query("SELECT id FROM users WHERE email = 'officer.priya@police.gov.in'");
    const [johnRows] = await conn.query("SELECT id FROM users WHERE email = 'john.doe@example.com'");
    const [sarahRows] = await conn.query("SELECT id FROM users WHERE email = 'sarah.smith@example.com'");

    const police1UserId = police1Rows[0]?.id;
    const police2UserId = police2Rows[0]?.id;
    const johnUserId = johnRows[0]?.id;
    const sarahUserId = sarahRows[0]?.id;

    // 3. Insert Police Officers
    if (police1UserId) {
      await conn.query(
        `INSERT INTO police_officers (user_id, badge_number, station_name, rank, zone)
         VALUES (?, 'POL-4092', 'Central Police Station', 'Inspector', 'Central Zone')
         ON DUPLICATE KEY UPDATE station_name=VALUES(station_name), rank=VALUES(rank)`,
        [police1UserId]
      );
    }

    if (police2UserId) {
      await conn.query(
        `INSERT INTO police_officers (user_id, badge_number, station_name, rank, zone)
         VALUES (?, 'POL-5011', 'West Traffic Division', 'Sub-Inspector', 'West Zone')
         ON DUPLICATE KEY UPDATE station_name=VALUES(station_name), rank=VALUES(rank)`,
        [police2UserId]
      );
    }
    console.log('[Seed] Police officers inserted/updated.');

    // Fetch Police Officer IDs
    const [po1] = await conn.query("SELECT id FROM police_officers WHERE badge_number = 'POL-4092'");
    const [po2] = await conn.query("SELECT id FROM police_officers WHERE badge_number = 'POL-5011'");
    const policeOfficer1Id = po1[0]?.id;
    const policeOfficer2Id = po2[0]?.id;

    // 4. Insert Vehicles
    const vehiclesData = [
      ['TN 01 AB 1234', 'John Doe', 'Car', 'Honda City', 'Midnight Blue', '2021-05-15'],
      ['TN 09 CB 5678', 'John Doe', 'Two Wheeler', 'Yamaha FZ', 'Matte Black', '2022-08-20'],
      ['TN 02 XY 9999', 'Sarah Smith', 'Car', 'Hyundai Creta', 'Polar White', '2023-01-10'],
      ['MH 12 DL 4321', 'Rajesh Patel', 'Commercial Truck', 'Tata Signa', 'Yellow', '2019-11-05']
    ];

    for (const v of vehiclesData) {
      await conn.query(
        `INSERT INTO vehicles (vehicle_number, owner_name, vehicle_type, model, color, registration_date)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE owner_name=VALUES(owner_name), model=VALUES(model)`,
        v
      );
    }
    console.log('[Seed] Vehicles inserted/updated.');

    // 5. Insert Violations
    const violationsData = [
      [
        'VIO-2026-001',
        'TN 01 AB 1234',
        'Car',
        'Speeding',
        'Anna Salai Junction, Central Sector',
        '2026-03-01',
        '10:30:00',
        'Vehicle clocked at 92 km/h in a designated 50 km/h urban speed limit zone.',
        2000.00,
        'Approved',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
        policeOfficer1Id,
        johnUserId
      ],
      [
        'VIO-2026-002',
        'TN 01 AB 1234',
        'Car',
        'Signal Jump',
        'Mount Road Traffic Signal 4',
        '2026-03-05',
        '14:15:00',
        'Crossed red light traffic intersection while traffic was moving.',
        1500.00,
        'Pending Verification',
        'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop',
        policeOfficer1Id,
        johnUserId
      ],
      [
        'VIO-2026-003',
        'TN 09 CB 5678',
        'Two Wheeler',
        'No Helmet',
        'GST Road Flyover, Guindy',
        '2026-02-18',
        '09:45:00',
        'Rider operating motor two-wheeler without standard protective headgear.',
        1000.00,
        'Paid',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
        policeOfficer2Id,
        johnUserId
      ],
      [
        'VIO-2026-004',
        'TN 02 XY 9999',
        'Car',
        'Wrong Parking',
        'T-Nagar Commercial Plaza Road',
        '2026-03-08',
        '16:20:00',
        'Parked in no-parking tow-away zone obstructing emergency access lane.',
        500.00,
        'Approved',
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop',
        policeOfficer2Id,
        sarahUserId
      ],
      [
        'VIO-2026-005',
        'MH 12 DL 4321',
        'Commercial Truck',
        'Drunk Driving',
        'NH-44 Toll Plaza Checkpoint',
        '2026-03-10',
        '23:10:00',
        'Breathalyzer test recorded 0.08% BAC exceeding maximum allowable legal limits.',
        10000.00,
        'Approved',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
        policeOfficer1Id,
        null
      ],
      [
        'VIO-2026-006',
        'TN 01 AB 1234',
        'Car',
        'Mobile Phone Usage',
        'Kamarajar Salai Beach Road',
        '2026-02-10',
        '18:30:00',
        'Driver holding and speaking on mobile phone while driving through intersection.',
        1500.00,
        'Rejected',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop',
        policeOfficer2Id,
        johnUserId
      ]
    ];

    for (const vio of violationsData) {
      await conn.query(
        `INSERT INTO violations (
          violation_number, vehicle_number, vehicle_type, violation_type, location,
          violation_date, violation_time, description, fine_amount, status,
          evidence_image, reported_by_police_id, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status), fine_amount=VALUES(fine_amount)`,
        vio
      );
    }
    console.log('[Seed] Violations inserted/updated.');

    // Fetch Violation ID for VIO-2026-003
    const [vioPaidRows] = await conn.query("SELECT id FROM violations WHERE violation_number = 'VIO-2026-003'");
    const paidVioId = vioPaidRows[0]?.id;

    if (paidVioId && johnUserId) {
      await conn.query(
        `INSERT INTO payments (payment_number, violation_id, user_id, amount, payment_method, transaction_id, status)
         VALUES ('PAY-2026-8801', ?, ?, 1000.00, 'UPI', 'TXN9928103948', 'PAID')
         ON DUPLICATE KEY UPDATE status='PAID'`,
        [paidVioId, johnUserId]
      );
      console.log('[Seed] Sample payment inserted/updated.');
    }

    // 6. Insert Notifications
    if (johnUserId) {
      await conn.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES
         (?, 'Violation Alert', 'A new violation VIO-2026-002 has been logged for vehicle TN 01 AB 1234.'),
         (?, 'Payment Confirmation', 'Payment of ₹1,000.00 for violation VIO-2026-003 was successfully received.')`,
        [johnUserId, johnUserId]
      );
      console.log('[Seed] Notifications inserted.');
    }

    conn.release();
    console.log('[Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
  }
}

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
