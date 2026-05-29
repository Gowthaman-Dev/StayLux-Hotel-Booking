export const calculatePrice = ({
  pricePerNight,
  nights,
  guests,
  maxGuests,
}) => {
  const roomCharge = pricePerNight * nights;
  
  let extraGuestCharge = 0;
  const extraGuestPrice = 500;
  
  if (guests > maxGuests) {
    const extraGuests = guests - maxGuests;
    extraGuestCharge = extraGuests * extraGuestPrice * nights;
  }
  
  const serviceCharge = 200;
  const subTotal = roomCharge + extraGuestCharge + serviceCharge;
  const gst = subTotal * 0.18;
  const totalAmount = Math.round(subTotal + gst);
  
  return { totalAmount };
};