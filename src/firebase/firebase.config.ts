import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

import { serviceAccount } from './account'; // 👈 path to your downloaded key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: '<your-bucket-name>.appspot.com', // 👈 your Firebase Storage bucket name
  });
}

export const firebaseAdmin = admin;
