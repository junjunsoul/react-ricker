// authChip 权限碎片
// miniDepend 最小权限依赖
// hideChildrenInMenu 用于隐藏不需要在菜单中展示的子路由。用法可以查看 分步表单 的配置。
// hideInMenu 可以在菜单中不展示这个路由，包括子路由。效果可以查看 exception/trigger页面。
// 最多显示三级菜单
export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  //mobil
  {
    path: '/mobil',
    component: '../layouts/BasicLayout',
    routes: [
      {
        authChip: ['system.test_list', 'system.test_add'],
        miniDepend: ['system.test_list'],
        isMobile: true,
        path: '/mobil/test',
        name: 'test',
        component: './Mobil/test'
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // authChip: ['system.test_list', 'system.test_add'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            authChip: ['system.analysis_charts'],
            miniDepend: ['system.analysis_charts'],
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            authChip:['system.monitor_tag'],
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          }, 
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
          {
            path: '/profile',
            name: 'profile',
            routes: [
              // profile
              {
                path: '/profile/basic',
                name: 'basic',
                component: './Profile/BasicProfile',
              },
              {
                path: '/profile/advanced',
                name: 'advanced',
                component: './Profile/AdvancedProfile',
              },
            ],
          },          
        ],
      },
      // other
      {
        path: '/other',
        name: 'other',
        routes:[
          {
            name: 'result',
            path: '/result',
            routes: [
              // result
              {
                path: '/result/success',
                name: 'success',
                component: './Result/Success',
              },
              { path: '/result/fail', name: 'fail', component: './Result/Error' },
            ],
          },
          {
            name: 'exception',
            path: '/exception',
            routes: [
              // exception
              {
                path: '/exception/403',
                name: 'not-permission',
                component: './Exception/403',
              },
              {
                path: '/exception/404',
                name: 'not-find',
                component: './Exception/404',
              },
              {
                path: '/exception/500',
                name: 'server-error',
                component: './Exception/500',
              },
              {
                path: '/exception/trigger',
                name: 'trigger',
                hideInMenu: true,
                component: './Exception/TriggerException',
              },
            ],
          },          
        ]
      },
      // account
      {
        name: 'account',
        path: '/account',
        hideInMenu : true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //system
      {
        name: 'system',
        path: '/system',
        routes:[
          {
            path: '/system/role',
            name: 'role',
            authChip:['system.role_auth'],
            miniDepend:['system.role_auth'],
            component: './System/role',
          },
          {
            path: 'system/interface',
            name: 'interface',
            component: './System/interface'
          }
        ]
      },
      // 404
      {
        component: '404',
      },
    ],
  },
];
