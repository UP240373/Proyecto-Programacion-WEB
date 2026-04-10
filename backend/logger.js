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

  // GET /types
  getAllTypes: (typesCount, ip, userAgent) => {
    writeLog('types_get_all', {
      action: 'GET_ALL_TYPES',
      typesCount,
      ip,
      userAgent
    });
  },

  // GET /types/{id}
  getTypeById: (typeId, found, ip, userAgent) => {
    writeLog('types_get_by_id', {
      action: 'GET_TYPES_BY_ID',
      typeId,
      found, // true/false
      ip,
      userAgent
    });
  },

  // POST /types
  createType: (typeData, newTypeId, ip, userAgent) => {
    writeLog('types_create', {
      action: 'CREATE_TYPE',
      typeData,
      newTypeId,
      ip,
      userAgent
    });
  },

  // PUT /types/{id}
  updateType: (typeId, updatedData, ip, userAgent) => {
    writeLog('types_update', {
      action: 'UPDATE_TYPE',
      typeId,
      updatedData,
      ip,
      userAgent
    });
  },

  // DELETE /types/{id}
  deleteType: (typeId, deletedTypeData, ip, userAgent) => {
    writeLog('types_delete', {
      action: 'DELETE_TYPE',
      typeId,
      deletedTypeData: {
        id: deletedTypeData?.id,
        name: deletedTypeData?.name,
        code: deletedTypeData?.code
      },
      ip,
      userAgent
    });
  },

  // GET /categories
  getAllCategories: (categoriesCount, ip, userAgent) => {
    writeLog('categories_get_all', {
      action: 'GET_ALL_CATEGORIES',
      categoriesCount,
      ip,
      userAgent
    });
  },

  // GET /tickets
  getAllTickets: (ticketsCount, ip, userAgent) => {
    writeLog('tickets_get_all', {
      action: 'GET_ALL_TICKETS',
      ticketsCount,
      ip,
      userAgent
    });
  },

  // POST /tickets
  createTicket: (ticketData, newTicketId, ip, userAgent) => {
    writeLog('tickets_create', {
      action: 'CREATE_TICKET',
      ticketData,
      newTicketId,
      ip,
      userAgent
    });
  },

  // GET /tickets/{id}
  getTicketById: (ticketId, found, ip, userAgent) => {
    writeLog('tickets_get_by_id', {
      action: 'GET_TICKET_BY_ID',
      ticketId,
      found,
      ip,
      userAgent
    });
  },

  // GET /tickets/filter
  filterTickets: (filters, resultCount, ip, userAgent) => {
    writeLog('tickets_filter', {
      action: 'FILTER_TICKETS',
      filters,
      resultCount,
      ip,
      userAgent
    });
  },

  // PUT /tickets/{id}
  updateTicket: (ticketId, updatedData, ip, userAgent) => {
    writeLog('tickets_update', {
      action: 'UPDATE_TICKET',
      ticketId,
      updatedData,
      ip,
      userAgent
    });
  },

  // PATCH /tickets/{id}/status
  updateTicketStatus: (ticketId, oldStatus, newStatus, ip, userAgent) => {
    writeLog('tickets_status', {
      action: 'UPDATE_TICKET_STATUS',
      ticketId,
      oldStatus,
      newStatus,
      ip,
      userAgent
    });
  },

  // DELETE /tickets/{id}
  deleteTicket: (ticketId, deletedTicketData, ip, userAgent) => {
    writeLog('tickets_delete', {
      action: 'DELETE_TICKET',
      ticketId,
      deletedTicketData: {
        id: deletedTicketData?.id,
        title: deletedTicketData?.title,
        status: deletedTicketData?.status
      },
      ip,
      userAgent
    });
  },

  // POST /tickets/assign
  assignTicket: (ticketId, userId, ip, userAgent) => {
    writeLog('tickets_assign', {
      action: 'ASSIGN_TICKET',
      ticketId,
      assignedTo: userId,
      ip,
      userAgent
    });
  },

  // GET /tickets/user/{id}
  getTicketsByUser: (userId, ticketsCount, ip, userAgent) => {
    writeLog('tickets_get_by_user', {
      action: 'GET_TICKETS_BY_USER',
      userId,
      ticketsCount,
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