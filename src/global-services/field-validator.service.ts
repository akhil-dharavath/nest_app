import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FieldValidatorService {
  // validateRequiredFields(data: Record<string, any>, requiredFields: string[]) {
  //   const missingFields: string[] = [];

  //   for (const field of requiredFields) {
  //     const value = data[field];

  //     if (
  //       value === undefined ||
  //       value === null ||
  //       (typeof value === 'string' && value.trim() === '') ||
  //       (Array.isArray(value) && value.length === 0)
  //     ) {
  //       missingFields.push(field);
  //     }
  //   }

  //   if (missingFields.length > 0) {
  //     throw new BadRequestException(
  //       `Missing or empty required fields: ${missingFields.join(', ')}`
  //     );
  //   }

  //   return true;
  // }

  validateRequiredFields(data: Record<string, any>, requiredFields: string[]) {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = data[field];

      // Handle both string & non-string types safely
      const isEmptyString = typeof value === 'string' && value.trim() === '';
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isMissing =
        value === undefined || value === null || isEmptyString || isEmptyArray;

      if (isMissing) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing or empty required fields: ${missingFields.join(', ')}`,
      );
    }

    return true;
  }
}
