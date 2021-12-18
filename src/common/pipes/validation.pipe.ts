import { ValidationException } from '@common/exceptions';
import { ArgumentMetadata, Injectable, PipeTransform, Type } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidationError as ValidationErrorType } from 'class-validator';

const normalizeError = (error: ValidationError): Array<string> =>
  error.constraints
    ? Object.values(error.constraints)
    : (error.children ?? []).flatMap(normalizeError);

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.isBasicType(metatype)) {
      return value;
    }

    const entity = plainToClass(metatype, value);
    const errors = await validate(entity, {
      forbidNonWhitelisted: false,
      whitelist: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
    });

    if (errors.length > 0) {
      throw new ValidationException(this.extractValidateMessage(errors));
    }

    // Stripping out the non-whitelisted properties from a validated entity.
    return classToPlain(entity);
  }

  private isBasicType(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private extractValidateMessage(errors: ValidationErrorType[]): string[] {
    return Array.from(new Set(errors.flatMap(normalizeError)));
  }
}
