import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private app: admin.app.App;
  constructor() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.PROJECT_ID,
          clientEmail: process.env.CLIENT_EMAIL,
          privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'), // 👈 important fix
        }),
        storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
      });
    } else {
      this.app = admin.app();
    }
  }

  get storage() {
    return this.app.storage();
  }

  private bucket = admin.storage().bucket();

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const fileName = `uploads/${uuidv4()}-${file.originalname}`;
    const fileUpload = this.bucket.file(fileName);

    try {
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      // Make file publicly accessible
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
      return publicUrl;
    } catch (error) {
      throw new HttpException(`Upload failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      const fileUpload = this.bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        contentType: file.mimetype,
      });

      // Make public
      await fileUpload.makePublic();
      return fileUpload.publicUrl();
    });

    return Promise.all(uploadPromises);
  }
}
