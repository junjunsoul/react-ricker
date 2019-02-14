import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Modal, Tag, Divider, Popconfirm, Icon } from 'antd';
import { chunk, forEach } from 'lodash';
import JTable from '@/components/JTable';
import { authChip } from '@/authorize';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GroupCheckbox from '@/components/GroupCheckbox';
const FormItem = Form.Item;

const getAuthChips = () => {
  let obj = [];
  forEach(authChip, (item, key) => {
    let options = [];
    forEach(item.chip, (chil, chilKey) => {
      options.push({
        depend: chil.depend,
        label: chil.title,
        value: `${key}.${chilKey}`,
      });
    });
    obj.push({
      title: item.title,
      options,
    });
  });
  return obj;
};
const getAuthChipsByPath = paths => {
  let arr = [];
  forEach(authChip, (item, key) => {
    forEach(item.chip, (chil, chilKey) => {
      let isTrue = true;
      chil.depend.map(inteface => {
        if (paths.indexOf(inteface.url) < 0) {
          isTrue = false;
        }
      });
      if (isTrue) {
        arr.push(`${key}.${chilKey}`);
      }
    });
  });
  return arr;
};
const getPathByAuthChips = path => {
  let arr = [];
  forEach(authChip, (item, key) => {
    forEach(item.chip, (chil, chilKey) => {
      if (`${key}.${chilKey}` === path) {
        arr.push(...chil.depend.map(inteface => inteface.url));
      }
    });
  });
  return arr;
};

@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
    };
  }
  okHandle = () => {
    const { handleAdd, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  onChange = checkedList => {
    this.setState({
      checkedList,
    });
  };
  onCancel = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
    this.setState({
      checkedList: [],
    });
  };
  componentDidMount() {}
  render() {
    const { modalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="新建角色"
        width={700}
        size="small"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => this.onCancel()}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Card title="功能权限" size="small" bodyStyle={{ paddingTop: 0 }}>
              <div style={{ height: 450, overflow: 'hidden', overflowY: 'auto' }}>
                <AuthCheckbox
                  authList={getAuthChips()}
                  checkedList={this.state.checkedList}
                  onChange={this.onChange}
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="可见菜单" size="small">
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: getAuthChipsByPath([
        '/api/getMenu',
        '/api/test/add',
        '/api/test/list',
        '/api/fake_chart_data',
      ]),
    };
  }
  okHandle = () => {
    const { handleUpdate, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  onCancel = () => {
    const { handleUpdateModalVisible } = this.props;
    handleUpdateModalVisible();
  };
  onChange = checkedList => {
    this.setState({
      checkedList,
    });
  };
  render() {
    const { updateModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="修改角色信息"
        width={700}
        size="small"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => this.onCancel()}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Card title="功能权限" size="small" bodyStyle={{ paddingTop: 0 }}>
              <div style={{ height: 450, overflow: 'hidden', overflowY: 'auto' }}>
                <AuthCheckbox
                  authList={getAuthChips()}
                  checkedList={this.state.checkedList}
                  onChange={this.onChange}
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="可见菜单" size="small">
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}
const AuthCheckbox = props => {
  const { authList, checkedList, onChange } = props;
  return (
    <Fragment>
      {chunk(authList, 2).map((item, index) => {
        return (
          <Row gutter={16} key={index}>
            {item.map(chil => {
              return (
                <Col span={24} key={chil.title}>
                  <GroupCheckbox
                    checkAllLabel={chil.title}
                    options={chil.options}
                    checkedList={checkedList}
                    onChange={onChange}
                  />
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Fragment>
  );
};
const makeRenderer = props => {
  return <Tag>{props.value}</Tag>;
};
const actionRenderer = props => {
  const {
    context: { handleUpdateModalVisible },
  } = props;
  return (
    <Fragment>
      <a onClick={() => handleUpdateModalVisible(true)}>修改</a>
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
class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      formValues: {},
      context: this,
      frameworkComponents: {
        makeRenderer,
        actionRenderer,
      },
      columnDefs: [
        { headerName: '角色名称', field: 'role_name', cellRenderer: 'makeRenderer' },
        { headerName: '创建时间', field: 'create_time' },
        { headerName: '修改人', field: 'create' },
        { headerName: '操作', field: 'action', width: 100, cellRenderer: 'actionRenderer' },
      ],
    };
  }
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    this.handleUpdateModalVisible();
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetchRoleList',
    });
  }
  render() {
    const {
      route: { authorized },
      system: { roleList },
    } = this.props;
    const { modalVisible, updateModalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="角色设置">
        <Card bordered={false}>
          <div>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </div>
          <JTable
            columnDefs={this.state.columnDefs}
            rowData={roleList}
            context={this.state.context}
            frameworkComponents={this.state.frameworkComponents}
          />
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default Role;
