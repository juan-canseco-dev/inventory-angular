import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function salePriceGreaterThanPurchasePriceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const purchasePrice = control.get('purchasePrice')?.value;
    const salePrice = control.get('salePrice')?.value;

    if (purchasePrice == null || salePrice == null) {
      return null;
    }

    return Number(salePrice) > Number(purchasePrice)
      ? null
      : { salePriceMustBeGreaterThanPurchasePrice: true };
  };
}
