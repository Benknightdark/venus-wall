export interface ISelectOption {
    readonly value: string;
    readonly label: string;
}

export interface IGroupedOption {
    readonly name: string;
    readonly options:  readonly ISelectOption[];
}