// Centralized API client for Cleaning Buddy frontend

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Generic GET request helper
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Generic POST request helper
export const apiPost = async <T = any>(endpoint: string, data?: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Specific API endpoints for better type safety
export const api = {
  // GET endpoints
  getRooms: () => apiGet<{ rooms: any[] }>('/api/rooms'),
  getTaskTemplates: (roomId: number) => apiGet<{ tasks: any[] }>(`/api/task-templates/${roomId}`),
  getCleaningTips: () => apiGet<{ tips: any[] }>('/api/cleaning-tips'),
  getUser: (userId: number) => apiGet<{ user: any }>(`/api/users/${userId}`),
  
  // POST endpoints
  createQuizResponse: (data: { user_id: number; question_id: number; option_id: number; free_text_response?: string }) =>
    apiPost('/api/quiz-responses', data),
};
