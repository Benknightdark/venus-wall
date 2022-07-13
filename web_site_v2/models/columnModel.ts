import { ColumnSort } from "./columnSort";

export class ColumnModel {
    displayName: string = '';
    columnName: string = '';
    sort: ColumnSort | null = null;
    enableSort: boolean = true;
}