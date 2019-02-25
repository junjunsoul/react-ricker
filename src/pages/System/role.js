import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Tag,
  Divider,
  Popconfirm,
  Icon,
  Tree,
  Input,
} from 'antd';
import { chunk, forEach, isEmpty } from 'lodash';
import styles from './role.less';
import { authChip } from '@/authorize';
import { getAuthMenus } from '@/authorize/utils';
import { formatMessage } from 'umi/locale';
import JTable from '@/components/JTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GroupCheckbox from '@/components/GroupCheckbox';
const FormItem = Form.Item;
const { TreeNode } = Tree;

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
      checkedList: [],
    };
  }
  add = () => {
    this.setState({
      modalVisible: true,
      formValues: {
        role_name: '',
      },
      checkedList: [],
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
            modalVisible: true,
            formValues: data,
            checkedList: getAuthChipsByPath(authPaths || []),
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
      let paths = convertPath(this.state.checkedList);
      let result = { ...fieldsValue, paths };
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
    const { form } = this.props;
    return (
      <Modal
        destroyOnClose
        title="修改角色信息"
        width={800}
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
        <Row gutter={16}>
          <Col span={15}>
            <Card title="功能权限" size="small" bodyStyle={{ paddingTop: 0 }}>
              <div style={{ height: 400, overflow: 'hidden', overflowY: 'auto' }}>
                <AuthCheckbox
                  authList={getAuthChips()}
                  checkedList={this.state.checkedList}
                  onChange={this.onChange}
                />
              </div>
            </Card>
          </Col>
          <Col span={9}>
            <Card title="菜单预览" size="small" bodyStyle={{ paddingTop: 0 }}>
              <div style={{ height: 400, overflow: 'hidden', overflowY: 'auto' }}>
                <AuthTree checkedList={this.state.checkedList} />
              </div>
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
const formatter = (data, parentName) => {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
      };
      if (item.children) {
        const children = formatter(item.children, locale);
        // Reduce memory usage
        result.children = children;
      }
      return result;
    })
    .filter(item => item);
};

//创建菜单预览组件
const renderAuth = authChip => {
  let authNode = [];
  forEach(authChip, (item, key) => {
    authNode.push(
      <TreeNode
        icon={
          <Icon
            style={{ color: item.available ? '#52c41a' : '' }}
            type={item.available ? 'key' : 'key'}
          />
        }
        title={item.title}
        key={key}
      />
    );
  });
  return authNode;
};
const treeNode = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          icon={
            <Icon
              style={{ color: item.available ? '#52c41a' : '' }}
              type={item.available ? 'check' : 'close'}
            />
          }
          title={item.name}
          key={item.path}
        >
          {renderAuth(item.authChip)}
          {treeNode(item.children)}
        </TreeNode>
      );
    } else {
      return (
        <TreeNode
          icon={
            <Icon
              style={{ color: item.available ? '#52c41a' : '' }}
              type={item.available ? 'check' : 'close'}
            />
          }
          title={item.name}
          key={item.path}
        >
          {renderAuth(item.authChip)}
        </TreeNode>
      );
    }
  });
};
const convertPath = checkedList => {
  let paths = [];
  checkedList.map(item => {
    let arr = getPathByAuthChips(item);
    arr.map(item => {
      if (paths.indexOf(item) < 0) {
        paths.push(item);
      }
    });
  });
  return paths;
};
const AuthTree = connect(({ global }) => ({
  global,
}))(props => {
  const {
    global: { allRoute },
    checkedList,
  } = props;

  const route = formatter(getAuthMenus(allRoute, convertPath(checkedList)));
  return (
    <Tree defaultExpandAll showIcon switcherIcon={<Icon type="down" />}>
      {treeNode(route)}
    </Tree>
  );
});

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
class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '角色设置',
      tableList: [],
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
  }
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    const {
      route: { authorized },
    } = this.props;
    return (
      <PageHeaderWrapper title={this.state.name}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <JTable
              fileName={this.state.name}
              columnDefs={this.state.columnDefs}
              rowData={this.state.tableList}
              context={this}
              frameworkComponents={this.state.frameworkComponents}
            />
          </div>
        </Card>
        <FormLayout wrappedComponentRef={this.saveFormRef} />
      </PageHeaderWrapper>
    );
  }
}
export default Role;
