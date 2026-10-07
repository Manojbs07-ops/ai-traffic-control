const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true
};

const dbName = process.env.DB_NAME || 'traffic_violation_system';

let isRealMysql = false;
let realPool = null;

// In-Memory Fallback Database Store (Populated with Seed Data)
const memoryStore = {
  users: [],
  police_officers: [],
  vehicles: [],
  violations: [],
  payments: [],
  notifications: []
};

let autoIncrementId = 100;

async function initDatabase() {
  try {
    // Attempt real MySQL connection
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempConn.end();

    realPool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const sqlFilePath = path.join(__dirname, '../../database/traffic_system.sql');
    if (fs.existsSync(sqlFilePath)) {
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      const conn = await realPool.getConnection();
      await conn.query(sqlContent);
      conn.release();
    }

    isRealMysql = true;
    console.log(`[Database] Successfully connected to MySQL server database: ${dbName}`);

    // Run real seed
    const seed = require('./seed');
    if (typeof seed === 'function') {
      await seed();
    }
  } catch (error) {
    console.warn(`[Database Warning] MySQL Connection (${dbConfig.user}@${dbConfig.host}): ${error.message}`);
    console.log(`[Database Fallback] Initializing resilient In-Memory Traffic Database store...`);
    isRealMysql = false;
    await seedMemoryStore();
  }
}

// Seed In-Memory Fallback
async function seedMemoryStore() {
  const bcrypt = require('bcryptjs');
  const adminPass = await bcrypt.hash('admin123', 10);
  const policePass = await bcrypt.hash('police123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  memoryStore.users = [
    { id: 1, full_name: 'System Administrator', email: 'admin@traffic.gov.in', password_hash: adminPass, phone: '9876543210', address: 'Traffic HQ, City Center', role: 'admin', status: 'active', created_at: new Date() },
    { id: 2, full_name: 'Inspector R. Kumar', email: 'officer.kumar@police.gov.in', password_hash: policePass, phone: '9876543211', address: 'Central Police Station', role: 'police', status: 'active', created_at: new Date() },
    { id: 3, full_name: 'Sub-Inspector Priya Sharma', email: 'officer.priya@police.gov.in', password_hash: policePass, phone: '9876543212', address: 'West Division', role: 'police', status: 'active', created_at: new Date() },
    { id: 4, full_name: 'John Doe', email: 'john.doe@example.com', password_hash: userPass, phone: '9876543213', address: '12 Park Avenue, Metro City', role: 'citizen', status: 'active', created_at: new Date() },
    { id: 5, full_name: 'Sarah Smith', email: 'sarah.smith@example.com', password_hash: userPass, phone: '9876543214', address: '45 Green Ridge', role: 'citizen', status: 'active', created_at: new Date() }
  ];

  memoryStore.police_officers = [
    { id: 1, user_id: 2, badge_number: 'POL-4092', station_name: 'Central Police Station', rank: 'Inspector', zone: 'Central Zone' },
    { id: 2, user_id: 3, badge_number: 'POL-5011', station_name: 'West Traffic Division', rank: 'Sub-Inspector', zone: 'West Zone' }
  ];

  memoryStore.vehicles = [
    { id: 1, vehicle_number: 'TN 01 AB 1234', owner_name: 'John Doe', vehicle_type: 'Car', model: 'Honda City', color: 'Midnight Blue', registration_date: '2021-05-15' },
    { id: 2, vehicle_number: 'TN 09 CB 5678', owner_name: 'John Doe', vehicle_type: 'Two Wheeler', model: 'Yamaha FZ', color: 'Matte Black', registration_date: '2022-08-20' },
    { id: 3, vehicle_number: 'TN 02 XY 9999', owner_name: 'Sarah Smith', vehicle_type: 'Car', model: 'Hyundai Creta', color: 'Polar White', registration_date: '2023-01-10' }
  ];

  memoryStore.violations = [
    {
      id: 1,
      violation_number: 'VIO-2026-001',
      vehicle_number: 'TN 01 AB 1234',
      vehicle_type: 'Car',
      violation_type: 'Speeding',
      location: 'Anna Salai Junction, Central Sector',
      violation_date: '2026-03-01',
      violation_time: '10:30:00',
      description: 'Vehicle clocked at 92 km/h in a designated 50 km/h urban speed limit zone.',
      fine_amount: 2000.00,
      status: 'Approved',
      evidence_image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
      reported_by_police_id: 1,
      user_id: 4,
      created_at: new Date()
    },
    {
      id: 2,
      violation_number: 'VIO-2026-002',
      vehicle_number: 'TN 01 AB 1234',
      vehicle_type: 'Car',
      violation_type: 'Signal Jump',
      location: 'Mount Road Traffic Signal 4',
      violation_date: '2026-03-05',
      violation_time: '14:15:00',
      description: 'Crossed red light traffic intersection while traffic was moving.',
      fine_amount: 1500.00,
      status: 'Pending Verification',
      evidence_image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop',
      reported_by_police_id: 1,
      user_id: 4,
      created_at: new Date()
    },
    {
      id: 3,
      violation_number: 'VIO-2026-003',
      vehicle_number: 'TN 09 CB 5678',
      vehicle_type: 'Two Wheeler',
      violation_type: 'No Helmet',
      location: 'GST Road Flyover, Guindy',
      violation_date: '2026-02-18',
      violation_time: '09:45:00',
      description: 'Rider operating motor two-wheeler without standard protective headgear.',
      fine_amount: 1000.00,
      status: 'Paid',
      evidence_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
      reported_by_police_id: 2,
      user_id: 4,
      created_at: new Date()
    }
  ];

  memoryStore.payments = [
    {
      id: 1,
      payment_number: 'PAY-2026-8801',
      violation_id: 3,
      user_id: 4,
      amount: 1000.00,
      payment_method: 'UPI',
      transaction_id: 'TXN9928103948',
      payment_date: new Date(),
      status: 'PAID'
    }
  ];

  memoryStore.notifications = [
    { id: 1, user_id: 4, title: 'Violation Alert', message: 'A new violation VIO-2026-002 has been logged.', is_read: 0, created_at: new Date() }
  ];

  console.log(`[Database Fallback] In-Memory Traffic Database ready with 5 Users, 3 Vehicles & 3 Violations.`);
}

