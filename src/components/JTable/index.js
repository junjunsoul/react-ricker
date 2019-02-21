import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import styles from './index.less';
import moment from 'moment';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { Row, Col, Card, Icon, Input, Button } from 'antd';
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
        resizable: true,
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
  onBtExport() {
    console.log(123123);
    this.gridApi.exportDataAsExcel({
      fileName: (this.props.fileName || '') + moment().format('YYYYMMDD'),
    });
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
          <Col md={18} sm={24} />
          <Col md={6} sm={24}>
            <Row>
              <Col span={20}>
                <Search placeholder="在表格中搜索..." onSearch={value => this.quickFilter(value)} />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button type="dashed" onClick={() => this.onBtExport()} icon="download" />
              </Col>
            </Row>
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
