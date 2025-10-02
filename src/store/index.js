import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: 'Купить молоко', done: false, creator: 'Cristiano Ronaldo', deadline: '2025-10-10' },
      { id: 2, text: 'Купить мясо', done: true, creator: 'Leo Messi', deadline: '2025-10-05' },
    ],
    nextId: 3,
  },
  mutations: {
    ADD_TODO(state, { text, creator, deadline }) {
      state.todos.push({ id: state.nextId++, text, done: false, creator, deadline });
    },
    DELETE_TODO(state, id) {
      state.todos = state.todos.filter(todo => todo.id !== id);
    },
    TOGGLE_TODO(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    },
  },
  getters: {
    allTodos: state => state.todos,
    doneTodos: state => state.todos.filter(todo => todo.done),

    overdueTodos: state => {
      const today = new Date('2025-10-02');
      return state.todos.filter(todo => !todo.done && todo.deadline && new Date(todo.deadline) < today);
    },
  },
});
