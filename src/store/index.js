import Vue from 'vue';
import Vuex from 'vuex';
import { getDateOnly } from '../utils/dateHelper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: JSON.parse(localStorage.getItem('todos')) || [],
    nextId: 1,
  },
  mutations: {
    ADD_TODO(state, { text, creator, deadline, priority, tags }) {
      const maxId = state.todos.length > 0 ? Math.max(...state.todos.map(t => t.id)) : 0;
      state.todos.push({
        id: maxId + 1,
        text,
        done: false,
        isFavorite: false,
        creator,
        deadline,
        priority: priority || 'Low',
        tags: tags || [],
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    DELETE_TODO(state, id) {
      state.todos = state.todos.filter(todo => todo.id !== id);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    TOGGLE_TODO(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    TOGGLE_FAVORITE(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.isFavorite = !todo.isFavorite;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
  },
  getters: {
    allTodos: state => state.todos,
    doneTodos: state => state.todos.filter(todo => todo.done),
    todayTodos: state => {
      const today = getDateOnly(new Date());
      return state.todos.filter(todo => !todo.done && todo.deadline && getDateOnly(new Date(todo.deadline)) >= today);
    },
    overdueTodos: state => {
      const today = getDateOnly(new Date());
      return state.todos.filter(todo => !todo.done && todo.deadline && getDateOnly(new Date(todo.deadline)) < today);
    },
    favoriteTodos: state => state.todos.filter(todo => todo.isFavorite),
  },
});
