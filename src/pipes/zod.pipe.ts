import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private bodySchema: ZodSchema,
    private paramSchemaMap?: Record<string, ZodSchema>,
  ) {}

  loadTestSchema(metadata: ArgumentMetadata): ZodSchema | null {
    switch (metadata.type) {
      case 'body':
        return this.bodySchema;
      case 'query':
        return null;
      case 'param':
        return this.paramSchemaMap?.[metadata.data!] || null;
      case 'custom':
        return null;
    }
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    const testSchema = this.loadTestSchema(metadata);
    if (!testSchema) {
      console.warn(
        `No schema for ${metadata.type} ${metadata.data}, skipping.`,
      );
      return value;
    }
    try {
      const parsedValue = testSchema.parse(value);
      return parsedValue;
    } catch (error: unknown) {
      console.log(error);
      throw new BadRequestException('Validation failed');
    }
  }
}
