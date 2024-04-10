import { Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isEnum } from 'class-validator';
import { toTitleCase } from '../../utils/utils';

@Injectable()
export class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
  constructor(private enumEntity: any) {}

  transform(value: string): Promise<any> {
    if (
      (isDefined(value) && isEnum(value, this.enumEntity)) ||
      isEnum(toTitleCase(value), this.enumEntity)
    ) {
      // Check title casing of the value incase the value comes in as a different casing
      return Promise.resolve(
        this.enumEntity[value] || this.enumEntity[toTitleCase(value)],
      );
    }

    // Return the 0 index of the enum
    return Promise.resolve(0);
  }
}
