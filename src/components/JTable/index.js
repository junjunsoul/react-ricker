import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './index.less';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { Row, Col, Card, Icon, Input } from 'antd';
const Search = Input.Search;
class JTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowSelection: 'multiple',
      //列设置
      defaultColDef: {
        enableValue: true,
        enableRowGroup: true,
        enablePivot: false,
        sortable: true,
        filter: true,
        // icons: {
        //     sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
        //     sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        // },
        menuTabs: ['generalMenuTab', 'filterMenuTab'],
      },
      //侧边状态栏
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressSideButtons: true,
              suppressColumnFilter: false,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
      },
      //底部状态拦
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'left',
          },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ],
      },
    };
    this.tableRef = React.createRef();
  }
  quickFilter(value) {
    this.gridApi.setQuickFilter(value);
  }
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  render() {
    return (
      <div>
        <Row gutter={16} style={{ padding: '8px 0' }}>
          <Col span={18} />
          <Col span={6}>
            <Search placeholder="在表格中搜索..." onSearch={value => this.quickFilter(value)} />
          </Col>
        </Row>
        <div className="ag-theme-balham" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            enableRangeSelection={true}
            onGridReady={this.onGridReady}
            defaultColDef={this.state.defaultColDef}
            statusBar={this.state.statusBar}
            sideBar={this.state.sideBar}
            rowSelection={this.state.rowSelection}
            ref={this.tableRef}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
export default JTable;
