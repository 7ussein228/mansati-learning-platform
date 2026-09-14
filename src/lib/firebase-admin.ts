import { type App, getApps, initializeApp, cert } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuth: Auth;

function getFirebaseAdmin() {
  if (!adminApp) {
    if (getApps().length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin credentials not configured in .env.local');
      }

      adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
      adminApp = getApps()[0];
    }
    adminAuth = getAuth(adminApp);
  }
  return { adminApp, adminAuth };
}

export { getFirebaseAdmin };
