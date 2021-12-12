import { Type } from '@angular/core';

export class DynamicComponents {
  constructor(public component: Type<any>, public data: any) {}

}
