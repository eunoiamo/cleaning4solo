class Cleaning4SoloAPI {
  static async eventAPI() {
    const response = await fetch(`${process.env.BASE_URL}/events`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async createEvent(event) {
    const response = await fetch(`${process.env.BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    return response.json();
  }

  static async deleteEventById(id) {
    const response = await fetch(`${process.env.BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    return response.json();
  }

  static async updateEvent(id, event) {
    const response = await fetch(`${process.env.BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    return response.json();
  }

  static async updateBlog(id, blog) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token is not available. Please log in again.');
    }

    const response = await fetch(`${process.env.BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify(blog),
    });
    if (!response.ok) {
      throw new Error('Failed to delete Blog');
    }
    return response.json();
  }

  static async blogAPI() {
    const response = await fetch(`${process.env.BASE_URL}/blogs`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getAllGalleries() {
    const response = await fetch(`${process.env.BASE_URL}/galleries`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async createGallery(imageUrl, category) {
    const response = await fetch(`${process.env.BASE_URL}/galleries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, category }),
    });
    return response.json();
  }

  static async deleteGalleryById(galleryId) {
    const response = await fetch(`${process.env.BASE_URL}/galleries/${galleryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    return response.json();
  }

  static async getDetailBlog(id) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/blogs/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

  static async getDetailEvent(id) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/events/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

  static async signup(username, email, password) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during signup:', error.message);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during login:', error.message);
      throw error;
    }
  }

  static async joinVolunteer(userId, eventId) {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token is not available. Please log in again.');
      }

      const response = await fetch(`${process.env.BASE_URL}/volunteer/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gagal mengunggah data: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error during joining event:', error.message);
      throw error;
    }
  }

  static async getDetaiVolunteer(id) {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token is not available. Please log in again.');
      }
      const response = await fetch(`${process.env.BASE_URL}/volunteer/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

  static async deleteVolunteerEvent(userId, eventId) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/volunteer/${userId}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus event');
      }
      return await response.json();
    } catch (error) {
      console.error('Error during deleting event:', error.message);
      throw error;
    }
  }

  static async getUser() {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token is not available. Please log in again.');
      }
      const response = await fetch(`${process.env.BASE_URL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Fetch error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

  static async deleteUserId(userId) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus user');
      }
      return await response.json(); // Sesuaikan ini sesuai dengan respons server Anda
    } catch (error) {
      console.error('Error during deleting user:', error.message);
      throw error;
    }
  }

  static async createBlog(title, image, content) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, image, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during blog creation:', error.message);
      throw error;
    }
  }

  static async deleteBlogId(blogId) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error.message);
      throw error;
    }
  }


  static async getAllValues() {
    const response = await fetch(`${process.env.BASE_URL}/value`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async createWasteValue(jenisSampah, harga, emisi) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/value`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jenisSampah, harga, emisi }),
      });

      if (!response.ok) {
        throw new Error('Failed to create waste');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during waste creation:', error.message);
      throw error;
    }
  }

  static async deleteWasteValue(wasteValueId) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/value/${wasteValueId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete waste');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error.message);
      throw error;
    }
  }

  static async updateWasteValue(id, value) {
    const response = await fetch(`${process.env.BASE_URL}/value/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      throw new Error('Failed to update Waste');
    }
    return response.json();
  }

  static async getDetailValue(id) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/value/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

}

export default Cleaning4SoloAPI;
