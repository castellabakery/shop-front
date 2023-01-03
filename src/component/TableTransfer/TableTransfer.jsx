import {Table, Transfer} from "antd";
import difference from "lodash/difference";
import React from "react";

const TableTransfer = ({leftColumns, rightColumns, onRow, rowKey = 'idx', rightRowKey = 'idx', leftRowKey = 'idx', leftFilter, isDisabled, titles, selectAllLabels, onSelectChange, ...restProps}) => {
    const operations = ['추가', '제거'];
    const _selectAllLabels = selectAllLabels || ['대기중인 사용자 목록', '추가된 사용자 목록'];
    return (
        <Transfer {...restProps} titles={titles} selectAllLabels={_selectAllLabels} operations={operations}
                  onSelectChange={onSelectChange || null}
                  showSelectAll={false}
                  rowKey={record => record[rowKey]}>
            {({
                  direction,
                  filteredItems,
                  onItemSelectAll,
                  onItemSelect,
                  selectedKeys: listSelectedKeys,
                  disabled: listDisabled,
              }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;

                if (direction === 'left' && leftFilter) {
                    filteredItems = leftFilter(filteredItems);
                }

                const rowSelection = {
                    getCheckboxProps: item => ({disabled: listDisabled || (direction === 'left' && isDisabled(item))}),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows
                            .filter(item => !isDisabled(item))
                            .map((record) => record[rowKey]);

                        const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys);

                        onItemSelectAll(diffKeys, selected);
                    },
                    onSelect(record, selected) {
                        onItemSelect(record[rowKey], selected);
                    },

                    selectedRowKeys: listSelectedKeys,
                };

                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        rowKey={direction === 'left' ? leftRowKey : rightRowKey}
                        style={{pointerEvents: listDisabled ? 'none' : null}}
                        onRow={(record) => {
                            record.onItemSelect = onItemSelect;
                            record.listSelectedKeys = listSelectedKeys;
                            if (onRow) {
                                return onRow(record, direction, onItemSelect, !listSelectedKeys.includes(record[rowKey]));
                            }

                            return {
                                onClick: () => {
                                    const {disabled: itemDisabled} = record;
                                    if (itemDisabled || listDisabled || (direction === 'left' && isDisabled(record))) return;
                                    onItemSelect(record[rowKey], !listSelectedKeys.includes(record[rowKey]));
                                },
                            };
                        }}
                    />
                );
            }}
        </Transfer>
    )
};

export default TableTransfer