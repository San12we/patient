import axios from 'axios';
import moment from 'moment';

export const fetchSubaccountCode = async (userId: string): Promise<string | null> => {
  try {
    const response = await axios.get(`https://medplus-health.onrender.com/api/subaccount/${userId}`);
    if (response.data.status === 'Success') {
      const { subaccount_code } = response.data.data;
      return subaccount_code;
    } else {
      console.error('Failed to fetch subaccount code:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch subaccount code:', error);
    return null;
  }
};

export const bookAppointment = async (
  doctorId: string,
  userId: string,
  patientName: string,
  selectedDate: Date,
  selectedTimeSlot: { id: string; time: string } | null,
  selectedInsurance: string,
  subaccountCode: string | null,
  userEmail: string,
  consultationFee: number,
  withInsurance: boolean
): Promise<string | null> => {
  try {
    const appointmentData = {
      doctorId: doctorId,
      userId: userId,
      patientName: patientName,
      date: moment(selectedDate).format('YYYY-MM-DD'),
      timeSlotId: selectedTimeSlot?.id || null,
      time: selectedTimeSlot?.time || null,
      status: 'pending',
      insurance: selectedInsurance,
    };

    if (selectedInsurance) {
      appointmentData.timeSlotId = appointmentData.timeSlotId || 'defaultTimeSlotId';
      appointmentData.time = appointmentData.time || 'defaultTime';
    }

    const appointmentResponse = await axios.post('https://medplus-health.onrender.com/api/appointments', appointmentData);
    const newAppointmentId = appointmentResponse.data.appointment._id;
    if (!newAppointmentId) {
      throw new Error('Failed to retrieve appointmentId from response');
    }

    if (withInsurance) {
      return newAppointmentId;
    }

    const paymentResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: userEmail,
        amount: consultationFee * 100,
        subaccount: subaccountCode,
        currency: 'KES',
        metadata: {
          appointmentId: newAppointmentId,
          timeSlotId: selectedTimeSlot?.id || null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (paymentResponse.data.status) {
      return newAppointmentId;
    } else {
      throw new Error('Payment initialization failed');
    }
  } catch (error) {
    console.error('Failed to book appointment:', error);
    throw error;
  }
};
const handlePaymentSuccess = async (response: any) => {
  setIsSubmitting(false);
  toaster.show({ message: 'Payment successful and appointment confirmed!', type: 'success' });
  console.log('Payment successful:', response);

  try {
    const currentAppointmentId = appointmentIdRef.current;
    console.log('State before confirming appointment:', { appointmentId: currentAppointmentId });

    if (!currentAppointmentId) {
      throw new Error('No appointment ID available for status update.');
    }

    console.log('Confirming appointment with ID:', currentAppointmentId);

    // Confirm appointment in the backend
    await confirmAppointment(currentAppointmentId);

  } catch (error) {
    console.error('Error updating appointment status:', error);
    toaster.show({ message: 'Failed to update appointment status.', type: 'error' });
  }
};

