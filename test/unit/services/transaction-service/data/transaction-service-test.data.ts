export class TransactionServiceTestData {
  public static getNewError(): Error {
    return new Error('Test error');
  }

  public static getSuccessfullyTestResult(): string {
    return 'Successfully test result.';
  }
}
