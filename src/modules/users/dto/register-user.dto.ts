import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  Validate,
  IsNotEmpty,
} from 'class-validator';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

// 👇 Custom validator: at least one of username, email, or phoneNumber must be provided
export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          return fields.some((field) => obj[field] !== undefined && obj[field] !== '');
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following fields must be provided: ${fields.join(', ')}`;
        },
      },
    });
  };
}

export class RegisterUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // 👇 add a dummy property for the custom validator to attach to
  @AtLeastOneField(['username', 'email', 'phoneNumber'])
  dummyField: string;
}
