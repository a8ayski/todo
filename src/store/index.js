import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: 'Купить молоко', done: false },
      { id: 2, text: 'Позвонить маме', done: true },
    ],
    nextId: 3,
  },
  mutations: {
    addTodo(state, text) {
      state.todos.push({ id: state.nextId++, text, done: false });
    },
    deleteTodo(state, id) {
      state.todos = state.todos.filter(todo => todo.id !== id);
    },
  },

  getters: {
    allTodos: state => state.todos,
    doneTodos: state => state.todos.filter(todo => todo.done),
  },
});
