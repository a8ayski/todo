import Vue from 'vue';
import VueRouter from 'vue-router';
import TodoList from '../components/TodoList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'TodoList',
    component: TodoList,
  },
  {
    path: '/todo/:id',
    name: 'TodoDetail',
    component: TodoList,
    props: true,
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
