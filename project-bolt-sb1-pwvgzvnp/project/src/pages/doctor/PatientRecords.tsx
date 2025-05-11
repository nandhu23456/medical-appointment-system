import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMedicalRecordStore, MedicalRecord } from '../../stores/medicalRecordStore';
import { File, Lock, Eye, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';

const PatientRecords: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { records, fetchRecords, loading, validateAccessPassword } = useMedicalRecordStore();
  
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [accessPassword, setAccessPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [unlockedRecords, setUnlockedRecords] = useState<string[]>([]);
  
  useEffect(() => {
    if (patientId) {
      fetchRecords(patientId);
    }
  }, [patientId, fetchRecords]);
  
  const handleViewRecord = (record: MedicalRecord) => {
    setPasswordError(false);
    setViewingRecord(record);
    setAccessPassword('');
  };
  
  const checkPassword = async () => {
    if (!viewingRecord) return;
    
    const isValid = await validateAccessPassword(viewingRecord.id, accessPassword);
    
    if (isValid) {
      setPasswordError(false);
      setUnlockedRecords(prev => [...prev, viewingRecord.id]);
      setAccessPassword('');
    } else {
      setPasswordError(true);
    }
  };
  
  const isRecordUnlocked = (recordId: string) => {
    return unlockedRecords.includes(recordId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to appointments
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Patient Medical Records</h1>
          <p className="mt-1 text-sm text-gray-600">
            Patient ID: {patientId}
          </p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading patient records...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className={`border rounded-lg overflow-hidden transition-shadow ${
                    isRecordUnlocked(record.id) ? 'border-green-300 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <File className={`h-5 w-5 mr-2 ${isRecordUnlocked(record.id) ? 'text-green-600' : 'text-blue-500'}`} />
                        <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                      </div>
                      {isRecordUnlocked(record.id) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {isRecordUnlocked(record.id) ? (
                      <div className="mt-4 bg-white p-3 rounded border border-green-200 text-sm text-gray-800">
                        {record.description}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          This record is password protected. You need the access password to view it.
                        </p>
                        <button
                          onClick={() => handleViewRecord(record)}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Enter password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <File className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              This patient has not added any medical records yet.
            </p>
          </div>
        )}
      </div>
      
      {/* Password Entry Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Access Medical Record</h3>
              <button
                onClick={() => setViewingRecord(null)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-4">
                <Lock className="h-12 w-12 mx-auto text-amber-500 mb-2" />
                <h4 className="text-lg font-medium text-gray-900">{viewingRecord.title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  This record requires a password for access.
                </p>
              </div>
              
              {passwordError && (
                <div className="mb-4 p-3 rounded-md bg-red-50 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">Incorrect password. Please try again.</p>
                </div>
              )}
              
              <div className="mt-4">
                <label htmlFor="doctor-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Password
                </label>
                <input
                  type="password"
                  id="doctor-password"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setViewingRecord(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={checkPassword}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Unlock Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;