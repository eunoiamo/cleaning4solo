import { jwtDecode } from 'jwt-decode';

// Fungsi untuk mendekode token dan mengambil userID
function getUserIDFromToken() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log('No token found in sessionStorage.');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded._id; // Asumsi payload token memiliki properti userID
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

function getUserRoleFromToken() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log('No token found in sessionStorage.');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

// Export fungsi getUserIDFromToken
export { getUserIDFromToken, getUserRoleFromToken };
