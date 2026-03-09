import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Configuration validation
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CLIENT_X509_CERT_URL',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_STORAGE_BUCKET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Current environment variables:', Object.keys(process.env));
    throw new Error(`Missing required Firebase variables: ${missingVars.join(', ')}`);
  }

  // Validate private key format
  if (!process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
    throw new Error('Invalid Firebase private key format');
  }
};

try {
  // Validate before initialization
  validateFirebaseConfig();

  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };

  // Initialize Firebase
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  console.log('✅ Firebase Admin initialized for project:', process.env.FIREBASE_PROJECT_ID);
} catch (error) {
  console.error('❌ FATAL: Firebase initialization failed:', error.message);
  process.exit(1);
}

// Enhanced utility functions
export const auth = admin.auth();
export const firestore = admin.firestore();
export const storage = admin.storage();

export const setUserRole = async (uid, role) => {
  try {
    await auth.setCustomUserClaims(uid, { role });
    await firestore.collection('users').doc(uid).update({ role });
    console.log(`✅ Set role "${role}" for user ${uid}`);
    return true;
  } catch (error) {
    console.error(`❌ Role assignment failed for ${uid}:`, error.message);
    return false;
  }
};

export const verifyUserRole = async (uid, requiredRole) => {
  try {
    const user = await auth.getUser(uid);
    const userDoc = await firestore.collection('users').doc(uid).get();
    
    return user.customClaims?.role === requiredRole || 
           userDoc.data()?.role === requiredRole;
  } catch (error) {
    console.error(`❌ Role verification failed for ${uid}:`, error.message);
    return false;
  }
};

export default admin;