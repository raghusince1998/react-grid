import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../grid.scss'

const GridMobileView = React.forwardRef((props: any, ref: any) => {
    const itemsPerPage = props.gridProps.pageSize ?? 5;
    const currentPage: number = props.state.currentPage;
    const totalPages: number = Math.ceil(props.state.items.length / itemsPerPage);
    const { mobileDataProps } = props.gridProps;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageItems = props.state.items.slice(indexOfFirstItem, indexOfLastItem);
    const noOfPagesPerSet = 4;
    const [currentSet, setCurrentSet] = React.useState<number>(0);
    const [total, setTotal] = useState<number[]>([]);
    const [paginationSubArray, setPaginationSubArray] = useState<number[]>([]);
    useEffect(() => {
        const currentSet = 0;
        const tempArr: number[] = [];
        const totalNoOfPagesCount = Math.ceil(props.state.items.length / props.gridProps.pageSize);
        for (let i = 1; i <= totalNoOfPagesCount; i++) {
            tempArr.push(i);
        }
        setTotal([...tempArr]);
        setPaginationSubArray(tempArr.slice(currentSet * noOfPagesPerSet, currentSet * noOfPagesPerSet + noOfPagesPerSet)); // check if last then assign last
        setCurrentSet(currentSet);
    }, [props.state.items]);

    const updatePageSet = (set: number) => {
        setCurrentSet(set);
        const startingIndex = set * noOfPagesPerSet;
        setPaginationSubArray(total.slice(startingIndex, startingIndex + noOfPagesPerSet));
        props.handlePageChange(startingIndex + 1);
    };

    return (
        <div className={'ms-grid'}>
            <div className='ms-grid-listing_filter'>
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
                                        readOnly={true}
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
            <div className='ms-grid-listing-data'>
                {currentPageItems.map((data: any, index: any) => (
                    <div key={index} className='ms-grid-listing-data_cards'>
                        {mobileDataProps.title && (
                            <>
                                <h1 className='ms-grid-listing-data_cards_title'>{data[mobileDataProps.title]}</h1>
                                <hr className='ms-grid-listing-data_cards_border' />
                            </>
                        )}
                        <div>
                            {mobileDataProps.primaryDescription &&
                                mobileDataProps.primaryDescription.length > 0 &&
                                mobileDataProps.primaryDescription.map((primaryDescription: any, index: number) => {
                                    return (
                                        <h3 className='ms-grid-listing-data_cards_primaryDescription' key={index}>
                                            {/* eslint-disable-next-line security/detect-object-injection */}
                                            {data[primaryDescription]}
                                        </h3>
                                    );
                                })}
                            <div>
                                {mobileDataProps.secondaryDescription &&
                                    mobileDataProps.secondaryDescription.length > 0 &&
                                    mobileDataProps.secondaryDescription.map((secondaryDescription: any, index: number) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <div className='ms-grid-listing-data_cards_secondaryDescription'>
                                                    <span>{data[secondaryDescription.item1]}</span>
                                                    <span>{secondaryDescription.separator}</span>
                                                    <span>{data[secondaryDescription.item2]}</span>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>

                            {data.requestedBy && (
                                <div className={'ms-grid-listing-data_cards_requested-by'}>Requested by: {data.requestedBy} </div>
                            )}
                            {data.status && (
                                <button
                                    className={`ms-grid-listing-data_cards_data status-button ${data.status
                                        .replace(/\s+/g, '-')
                                        .toLowerCase()}`}
                                >
                                    {data.status}
                                </button>
                            )}

                            {props.gridProps.actions && (
                                <button
                                    className={`ms-grid-listing-data_cards_data_button ${data.status && 'nrw-history__button'}`}
                                    onClick={props.gridProps.actions.callBack ? () => props.gridProps.actions.callBack(data) : () => {}}
                                >
                                    {props.gridProps.actions.label}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {currentPageItems.length === 0}
            {currentPageItems && currentPageItems.length > 0 && (
                <div className={'ms-grid-listing_pagination'}>
                    {/*prev pagination page*/}
                    <div
                        className={
                            currentSet === 0 ? 'ms-grid-listing_pagination__outer_prev disable' : 'ms-grid-listing_pagination__outer_prev'
                        }
                        title={'Previous Set'}
                        onClick={() => {
                            if (currentSet >= 1) {
                                updatePageSet(currentSet - 1);
                            }
                        }}
                    >
                        <button
                            onClick={() => {
                                if (currentSet >= 1) {
                                    updatePageSet(currentSet - 1);
                                }
                            }}
                            disabled={currentSet === 0}
                            aria-label={'outer prev'}
                        />
                    </div>
                    <span className={'ms-grid-listing_pagination_prev'}>
                        <button
                            className={`ms-grid-listing_pagination_prev-icon ${currentPage === 1 ? 'active' : ''}`}
                            onClick={() => {
                                if (currentPage === currentSet * noOfPagesPerSet + 1) {
                                    updatePageSet(currentSet - 1);
                                } else {
                                    props.handlePageChange(currentPage - 1);
                                }
                            }}
                            title={'Prev Page'}
                            disabled={currentPage === 1}
                        />
                    </span>
                    {paginationSubArray &&
                        paginationSubArray.map((pageNumber: number) => (
                            <span key={pageNumber}>
                                <button
                                    onClick={() => props.handlePageChange(pageNumber)}
                                    className={`ms-grid-listing_pagination_num ${props.state.currentPage === pageNumber ? 'active' : ''}`}
                                >
                                    {pageNumber}
                                </button>
                            </span>
                        ))}

                    <span className={'ms-grid-listing_pagination_next'}>
                        <button
                            onClick={() => {
                                if (currentPage === currentSet * noOfPagesPerSet + noOfPagesPerSet) {
                                    updatePageSet(currentSet + 1);
                                } else {
                                    props.handlePageChange(currentPage + 1);
                                }
                            }}
                            title={'Next Page'}
                            disabled={currentPage === totalPages}
                            className={`ms-grid-listing_pagination_next-icon ${currentPage === totalPages ? 'active' : ''}`}
                        />
                    </span>
                    <div
                        aria-label={'Next Set'}
                        className={
                            currentSet === Math.ceil(total.length / noOfPagesPerSet) - 1
                                ? 'ms-grid-listing_pagination__outer_next disable'
                                : 'ms-grid-listing_pagination__outer_next'
                        }
                        onClick={() => {
                            if (currentSet < totalPages - 1) {
                                updatePageSet(currentSet + 1);
                            }
                        }}
                    >
                        <button disabled={currentSet === Math.ceil(total.length / noOfPagesPerSet) - 1} aria-label={'outer next'} />
                    </div>
                </div>
            )}
        </div>
    );
});

export default GridMobileView;
