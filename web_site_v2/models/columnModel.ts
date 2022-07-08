import { ColumnSort } from "./ColumnSort";

export class ColumnModel {
    displayName: string = '';
    columnName: string = '';
    sort: ColumnSort | null = null;
    enableSort: boolean = true;
}