export interface IGridColumns {
    name: string;
    field: string;
    sortable: boolean;
}
export interface IGridActions {
    label: string;
    callBack?: any;
}
export interface IGridFilter {
    allLabel: string;
    field: string;
    type: string;
    callBack?: any;
    options?: any;
}
export interface IMobileDataProps {
    title: string;
    primaryDescription: string[];
    secondaryDescription: {}[];
}
export interface IGridComponentProps {
    items: any;
    columns: IGridColumns[];
    mobileDataProps: IMobileDataProps;
    actions?: IGridActions;
    filters?: IGridFilter[];
    searchFields?: string[];
    pageSize: number;
}
export interface IGridRuleSortColumn {
    field: string;
    sortType: string;
}
export interface IGridRuleFilter {
    key: any;
    values: any;
    allLabel: string;
    selectedItem: string;
    type: string;
    callBack?: any;
}
export interface IGridRule {
    sortColumn: IGridRuleSortColumn;
    filters: any;
    searchTerm: string;
}

export interface IGridViewProps {
    gridProps: IGridComponentProps;
    isMobileView: boolean;
    isLoading: boolean;
}
