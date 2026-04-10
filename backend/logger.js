// backend/logger.js
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const writeLog = (type, data) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${type}-${dateStr}.log`);
  
  const logEntry = {
    timestamp: now.toISOString(),
    ...data
  };
  
  fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) console.error('Error writing log:', err);
  });
};

const logger = {
  // GET /users
  getAllUsers: (usersCount, ip, userAgent) => {
    writeLog('users_get_all', {
      action: 'GET_ALL_USERS',
      usersCount,
      ip,
      userAgent
    });
  },

  // GET /users/filter
  filterUsers: (filters, resultCount, ip, userAgent) => {
    writeLog('users_filter', {
      action: 'FILTER_USERS',
      filters,
      resultCount,
      ip,
      userAgent
    });
  },

  // GET /users/{id}
  getUserById: (userId, found, ip, userAgent) => {
    writeLog('users_get_by_id', {
      action: 'GET_USER_BY_ID',
      userId,
      found, // true/false
      ip,
      userAgent
    });
  },

  // POST /users
  createUser: (userData, newUserId, ip, userAgent) => {
    // No guardar contraseña en logs
    const { password, ...safeUserData } = userData;
    writeLog('users_create', {
      action: 'CREATE_USER',
      userData: safeUserData,
      newUserId,
      ip,
      userAgent
    });
  },

  // PATCH /users/{id}/status
  updateUserStatus: (userId, oldStatus, newStatus, ip, userAgent) => {
    writeLog('users_status', {
      action: 'UPDATE_USER_STATUS',
      userId,
      oldStatus,
      newStatus,
      ip,
      userAgent
    });
  },

  // PUT /users/{id}
  updateUser: (userId, updatedData, ip, userAgent) => {
    // No guardar contraseña en logs
    const { password, ...safeData } = updatedData;
    writeLog('users_update', {
      action: 'UPDATE_USER',
      userId,
      updatedData: safeData,
      ip,
      userAgent
    });
  },

  // DELETE /users/{id}
  deleteUser: (userId, deletedUserData, ip, userAgent) => {
    writeLog('users_delete', {
      action: 'DELETE_USER',
      userId,
      deletedUserData: {
        id: deletedUserData?.id,
        name: deletedUserData?.name,
        email: deletedUserData?.email
      },
      ip,
      userAgent
    });
  },

  // GET /careers
  getAllCareers: (careersCount, ip, userAgent) => {
    writeLog('careers_get_all', {
      action: 'GET_ALL_CAREERS',
      careersCount,
      ip,
      userAgent
    });
  },

  // GET /careers/filter
  filterCareers: (filters, resultCount, ip, userAgent) => {
    writeLog('careers_filter', {
      action: 'FILTER_CAREERS',
      filters,
      resultCount,
      ip,
      userAgent
    });
  },

  // GET /users/{id}
  getCareerById: (careerId, found, ip, userAgent) => {
    writeLog('users_get_by_id', {
      action: 'GET_USER_BY_ID',
      careerId,
      found, // true/false
      ip,
      userAgent
    });
  },

  // POST /careers
  createCareer: (careerData, newCareerId, ip, userAgent) => {
    writeLog('careers_create', {
      action: 'CREATE_CAREER',
      careerData,
      newCareerId,
      ip,
      userAgent
    });
  },

  // PUT /careers/{id}
  updateCareer: (careerId, updatedData, ip, userAgent) => {
    writeLog('careers_update', {
      action: 'UPDATE_CAREER',
      careerId,
      updatedData,
      ip,
      userAgent
    });
  },

  // DELETE /careers/{id}
  deleteCareer: (careerId, deletedCareerData, ip, userAgent) => {
    writeLog('careers_delete', {
      action: 'DELETE_CAREER',
      careerId,
      deletedCareerData: {
        id: deletedCareerData?.id,
        name: deletedCareerData?.name,
        code: deletedCareerData?.code
      },
      ip,
      userAgent
    });
  },

  // Error general
  error: (endpoint, error, ip) => {
    writeLog('users_error', {
      action: 'ERROR',
      endpoint,
      error: error.message,
      ip
    });
  }
};

module.exports = logger;