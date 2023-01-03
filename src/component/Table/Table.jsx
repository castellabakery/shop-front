import React, {useCallback, useEffect, useState} from 'react';

import PropTypes from 'prop-types';
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Pagination,
    Radio,
    Row,
    Select,
    Table as AntdTable
} from 'antd';
import {ClearOutlined, SearchOutlined} from '@ant-design/icons';
import {Loading, Message} from '../../component';
import * as CommonJs from '../../lib/Common';
import moment from "moment";

import './Table.css';

const { RangePicker } = DatePicker;

const Table = (props) => {
    const [fields, setFields] = useState([
        {
            name: ['searchConditionDate'],
            value: [],
        },
    ]);

    const {
        columns,
        filters,
        buttons,
        onList,
        statistics,
        scroll,
        searches = {},
        onRow,
        onSearch,
        title = '',
        rowClassName,
        components,
        isInitLoad = false,
        dataSource,
        rowSelection,
        innerRef,
        className,
        defaultPagination = false,
        total = 0,
        expandable = {},
        defaultParam = {},
        showDefaultButton = true,
        showDateButton = false,
        showStatistics = false,
        showPagination = true,
        showTopPagination = true,
        showBottomPagination = true,
        showHeader = true,
        pageNo = 1,
        len = 10,
        size = 'default',
        rowKey = 'idx',
        expandedRowKeys,
        locale = null,
        propDataList,
        propTotal,
        showTotalOrder = false,
        showTotalMedicine = false
    } = props;

    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [_pageNo, setPageNo] = useState(pageNo);
    const [_len, setLen] = useState(len);
    const [_total, setTotal] = useState(total);
    const [initLoad, setInitLoad] = useState(isInitLoad);
    const [isInit, setIsInit] = useState(false);
    const [filterList, setFilterList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [dateKeyList, setDateKeyList] = useState([]);
    const hasFilter = (filters && Array.isArray(filters)) || false;
    const [dateValue, setDateValue] = useState([]);
    const [point, setPoint] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalApproveAmount, setTotalApproveAmount] = useState(0);
    const [totalCancelAmount, setTotalCancelAmount] = useState(0);
    const [totalUsePoint, setTotalUsePoint] = useState(0);
    const [totalCancelPoint, setTotalCancelPoint] = useState(0);
    const [amount, setAmount] = useState(0);
    const [doStatisticsSummary, setDoStatisticsSummary] = useState(true);

    const onReset = () => {
        form.resetFields();
    };

    const onSubmit = useCallback(() => {
        form.submit();
    }, [form]);

    const _onList = (values) => {
        values = Object.assign(values, defaultParam);
        if(showStatistics){
            if(doStatisticsSummary){
                statistics(values)
                    .then((response) => {
                        console.log(response);
                        const res = response.data;
                        setTotalAmount(res.totalAmount);
                        setTotalApproveAmount(res.totalApproveAmount);
                        setTotalCancelPoint(res.totalCancelPoint);
                        setTotalCancelAmount(res.totalCancelAmount);
                        setTotalUsePoint(res.totalUsePoint);
                        setAmount(res.amount);
                    })
                    .catch((error) => {
                        Message.error(error.message);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        }
        if(propTotal > 0) {
            setTotal(propTotal);
            setDataList(propDataList);
            setIsLoading(false);
        } else {
            onList(values)
                .then((response) => {
                    const res = response.data;
                    const total = res.totalElements || 0;
                    const list = res.content || [];
                    setTotal(total);
                    setDataList(list);
                    if(showTotalOrder){
                        const point = list.reduce((acc, val) => acc + val.pointSave, 0)
                        setPoint(point);
                    }
                })
                .catch((error) => {
                    Message.error(error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const _onSearch = useCallback((pageNo = _pageNo, len = _len) => {
        form.validateFields()
            .then(values => {
                values.pageNo = pageNo;
                values.len = len;

                setPageNo(pageNo);
                setLen(len);

                const keys = Object.keys(values);
                let _values = {};
                for (let i = 0, len = keys.length; i < len; ++i) {
                    const key = keys[i];
                    const val = values[key];
                    if (!val) {
                        _values[key] = val;
                    } else {
                        if (val instanceof moment) {
                            const ins = form.getFieldInstance(key);
                            _values[key] = moment(val).format(ins && ins.props && ins.props.format ? ins.props.format : (val._f || 'YYYY-MM-DD'));
                        } else {
                            _values[key] = val;
                        }
                    }
                }

                if (!onSearch) {
                    _onList(values);
                    return;
                }
                onSearch(_values);
            })
    }, [form, onSearch, _pageNo, _len, _onList, setPageNo, setLen]);

    const makeFilterElement = useCallback(() => {
        let dateKeyList = [];
        let filterList = [];
        if (hasFilter) {
            let rows = [];
            let cnt = 0;
            for (let i = 0, len = filters.length; i < len; ++i) {
                const filter = filters[i];
                if (!filter.hasOwnProperty('key')
                    || !filter.hasOwnProperty('type')
                    || !filter.hasOwnProperty('name')
                ) {
                    console.log('filter has not required properties - ', filter);
                    continue;
                }

                const key = filter.key;
                const type = filter.type; // allow type: text, radio, select, checkbox
                const name = filter.name || '　';
                const rules = filter.rules || [{required: false}];
                const hasRules = filter.hasOwnProperty('rules');
                const placeholder = filter.placeholder || name;
                const itemStyle = hasRules ? {} : {marginBottom: '5px'};

                if (cnt > 0 && cnt % 4 === 0) {
                    filterList.push(
                        <Row gutter={[16, 8]} key={'filter-row-' + i} className={'filter_line'}>{rows}</Row>
                    );
                    rows = [];
                    cnt = 0;
                }

                let el = null;
                switch (type) {
                    case 'text': {
                        let defaultValue = filter.defaultValue || '';

                        el =
                            <Form.Item name={key}
                                       initialValue={defaultValue}
                                       label={name}
                                       rules={rules}
                                       style={itemStyle}
                            >
                                <Input placeholder={placeholder}
                                       disabled={isLoading}
                                       onPressEnter={() => {
                                           setDoStatisticsSummary(true);
                                           _onSearch(1, _len)
                                       }}/>
                            </Form.Item>;
                        break;
                    }
                    case 'radio':
                    case 'checkbox':
                    case 'select': {
                        if (!filter.hasOwnProperty('options')) {
                            break;
                        }

                        const options = filter.options;
                        if (!Array.isArray(options)) {
                            console.log('options is not Array - ', key, name, options);
                            break;
                        }

                        let optionList = [];
                        for (let o = 0, oLen = options.length; o < oLen; ++o) {
                            const option = options[o];
                            if (!option || option.constructor !== Object) {
                                console.log('option is not Object - ', key, name, option);
                                optionList = [];
                                break;
                            }

                            if (!option.hasOwnProperty('value') || !option.hasOwnProperty('name')) {
                                console.log('option hsa not required properties - ', key, name, option);
                                optionList = [];
                                break;
                            }

                            optionList.push(option);
                        }

                        if ('radio' === type) {
                            if (0 >= optionList.length) {
                                break;
                            }

                            let defaultValue = filter.defaultValue || optionList[0].value;

                            el =
                                <Form.Item name={key}
                                           initialValue={defaultValue}
                                           label={name}
                                           rules={rules}
                                           style={itemStyle}
                                >
                                    <Radio.Group buttonStyle="solid" size="small">
                                        {optionList.map(option => {
                                            return <Radio.Button value={option.value}
                                                                 key={'filter-' + key + '-' + option.value}
                                                                 disabled={isLoading}>{option.name}</Radio.Button>
                                        })}
                                    </Radio.Group>
                                </Form.Item>;
                        } else if ('checkbox' === type) {
                            if (0 >= optionList.length) {
                                break;
                            }

                            let defaultValue = filter.defaultValue || (optionList.length > 1 ? [] : undefined);

                            if (optionList.length > 1 && !Array.isArray(defaultValue)) {
                                defaultValue = [defaultValue];
                            }

                            if (optionList.length === 1) {
                                el =
                                    <Form.Item name={key}
                                               initialValue={defaultValue}
                                               valuePropName={'checked'}
                                               label={name}
                                               rules={rules}
                                               style={itemStyle}
                                    >
                                        <Checkbox value={optionList[0].value}
                                                  key={'filter-' + key + '-' + optionList[0].value}
                                                  disabled={isLoading}>{optionList[0].name}</Checkbox>
                                    </Form.Item>
                            } else {
                                el =
                                    <Form.Item name={key}
                                               initialValue={defaultValue}
                                               label={name}
                                               rules={rules}
                                               style={itemStyle}
                                    >
                                        {
                                            <Checkbox.Group>
                                                {optionList.map(option => {
                                                    return <Checkbox value={option.value}
                                                                     key={'filter-' + key + '-' + option.value}
                                                                     disabled={isLoading}>{option.name}</Checkbox>
                                                })}
                                            </Checkbox.Group>
                                        }
                                    </Form.Item>
                            }
                        } else if ('select' === type) {
                            const showSearch = filter.hasOwnProperty('showSearch') && filter.showSearch;
                            let defaultValue;

                            if (0 >= optionList.length) {
                                if (!showSearch) {
                                    break;
                                }
                                defaultValue = '';
                            } else {
                                defaultValue = undefined === filter.defaultValue ? (showSearch ? '' : optionList[0].value) : filter.defaultValue;
                            }

                            el =
                                <Form.Item
                                    name={key}
                                    initialValue={defaultValue}
                                    label={name}
                                    rules={rules}
                                    style={itemStyle}
                                >
                                    <Select
                                        allowClear={showSearch}
                                        showSearch={showSearch}
                                        placeholder={placeholder}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        disabled={isLoading}
                                    >
                                        {optionList.map(option => {
                                            return <Select.Option value={option.value}
                                                                  key={'filter-' + key + '-' + option.value}
                                            >{option.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                        }
                        break;
                    }
                    case 'date': {
                        let defaultValue = filter.defaultValue || '';
                        let picker = filter.picker || 'date';
                        let format = filter.format || 'YYYY-MM-DD';
                        let disabledFunc = filter.disabledFunc || '';
                        if (defaultValue) {
                            // defaultValue = moment(defaultValue, format);
                            defaultDateValue(defaultValue);
                        }

                        dateKeyList.push(key);

                        el =
                            <Form.Item
                                name={key}
                                label={name}
                                style={itemStyle}
                                rules={rules}
                                // initialValue={defaultValue}
                            >
                                <RangePicker
                                    style={{width: "100%"}}
                                    showToday={true}
                                    picker={picker}
                                    format={format}
                                    disabledDate={disabledFunc}
                                />
                            </Form.Item>;
                        break;
                    }
                    case 'hidden': {
                        let defaultValue = filter.defaultValue || '';

                        el =
                            <Form.Item name={key}
                                       initialValue={defaultValue}
                                       label={name}
                                       rules={rules}
                                       style={itemStyle}
                                       hidden={true}
                            >
                                <Input hidden={true}
                                       placeholder={placeholder}
                                       disabled={isLoading}
                                       onPressEnter={() => {
                                           setDoStatisticsSummary(true);
                                           _onSearch(1, _len)
                                       }}/>
                            </Form.Item>;
                        break;
                    }
                    default: {
                        break;
                    }
                }

                if (null === el) {
                    continue;
                }

                const row =
                    <Col span={6} key={'filter-col-' + key}>
                        {el}
                    </Col>;

                rows.push(row);
                ++cnt;
            }

            if (0 < rows.length) {
                filterList.push(
                    <Row gutter={[16, 8]} key={'filter-row-last'} className={'filter_line'}>{rows}</Row>
                );
            }
        }

        setDateKeyList(dateKeyList);
        return filterList;
    }, [hasFilter, filters, isLoading, _onSearch, _len, setDateKeyList, setDateValue]);

    const onFinish = values => {
        if (onList === undefined) {
            if (dataSource && dataSource.length > 0) {
                setDataList(dataSource);
                setTotal(dataSource.length);
            }
            return false;
        }

        const keys = Object.keys(values);
        let _values = {};
        for (let i = 0, len = keys.length; i < len; ++i) {
            const key = keys[i];
            const val = values[key];
            if (!val) {
                _values[key] = val;
            } else {
                if (val instanceof moment) {
                    const ins = form.getFieldInstance(key);
                    _values[key] = moment(val).format(ins && ins.props && ins.props.format ? ins.props.format : (val._f || 'YYYY-MM-DD'));
                } else {
                    _values[key] = val;
                }
            }
        }

        setIsLoading(true);

        setTimeout(() => {
            _values.pageNo = _pageNo;
            _values.len = _len;

            _values = Object.assign(_values, defaultParam);

            _onList(_values);
        }, 100);
    };

    const handlePageSize = useCallback((len) => {
        setDoStatisticsSummary(false);
        setLen(len);
        _onSearch(_pageNo, len);
    }, [_onSearch, setLen, _pageNo]);

    const handlePageNo = useCallback((pageNo, len) => {
        setDoStatisticsSummary(false);
        setPageNo(pageNo);
        _onSearch(pageNo, len);
    }, [_onSearch, setPageNo]);

    if (innerRef) {
        innerRef.current = {
            isLoading: isLoading,
            setIsLoading: setIsLoading,
            onSubmit: onSubmit,
            total: _total,
        };
    }

    useEffect(() => {
        if (false === isInit) {
            setFilterList(makeFilterElement());
            setIsInit(true);
        } else {
            if (true === initLoad) {
                setInitLoad(false);
                onSubmit();
            }
        }

        for (let key in dateKeyList) {
            if (!dateKeyList.hasOwnProperty(key)) {
                continue;
            }

            const d = dateKeyList[key];
            if (searches.hasOwnProperty(d)) {
                const v = searches[d];
                searches[d] = moment(v._i);
            }
        }

        form.setFieldsValue(searches);
        if (searches.hasOwnProperty('pageNo')) {
            if (!isNaN(searches.pageNo)) {
                const pageNo = Number(searches.pageNo);
                if (0 < pageNo) {
                    setPageNo(pageNo);
                }
            }
        }

        if (searches.hasOwnProperty('len')) {
            if (!isNaN(searches.len)) {
                const len = Number(searches.len);
                if (10 !== len && 20 !== len && 50 !== len && 100 !== len) {
                    setLen(10);
                } else {
                    setLen(len);
                }
            }
        }
    }, [makeFilterElement, initLoad, setInitLoad, setFilterList, isInit, setIsInit, onSubmit, form, searches, dateKeyList, dateValue]);

    useEffect(() => {
        if (dataSource) {
            setDataList(dataSource);
            setTotal(dataSource.length);
        }
    }, [setDataList, dataSource]);

    const tableContainer = <AntdTable expandable={expandable}
                                      columns={columns}
                                      components={components}
                                      rowClassName={rowClassName}
                                      dataSource={dataList}
                                      rowSelection={rowSelection}
                                      size={size}
                                      locale={locale}
                                      expandedRowKeys={expandedRowKeys}
                                      onRow={(record, index) => {
                                          record['rownum'] = CommonJs.makeComma(_total - ((_pageNo - 1) * len) - index);
                                          if (onRow) {
                                              return onRow(record, index);
                                          }
                                      }}
                                      scroll={scroll}
                                      title={title}
                                      showHeader={showHeader}
                                      rowKey={rowKey}
                                      pagination={defaultPagination}/>;

    const changeDateValue = (e, type) => {
        if(type === "today") {
            setFields([
                {
                    name: ['searchConditionDate'],
                    value: [moment(new Date(), "YYYY-MM-DD"), moment(new Date(), "YYYY-MM-DD")],
                },
            ])
        } else if(type === "week") {
            setFields([
                {
                    name: ['searchConditionDate'],
                    value: [moment(new Date(), "YYYY-MM-DD").subtract(1, "weeks"), moment(new Date(), "YYYY-MM-DD")],
                },
            ])
        } else if(type === "month") {
            setFields([
                {
                    name: ['searchConditionDate'],
                    value: [moment(new Date(), "YYYY-MM-DD").subtract(1, "months"), moment(new Date(), "YYYY-MM-DD")]
                },
            ])
        } else if(type === "3month") {
            setFields([
                {
                    name: ['searchConditionDate'],
                    value: [moment(new Date(), "YYYY-MM-DD").subtract(3, "months"), moment(new Date(), "YYYY-MM-DD")]
                },
           ])
        }
    }

    const defaultDateValue = (moment) => {
        setFields([
            {
                name: ['searchConditionDate'],
                value: moment,
            },
        ])
    }

    const excelDownload = () => {
        console.log(form.getFieldsValue());
        console.log(CommonJs.jsonToQueryString(form.getFieldsValue()));
        const params = {
            paymentMethod: form.getFieldValue('paymentMethod'),
            startDate: (form.getFieldValue('searchConditionDate') !== null && form.getFieldValue('searchConditionDate') !== undefined && form.getFieldValue('searchConditionDate')[0] !== undefined ? moment(form.getFieldValue('searchConditionDate')[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (form.getFieldValue('searchConditionDate') !== null && form.getFieldValue('searchConditionDate') !== undefined && form.getFieldValue('searchConditionDate')[1] !== undefined ? moment(form.getFieldValue('searchConditionDate')[1]._d).format('YYYY-MM-DD') : ''),
            recommender: form.getFieldValue('recommender')
        };
        window.location.href = process.env.REACT_APP_API_HOST + "/admin/excelDownload/sales/list" + CommonJs.jsonToQueryString(params);
    }

    return (
        <div className={undefined === className ? 'component_table_wrap' : 'component_table_wrap ' + className}>
            {
                showStatistics &&
                    <div>
                        {/*<div style={{textAlign:"left", border:"5"}}>*/}
                        {/*    총 결제 금액 : {totalAmount.toLocaleString()} | 총 취소 금액 : {(Number(totalCancelAmount) + Number(totalCancelPoint)).toLocaleString()} | 순 결제 금액 : {amount.toLocaleString()}*/}
                        {/*</div>*/}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="총 결제 금액" bordered={true}>
                                    <h3>{totalAmount.toLocaleString()} 원</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="총 취소 금액" bordered={true}>
                                    <h3>{(Number(totalCancelAmount) + Number(totalCancelPoint)).toLocaleString()} 원</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="순 결제 금액" bordered={true}>
                                    <h3>{amount.toLocaleString()} 원</h3>
                                </Card>
                            </Col>
                        </Row>
                        <br/>
                        {/*<Button onClick={excelDownload}>엑셀 다운로드</Button>*/}
                    </div>
            }
            {
                showTotalOrder &&
                    <div>
                        <div style={{textAlign:"left", border:"5"}}>총 {_total}건 | {point}p</div> {/*TODO*/}
                        <br/>
                    </div>
            }
            {
                showTotalMedicine &&
                <div>
                    <div style={{textAlign:"left", border:"5"}}>총 {_total}건 | {point}p</div> {/*TODO*/}
                    <br/>
                </div>
            }
            <Form layout={'vertical'}
                  form={form}
                  name="table_filter_form"
                  onFinish={onFinish}
                  fields={fields}
                  onFieldsChange={(_, allFields) => {
                      setFields(allFields);
                  }}>
                {
                    showDefaultButton && filterList.length > 0 &&
                    <Row className={'filter_div'}>
                        <Col span={24}>
                            {
                                filterList.length > 0 &&
                                <>
                                    {filterList}
                                </>
                            }
                            {
                                showDateButton &&
                                <Row>
                                    <Col offset={12} span={12}>
                                        <div className={'padding_bottom_15px float_right'}>
                                            <Button type="primary"
                                                    onClick={e => {changeDateValue(e, "today")}}>
                                                오늘
                                            </Button>
                                            <Button type="primary"
                                                    onClick={e => {changeDateValue(e, "week")}}>
                                                일주일
                                            </Button>
                                            <Button type="primary"
                                                    onClick={e => {changeDateValue(e, "month")}}>
                                                1개월
                                            </Button>
                                            <Button type="primary"
                                                    onClick={e => {changeDateValue(e, "3month")}}>
                                                3개월
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            }
                            {
                                showDefaultButton &&
                                <Row>
                                    <Col offset={12} span={12}>
                                        <div className={'padding_bottom_15px float_right'}>
                                            <Button type="primary" icon={<SearchOutlined/>}
                                                    onClick={() => {
                                                        setDoStatisticsSummary(true);
                                                        _onSearch(1, _len);
                                                    }}
                                                    loading={isLoading}>
                                                검색
                                            </Button>
                                            {
                                                filterList.length > 0 &&
                                                <Button className={'margin_left_7px'} icon={<ClearOutlined/>}
                                                        onClick={onReset}
                                                        loading={isLoading}>
                                                    초기화
                                                </Button>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                }
            </Form>

            {
                buttons &&
                <Row>
                    <Col span={24} className={'float_right'}>
                        <div className={'padding_bottom_15px padding_top_18px float_right'}>
                            {buttons.map((button, i) => {
                                return <Button key={'filter-button-' - i}
                                               type={button.type || 'default'}
                                               icon={button.icon || null}
                                               className={'margin_left_5px'}
                                               disabled={button.disabled || false}
                                               onClick={button.onClick || null}
                                               loading={isLoading}>
                                    {button.name}
                                </Button>
                            })}
                        </div>
                    </Col>
                </Row>
            }

            {
                showPagination &&
                showTopPagination &&
                <Row>
                    <Col span={24}>
                        <Pagination
                            size={size}
                            total={_total}
                            showTotal={(total, range) => `총 ${CommonJs.makeComma(total)} 개 중 ${CommonJs.makeComma(range[0])}-${CommonJs.makeComma(range[1])}`}
                            defaultPageSize={_len}
                            pageSize={_len}
                            defaultCurrent={_pageNo}
                            current={_pageNo}
                            className={'pagination'}
                            onShowSizeChange={(current, size) => handlePageSize(size)}
                            onChange={(page, pageSize) => handlePageNo(page, pageSize)}
                            disabled={isLoading}
                            showSizeChanger={true}
                        />
                    </Col>
                </Row>
            }

            <Row>
                <Col span={24}>
                    <Loading loading={isLoading}>
                        {tableContainer}
                    </Loading>
                </Col>
            </Row>

            {
                showPagination &&
                showBottomPagination &&
                <Row>
                    <Col span={24}>
                        <Pagination
                            size={size}
                            total={_total}
                            showTotal={(total, range) => `총 ${CommonJs.makeComma(total)} 개 중 ${CommonJs.makeComma(range[0])}-${CommonJs.makeComma(range[1])}`}
                            defaultPageSize={_len}
                            pageSize={_len}
                            defaultCurrent={_pageNo}
                            current={_pageNo}
                            className={'pagination'}
                            onShowSizeChange={(current, size) => handlePageSize(size)}
                            onChange={(page, pageSize) => handlePageNo(page, pageSize)}
                            disabled={isLoading}
                            showSizeChanger={true}
                        />
                    </Col>
                </Row>
            }
        </div>
    )
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    onList: PropTypes.func,
    statistics: PropTypes.func,
    isInitLoad: PropTypes.bool,
    filters: PropTypes.array,
    buttons: PropTypes.array,
    className: PropTypes.string,
    showDefaultButton: PropTypes.bool,
    showTotalOrder: PropTypes.bool,
    showTotalMedicine: PropTypes.bool,
    showDateButton: PropTypes.bool,
    showStatistics: PropTypes.bool,
    showPagination: PropTypes.bool,
    showHeader: PropTypes.bool,
    pageNo: PropTypes.number,
    len: PropTypes.number,
    innerRef: PropTypes.object,
    defaultParam: PropTypes.object,
    searches: PropTypes.object,
    onSearch: PropTypes.func,
    onRow: PropTypes.func,
};

export default Table;
