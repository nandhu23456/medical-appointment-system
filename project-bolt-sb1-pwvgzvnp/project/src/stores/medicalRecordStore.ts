import { create } from 'zustand';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  date: string;
  description: string;
  doctorName: string;
  accessPassword: string;
}

interface MedicalRecordState {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  
  fetchRecords: (patientId: string) => Promise<void>;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  validateAccessPassword: (recordId: string, password: string) => Promise<boolean>;
}

// Mock data
const mockRecords: MedicalRecord[] = [
  {
    id: 'r1',
    patientId: 'p1',
    title: 'Annual Physical Examination',
    date: '2025-02-15',
    description: 'Patient is in good health. Blood pressure: 120/80, Heart rate: 72 bpm. No significant findings.',
    doctorName: 'Dr. Emily Smith',
    accessPassword: 'health123'
  },
  {
    id: 'r2',
    patientId: 'p1',
    title: 'Flu Treatment',
    date: '2025-01-10',
    description: 'Patient presented with fever, cough, and sore throat. Diagnosed with influenza A. Prescribed Tamiflu and recommended rest.',
    doctorName: 'Dr. Sarah Johnson',
    accessPassword: 'flu456'
  }
];

export const useMedicalRecordStore = create<MedicalRecordState>((set, get) => ({
  records: [],
  loading: false,
  error: null,
  
  fetchRecords: async (patientId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const patientRecords = mockRecords.filter(record => record.patientId === patientId);
      set({ records: patientRecords, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch medical records', loading: false });
    }
  },
  
  addRecord: async (record) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const newRecord = {
        ...record,
        id: `r${mockRecords.length + 1}`
      };
      
      mockRecords.push(newRecord);
      set(state => ({ 
        records: [...state.records, newRecord],
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to add medical record', loading: false });
    }
  },
  
  updateRecord: async (id, updatedFields) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update record in mock database
      const recordIndex = mockRecords.findIndex(record => record.id === id);
      if (recordIndex !== -1) {
        mockRecords[recordIndex] = { ...mockRecords[recordIndex], ...updatedFields };
      }
      
      // Update state
      const updatedRecords = get().records.map(record => 
        record.id === id ? { ...record, ...updatedFields } : record
      );
      
      set({ records: updatedRecords, loading: false });
    } catch (error) {
      set({ error: 'Failed to update medical record', loading: false });
    }
  },
  
  deleteRecord: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from mock database
      const recordIndex = mockRecords.findIndex(record => record.id === id);
      if (recordIndex !== -1) {
        mockRecords.splice(recordIndex, 1);
      }
      
      // Update state
      set(state => ({ 
        records: state.records.filter(record => record.id !== id),
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to delete medical record', loading: false });
    }
  },
  
  validateAccessPassword: async (recordId, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const record = mockRecords.find(r => r.id === recordId);
      
      if (!record) {
        return false;
      }
      
      return record.accessPassword === password;
    } catch (error) {
      set({ error: 'Failed to validate password', loading: false });
      return false;
    }
  }
}));