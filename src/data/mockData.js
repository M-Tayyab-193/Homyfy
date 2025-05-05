export const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Stunning Beachfront Villa with Private Pool',
    description: 'Experience luxury beach living in this stunning villa with panoramic ocean views. This spacious property features a private infinity pool, direct beach access, and modern amenities throughout. Perfect for family gatherings or groups of friends looking for an unforgettable vacation.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 350,
    currency: 'USD',
    rating: 4.97,
    reviewCount: 128,
    type: 'villa',
    beds: 4,
    bathrooms: 3,
    maxGuests: 8,
    amenities: ['Beachfront', 'Private Pool', 'Wifi', 'Kitchen', 'Air conditioning', 'TV', 'Washer', 'Dryer', 'Free parking'],
    host: {
      id: 'h1',
      name: 'Sophie',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      superhost: true
    },
    location: {
      address: '123 Beach Avenue',
      city: 'Malibu',
      state: 'California',
      country: 'United States',
      coordinates: {
        lat: 34.025920,
        lng: -118.779778
      }
    },
    featured: true
  },
  {
    id: '2',
    title: 'Modern Loft in Downtown with City Views',
    description: 'Stay in this stylish loft apartment in the heart of downtown. Floor-to-ceiling windows offer spectacular city views, while the modern interior provides comfort and luxury. Walking distance to top restaurants, shopping, and attractions.',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 175,
    currency: 'USD',
    rating: 4.89,
    reviewCount: 95,
    type: 'apartment',
    beds: 1,
    bathrooms: 1,
    maxGuests: 3,
    amenities: ['City view', 'Wifi', 'Kitchen', 'Air conditioning', 'TV', 'Elevator', 'Gym', 'Doorman'],
    host: {
      id: 'h2',
      name: 'Daniel',
      avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
      superhost: false
    },
    location: {
      address: '456 Downtown Blvd',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States',
      coordinates: {
        lat: 41.878113,
        lng: -87.629799
      }
    },
    featured: true
  },
  {
    id: '3',
    title: 'Treehouse Retreat in Tropical Forest',
    description: 'Escape to this unique treehouse retreat surrounded by lush tropical forest. This eco-friendly accommodation offers a one-of-a-kind experience with nature while providing modern comforts. Wake up to the sounds of birds and enjoy breathtaking views from your private balcony.',
    images: [
      'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546593064-053d21199be1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 220,
    currency: 'USD',
    rating: 4.95,
    reviewCount: 63,
    type: 'treehouse',
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Forest view', 'Wifi', 'Kitchenette', 'Private balcony', 'Outdoor shower', 'Breakfast included'],
    host: {
      id: 'h3',
      name: 'Maria',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      superhost: true
    },
    location: {
      address: '789 Forest Road',
      city: 'Kailua-Kona',
      state: 'Hawaii',
      country: 'United States',
      coordinates: {
        lat: 19.639994,
        lng: -155.996544
      }
    },
    featured: false
  },
  {
    id: '4',
    title: 'Luxury Penthouse with Rooftop Terrace',
    description: 'Enjoy this luxurious penthouse apartment featuring a private rooftop terrace with panoramic views of the city skyline. Premium finishes throughout, gourmet kitchen, and spacious living areas make this the perfect urban retreat.',
    images: [
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 400,
    currency: 'USD',
    rating: 4.92,
    reviewCount: 87,
    type: 'apartment',
    beds: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    amenities: ['Rooftop terrace', 'City view', 'Wifi', 'Gourmet kitchen', 'Air conditioning', 'TV', 'Washer', 'Dryer', 'Gym', 'Doorman'],
    host: {
      id: 'h4',
      name: 'James',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      superhost: true
    },
    location: {
      address: '101 Skyline Ave',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      coordinates: {
        lat: 40.712776,
        lng: -74.005974
      }
    },
    featured: true
  },
  {
    id: '5',
    title: 'Charming Cottage in Wine Country',
    description: 'Escape to this charming cottage in the heart of wine country. Surrounded by vineyards, this cozy retreat offers a peaceful getaway with easy access to wineries, gourmet restaurants, and beautiful hiking trails.',
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596812493806-5e0918be1a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 195,
    currency: 'USD',
    rating: 4.88,
    reviewCount: 112,
    type: 'house',
    beds: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ['Vineyard view', 'Wifi', 'Kitchen', 'Fireplace', 'Patio', 'BBQ grill', 'Free parking'],
    host: {
      id: 'h5',
      name: 'Emily',
      avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
      superhost: true
    },
    location: {
      address: '222 Vineyard Lane',
      city: 'Napa',
      state: 'California',
      country: 'United States',
      coordinates: {
        lat: 38.297538,
        lng: -122.286865
      }
    },
    featured: false
  },
  {
    id: '6',
    title: 'Historic Brownstone in Trendy Neighborhood',
    description: 'Stay in this beautifully restored historic brownstone in one of the city\'s trendiest neighborhoods. Original architectural details are complemented by modern updates for a perfect blend of old and new.',
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585264550248-1778be3b8921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 230,
    currency: 'USD',
    rating: 4.91,
    reviewCount: 76,
    type: 'house',
    beds: 3,
    bathrooms: 2,
    maxGuests: 5,
    amenities: ['Wifi', 'Full kitchen', 'Washer', 'Dryer', 'TV', 'Air conditioning', 'Backyard', 'Free street parking'],
    host: {
      id: 'h6',
      name: 'Michael',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      superhost: false
    },
    location: {
      address: '333 Brownstone St',
      city: 'Boston',
      state: 'Massachusetts',
      country: 'United States',
      coordinates: {
        lat: 42.360082,
        lng: -71.058880
      }
    },
    featured: false
  },
  {
    id: '7',
    title: 'Oceanfront Condo with Stunning Views',
    description: 'Wake up to panoramic ocean views in this luxurious beachfront condo. Floor-to-ceiling windows showcase the breathtaking scenery, while the modern interior provides comfort and style. Steps away from the beach and local attractions.',
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567002260932-65315bf2d2fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 285,
    currency: 'USD',
    rating: 4.94,
    reviewCount: 104,
    type: 'condo',
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['Beachfront', 'Ocean view', 'Wifi', 'Full kitchen', 'Air conditioning', 'TV', 'Pool', 'Hot tub', 'Gym'],
    host: {
      id: 'h7',
      name: 'Jennifer',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      superhost: true
    },
    location: {
      address: '444 Shoreline Drive',
      city: 'Miami',
      state: 'Florida',
      country: 'United States',
      coordinates: {
        lat: 25.761680,
        lng: -80.191790
      }
    },
    featured: true
  },
  {
    id: '8',
    title: 'Mountain Cabin with Hot Tub',
    description: 'Unwind in this cozy mountain cabin featuring a private outdoor hot tub with forest views. The perfect mix of rustic charm and modern comforts make this an ideal retreat for nature lovers and those seeking relaxation.',
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595274459742-4a5f67a68fd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    ],
    price: 210,
    currency: 'USD',
    rating: 4.96,
    reviewCount: 88,
    type: 'cabin',
    beds: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ['Hot tub', 'Mountain view', 'Wifi', 'Kitchen', 'Fireplace', 'TV', 'BBQ grill', 'Free parking'],
    host: {
      id: 'h8',
      name: 'Robert',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      superhost: true
    },
    location: {
      address: '555 Mountain Trail',
      city: 'Aspen',
      state: 'Colorado',
      country: 'United States',
      coordinates: {
        lat: 39.191097,
        lng: -106.823578
      }
    },
    featured: false
  }
]

