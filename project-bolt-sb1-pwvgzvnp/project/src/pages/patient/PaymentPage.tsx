import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointmentStore, Appointment, PaymentDetails } from '../../stores/appointmentStore';
import { CreditCard, Calendar, Clock, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { appointments, completePayment } = useAppointmentStore();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  useEffect(() => {
    if (appointmentId) {
      const foundAppointment = appointments.find(apt => apt.id === appointmentId);
      if (foundAppointment) {
        setAppointment(foundAppointment);
      } else {
        // Handle appointment not found
        navigate('/patient');
      }
    }
  }, [appointmentId, appointments, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointment) return;
    
    setPaymentError(null);
    setIsProcessing(true);
    
    // Basic validation
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      setPaymentError('Please fill in all payment fields');
      setIsProcessing(false);
      return;
    }
    
    if (cardNumber.length < 16) {
      setPaymentError('Invalid card number');
      setIsProcessing(false);
      return;
    }
    
    try {
      const paymentDetails: PaymentDetails = {
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        amount: appointment.appointmentFee
      };
      
      await completePayment(appointment.id, paymentDetails);
      setPaymentSuccess(true);
      
      // Redirect to dashboard after successful payment
      setTimeout(() => {
        navigate('/patient');
      }, 3000);
    } catch (error) {
      setPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!appointment) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading appointment details...</p>
      </div>
    );
  }
  
  if (appointment.paymentStatus === 'paid') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Already Completed</h2>
            <p className="text-gray-600 mb-6">
              This appointment has already been paid for. No further action is needed.
            </p>
            <button
              onClick={() => navigate('/patient')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/patient')}
        className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
        Back to dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Complete Your Payment</h1>
          <p className="mt-1 text-sm text-gray-600">
            Secure payment for your appointment
          </p>
        </div>
        
        {paymentSuccess ? (
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been confirmed. You will be redirected to the dashboard shortly.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Appointment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="text-md font-medium text-gray-900">{appointment.doctorName}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-3">
                    Amount: ${appointment.appointmentFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {paymentError && (
              <div className="mb-6 p-3 rounded-md bg-red-50 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{paymentError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      id="cardholderName"
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name on card"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        required
                      />
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 2) {
                            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                          }
                          setExpiryDate(value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`
                    w-full py-3 px-4 rounded-md font-medium text-white 
                    flex justify-center items-center
                    ${isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }
                  `}
                >
                  {isProcessing ? (
                    <>
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ${appointment.appointmentFee.toFixed(2)}
                    </>
                  )}
                </button>
                
                <p className="mt-4 text-xs text-center text-gray-500">
                  This is a demo payment page. No actual charges will be made.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;