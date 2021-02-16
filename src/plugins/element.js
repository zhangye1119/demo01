import Vue from 'vue'
import { Alert, Button, Cascader, Checkbox, CheckboxGroup, Select, Step, Steps, TabPane, Tabs, Tag, Upload } from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from 'element-ui'
import {Container,Header,Aside,Main,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,
    TableColumn,
    Switch,
    Pagination,
    Dialog,
    MessageBox,
    Tree,
    Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm


