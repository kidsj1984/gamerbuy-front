import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const permissionRouter: RouteConfig =  {
  path: '/permission',
  component: Layout,
  redirect: '/permission/directive',
  meta: {
    title: 'permission',
    icon: 'lock',
    roles: ['admin', 'editor'], // you can set roles in root nav
    alwaysShow: true // will always show the root menu
  },
  children: [
    {
      path: 'page',
      component: () => import(/* webpackChunkName: "permission-page" */ '@/views/demo/permission/page.vue'),
      name: 'PagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'directive',
      component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/demo/permission/directive.vue'),
      name: 'DirectivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    },
    {
      path: 'role',
      component: () => import(/* webpackChunkName: "permission-role" */ '@/views/demo/permission/role.vue'),
      name: 'RolePermission',
      meta: {
        title: 'rolePermission',
        roles: ['admin']
      }
    }
  ]
}

export const iconRouter: RouteConfig =  {
  path: '/icon',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "icons" */ '@/views/demo/icons/index.vue'),
      name: 'Icons',
      meta: {
        title: 'icons',
        icon: 'icon',
        noCache: true
      }
    }
  ]
}

export const exampleRouter: RouteConfig =  {
  path: '/example',
  component: Layout,
  redirect: '/example/list',
  meta: {
    title: 'example',
    icon: 'example'
  },
  children: [
    {
      path: 'create',
      component: () => import(/* webpackChunkName: "example-create" */ '@/views/demo/example/create.vue'),
      name: 'CreateArticle',
      meta: {
        title: 'createArticle',
        icon: 'edit'
      }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import(/* webpackChunkName: "example-edit" */ '@/views/demo/example/edit.vue'),
      name: 'EditArticle',
      meta: {
        title: 'editArticle',
        noCache: true,
        activeMenu: '/example/list',
        hidden: true
      }
    },
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "example-list" */ '@/views/demo/example/list.vue'),
      name: 'ArticleList',
      meta: {
        title: 'articleList',
        icon: 'list'
      }
    }
  ]
}

export const tabRouter: RouteConfig =  {
  path: '/tab',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "tab" */ '@/views/demo/tab/index.vue'),
      name: 'Tab',
      meta: {
        title: 'tab',
        icon: 'tab'
      }
    }
  ]
}

export const errorRouter: RouteConfig =  {
  path: '/error',
  component: Layout,
  redirect: 'noredirect',
  meta: {
    title: 'errorPages',
    icon: '404'
  },
  children: [
    {
      path: '401',
      component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
      name: 'Page401',
      meta: {
        title: 'page401',
        noCache: true
      }
    },
    {
      path: '404',
      component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
      name: 'Page404',
      meta: {
        title: 'page404',
        noCache: true
      }
    }
  ]
}

export const errorLogRouter: RouteConfig =  {
  path: '/error-log',
  component: Layout,
  redirect: 'noredirect',
  children: [
    {
      path: 'log',
      component: () => import(/* webpackChunkName: "error-log" */ '@/views/demo/error-log/index.vue'),
      name: 'ErrorLog',
      meta: {
        title: 'errorLog',
        icon: 'bug'
      }
    }
  ]
}

export const excelRouter: RouteConfig =  {
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    {
      path: 'export-excel',
      component: () => import(/* webpackChunkName: "export-excel" */ '@/views/demo/excel/export-excel.vue'),
      name: 'ExportExcel',
      meta: { title: 'exportExcel' }
    },
    {
      path: 'export-selected-excel',
      component: () => import(/* webpackChunkName: "select-excel" */ '@/views/demo/excel/select-excel.vue'),
      name: 'SelectExcel',
      meta: { title: 'selectExcel' }
    },
    {
      path: 'export-merge-header',
      component: () => import(/* webpackChunkName: "merge-header" */ '@/views/demo/excel/merge-header.vue'),
      name: 'MergeHeader',
      meta: { title: 'mergeHeader' }
    },
    {
      path: 'upload-excel',
      component: () => import(/* webpackChunkName: "upload-excel" */ '@/views/demo/excel/upload-excel.vue'),
      name: 'UploadExcel',
      meta: { title: 'uploadExcel' }
    }
  ]
}

export const zipRouter: RouteConfig =  {
  path: '/zip',
  component: Layout,
  redirect: '/zip/download',
  meta: {
    title: 'zip',
    icon: 'zip',
    alwaysShow: true // will always show the root menu
  },
  children: [
    {
      path: 'download',
      component: () => import(/* webpackChunkName: "zip" */ '@/views/demo/zip/index.vue'),
      name: 'ExportZip',
      meta: { title: 'exportZip' }
    }
  ]
}

export const pdfRouter: RouteConfig =  {
  path: '/pdf',
  component: Layout,
  redirect: '/pdf/index',
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "pdf" */ '@/views/demo/pdf/index.vue'),
      name: 'PDF',
      meta: {
        title: 'pdf',
        icon: 'pdf'
      }
    }
  ]
}

export const pdfDownloadRouter: RouteConfig =  {
  path: '/pdf-download-example',
  component: () => import(/* webpackChunkName: "pdf-download-example" */ '@/views/demo/pdf/download.vue'),
  meta: { hidden: true }
}

export const themeRouter: RouteConfig =  {
  path: '/theme',
  component: Layout,
  redirect: 'noredirect',
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "theme" */ '@/views/demo/theme/index.vue'),
      name: 'Theme',
      meta: {
        title: 'theme',
        icon: 'theme'
      }
    }
  ]
}

export const clipboardRouter: RouteConfig =  {
  path: '/clipboard',
  component: Layout,
  redirect: 'noredirect',
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "clipboard" */ '@/views/demo/clipboard/index.vue'),
      name: 'Clipboard',
      meta: {
        title: 'clipboard',
        icon: 'clipboard'
      }
    }
  ]
}

export const i18nRouter: RouteConfig =  {
  path: '/i18n',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "i18n-demo" */ '@/views/demo/i18n-demo/index.vue'),
      name: 'I18n',
      meta: {
        title: 'i18n',
        icon: 'international'
      }
    }
  ]
}

export const guideRouter: RouteConfig =  {
  path: '/guide',
  component: Layout,
  redirect: '/guide/index',
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
      name: 'Guide',
      meta: {
        title: 'guide',
        icon: 'guide',
        noCache: true
      }
    }
  ]
}
