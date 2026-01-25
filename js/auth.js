/**
 * AIByJob Auth Module
 * Handles user registration, login, and session management
 * Supports both localStorage and SQL database authentication
 * 
 * CROSS-SITE LOGIN: Any AIUNITES user can login to any site
 * NEW USERS: Tagged with this site's SITE_ID
 */

const Auth = {
  SITE_ID: 'AIByJob',
  
  /**
   * Register new user
   * Saves to both localStorage and SQL database (if available)
   * New users are tagged with this site's SITE_ID
   */
  async signup(displayName, username, email, password) {
    if (!displayName || displayName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if username exists in localStorage
    if (Storage.getUserByUsername(username)) {
      throw new Error('Username already taken');
    }
    
    // Check if username exists in SQL database (any site)
    if (this.checkUsernameInSQL(username)) {
      throw new Error('Username already taken');
    }

    // Create user in localStorage
    const user = Storage.createUser({
      displayName,
      username,
      email,
      password
    });

    // Also save to SQL database if available (tagged with this site)
    await this.saveUserToSQL(user, password);

    Storage.setCurrentUser(user.username);
    return user;
  },

  /**
   * Check if username exists in SQL database (any site - global uniqueness)
   */
  checkUsernameInSQL(username) {
    if (typeof SQLDatabase === 'undefined' || !SQLDatabase.isLoaded || !SQLDatabase.db) {
      return false;
    }
    
    try {
      const stmt = SQLDatabase.db.prepare(
        `SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`
      );
      stmt.bind([username]);
      const exists = stmt.step();
      stmt.free();
      return exists;
    } catch (e) {
      console.warn('[Auth] SQL username check failed:', e.message);
      return false;
    }
  },

  /**
   * Save user to SQL database with password hashing
   */
  async saveUserToSQL(user, password) {
    if (typeof SQLDatabase === 'undefined' || !SQLDatabase.isLoaded || !SQLDatabase.db) {
      return false;
    }
    
    try {
      // Ensure users table exists
      SQLDatabase.ensureUsersTable();
      
      // Hash password
      const passwordHash = await SQLDatabase.hashPassword(password);
      
      SQLDatabase.db.run(`
        INSERT INTO users (username, password_hash, display_name, email, role, created_at, site)
        VALUES (?, ?, ?, ?, ?, datetime('now'), ?)
      `, [
        user.username.toLowerCase(),
        passwordHash,
        user.displayName,
        user.email || '',
        user.isAdmin ? 'admin' : 'user',
        this.SITE_ID
      ]);
      
      SQLDatabase.autoSave();
      console.log('[Auth] User saved to SQL database:', user.username, 'for site:', this.SITE_ID);
      return true;
    } catch (e) {
      console.warn('[Auth] Failed to save user to SQL:', e.message);
      return false;
    }
  },

  /**
   * Login user
   * CROSS-SITE: Checks SQL database first (no site filter), then localStorage
   * Any AIUNITES user can login to any site
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Please enter username and password');
    }

    // Try SQL database FIRST if available (shared AIUNITES database - NO site filter)
    if (typeof SQLDatabase !== 'undefined' && SQLDatabase.isLoaded && SQLDatabase.db) {
      try {
        const stmt = SQLDatabase.db.prepare(
          `SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`
        );
        stmt.bind([username]);
        
        if (stmt.step()) {
          const dbUser = stmt.getAsObject();
          stmt.free();
          
          // Check password - support both hashed and plain text
          const storedPassword = dbUser.password_hash || dbUser.password || '';
          let passwordMatch = false;
          
          // Try hashed comparison first
          if (storedPassword.length === 64) {
            // Looks like SHA-256 hash
            const inputHash = await SQLDatabase.hashPassword(password);
            passwordMatch = (storedPassword === inputHash);
          }
          
          // Fall back to plain text comparison
          if (!passwordMatch) {
            passwordMatch = (storedPassword === password);
          }
          
          if (!passwordMatch) {
            throw new Error('Incorrect password');
          }
          
          // Create localStorage user from DB user for session
          const user = Storage.createUser({
            displayName: dbUser.display_name || dbUser.displayName || username,
            username: dbUser.username,
            email: dbUser.email || '',
            password: password,
            isAdmin: dbUser.role === 'admin'
          });
          
          console.log('[Auth] User authenticated from SQL database:', username, '(registered on:', dbUser.site || 'unknown', ')');
          
          if (typeof App !== 'undefined' && App.showToast) {
            App.showToast('🐙 Logged in from AIUNITES database!', 'success');
          }
          
          Storage.setCurrentUser(user.username);
          return user;
        } else {
          stmt.free();
        }
      } catch (dbError) {
        if (dbError.message === 'Incorrect password') {
          throw dbError;
        }
        console.warn('[Auth] SQL database lookup failed:', dbError.message);
        // Continue to localStorage fallback
      }
    }
    
    // Fallback to localStorage (for offline/localhost use)
    let user = Storage.getUserByUsername(username);
    
    if (user) {
      // Found in localStorage - check password
      if (user.password !== password) {
        throw new Error('Incorrect password');
      }
      Storage.setCurrentUser(user.username);
      return user;
    }
    
    throw new Error('User not found');
  },

  /**
   * Demo login
   * Tries SQL database first for demo user, then creates local demo
   */
  async loginDemo() {
    const demo = APP_CONFIG.defaultDemo;
    
    // Try to login (will check SQL database too)
    try {
      return await this.login(demo.username, demo.password);
    } catch (e) {
      // If demo user doesn't exist anywhere, create it locally
      console.log('[Auth] Creating local demo user');
      const user = Storage.createUser({
        displayName: demo.displayName,
        username: demo.username,
        email: demo.email,
        password: demo.password,
        isAdmin: demo.isAdmin
      });
      Storage.setCurrentUser(user.username);
      return user;
    }
  },

  /**
   * Logout current user
   */
  logout() {
    Storage.clearCurrentUser();
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return Storage.getCurrentUser() !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  /**
   * Check if current user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.isAdmin === true;
  },

  /**
   * Update user profile
   */
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    // Update in localStorage
    const updatedUser = Storage.updateUser(user.username, updates);
    
    // Also update in SQL database if available
    this.updateUserInSQL(user.username, updates);
    
    return updatedUser;
  },
  
  /**
   * Update user in SQL database
   */
  updateUserInSQL(username, updates) {
    if (typeof SQLDatabase === 'undefined' || !SQLDatabase.isLoaded || !SQLDatabase.db) {
      return false;
    }
    
    try {
      const fields = [];
      const values = [];
      
      if (updates.displayName) {
        fields.push('display_name = ?');
        values.push(updates.displayName);
      }
      if (updates.email !== undefined) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      
      if (fields.length === 0) return false;
      
      values.push(username);
      
      SQLDatabase.db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE LOWER(username) = LOWER(?)`,
        values
      );
      
      SQLDatabase.autoSave();
      console.log('[Auth] User updated in SQL database:', username);
      return true;
    } catch (e) {
      console.warn('[Auth] Failed to update user in SQL:', e.message);
      return false;
    }
  },

  /**
   * Update user settings
   */
  updateSettings(settings) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    const updatedSettings = { ...user.settings, ...settings };
    return Storage.updateUser(user.username, { settings: updatedSettings });
  }
};
