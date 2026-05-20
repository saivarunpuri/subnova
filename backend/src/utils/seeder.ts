import User from '../models/User';
import OTTBrand from '../models/OTTBrand';
import Pack from '../models/Pack';

export const seedDefaultData = async () => {
  try {
    // 1. Seed Admin User if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Varun Dev',
        email: 'varundevlops',
        passwordHash: 'password', // in real life, hash this!
        role: 'admin'
      });
      console.log('🌱 Admin user seeded successfully.');
    }

    // 2. Check if brands already exist
    const brandCount = await OTTBrand.countDocuments();
    if (brandCount > 0) {
      return; // Already seeded
    }

    console.log('🌱 Database empty. Commencing high-fidelity seeding of OTT Universe...');

    // 3. Define Brands
    const brandsToSeed = [
      {
        name: 'Netflix',
        category: 'entertainment',
        logo: '',
        description: 'Immersive global streaming, movies, and award-winning series.'
      },
      {
        name: 'Prime Video',
        category: 'entertainment',
        logo: '',
        description: 'Amazon Original series, blockbuster movies, and live sports.'
      },
      {
        name: 'Aha Video',
        category: 'entertainment',
        logo: '',
        description: 'Premium regional South Indian movies, shows, and web originals.'
      },
      {
        name: 'Spotify',
        category: 'music',
        logo: '',
        description: 'Millions of tracks, curated playlists, and podcasts ad-free.'
      },
      {
        name: 'Coursera Plus',
        category: 'education',
        logo: '',
        description: 'Professional certificates, degrees, and guided courses from top universities.'
      },
      {
        name: 'Notion Pro',
        category: 'productivity',
        logo: '',
        description: 'Unified collaborative workspace, wikis, and advanced task boards.'
      }
    ];

    const seededBrands = [];
    for (const b of brandsToSeed) {
      const brand = await OTTBrand.create(b);
      seededBrands.push(brand);
    }
    console.log(`🌱 Seeded ${seededBrands.length} dynamic OTT Brands.`);

    // 4. Find Brand References
    const netflix = seededBrands.find(b => b.name === 'Netflix')!;
    const prime = seededBrands.find(b => b.name === 'Prime Video')!;
    const aha = seededBrands.find(b => b.name === 'Aha Video')!;
    const spotify = seededBrands.find(b => b.name === 'Spotify')!;
    const coursera = seededBrands.find(b => b.name === 'Coursera Plus')!;
    const notion = seededBrands.find(b => b.name === 'Notion Pro')!;

    // 5. Seed Packs
    const packsToSeed = [
      // Netflix Packs
      {
        brand: netflix._id,
        title: 'Mobile Plan',
        price: 149,
        originalPrice: 199,
        validity: '30 Days',
        features: ['Mobile & Tablet Only', '480p SD Quality', '1 Active Screen'],
        description: 'Perfect for solo personal smartphone streaming.'
      },
      {
        brand: netflix._id,
        title: 'Standard HD',
        price: 499,
        originalPrice: 649,
        validity: '30 Days',
        features: ['Smart TV, PC, Mobile support', '1080p Full HD Quality', '2 Active Screens simultaneously'],
        description: 'Great for sharing with a partner or family member.'
      },
      {
        brand: netflix._id,
        title: 'Premium 4K',
        price: 649,
        originalPrice: 799,
        validity: '30 Days',
        features: ['4K Ultra HD + HDR', 'Dolby Atmos Spatial Audio', '4 Active Screens', 'All devices supported'],
        description: 'The ultimate cinematic home entertainment experience.'
      },

      // Prime Video Packs
      {
        brand: prime._id,
        title: 'Monthly Prime',
        price: 299,
        originalPrice: 399,
        validity: '30 Days',
        features: ['4K HDR Video support', '3 Screen Sharing', 'Free Prime delivery access'],
        description: 'Complete Amazon Prime features with ad-free movies.'
      },
      {
        brand: prime._id,
        title: 'Annual Premium',
        price: 1499,
        originalPrice: 1999,
        validity: '365 Days',
        features: ['Yearlong uninterrupted access', '4K HDR Streaming', 'Amazon Prime Music included', 'Prime Reading'],
        description: 'Massive savings with our best value annual streaming subscription.'
      },

      // Aha Video Packs
      {
        brand: aha._id,
        title: 'Telugu Quarterly',
        price: 199,
        originalPrice: 299,
        validity: '90 Days',
        features: ['Telugu Exclusive Blockbusters', '1080p Full HD', '2 Shared screens'],
        description: 'Regional entertainment tailored for South Indian cinema enthusiasts.'
      },

      // Spotify Packs
      {
        brand: spotify._id,
        title: 'Premium Individual',
        price: 119,
        originalPrice: 149,
        validity: '30 Days',
        features: ['Ad-free offline music', 'High-fidelity audio stream', 'Unlimited skips', 'Group sessions'],
        description: 'Stream music smoothly without interruptions.'
      },

      // Coursera Packs
      {
        brand: coursera._id,
        title: 'Unlimited Pass',
        price: 4999,
        originalPrice: 6500,
        validity: '30 Days',
        features: ['7,000+ courses included', 'Verified certificates', 'Top global university partners'],
        description: 'Invest in your career with professional development credentials.'
      },

      // Notion Packs
      {
        brand: notion._id,
        title: 'Plus Workspace',
        price: 399,
        originalPrice: 599,
        validity: '30 Days',
        features: ['Unlimited file uploads', 'Notion AI capabilities', '30-day page version history', 'Advanced integrations'],
        description: 'Collaborate and build personal knowledge databases.'
      }
    ];

    await Pack.create(packsToSeed);
    console.log('🌱 Successfully seeded all high-fidelity subscription plans.');
  } catch (error: any) {
    console.error('❌ Failed to run initial database seeding:', error.message);
  }
};
