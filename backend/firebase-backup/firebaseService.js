const { firestore } = require(.firebase-admin.);
const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key

// Initialize Firebase Admin with your project config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = firestore;

// Recommended settings for development
db.settings({ ignoreUndefinedProperties: true });

module.exports = {
  db,
  
  // User Management
  createUser: async (userData) => {
    try {
      const userRef = db.collection('users').doc();
      await userRef.set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return userRef.id;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  },

  // Event Management
  createEvent: async (eventData) => {
    try {
      const eventRef = db.collection('events').doc();
      await eventRef.set({
        ...eventData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return eventRef.id;
    } catch (error) {
      console.error('Error creating event:', error.message);
      throw new Error('Failed to create event');
    }
  },

  getEvents: async () => {
    try {
      const snapshot = await db.collection('events').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    } catch (error) {
      console.error('Error fetching events:', error.message);
      throw new Error('Failed to fetch events');
    }
  },

  testConnection: async () => {
    try {
      await db.collection('test-connection').doc('status').set({ connected: true });
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw new Error('Failed to connect to Firestore');
    }
  },
};
