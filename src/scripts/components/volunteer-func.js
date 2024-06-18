import cleaning4soloAPI from '../data/cleaning4soloAPI';
import { getUserIDFromToken } from './decodeUserID';
import { showSuccessAlert, showErrorAlert } from './allertMessage';

const token = sessionStorage.getItem('token');

async function setupJoinEventListeners(eventID) {
  const eventId = eventID;

  if (!token) {
    showErrorAlert('You need to be logged in to join an event.');
    return;
  }

  const userId = getUserIDFromToken(token);
  if (!userId) {
    showErrorAlert('Invalid token. Please log in again.');
    return;
  }

  try {
    const response = await cleaning4soloAPI.joinVolunteer(userId, eventId);
    showSuccessAlert(response.message);
  } catch (err) {
    showErrorAlert(err.message);
  }
}

async function deleteItemVolunteer(eventID) {
  const eventId = eventID;

  if (!token) {
    showErrorAlert('You need to be logged in to join an event.');
    return;
  }

  const userId = getUserIDFromToken(token);
  if (!userId) {
    showErrorAlert('Invalid token. Please log in again.');
    return;
  }

  try {
    const response = await cleaning4soloAPI.deleteVolunteerEvent(userId, eventId);
    showSuccessAlert(response.message);
  } catch (err) {
    showErrorAlert(err.message);
  }
}

export { setupJoinEventListeners, deleteItemVolunteer };
