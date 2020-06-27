import { InputChecker } from "./inputChecker";


describe('InputChecker', () => {
    let subject: InputChecker;
  
    beforeEach(() => {
      subject = new InputChecker();
    });
  
    it('should create', () => {
      expect(subject).toBeTruthy();
    });

  it('should detect incorrectly formatted input for value amount', () => {

    let result: boolean;

    result = subject.checkStrideInput([0, 2, 4, 8, 16], 0);
    expect(result).toBeTrue();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 4, 8, 1000], 0);
    expect(result).toBeTrue();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 4, "70", "150"], 0);
    expect(result).toBeTrue();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 4, 2, 8, 16], 0);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 2, 8, 16], 0);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2.5, 4, 8, 16], 0);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([-1, 4, 2, 8, 16], 0);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    
    result = subject.checkStrideInput([0, 2, 4, 8, 16], 1);
    expect(result).toBeTrue();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 4, 8, 100], 1);
    expect(result).toBeTrue();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 4, 8, 101], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 4, 8, 1000], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2, 2, 8, 100], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 4, 2, 8, 100], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([0, 2.5, 4, 8, 100], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
    
    result = subject.checkStrideInput([-1, 2.5, 4, 8, 100], 1);
    expect(result).toBeFalse();
    subject.clearErrorOccurences();
  });
});
