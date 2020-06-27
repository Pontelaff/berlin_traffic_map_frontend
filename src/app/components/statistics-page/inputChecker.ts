import { cloneDeep } from 'lodash';


interface errorMsg {
    identifier: string;
    didOccur: boolean;
    message: string;
    }

export class InputChecker {
    
    errorMessages: errorMsg[];
    isStrideFaulty: boolean[] = [];

    constructor ()
    {
      this.errorMessages = [
        {identifier: "countRange",      didOccur: false, message: "Anzahl nicht 2 bis 10"},
        {identifier: "negative",        didOccur: false, message: "Negativer Wert"},
        {identifier: "morethan100%",    didOccur: false, message: "Mehr als 100%"},
        {identifier: "letter",          didOccur: false, message: "Nichtnumerische Zeichen"},
        {identifier: "order",           didOccur: false, message: "Nicht aufsteigend"},
        {identifier: "float",           didOccur: false, message: "Fließkommazahl"}
      ]
    }

    resetStrideFaultyArr(length: number)
    {
        this.isStrideFaulty.length = length;
        this.isStrideFaulty.fill(false);
    }

    checkStrideInput(customTimeStrides: any[], opMode: number)
    {
      let compareArr: number[] = cloneDeep(customTimeStrides);
  
      for(let idx = 0; idx < compareArr.length; idx++)
      {
        compareArr[idx] = Number(compareArr[idx]);
  
        /* check for non-numerical characters */
        let isNumber = this.checkNumerical(compareArr[idx]);
        this.isStrideFaulty[idx] = !isNumber;
        if(!isNumber)
            continue;
        
        /* check for negatives */
        let isPositive = this.checkPositive(compareArr[idx]);
        this.isStrideFaulty[idx] = !isPositive;
        if(!isPositive)
            continue;
        
        /* check for floats */
        let isWholeNumber = this.checkWhole(compareArr[idx]);
        this.isStrideFaulty[idx] = !isWholeNumber;
        if(!isWholeNumber)
            continue;
        
        /* check for > 100% */
        let isInRange = this.checkSub101Percent(compareArr[idx], opMode);
        this.isStrideFaulty[idx] = !isInRange;
        if(!isInRange)
            continue;
      }
  
      /* check for non-ascending order */
      if(!this.didErrorsOccur())
        this.checkAscendingOrder(compareArr);
  
      /* return false if at least one stride input was faulty */
      return !this.didErrorsOccur();
    }

    checkNumerical(val: number)
    {
        if(isNaN(val))
        {
            console.log("letter found");
            this.setErrorOccurence("letter");
            return false;
        }
        
        return true;
    }
    
    checkPositive(val: number)
    {
        if(val < 0)
        {
            console.log("negative found");
            this.setErrorOccurence("negative");
            return false;
        }
        
        return true;
    }

    checkWhole(val: number)
    {
        if(Math.floor(val) != val)
        {
            console.log("floating point value found");
            this.setErrorOccurence("float");
            return false;
        }
        
        return true;
    }

    checkSub101Percent(val: number, opMode: number)
    {
        if(opMode == 1 && val > 100)
        {
            console.log("more than 100% found");
            this.setErrorOccurence("morethan100%");
            return false;
        }
        
        return true;
    }

    checkAscendingOrder(valArr: number[])
    {
        for(let idx = 1; idx < valArr.length; idx++)
        {
          if(valArr[idx - 1] >= valArr[idx])
          {
                console.log("non-ascending order");
                this.setErrorOccurence("order");
                this.isStrideFaulty[idx] = true;
          }
        }
    }

    checkRange(val: number, min: number, max: number)
    {
        if(val < min || val > max)
        {
          console.log("desired strides count less than " + min + " or greater than " + max);
          this.setErrorOccurence("countRange");
          return false;
        }

        return true;
    }


    private setErrorOccurence(ident: string)
    {
        for(let idx = 0; idx < this.errorMessages.length; idx++)
        {
            if(this.errorMessages[idx].identifier == ident)
                this.errorMessages[idx].didOccur = true;
        }
    }

    clearErrorOccurences()
    {
        for(let idx = 0; idx < this.errorMessages.length; idx++)
        {
            this.errorMessages[idx].didOccur = false;
        }
    }

    didErrorsOccur()
    {
        for(let idx = 0; idx < this.errorMessages.length; idx++)
        {
            if(this.errorMessages[idx].didOccur)
                return true;
        }

        return false;
    }

}