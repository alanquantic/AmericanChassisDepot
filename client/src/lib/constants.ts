// Condition and size values for filtering
export const CONDITIONS = [
  { name: "All Chassis", value: "all" },
  { name: "New Chassis", value: "new-chassis" },
  { name: "Used Chassis", value: "used-chassis" }
];

// Manufacturer values for filtering
export const MANUFACTURERS = [
  { name: "All Manufacturers", value: "all" },
  { name: "Bull", value: "Bull" },
  { name: "Cheetah", value: "Cheetah" },
  { name: "Pratt", value: "Pratt" },
  { name: "Stoughton", value: "Stoughton" }
];

export const SIZES = [
  { name: "All Sizes", value: "all" },
  { name: "20ft", value: "20ft" },
  { name: "40ft", value: "40ft" },
  { name: "45ft", value: "45ft" },
  { name: "53ft", value: "53ft" }
];

// Contact information
export const CONTACT_INFO = {
  address: "123 Transport Drive, Logistics Park, TX 75001",
  phone: "(555) 123-4567",
  email: "info@americanchassisdepot.com",
  hours: [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ]
};

// Company information
export const COMPANY_INFO = {
  name: "American Chassis Depot",
  tagline: "Premium Chassis Solutions for Every Need",
  description: "American Chassis Depot is a leading provider of high-quality chassis solutions for the transportation and logistics industry. We specialize in offering a diverse range of chassis options from the industry's most trusted manufacturers.",
  benefits: [
    { icon: "truck", title: "Premium Quality", description: "Top industry brands" },
    { icon: "tools", title: "Expert Support", description: "Dedicated specialists" },
    { icon: "certificate", title: "Certified Products", description: "Industry-compliant" }
  ]
};
