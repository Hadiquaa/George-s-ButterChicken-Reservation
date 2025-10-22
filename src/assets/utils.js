// To check if a customer already exists in any queue or waitlist
export function findExistingReservation(contact, waitlist) {
  let existingEmployee = null;

  // loop through every employee's queue in localStorage
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("restaurantData_")) {
      const employeeData = JSON.parse(localStorage.getItem(key));
      const found = employeeData.queue.find((p) => p.contact === contact);
      if (found) {
        existingEmployee = key.replace("restaurantData_", "");
        break;
      }
    }
  }

  // checking in shared waitlist
  const inWaitlist = waitlist.find((p) => p.contact === contact);

  if (existingEmployee) {
    return {
      exists: true,
      location: "queue",
      employee: existingEmployee,
    };
  }

  if (inWaitlist) {
    return {
      exists: true,
      location: "waitlist",
    };
  }

  return { exists: false };
}

export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

 // Validating if the contact is a 10-digit phone number
export function validatePhoneNumber(phone) {
 

  if (phone.length === 0) {
    return { valid: false, message: "Phone number cannot be empty." };
  }

  // Only digits and exactly 10 of them
  const phoneRegex = /^\d{10}$/;

  if (!phoneRegex.test(phone)) {
    return {
      valid: false,
      message: "Please enter a valid 10-digit phone number.",
    };
  }

  return { valid: true, message: "" };
}
// Validate if the customer name only contains alphabets and spaces
export function validateCustomerName(name) {
 

  if (name.length === 0) {
    return { valid: false, message: "Customer name cannot be empty." };
  }

  // Only alphabets and spaces allowed
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) {
    return {
      valid: false,
      message: "Name can only contain alphabets and spaces.",
    };
  }

  return { valid: true, message: "" };
}
