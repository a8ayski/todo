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
      <el-input v-model="newCreator" placeholder="Creator" class="w-full" clearable></el-input>
      <el-date-picker
        v-model="newDeadline"
        type="date"
        placeholder="Deadline"
        class="w-full"
        format="yyyy-MM-DD"
        value-format="yyyy-MM-DD"
      ></el-date-picker>
      <el-button type="primary" @click="handleAdd" class="w-full animated-hover">Add Task</el-button>
    </div>

    <div class="space-y-3">
      <el-list>
        <el-list-item v-for="todo in todos" :key="todo.id">
          <TodoItem :todo="todo" @toggle="toggleTodo" @delete="deleteTodo" @open-detail="openDetail" />
        </el-list-item>
      </el-list>
      <p v-if="todos.length === 0" class="text-center text-gray-500">No tasks 😴</p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm font-medium text-gray-600">Tasks: {{ todos.length }}</p>
    </div>

    <el-drawer
      title="Task Details"
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      :wrapperClosable="true"
      size="30%"
    >
      <TodoDetail :todo="selectedTodo" @close="closeDetail" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TodoItem from './TodoItem.vue';
import TodoDetail from './TodoDetail.vue';

export default {
  components: { TodoItem, TodoDetail },
  data() {
    return {
      newTodo: '',
      newCreator: '',
      newDeadline: null,
      detailDrawerVisible: false,
      selectedTodo: null,
    };
  },
  computed: {
    ...mapGetters(['allTodos']),
    todos() {
      return this.allTodos;
    },
  },
  watch: {
    '$route.params.id'(newId) {
      console.log('Route id changed:', newId);
      if (newId) {
        this.selectedTodo = this.allTodos.find(t => t.id === parseInt(newId));
        this.detailDrawerVisible = true;
      } else {
        this.closeDetail();
      }
    },
  },
  methods: {
    handleAdd() {
      if (!this.newTodo.trim()) {
        this.$message.error('Введите текст задачи!');
        return;
      }
      else {
              this.$store.commit('ADD_TODO', {
          text: this.newTodo,
          creator: this.newCreator.trim() || 'Anonymous',
          deadline: this.newDeadline || '',
        });
      }  
      let deadlineStr = '';
      if (this.newDeadline) {
        deadlineStr = this.newDeadline.format('yyyy-MM-DD');
        console.log(deadlineStr)
      }
      console.log('Before commit: text', this.newTodo, 'creator', this.newCreator, 'deadline', deadlineStr);
      this.$store.commit('ADD_TODO', {
        text: this.newTodo,
        creator: this.newCreator.trim() || 'Anonymous',
        deadline: deadlineStr,
      });
      console.log('After commit: todos', this.$store.state.todos);
      this.newTodo = '';
      this.newCreator = '';
      this.newDeadline = null;
      this.$message.success('Задача добавлена!');
    },

    deleteTodo(id) {
      this.$store.commit('DELETE_TODO', id);
    },
    toggleTodo(id) {
      this.$store.commit('TOGGLE_TODO', id);
    },
    openDetail(id) {
      console.log('Open detail for id:', id);
      this.$router.push(`/todo/${id}`);
    },
    closeDetail() {
      console.log('Close detail');
      this.$router.push('/');
      this.detailDrawerVisible = false;
      this.selectedTodo = null;
    },
  },
};
</script>
