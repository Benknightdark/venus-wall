export interface ISelectOption {
    readonly value: string;
    readonly label: string;
}

export interface IGroupedOption {
    readonly label: string;
    readonly options: readonly ISelectOption[];
}