import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
}

// Mock user database for demo purposes
const mockUsers = [
  { 
    id: 'p1', 
    name: 'John Doe', 
    email: 'patient@example.com', 
    password: 'password123', 
    role: 'patient' as const 
  },
  { 
    id: 'd1', 
    name: 'Dr. Smith', 
    email: 'doctor@example.com', 
    password: 'doctor123', 
    role: 'doctor' as const 
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  authError: null,
  
  login: async (email, password) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(user => user.email === email);
    
    if (!user) {
      set({ authError: 'User not found' });
      return;
    }
    
    if (user.password !== password) {
      set({ authError: 'Incorrect password' });
      return;
    }
    
    // Successful login
    const { password: _, ...userWithoutPassword } = user;
    set({ 
      isAuthenticated: true, 
      user: userWithoutPassword, 
      authError: null 
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  },
  
  register: async (name, email, password, role) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (mockUsers.some(user => user.email === email)) {
      set({ authError: 'Email already in use' });
      return;
    }
    
    // Create new user
    const newUser = {
      id: `${role.charAt(0)}${mockUsers.length + 1}`,
      name,
      email,
      password,
      role
    };
    
    mockUsers.push(newUser);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    set({ 
      isAuthenticated: true, 
      user: userWithoutPassword, 
      authError: null 
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('user');
  }
}));

// Initialize state from localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({ isAuthenticated: true, user });
    } catch (error) {
      localStorage.removeItem('user');
    }
  }
}