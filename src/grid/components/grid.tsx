import * as React from 'react';
import GridMobileView from './grid-mobile.view';
import GridDesktopView from './grid-desktop.view';
import { IGridFilter, IGridRule, IGridRuleFilter, IGridRuleSortColumn, IGridViewProps } from './grid-types';

interface IGridComponentState {
    items: any;
    currentPage: number;
    rule: IGridRule;
    showMoreActionIndex: number;
    filterItemIndex: number;
}

class Grid extends React.PureComponent<IGridViewProps, IGridComponentState> {
    public ref = React.createRef();
    constructor(props: IGridViewProps) {
        super(props);
        this.state = {
            items: [...props.gridProps.items],
            currentPage: 1,
            rule: {
                sortColumn: {
                    field: '',
                    sortType: ''
                },
                filters: [],
                searchTerm: ''
            },
            showMoreActionIndex: -1,
            filterItemIndex: -1
        };
    }
    public componentDidMount(): void {
        this.prepareGridFilters();
        window.addEventListener('click', event => {
            if (this.ref && this.ref.current) {
                const target = event.target as Node;
                // @ts-ignore
                if (!this.ref.current.contains(target)) {
                    this.setState({ filterItemIndex: -1 });
                }
            }
        });
    }
    public componentDidUpdate(prevProps: IGridViewProps): void {
        if (this.props.gridProps.items.length !== prevProps.gridProps.items.length) {
            this.prepareGridFilters();
            this.setState({ items: this.props.gridProps.items });
        }
    }
    private handlePageChange = (pageNumber: number): void => {
        this.setState({ currentPage: pageNumber });
    };
    private onlyUnique(value: string, index: number, array: any): boolean {
        return array.indexOf(value) === index;
    }
    private prepareGridFilters = () => {
        if (this.props.gridProps.filters && this.props.gridProps.filters.length > 0) {
            const rule: IGridRule = { ...this.state.rule };
            const filters: IGridRuleFilter[] = [];
            this.props.gridProps.filters.forEach((filterOption: IGridFilter) => {
                let options: {}[];
                switch (filterOption?.type) {
                    case 'date':
                        options = filterOption?.options ?? [];
                        break;
                    case 'number':
                        options = filterOption?.options ?? [];
                        options.splice(0, 0, filterOption.allLabel);
                        break;
                    default:
                        options = this.sortItems(
                            this.props.gridProps.items.map((item: any) => item[filterOption.field]).filter(this.onlyUnique)
                        );
                        options.splice(0, 0, filterOption.allLabel);
                        break;
                }
                const selectedFilterItem = this.state.rule.filters.find((fil: IGridRuleFilter) => {
                    return fil.key === filterOption.field && filterOption.callBack && fil.callBack === filterOption.callBack;
                });
                const selectedItem = selectedFilterItem?.selectedItem;
                const filter: IGridRuleFilter = {
                    key: filterOption.field,
                    values: options,
                    allLabel: filterOption.allLabel,
                    selectedItem: selectedItem ? selectedItem : options.length > 0 ? options[0]!.toString() : '',
                    type: filterOption.type
                };
                if (filterOption?.callBack) {
                    filter['callBack'] = filterOption.callBack;
                }
                filters.push(filter);
            });
            rule.filters = filters;
            this.setState({ rule: rule });
        }
    };

    public alphanumericSort = (a: string, b: string): number => {
        const regex: RegExp = /(\d+|\D+)/g;

        // Split strings into arrays of number and non-number parts
        const aParts: RegExpMatchArray | null = a.match(regex);
        const bParts: RegExpMatchArray | null = b.match(regex);

        if (!aParts || !bParts) {
            return 0;
        }

        // Iterate over parts and compare
        for (let i: number = 0; i >= 0 && i < Math.min(aParts.length, bParts.length); i++) {
            // eslint-disable-next-line security/detect-object-injection
            const aPart: string = aParts[i]!;
            // eslint-disable-next-line security/detect-object-injection
            const bPart: string = bParts[i]!;

            // Compare numeric parts as numbers
            if (!isNaN(Number(aPart)) && !isNaN(Number(bPart))) {
                const numA: number = Number(aPart);
                const numB: number = Number(bPart);
                if (numA !== numB) {
                    return numA - numB;
                }
            } else {
                // Compare non-numeric parts as strings
                const comparison = aPart.localeCompare(bPart);
                if (comparison !== 0) {
                    return comparison;
                }
            }
        }
        // Handle strings of different lengths
        return aParts.length - bParts.length;
    };
    private updateSorterRule = (key: string, overRide?: boolean) => {
        const sortColumn: IGridRuleSortColumn = { ...this.state.rule.sortColumn };
        let order: string = overRide ? sortColumn.sortType : 'asc';
        if (!overRide && sortColumn.field === key) {
            const sortType = sortColumn.sortType;
            switch (sortType) {
                case 'asc':
                    order = 'desc';
                    break;
                case 'desc':
                    order = '';
                    break;
                case '':
                    order = 'asc';
                    break;
                default:
                    break;
            }
        }
        if (order === '') {
            sortColumn.field = '';
            sortColumn.sortType = order;
        } else {
            sortColumn.field = key;
            sortColumn.sortType = order;
        }
        const rule: IGridRule = { ...this.state.rule };
        rule.sortColumn = sortColumn;
        this.prepareGridItems(rule);
        this.setState({ rule: rule });
    };
    private updateFiltersRule = (key?: string, selectedValue?: string, callBack?: any) => {
        let filters: IGridRuleFilter[] = [...this.state.rule.filters];
        filters = filters.map((filter: IGridRuleFilter) => {
            let value = filter.selectedItem;
            if (key === filter.key && selectedValue) {
                value = selectedValue;
            }
            filter.selectedItem = value;
            return filter;
        });
        const rule: IGridRule = { ...this.state.rule };
        rule.filters = filters;
        if (callBack) {
            const selectedExpireDays: RegExpMatchArray | null | undefined = selectedValue?.match(/\d+/);
            if (selectedExpireDays) {
                const selectedDays: number = parseInt(selectedExpireDays[0], 10);
                callBack(selectedDays, selectedValue);
            }
        } else {
            this.prepareGridItems(rule);
        }
        this.setState({ rule: rule });
    };

