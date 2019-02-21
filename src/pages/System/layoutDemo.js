import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Select,
  Card,
  Form,
  Button,
  Modal,
  Divider,
  Popconfirm,
  Icon,
  Input,
  InputNumber,
  DatePicker,
} from 'antd';
import styles from './layoutDemo.less';
import JTable from '@/components/JTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ system, loading }) => ({
  system,
  loading: loading.models.system,
}))
@Form.create()
class FormLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      formValues: {},
    };
  }
  add = () => {
    this.setState({
      title:'新增',
      modalVisible: true,
      formValues: {
        role_name: '',
      },
    });
  };
  edit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetchRoleInfo',
      callback: response => {
        if (!response.code) {
          const {
            data,
            data: { authPaths },
          } = response;
          this.setState({
            title:'修改',
            modalVisible: true,
            formValues: data,
          });
        }
      },
    });
  };
  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let result = { ...fieldsValue };
      console.log(result);
      this.onCancel();
    });
  };
  onCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  onChange = checkedList => {
    this.setState({
      checkedList,
    });
  };
  render() {
    const { form,pageName } = this.props;
    return (
      <Modal
        destroyOnClose
        title={`${this.state.title}${pageName}`}
        width={600}
        size="small"
        visible={this.state.modalVisible}
        onOk={this.okHandle}
        onCancel={() => this.onCancel()}
      >
        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="角色名称">
          {form.getFieldDecorator('role_name', {
            initialValue: this.state.formValues.role_name,
            rules: [{ required: true, message: '请输入至少五个以上字符！', min: 2 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

@Form.create()
class SearchForm extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      expandForm: false
    }
  }

  handleSearch = e => {
    e.preventDefault();

    const { tableReload, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      tableReload(fieldsValue)
    });
  };

  handleFormReset = () => {
    const { form ,tableReload} = this.props;
    form.resetFields();
    tableReload({})
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  render(){
    const { expandForm } = this.state;
      return(
        <div className={styles.tableListForm}>
        {
          expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()
        }
        </div>
      )
  }
}
const actionRenderer = props => {
  const {
    context: { handleUpdate },
  } = props;
  return (
    <Fragment>
      <a onClick={() => handleUpdate()}>修改</a>
      <Divider type="vertical" />
      <Popconfirm
        title="确认删除？"
        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      >
        <a>删除</a>
      </Popconfirm>
    </Fragment>
  );
};
@connect(({ system, loading }) => ({
  system,
  loading: loading.models.system,
}))
class LayoutDemo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageName: '页面Demo',
      tableList:[],
      frameworkComponents: {
        actionRenderer,
      },
      columnDefs: [
        { headerName: '角色名称', field: 'role_name' },
        { headerName: '创建时间', field: 'create_time' },
        { headerName: '修改人', field: 'create' },
        { headerName: '操作', field: 'action', width: 100, cellRenderer: 'actionRenderer' },
      ],
    };
  }
  handleAdd = () => {
    this.formRef.add();
  };
  handleUpdate = fields => {
    this.formRef.edit();
  };
  componentDidMount() {
      this.tableReload({})
  };

  tableReload = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetchRoleList',
      callback: response => {
        if (!response.code) {
          this.setState({
            tableList: response.data,
          });
        }
      },
    });
    console.log(values)
  };
  
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef;
  };
  render() {
    const {
      route: { authorized },
    } = this.props;
    return (
      <PageHeaderWrapper title={this.state.pageName}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
                tableReload={this.tableReload} 
                wrappedComponentRef={this.saveSearchFormRef}/>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <JTable
              fileName={this.state.pageName}
              columnDefs={this.state.columnDefs}
              rowData={this.state.tableList}
              context={this}
              frameworkComponents={this.state.frameworkComponents}
            />        
          </div>
        </Card>
        <FormLayout wrappedComponentRef={this.saveFormRef} pageName={this.state.pageName} />
      </PageHeaderWrapper>
    );
  }
}
export default LayoutDemo;
