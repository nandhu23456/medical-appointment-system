import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Search, ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppointmentStore, Doctor, TimeSlot } from '../../stores/appointmentStore';

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    doctors, 
    timeSlots, 
    selectedDoctor, 
    selectedDate, 
    selectedTimeSlot,
    fetchDoctors, 
    fetchTimeSlots, 
    bookAppointment,
    setSelectedDoctor,
    setSelectedDate,
    setSelectedTimeSlot,
    loading
  } = useAppointmentStore();
  
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Calculate dates for the next 14 days
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    };
  });

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots(selectedDoctor.id, selectedDate);
    }
  }, [selectedDoctor, selectedDate, fetchTimeSlots]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter ? doctor.specialty === specialtyFilter : true;
    return matchesSearch && matchesSpecialty;
  });

  const uniqueSpecialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBooking = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      return;
    }

    try {
      const appointmentId = await bookAppointment(
        user.id,
        user.name,
        selectedDoctor.id,
        selectedDoctor.name,
        selectedDate,
        selectedTimeSlot,
        selectedDoctor.appointmentFee
      );

      setSuccessMessage('Appointment booked successfully!');
      
      // Clear form after 2 seconds and redirect to payment
      setTimeout(() => {
        navigate(`/patient/payment/${appointmentId}`);
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const goBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedTimeSlot(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedDate(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Book an Appointment</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule a visit with one of our healthcare professionals.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full px-6 pt-4">
          <div className="flex items-center w-full">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 px-2 text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Select Doctor</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Choose Date</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Book Time</span>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 my-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            {successMessage}
          </div>
        )}

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">All Specialties</option>
                {uniqueSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex p-4">
                      <div className="flex-shrink-0">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-blue-600">{doctor.specialty}</p>
                        <div className="mt-2 flex justify-between items-end">
                          <p className="text-sm text-gray-500">
                            Appointment Fee: <span className="font-semibold">${doctor.appointmentFee}</span>
                          </p>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && selectedDoctor && (
          <div className="p-6">
            <button
              onClick={goBack}
              className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
              Back to doctor selection
            </button>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-blue-600">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Select a date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {dateOptions.map((date) => (
                <button
                  key={date.value}
                  onClick={() => handleDateSelect(date.value)}
                  className={`
                    p-3 rounded-lg text-center transition-colors
                    ${date.isWeekend ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-50'}
                    ${selectedDate === date.value ? 'bg-blue-100 border border-blue-500 text-blue-700' : 'border border-gray-200'}
                  `}
                  disabled={date.isWeekend}
                >
                  <div className="text-xs uppercase font-semibold mb-1">
                    {date.label.split(',')[0]}
                  </div>
                  <div className="text-lg font-medium">
                    {date.label.split(',')[1].trim().split(' ')[1]}
                  </div>
                  <div className="text-xs">
                    {date.label.split(',')[1].trim().split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && selectedDoctor && selectedDate && (
          <div className="p-6">
            <button
              onClick={goBack}
              className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
              Back to date selection
            </button>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-blue-600">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Calendar className="inline-block h-4 w-4 mr-1" />
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Select a time</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading available times...</p>
              </div>
            ) : timeSlots.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={!slot.available}
                      className={`
                        p-3 rounded-lg text-center transition-colors border
                        ${!slot.available
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : selectedTimeSlot?.id === slot.id
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-gray-200 hover:bg-blue-50'
                        }
                      `}
                    >
                      <div className="flex justify-center items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{slot.time}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Appointment Fee:</span>
                    <span className="text-lg font-semibold text-gray-900">${selectedDoctor.appointmentFee.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={!selectedTimeSlot || loading}
                    className={`
                      w-full py-3 px-4 rounded-md font-medium text-white 
                      flex justify-center items-center
                      ${selectedTimeSlot && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        : 'bg-gray-300 cursor-not-allowed'
                      }
                      transition-colors
                    `}
                  >
                    {loading ? (
                      <>
                        <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No available time slots for this date.</p>
                <button
                  onClick={goBack}
                  className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select a different date
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;