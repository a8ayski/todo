<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <div class="mb-6 space-y-4">
      <el-input
        v-model="newTodo"
        placeholder="Add new todo..."
        @keyup.enter="handleAdd"
        class="w-full"
        clearable
      ></el-input>
      <el-input v-model="newCreator" placeholder="Creator (Name Surname)..." class="w-full" clearable></el-input>
      <el-date-picker
        v-model="newDeadline"
        type="date"
        placeholder="Deadline (YYYY-MM-DD)"
        class="w-full"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      ></el-date-picker>
      <el-button type="primary" @click="handleAdd" class="w-full animated-hover">Add Task</el-button>
    </div>

    <div class="space-y-3">
      <el-list>
        <el-list-item v-for="todo in filteredTodos" :key="todo.id">
          <TodoItem :todo="todo" @toggle="toggleTodo" @delete="deleteTodo" />
        </el-list-item>
      </el-list>
      <p v-if="filteredTodos.length === 0" class="text-center text-gray-500">No tasks match filter 😴</p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm font-medium text-gray-600">Showing: {{ filteredTodos.length }} tasks</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TodoItem from './TodoItem.vue';

export default {
  components: { TodoItem },
  props: ['filter'],
  data() {
    return {
      newTodo: '',
      newCreator: '',
      newDeadline: '',
    };
  },
  computed: {
    ...mapGetters(['allTodos', 'doneTodos', 'overdueTodos']),
    filteredTodos() {
      switch (this.filter) {
        case 'done':
          return this.doneTodos;
        case 'overdue':
          return this.overdueTodos;
        default:
          return this.allTodos;
      }
    },
  },
  methods: {
    handleAdd() {
      if (this.newTodo.trim()) {
        this.$store.commit('ADD_TODO', {
          text: this.newTodo,
          creator: this.newCreator.trim() || 'Anonymous',
          deadline: this.newDeadline || '',
        });
        this.newTodo = '';
        this.newCreator = '';
        this.newDeadline = '';
      }
    },
    deleteTodo(id) {
      this.$store.commit('DELETE_TODO', id);
    },
    toggleTodo(id) {
      this.$store.commit('TOGGLE_TODO', id);
    },
  },
  mounted() {
    console.log('TodoList mounted with filter:', this.filter);
  },
};
</script>