    public updateSearchTermRule = (val: string) => {
        const rule: IGridRule = { ...this.state.rule };
        rule.searchTerm = val;
        this.prepareGridItems(rule);
        this.setState({ rule: rule });
    };
    private prepareGridItems = (ruleInfo: IGridRule) => {
        // first filter
        // search on filter data
        // and then sort on search and filter data...
        const rule: IGridRule = ruleInfo ? ruleInfo : this.state.rule;
        const items: any = [...this.props.gridProps.items];
        const filterItemsData = this.filterItems(ruleInfo, items);
        const searchItemsData = this.searchItems(ruleInfo, filterItemsData);
        const sortItemsData = this.sortItems(searchItemsData, rule.sortColumn.field, rule.sortColumn.sortType);
        this.setState({ items: sortItemsData, currentPage: 1 });
    };
    private searchItems = (rule: IGridRule, items: any) => {
        const searchFields = this.props.gridProps.searchFields;
        if (searchFields && searchFields.length > 0) {
            return items.filter((item: any) => {
                return searchFields.some((searchField: string) => {
                    // eslint-disable-next-line security/detect-object-injection
                    return item[searchField] && item[searchField].toLowerCase().includes(rule.searchTerm.toLowerCase());
                });
            });
        }
    };
    private filterItems = (rule: IGridRule, items: any) => {
        rule.filters.forEach((filter: IGridRuleFilter) => {
            items = items.filter((item: any) => {
                if (filter.selectedItem === filter.allLabel) {
                    return item;
                } else if (filter?.callBack) {
                    return item;
                }
                return item[filter.key] && item[filter.key].indexOf(filter.selectedItem) > -1;
            });
        });
        return items;
    };
    public sortItems = (array: any, key?: string, orderValue?: string) => {
        const order: string = orderValue ?? 'asc';
        let valA: any;
        let valB: any;
        return array.sort((a: any, b: any) => {
            let comparison: number = 0;
            if (key) {
                // eslint-disable-next-line security/detect-object-injection
                valA = key === 'date' ? new Date(a[key]) : a[key];
                // eslint-disable-next-line security/detect-object-injection
                valB = key === 'date' ? new Date(b[key]) : b[key];
            } else {
                valA = a;
                valB = b;
            }
            // Handle different data types
            if (typeof valA === 'string' && typeof valB === 'string') {
                comparison = this.alphanumericSort(valA, valB);
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
            } else if (valA instanceof Date && valB instanceof Date) {
                comparison = valA.getTime() - valB.getTime();
            } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                comparison = valA === valB ? 0 : valA ? 1 : -1;
            }
            // Adjust for descending order
            return order === 'asc' ? comparison : -comparison;
        });
    };
    private showHideFilterDropDown = (index: number) => {
        if (index === this.state.filterItemIndex) {
            this.setState({ filterItemIndex: -1 });
            return;
        }
        this.setState({ filterItemIndex: index });
    };
    public render(): JSX.Element | null {
        const isMobileView = this.props.isMobileView;
        const renderView = isMobileView ? (
            <GridMobileView
                state={this.state}
                handlePageChange={this.handlePageChange}
                updateFiltersRule={this.updateFiltersRule}
                updateSearchTermRule={this.updateSearchTermRule}
                showHideFilterDropDown={this.showHideFilterDropDown}
                gridProps={this.props.gridProps}
                ref={this.ref}
            />
        ) : (
            <GridDesktopView
                state={this.state}
                handlePageChange={this.handlePageChange}
                updateSorterRule={this.updateSorterRule}
                updateFiltersRule={this.updateFiltersRule}
                updateSearchTermRule={this.updateSearchTermRule}
                showHideFilterDropDown={this.showHideFilterDropDown}
                gridProps={this.props.gridProps}
                ref={this.ref}
            />
        );
        {
            return this.props.isLoading ? (
                <div className='nrw-loader__loading-screen'>
                    <div className='nrw-loader__loading-spinner' />
                </div>
            ) : (
                renderView
            );
        }
    }
}

export default Grid;