export const PROPERTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'apartment', label: 'Apartments' },
  { id: 'house', label: 'Houses' },
  { id: 'villa', label: 'Villas' },
  { id: 'cabin', label: 'Cabins' },
  { id: 'condo', label: 'Condos' },
  { id: 'treehouse', label: 'Treehouses' }
]

export const REVIEWS = {
  '1': [
    {
      id: 'r1',
      userId: 'u1',
      userName: 'Jessica',
      userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5,
      date: '2023-07-15',
      comment: 'Absolutely stunning property! The beach views are even better than in the photos, and the house was immaculate. We loved having morning coffee on the deck and watching the sunset from the infinity pool. Can\'t wait to come back!'
    },
    {
      id: 'r2',
      userId: 'u2',
      userName: 'Mark',
      userAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      rating: 5,
      date: '2023-06-22',
      comment: 'This villa exceeded our expectations. The host was very responsive and gave us great local recommendations. The private beach access was a huge plus, and the kitchen had everything we needed to cook great meals.'
    },
    {
      id: 'r3',
      userId: 'u3',
      userName: 'Alicia',
      userAvatar: 'https://randomuser.me/api/portraits/women/79.jpg',
      rating: 4,
      date: '2023-05-10',
      comment: 'Beautiful home in a perfect location. Very clean and well-maintained. The only reason for 4 stars instead of 5 is that the air conditioning in one bedroom wasn\'t working well, but the host sent someone to fix it right away.'
    }
  ],
  '2': [
    {
      id: 'r4',
      userId: 'u4',
      userName: 'Thomas',
      userAvatar: 'https://randomuser.me/api/portraits/men/18.jpg',
      rating: 5,
      date: '2023-07-05',
      comment: 'This loft is exactly as pictured - stylish, clean, and with amazing views of the city. The location couldn\'t be better, with great restaurants and shopping just steps away. I would definitely stay here again!'
    },
    {
      id: 'r5',
      userId: 'u5',
      userName: 'Sophia',
      userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      rating: 4,
      date: '2023-06-14',
      comment: 'Great apartment in a perfect downtown location. The views are spectacular, especially at night. The only downside was some noise from the street below, but that\'s expected in such a central location.'
    }
  ],
  '4': [
    {
      id: 'r6',
      userId: 'u6',
      userName: 'David',
      userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 5,
      date: '2023-07-28',
      comment: 'The penthouse was absolutely amazing! The rooftop terrace was our favorite spot - perfect for morning coffee and evening drinks with unbelievable views. Everything was top-notch from the furnishings to the amenities.'
    },
    {
      id: 'r7',
      userId: 'u7',
      userName: 'Emma',
      userAvatar: 'https://randomuser.me/api/portraits/women/90.jpg',
      rating: 5,
      date: '2023-06-30',
      comment: 'Stunning apartment with incredible attention to detail. The kitchen was a dream to cook in, and the location was perfect for exploring the city. The host was very attentive and accommodating.'
    }
  ],
  '7': [
    {
      id: 'r8',
      userId: 'u8',
      userName: 'Ryan',
      userAvatar: 'https://randomuser.me/api/portraits/men/37.jpg',
      rating: 5,
      date: '2023-07-20',
      comment: 'This oceanfront condo is breathtaking! Waking up to those views every morning was worth every penny. The place was spotless, beautifully decorated, and had everything we needed for a perfect beach vacation.'
    },
    {
      id: 'r9',
      userId: 'u9',
      userName: 'Laura',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4,
      date: '2023-07-02',
      comment: 'Beautiful condo with amazing ocean views. The beach access was convenient and the pool area was lovely. Only giving 4 stars because the elevators were slow during peak times, but that\'s not the host\'s fault!'
    }
  ]
}