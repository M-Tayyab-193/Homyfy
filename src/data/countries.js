// Top countries list
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'EG', name: 'Egypt' }
]

// Provinces/States by country
export const PROVINCES = {
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
    'West Virginia', 'Wisconsin', 'Wyoming'
  ],
  'Pakistan': [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 
    'Saskatchewan', 'Yukon'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ],
  'Australia': [
    'New South Wales', 'Queensland', 'South Australia', 'Tasmania', 
    'Victoria', 'Western Australia', 'Australian Capital Territory', 
    'Northern Territory'
  ],
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ],
  'Germany': [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
    'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland',
    'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
  ],
  'France': [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany',
    'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France',
    'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie',
    'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
  ],
  'Italy': [
    'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria',
    'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio',
    'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont', 'Sardinia',
    'Sicily', 'Trentino-South Tyrol', 'Tuscany', 'Umbria', 'Veneto'
  ],
  'Spain': [
    'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
    'Canary Islands', 'Cantabria', 'Castile and León', 'Castilla-La Mancha',
    'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid',
    'Murcia', 'Navarre', 'Valencia'
  ]
}

// Helper function to get provinces for a country
export const getProvincesForCountry = (countryName) => {
  return PROVINCES[countryName] || []
}
