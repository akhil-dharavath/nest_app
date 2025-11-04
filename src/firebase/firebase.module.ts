import { Global, Module } from '@nestjs/common';
import { firebaseAdmin } from './firebase.config';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useValue: firebaseAdmin,
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
