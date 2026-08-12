const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || 'Request failed')
  }
  return res.json()
}

export const authService = {
  async login(email, password) {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Unknown error' }))
      // Pass the raw detail string as error message so LoginPage can catch PENDING / REJECTED / UNVERIFIED
      throw new Error(error.detail || 'بيانات الدخول غير صحيحة')
    }
    return res.json()
  },

  async register(name, email, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  async verifyEmail(email, code) {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  },
}

export const issuesService = {
  async getAll(category, userId, page = 1, limit = 10) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (userId) params.append('creator_id', userId)
    params.append('page', page)
    params.append('limit', limit)
    return apiRequest(`/issues/?${params.toString()}`)
  },

  async getCount(category, userId) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (userId) params.append('creator_id', userId)
    return apiRequest(`/issues/count?${params.toString()}`)
  },

  async create(formData) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/issues/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error('فشل إنشاء الإشكالية')
    return res.json()
  },

  async close(issueId) {
    return apiRequest(`/issues/${issueId}/close`, { method: 'PATCH' })
  },

  async cycleStatus(issueId) {
    return apiRequest(`/issues/${issueId}/cycle-status`, { method: 'PATCH' })
  },

  async aiSearch(query) {
    return apiRequest('/issues/ai-search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  },

  async addComment(issueId, text) {
    return apiRequest(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  },
}

export const dashboardService = {
  async getStats() {
    return apiRequest('/dashboard/stats')
  },

  async exportReport(startDate, endDate) {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    const q = params.toString() ? `?${params.toString()}` : ''
    
    const res = await fetch(`${BASE_URL}/dashboard/export${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Export failed')
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `تقرير_سجلات_المصنع_${startDate || 'من'}_إلى_${endDate || 'إلى'}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  },

  async getAiReport(customPrompt) {
    const q = customPrompt ? `?custom_prompt=${encodeURIComponent(customPrompt)}` : ''
    return apiRequest(`/dashboard/ai-report${q}`)
  },
}

export const notificationsService = {
  async getAll() {
    return apiRequest('/notifications')
  },
  async getUnreadCount() {
    return apiRequest('/notifications/unread-count')
  },
  async markRead(id) {
    return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
  },
  async markAllRead() {
    return apiRequest('/notifications/read-all', { method: 'PATCH' })
  },
  async delete(id) {
    return apiRequest(`/notifications/${id}`, { method: 'DELETE' })
  },
  async generateSmartAlerts() {
    return apiRequest('/notifications/generate-smart-alerts', { method: 'POST' })
  },
}

export const adminService = {
  async getUsers() {
    return apiRequest('/admin/users')
  },
  async updateRole(userId, role) {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  },
  async approveUser(userId, category) {
    return apiRequest(`/admin/users/${userId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ category })
    })
  },
  async rejectUser(userId) {
    return apiRequest(`/admin/users/${userId}/reject`, { method: 'POST' })
  },
  async updatePermissions(userId, permissions) {
    return apiRequest(`/admin/users/${userId}/permissions`, {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
    })
  },
  async deleteUser(userId) {
    return apiRequest(`/admin/users/${userId}`, { method: 'DELETE' })
  },
  async deleteIssue(issueId) {
    return apiRequest(`/admin/issues/${issueId}`, { method: 'DELETE' })
  },
  async getArchivedIssues() {
    return apiRequest('/admin/archived-issues')
  },
  async archiveIssue(issueId) {
    return apiRequest(`/admin/issues/${issueId}/archive`, { method: 'PATCH' })
  },
  async shareIssue(issueId, category) {
    return apiRequest(`/issues/${issueId}/share`, {
      method: 'POST',
      body: JSON.stringify({ category })
    })
  },
}
