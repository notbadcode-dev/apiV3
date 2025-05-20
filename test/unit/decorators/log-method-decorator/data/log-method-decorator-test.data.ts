import { LogMethod } from '@common/decorators/logged-method.decorator';

export class LogMethodDecoratorTestData {
  @LogMethod
  public static async testMethod(arg1: string, arg2: string): Promise<string> {
    return `${arg1} ${arg2}`;
  }

  @LogMethod
  public static async testMethodWithError(): Promise<void> {
    throw new Error('Test error');
  }

  public static getError(): Error {
    return new Error('Test error');
  }

  public static getStartingTestMethodMessage(): string {
    return `Starting testMethod`;
  }

  public static getFinishedTestMethodMessage(): string {
    return `Finished testMethod`;
  }

  public static getTestMethodWithErrorMessage(): string {
    return `Method testMethodWithError failed`;
  }

  public static getCaughtObjectIsNotAnInstanceOfError(): string {
    return 'Caught object is not an instance of Error';
  }
}
