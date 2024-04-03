import { registerDecorator, ValidationOptions } from 'class-validator';

const LOWER_CHARACTER_REGEX = RegExp(/(?=.*[a-z])/);
const UPPER_CHARACTER_REGEX = RegExp(/(?=.*[A-Z])/);
const DIGIT_CHARACTER_REGEX = RegExp(/(?=.*\d)/);
const SPECIAL_CHARACTER_REGEX = RegExp(/(?=.*\W)/);

export function ContainsLowerChar(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const match = value.match(LOWER_CHARACTER_REGEX);
          return typeof value === 'string' && match?.length > 0;
        },
      },
    });
  };
}

export function ContainsUpperChar(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const match = value.match(UPPER_CHARACTER_REGEX);
          return typeof value === 'string' && match?.length > 0;
        },
      },
    });
  };
}

export function ContainsDigit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const match = value.match(DIGIT_CHARACTER_REGEX);
          return typeof value === 'string' && match?.length > 0;
        },
      },
    });
  };
}

export function ContainsSpecialChar(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const match = value.match(SPECIAL_CHARACTER_REGEX);
          return typeof value === 'string' && match?.length > 0;
        },
      },
    });
  };
}
