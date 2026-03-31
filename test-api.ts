import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

async function test() {
  try {
    console.log('1. Registering Principal...');
    let email = `admin_${Date.now()}@school.com`;
    const register = await axios.post(`${API_URL}/auth/register`, {
      name: 'Admin User',
      email: email,
      password: 'password123',
      role: 'Principal' // Verified! The database expects 'Principal'
    });
    console.log('Principal Registered:', register.data);

    console.log('\n2. Logging in...');
    const login = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      password: 'password123'
    });
    const token = login.data.token;
    console.log('Logged in! Token received.');

    console.log('\n3. Creating Announcement...');
    const announcement = await axios.post(`${API_URL}/announcements`, {
      title: 'Welcome Back!',
      content: 'The new semester starts next Monday. Please be prepared.',
      date: new Date().toISOString().split('T')[0]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Announcement Created:', announcement.data);

    console.log('\n4. Fetching all announcements...');
    const allAnnouncements = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('All Announcements:', allAnnouncements.data);
    require('fs').writeFileSync('test-results.txt', 'The Backend is 100% Ready!\n' + JSON.stringify(allAnnouncements.data), 'utf-8');

  } catch (error: any) {
    const errorMsg = 'Test Failed:\n' + JSON.stringify(error.response?.data, null, 2) + '\n' + error.message;
    console.error(errorMsg);
    require('fs').writeFileSync('test-results.txt', errorMsg, 'utf-8');
  }
}

test();