initDatabase();

// Execute query abstraction
async function query(sql, params = []) {
  if (isRealMysql && realPool) {
    try {
      return await realPool.execute(sql, params);
    } catch (err) {
      console.error('[MySQL Real Query Error]', err.message);
      // Fallback to memory on runtime pool failure
    }
  }

  // Handle SQL in Memory Store
  return executeInMemoryQuery(sql, params);
}

// In-Memory Query Engine
function executeInMemoryQuery(sql, params = []) {
  const sqlTrim = sql.trim();
  const lower = sqlTrim.toLowerCase().replace(/\s+/g, ' ');

  // --- AGGREGATE DASHBOARD QUERIES ---
  if (lower.includes('count(*) as count from users')) {
    const roleMatch = lower.includes("role = 'citizen'");
    const count = roleMatch ? memoryStore.users.filter(u => u.role === 'citizen').length : memoryStore.users.length;
    return [[{ count }]];
  }

  if (lower.includes('count(*) as count from police_officers')) {
    return [[{ count: memoryStore.police_officers.length }]];
  }

  if (lower.includes('sum(amount) as total_revenue from payments')) {
    const revenue = memoryStore.payments
      .filter(p => !p.status || p.status.toUpperCase() === 'PAID')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    return [[{ total_revenue: revenue }]];
  }

  // --- IDENTIFY PRIMARY FROM TABLE ---
  const fromMatch = lower.match(/\bfrom\s+([a-zA-Z_]+)\b/);
  const primaryTable = fromMatch ? fromMatch[1] : '';

  // 1. SELECT USERS
  if (lower.startsWith('select') && primaryTable === 'users') {
    let result = [...memoryStore.users];

    if (lower.includes('where id = ?') || lower.includes('where id=?')) {
      result = result.filter(u => u.id == params[0]);
    } else if (lower.includes('where email = ?') || lower.includes('where email=?')) {
      result = result.filter(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
    } else {
      if (lower.includes('role = ?')) {
        const roleParam = params.find(p => ['citizen', 'police', 'admin'].includes(p));
        if (roleParam) result = result.filter(u => u.role === roleParam);
      }
      if (lower.includes('like ?')) {
        const searchParam = params.find(p => typeof p === 'string' && p.startsWith('%') && p.endsWith('%'));
        if (searchParam) {
          const q = searchParam.replace(/%/g, '').toLowerCase();
          result = result.filter(u =>
            (u.full_name && u.full_name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.phone && u.phone.includes(q))
          );
        }
      }
    }
    return [result];
  }

  // 2. SELECT POLICE OFFICERS
  if (lower.startsWith('select') && primaryTable === 'police_officers') {
    let result = memoryStore.police_officers.map(po => {
      const u = memoryStore.users.find(usr => usr.id === po.user_id) || {};
      return {
        ...po,
        police_id: po.id,
        full_name: u.full_name || '',
        email: u.email || '',
        phone: u.phone || '',
        status: u.status || 'active',
        joined_at: po.created_at || new Date()
      };
    });

    if (lower.includes('where po.user_id = ?') || lower.includes('where user_id = ?')) {
      result = result.filter(p => p.user_id == params[0]);
    } else if (lower.includes('where po.id = ?') || lower.includes('where id = ?')) {
      result = result.filter(p => p.id == params[0] || p.police_id == params[0]);
    } else if (lower.includes('where badge_number = ?')) {
      result = result.filter(p => p.badge_number === params[0]);
    }
    return [result];
  }

  // 3. SELECT VEHICLES
  if (lower.startsWith('select') && primaryTable === 'vehicles') {
    let result = [...memoryStore.vehicles];
    if (lower.includes('where vehicle_number = ?')) {
      result = result.filter(v => (v.vehicle_number || '').toUpperCase() === String(params[0]).toUpperCase());
    }
    return [result];
  }

  // 4. SELECT VIOLATIONS
  if (lower.startsWith('select') && primaryTable === 'violations') {
    let result = memoryStore.violations.map(v => {
      const u = memoryStore.users.find(usr => usr.id === v.user_id) || {};
      const po = memoryStore.police_officers.find(p => p.id === v.reported_by_police_id) || {};
      const pUser = memoryStore.users.find(usr => usr.id === po.user_id) || {};
      const pay = memoryStore.payments.find(p => p.violation_id === v.id) || {};

      return {
        ...v,
        owner_name: u.full_name || 'Registered Owner',
        owner_email: u.email || '',
        owner_phone: u.phone || '',
        badge_number: po.badge_number || 'POL-DESK',
        station_name: po.station_name || 'Traffic HQ',
        rank: po.rank || 'Inspector',
        police_name: pUser.full_name || 'Officer',
        payment_id: pay.id || null,
        payment_number: pay.payment_number || null,
        transaction_id: pay.transaction_id || null,
        payment_date: pay.payment_date || null,
        payment_method: pay.payment_method || null,
        paid_amount: pay.amount || null
      };
    });

    // Single item by ID or violation_number
    if (lower.includes('v.id = ? or v.violation_number = ?') || lower.includes('where v.id = ?') || (lower.includes('where id = ?') && !lower.includes('user_id'))) {
      const target = params[0];
      result = result.filter(v => v.id == target || v.violation_number == target);
      return [result];
    }

    // Filter by Citizen user_id / registered vehicles
    if (lower.includes('user_id = ? or') || lower.includes('(v.user_id = ? or')) {
      const userId = params[0];
      const namePattern = typeof params[1] === 'string' ? params[1].replace(/%/g, '').toLowerCase() : '';
      const userVehicles = memoryStore.vehicles
        .filter(veh => (veh.owner_name && veh.owner_name.toLowerCase().includes(namePattern)) || veh.user_id == userId)
        .map(veh => (veh.vehicle_number || '').toUpperCase());

      result = result.filter(v => v.user_id == userId || userVehicles.includes((v.vehicle_number || '').toUpperCase()));
    }

    // Filter by vehicle_number exactly: e.g. "WHERE v.vehicle_number = ?"
    if (lower.includes('where v.vehicle_number = ?') || lower.includes('v.vehicle_number = ?')) {
      const vehParam = params.find(p => typeof p === 'string' && /^[A-Z0-9\s]{4,15}$/i.test(p) && !['Approved', 'Pending Verification', 'Paid', 'Rejected'].includes(p));
      if (vehParam) {
        result = result.filter(v => (v.vehicle_number || '').toUpperCase() === vehParam.trim().toUpperCase());
      }
    }

    // Filter by vehicle_number LIKE
    if (lower.includes('v.vehicle_number like ?')) {
      const likeParam = params.find(p => typeof p === 'string' && p.startsWith('%') && p.endsWith('%'));
      if (likeParam) {
        const q = likeParam.replace(/%/g, '').toUpperCase();
        result = result.filter(v => (v.vehicle_number || '').toUpperCase().includes(q));
      }
    }

    // Filter by status (literal or parameterized)
    if (lower.includes("v.status = 'pending verification'")) {
      result = result.filter(v => v.status === 'Pending Verification');
    } else if (lower.includes("v.status = 'approved' or v.status = 'paid'")) {
      result = result.filter(v => v.status === 'Approved' || v.status === 'Paid');
    } else if (lower.includes("v.status = 'rejected'")) {
      result = result.filter(v => v.status === 'Rejected');
    } else if (lower.includes('v.status = ?')) {
      const statusParam = params.find(p => ['Approved', 'Pending Verification', 'Paid', 'Rejected'].includes(p));
      if (statusParam) {
        result = result.filter(v => v.status === statusParam);
      }
    }

    // Filter by violation_type
    if (lower.includes('v.violation_type = ?')) {
      const typeParam = params.find(p => ['Speeding', 'Signal Jump', 'No Helmet', 'Drunk Driving', 'Wrong Route', 'Illegal Parking'].includes(p));
      if (typeParam) {
        result = result.filter(v => v.violation_type === typeParam);
      }
    }

    // Filter by reported_by_police_id
    if (lower.includes('v.reported_by_police_id = ?') || lower.includes('reported_by_police_id = ?')) {
      const polParam = params.find(p => typeof p === 'number' || (!isNaN(parseInt(p)) && typeof p === 'string'));
      if (polParam !== undefined) {
        result = result.filter(v => v.reported_by_police_id == polParam);
      }
    }

    // Sort by created_at DESC
    result.sort((a, b) => new Date(b.created_at || b.violation_date) - new Date(a.created_at || a.violation_date));
    return [result];
  }

  // 5. SELECT PAYMENTS
  if (lower.startsWith('select') && primaryTable === 'payments') {
    let result = memoryStore.payments.map(p => {
      const v = memoryStore.violations.find(vio => vio.id === p.violation_id) || {};
      const u = memoryStore.users.find(usr => usr.id === p.user_id) || {};
      return {
        ...p,
        violation_number: v.violation_number || 'VIO-NUM',
        violation_type: v.violation_type || 'Speeding',
        vehicle_number: v.vehicle_number || 'TN 01 AB 1234',
        violation_date: v.violation_date || new Date(),
        location: v.location || 'Metro Junction',
        paid_by_name: u.full_name || 'Citizen',
        paid_by_email: u.email || ''
      };
    });

    if (lower.includes('p.user_id = ?') || lower.includes('user_id = ?')) {
      result = result.filter(p => p.user_id == params[0]);
    }
    result.sort((a, b) => new Date(b.payment_date || 0) - new Date(a.payment_date || 0));
    return [result];
  }

  // 6. SELECT NOTIFICATIONS
  if (lower.startsWith('select') && primaryTable === 'notifications') {
    let result = [...memoryStore.notifications];
    if (lower.includes('where user_id = ?')) {
      result = result.filter(n => n.user_id == params[0]);
    }
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return [result];
  }

  // --- INSERT OPERATIONS ---
  if (lower.startsWith('insert into users')) {
    autoIncrementId++;
    let role = 'citizen';
    if (lower.includes("'police'")) role = 'police';
    else if (lower.includes("'admin'")) role = 'admin';
    else if (params[5]) role = params[5];

    const newUser = {
      id: autoIncrementId,
      full_name: params[0],
      email: params[1],
      password_hash: params[2],
      phone: params[3] || '',
      address: params[4] || '',
      role: role,
      status: 'active',
      created_at: new Date()
    };
    memoryStore.users.push(newUser);
    return [{ insertId: newUser.id, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into police_officers')) {
    autoIncrementId++;
    const newOfficer = {
      id: autoIncrementId,
      user_id: params[0],
      badge_number: params[1],
      station_name: params[2],
      rank: params[3] || 'Inspector',
      zone: params[4] || 'Central Zone',
      created_at: new Date()
    };
    memoryStore.police_officers.push(newOfficer);
    return [{ insertId: newOfficer.id, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into violations')) {
    autoIncrementId++;
    const newVio = {
      id: autoIncrementId,
      violation_number: params[0],
      vehicle_number: params[1],
      vehicle_type: params[2],
      violation_type: params[3],
      location: params[4],
      violation_date: params[5],
      violation_time: params[6],
      description: params[7],
      fine_amount: parseFloat(params[8]),
      status: params[9],
      evidence_image: params[10],
      reported_by_police_id: params[11],
      user_id: params[12],
      created_at: new Date()
    };
    memoryStore.violations.unshift(newVio);
    return [{ insertId: newVio.id, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into payments')) {
    autoIncrementId++;
    const newPay = {
      id: autoIncrementId,
      payment_number: params[0],
      violation_id: params[1],
      user_id: params[2],
      amount: parseFloat(params[3]),
      payment_method: params[4],
      transaction_id: params[5],
      payment_date: new Date(),
      status: 'PAID'
    };
    memoryStore.payments.unshift(newPay);
    return [{ insertId: newPay.id, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into notifications')) {
    autoIncrementId++;
    const newNotif = {
      id: autoIncrementId,
      user_id: params[0],
      title: params[1],
      message: params[2],
      is_read: 0,
      created_at: new Date()
    };
    memoryStore.notifications.unshift(newNotif);
    return [{ insertId: newNotif.id, affectedRows: 1 }];
  }

  // --- UPDATE OPERATIONS ---
  if (lower.startsWith('update violations')) {
    const id = params[params.length - 1];
    const item = memoryStore.violations.find(v => v.id == id);
    if (item) {
      if (lower.includes("status = 'paid'") || lower.includes("status = 'Paid'")) item.status = 'Paid';
      else if (lower.includes("status = 'approved'") || lower.includes("status = 'Approved'")) item.status = 'Approved';
      else if (lower.includes("status = 'rejected'") || lower.includes("status = 'Rejected'")) item.status = 'Rejected';
      else if (lower.includes('status = ?')) item.status = params[0];

      if (lower.includes('fine_amount = ?')) {
        const fineVal = params.find(p => typeof p === 'number' || (!isNaN(parseFloat(p)) && isFinite(p)));
        if (fineVal !== undefined) item.fine_amount = parseFloat(fineVal);
      }
    }
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith('update users')) {
    const id = params[params.length - 1];
    const u = memoryStore.users.find(usr => usr.id == id);
    if (u) {
      if (lower.includes('status = ?') && params.length === 2) {
        u.status = params[0];
      } else if (params.length > 2) {
        if (params[0]) u.full_name = params[0];
        if (params[1]) u.email = params[1];
        if (params[2]) u.phone = params[2];
        if (params[3]) u.status = params[3];
      }
    }
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith('update police_officers')) {
    const id = params[params.length - 1];
    const po = memoryStore.police_officers.find(p => p.id == id);
    if (po) {
      if (params[0]) po.badge_number = params[0];
      if (params[1]) po.station_name = params[1];
      if (params[2]) po.rank = params[2];
      if (params[3]) po.zone = params[3];
    }
    return [{ affectedRows: 1 }];
  }

  // --- DELETE OPERATIONS ---
  if (lower.startsWith('delete from violations')) {
    const id = params[0];
    memoryStore.violations = memoryStore.violations.filter(v => v.id != id);
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith('delete from users')) {
    const id = params[0];
    memoryStore.users = memoryStore.users.filter(u => u.id != id);
    return [{ affectedRows: 1 }];
  }

  if (lower.startsWith('delete from police_officers')) {
    const id = params[0];
    memoryStore.police_officers = memoryStore.police_officers.filter(p => p.id != id);
    return [{ affectedRows: 1 }];
  }

  return [[]];
}

module.exports = {
  get pool() {
    return realPool || { getConnection: async () => ({ query: async () => {}, release: () => {} }) };
  },
  query
};
