import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useMedicalRecordStore, MedicalRecord } from '../../stores/medicalRecordStore';
import { FileText, PlusCircle, Lock, Eye, EyeOff, Edit, Trash, AlertTriangle } from 'lucide-react';

const MedicalRecords: React.FC = () => {
  const { user } = useAuthStore();
  const { records, fetchRecords, addRecord, updateRecord, deleteRecord, validateAccessPassword } = useMedicalRecordStore();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [accessPassword, setAccessPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // New record form state
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formDoctorName, setFormDoctorName] = useState('');
  const [formAccessPassword, setFormAccessPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await fetchRecords(user.id);
        setLoading(false);
      };
      
      loadData();
    }
  }, [user, fetchRecords]);
  
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!formTitle || !formDate || !formDescription || !formDoctorName || !formAccessPassword) {
      return;
    }
    
    try {
      await addRecord({
        patientId: user.id,
        title: formTitle,
        date: formDate,
        description: formDescription,
        doctorName: formDoctorName,
        accessPassword: formAccessPassword
      });
      
      // Reset form
      setFormTitle('');
      setFormDate(new Date().toISOString().split('T')[0]);
      setFormDescription('');
      setFormDoctorName('');
      setFormAccessPassword('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add record:', error);
    }
  };
  
  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRecord) return;
    
    try {
      await updateRecord(editingRecord.id, editingRecord);
      setEditingRecord(null);
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };
  
  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteRecord(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };
  
  const handleViewRecord = async (record: MedicalRecord) => {
    setPasswordError(false);
    setViewingRecord(record);
    setAccessPassword('');
  };
  
  const checkPassword = async () => {
    if (!viewingRecord) return;
    
    const isValid = await validateAccessPassword(viewingRecord.id, accessPassword);
    
    if (isValid) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Medical Records</h1>
            <p className="mt-1 text-sm text-gray-600">
              Securely manage your medical history
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showAddForm ? (
              'Cancel'
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Record
              </>
            )}
          </button>
        </div>
        
        {/* Add New Record Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Medical Record</h2>
            <form onSubmit={handleAddRecord}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    value={formDoctorName}
                    onChange={(e) => setFormDoctorName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Access Password
                  </label>
                  <input
                    type="password"
                    id="accessPassword"
                    value={formAccessPassword}
                    onChange={(e) => setFormAccessPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Password for doctor access"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Doctors will need this password to view your medical record
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Records List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading your medical records...</p>
            </div>
          ) : records.length > 0 ? (
            records.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">{record.title}</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {' · '}{record.doctorName}
                    </p>
                    <div className="mt-2 flex items-center">
                      <Lock className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-xs text-gray-500">Password protected</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => setConfirmDelete(record.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No medical records</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't added any medical records yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add your first record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* View Record Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Medical Record Details</h3>
              <button
                onClick={() => setViewingRecord(null)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {!passwordError && accessPassword && validateAccessPassword(viewingRecord.id, accessPassword) ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-medium text-gray-900">{viewingRecord.title}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Unlocked
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(viewingRecord.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Doctor</p>
                    <p className="text-sm">{viewingRecord.doctorName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800">
                      {viewingRecord.description}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-center py-4">
                    <Lock className="h-12 w-12 mx-auto text-amber-500 mb-2" />
                    <h4 className="text-lg font-medium text-gray-900">This record is password protected</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the access password to view the details.
                    </p>
                  </div>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">Incorrect password. Please try again.</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Access Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end">
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
                      Unlock
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Edit Medical Record</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleUpdateRecord}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Record Title
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editingRecord.title}
                      onChange={(e) => setEditingRecord({...editingRecord, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="edit-date"
                      value={editingRecord.date}
                      onChange={(e) => setEditingRecord({...editingRecord, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-doctor" className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      id="edit-doctor"
                      value={editingRecord.doctorName}
                      onChange={(e) => setEditingRecord({...editingRecord, doctorName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Access Password
                    </label>
                    <input
                      type="password"
                      id="edit-password"
                      value={editingRecord.accessPassword}
                      onChange={(e) => setEditingRecord({...editingRecord, accessPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      rows={4}
                      value={editingRecord.description}
                      onChange={(e) => setEditingRecord({...editingRecord, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
              <button
                onClick={() => setConfirmDelete(null)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete this record?</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This action cannot be undone. The record will be permanently deleted.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteRecord(confirmDelete)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;