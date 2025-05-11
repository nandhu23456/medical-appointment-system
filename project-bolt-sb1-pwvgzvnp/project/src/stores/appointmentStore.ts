import { create } from 'zustand';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  avatar: string;
  appointmentFee: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  appointmentFee: number;
}

interface AppointmentState {
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  loading: boolean;
  error: string | null;
  
  fetchDoctors: () => Promise<void>;
  fetchTimeSlots: (doctorId: string, date: string) => Promise<void>;
  fetchAppointments: (userId: string, role: 'patient' | 'doctor') => Promise<void>;
  bookAppointment: (patientId: string, patientName: string, doctorId: string, doctorName: string, date: string, timeSlot: TimeSlot, fee: number) => Promise<string>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  completePayment: (appointmentId: string, paymentDetails: PaymentDetails) => Promise<void>;
  
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Emily Smith',
    specialty: 'Cardiologist',
    available: true,
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    appointmentFee: 150
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    specialty: 'Neurologist',
    available: true,
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    appointmentFee: 180
  },
  {
    id: 'd3',
    name: 'Dr. Sarah Johnson',
    specialty: 'Pediatrician',
    available: true,
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    appointmentFee: 120
  }
];

const mockTimeSlots: TimeSlot[] = [
  { id: 't1', time: '9:00 AM', available: true },
  { id: 't2', time: '10:00 AM', available: true },
  { id: 't3', time: '11:00 AM', available: false },
  { id: 't4', time: '1:00 PM', available: true },
  { id: 't5', time: '2:00 PM', available: true },
  { id: 't6', time: '3:00 PM', available: true },
  { id: 't7', time: '4:00 PM', available: false }
];

const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorId: 'd1',
    doctorName: 'Dr. Emily Smith',
    date: '2025-06-15',
    time: '10:00 AM',
    status: 'scheduled',
    paymentStatus: 'pending',
    appointmentFee: 150
  },
  {
    id: 'a2',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorId: 'd3',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-06-20',
    time: '2:00 PM',
    status: 'confirmed',
    paymentStatus: 'paid',
    appointmentFee: 120
  }
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  doctors: [],
  timeSlots: [],
  appointments: [],
  selectedDoctor: null,
  selectedDate: null,
  selectedTimeSlot: null,
  loading: false,
  error: null,

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ doctors: mockDoctors, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch doctors', loading: false });
    }
  },

  fetchTimeSlots: async (doctorId, date) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, we would filter slots based on doctor and date
      set({ timeSlots: mockTimeSlots, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch time slots', loading: false });
    }
  },

  fetchAppointments: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter appointments based on user role
      let filteredAppointments;
      if (role === 'patient') {
        filteredAppointments = mockAppointments.filter(apt => apt.patientId === userId);
      } else {
        filteredAppointments = mockAppointments.filter(apt => apt.doctorId === userId);
      }
      
      set({ appointments: filteredAppointments, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', loading: false });
    }
  },

  bookAppointment: async (patientId, patientName, doctorId, doctorName, date, timeSlot, fee) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAppointment: Appointment = {
        id: `a${mockAppointments.length + 1}`,
        patientId,
        patientName,
        doctorId,
        doctorName,
        date,
        time: timeSlot.time,
        status: 'scheduled',
        paymentStatus: 'pending',
        appointmentFee: fee
      };
      
      mockAppointments.push(newAppointment);
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        loading: false,
        selectedDoctor: null,
        selectedDate: null,
        selectedTimeSlot: null
      }));
      
      return newAppointment.id;
    } catch (error) {
      set({ error: 'Failed to book appointment', loading: false });
      throw error;
    }
  },

  cancelAppointment: async (appointmentId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update appointment status
      const updatedAppointments = get().appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      );
      
      set({ appointments: updatedAppointments, loading: false });
    } catch (error) {
      set({ error: 'Failed to cancel appointment', loading: false });
    }
  },

  completePayment: async (appointmentId, paymentDetails) => {
    set({ loading: true, error: null });
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update appointment payment status
      const updatedAppointments = get().appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, paymentStatus: 'paid', status: 'confirmed' } : apt
      );
      
      set({ appointments: updatedAppointments, loading: false });
    } catch (error) {
      set({ error: 'Payment processing failed', loading: false });
      throw error;
    }
  },

  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot })
}));