import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../grid.scss'

const GridDesktopView = React.forwardRef((props: any, ref: any) => {
    const itemsPerPage = props.gridProps.pageSize ?? 5;
    const currentPage: number = props.state.currentPage;
    const totalPages: number = Math.ceil(props.state.items.length / itemsPerPage);
    const { columns, actions } = props.gridProps;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageItems = props.state.items.slice(indexOfFirstItem, indexOfLastItem);
    const noOfPagesPerSet = 10;
    const [currentSet, setCurrentSet] = React.useState<number>(0);
    const [total, setTotal] = useState<number[]>([]);
    const [paginationSubArray, setPaginationSubArray] = useState<number[]>([]);
    useEffect(() => {
        const tempArr: number[] = [];
        const currentSet = 0;
        const totalNoOfPagesCount = Math.ceil(props.state.items.length / props.gridProps.pageSize);
        for (let i = 1; i <= totalNoOfPagesCount; i++) {
            tempArr.push(i);
        }
        setPaginationSubArray(tempArr.slice(currentSet * noOfPagesPerSet, currentSet * noOfPagesPerSet + noOfPagesPerSet));
        setCurrentSet(currentSet);
        setTotal([...tempArr]);
    }, [props.state.items]);

    const updatePageSet = (set: number) => {
        setCurrentSet(set);
        const startingIndex = set * noOfPagesPerSet;
        setPaginationSubArray(total.slice(startingIndex, startingIndex + noOfPagesPerSet));
        props.handlePageChange(startingIndex + 1);
    };

    return (
        <div className={'ms-grid'}>
            <div className={`ms-grid-listing_filter`}>
                {props.gridProps.searchFields && props.gridProps.searchFields.length > 0 && (
                    <div className={'ms-grid-listing_filter-search'}>
                        <input
                            type='text'
                            id='search'
                            name='search'
                            placeholder={'Search'}
                            onChange={(e: any) => {
                                props.updateSearchTermRule(e.target.value);
                            }}
                            className={'ms-grid-listing_filter-search-input'}
                        />
                        <span className={'ms-grid-listing_filter-search-icon'} />
                    </div>
                )}

                <div ref={ref} className={'ms-grid-listing_filter-dropdown'}>
                    {props.state.rule.filters &&
                        props.state.rule.filters.length > 0 &&
                        props.state.rule.filters.map((filter: any, index: number) => {
                            return (
                                <div
                                    className={`ms-grid-listing_filter-dropdown-dropdownSelect ${
                                        props.state.filterItemIndex === index ? 'active' : ''
                                    }`}
                                    id={filter.key}
                                    key={filter.key}
                                    onClick={() => props.showHideFilterDropDown(index)}
                                >
                                    <input
                                        className={`ms-grid-listing_filter-dropdown-input ${
                                            props.state.filterItemIndex === index ? 'active' : ''
                                        }`}
                                        name={filter.key}
                                        value={filter.selectedItem}
                                        aria-label={' filter dropdown input '}
                                        readOnly={true}
                                        id={'inputID'}
                                    />
                                    {props.state.filterItemIndex === index && (
                                        <div className='ms-grid-listing_filter-dropdown-dropdownSelect-content'>
                                            {filter.values.map((value: any, index: number) => {
                                                return (
                                                    <a
                                                        key={index}
                                                        onClick={() => {
                                                            props.updateFiltersRule(filter.key, value, filter.callBack);
                                                        }}
                                                    >
                                                        {value}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
            <table className='ms-grid-listing_table'>
                <thead className='ms-grid-listing_table-thead'>
                <tr className='ms-grid-listing_table-thead-row'>
                    {columns.map((data: any, index: number) => (
                        <th key={index} scope='row'>
                            {data.name}
                            {data.sortable && (
                                <span
                                    onClick={() => {
                                        void props.updateSorterRule(data.field);
                                    }}
                                    className={`ms-grid-listing_table-thead-row-icon${
                                        props.state.rule.sortColumn.field === data.field
                                            ? props.state.rule.sortColumn.sortType === 'asc'
                                                ? ' asc'
                                                : props.state.rule.sortColumn.sortType === 'desc'
                                                    ? ' desc'
                                                    : ''
                                            : ''
                                    }`}
                                />
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                {currentPageItems && currentPageItems.length > 0 && (
                    <tbody className='ms-grid-listing_table-body'>
                    {currentPageItems.map((data: any, index: number) => (
                        <tr key={index}>
                            {columns.map((column: any) => {
                                return (
                                    column.field && (
                                        <td
                                            scope='row'
                                            key={column.field}
                                            className={`ms-grid-listing_table-body__data-cell ${
                                                column.field === 'status'
                                                    ? `${data[column.field]}`.replace(/\s+/g, '-').toLowerCase()
                                                    : ''
                                            }`}
                                        >
                                            {data[column.field]}
                                        </td>
                                    )
                                );
                            })}
                            {actions && (
                                <td
                                    onClick={actions.callBack ? () => actions.callBack(data) : () => {}}
                                    scope='row'
                                    className='ms-grid-listing_table-body__data-cell'
                                >
                                    {actions.label}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                )}
            </table>
            {currentPageItems.length === 0 }
            {currentPageItems && currentPageItems.length > 0 && (
                <div className={'ms-grid-listing_pagination'}>
                    <div
                        className={
                            currentSet === 0 ? 'ms-grid-listing_pagination__outer_prev disable' : 'ms-grid-listing_pagination__outer_prev'
                        }
                        onClick={() => {
                            if (currentSet >= 1) {
                                updatePageSet(currentSet - 1);
                            }
                        }}
                        title={'Previous Set'}
                    >
                        <button disabled={currentSet === 0} aria-label={'outer prev'} />
                    </div>
                    <span className={'ms-grid-listing_pagination_prev'}>
                        <button
                            onClick={() => {
                                if (currentPage === currentSet * noOfPagesPerSet + 1) {
                                    updatePageSet(currentSet - 1);
                                } else {
                                    props.handlePageChange(currentPage - 1);
                                }
                            }}
                            disabled={currentPage === 1}
                            title={'Previous Page'}
                            className={`ms-grid-listing_pagination_prev-icon ${currentPage === 1 ? 'active' : ''}`}
                        />
                    </span>
                    {paginationSubArray.map((pageNumber: number) => (
                        <span key={pageNumber}>
                            <button
                                onClick={() => props.handlePageChange(pageNumber)}
                                className={`ms-grid-listing_pagination_num ${props.state.currentPage === pageNumber ? 'active' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        </span>
                    ))}
                    <div className={'ms-grid-listing_pagination_next'}>
                        <button
                            onClick={() => {
                                if (currentPage === currentSet * noOfPagesPerSet + noOfPagesPerSet) {
                                    updatePageSet(currentSet + 1);
                                } else {
                                    props.handlePageChange(currentPage + 1);
                                }
                            }}
                            disabled={currentPage === totalPages}
                            title={'Next Page'}
                            className={`ms-grid-listing_pagination_next-icon ${currentPage === totalPages ? 'active' : ''}`}
                        />
                    </div>
                    <div
                        className={
                            currentSet === Math.ceil(total.length / noOfPagesPerSet) - 1
                                ? 'ms-grid-listing_pagination__outer_next disable'
                                : 'ms-grid-listing_pagination__outer_next'
                        }
                        title={'Next Set'}
                        onClick={() => {
                            if (currentSet < totalPages - 1) {
                                updatePageSet(currentSet + 1);
                            }
                        }}
                    >
                        <button disabled={currentSet === Math.ceil(total.length / noOfPagesPerSet) - 1} aria-label={'outer_next'} />
                    </div>
                </div>
            )}
        </div>
    );
});
export default GridDesktopView;