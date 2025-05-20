import { IMethodDescriptor } from '@common/interfaces/method-descriptor.interface';

export class LogPropertyDescriptorDto {
  public key!: string;
  public value!: (...args: unknown[]) => unknown;
  public descriptor!: IMethodDescriptor;

  constructor(key: string, descriptor: IMethodDescriptor) {
    this.key = key;
    this.value = descriptor.value;
    this.descriptor = descriptor;
  }
}
