<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <el-form ref="todoForm" :model="form" :rules="rules" class="mb-6 space-y-4">
      <el-form-item prop="newTodo">
        <el-input
          v-model="form.newTodo"
          placeholder="Add new todo..."
          @keyup.enter="handleAdd"
          class="w-full"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="newCreator">
        <el-input v-model="form.newCreator" placeholder="Creator" class="w-full" clearable></el-input>
      </el-form-item>
      <el-form-item prop="newDeadline">
        <el-date-picker
          v-model="form.newDeadline"
          type="date"
          placeholder="Deadline"
          class="w-full"
          format="yyyy/MM/dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd" class="w-full animated-hover">Add Task</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-6 flex justify-around">
      <el-button :type="currentFilter === 'all' ? 'primary' : 'default'" @click="setFilter('all')"> All </el-button>
      <el-button :type="currentFilter === 'done' ? 'primary' : 'default'" @click="setFilter('done')"> Done </el-button>
      <el-button :type="currentFilter === 'overdue' ? 'primary' : 'default'" @click="setFilter('overdue')">
        Overdue
      </el-button>
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
      :before-close="closeDetail"
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
      form: {
        newTodo: '',
        newCreator: '',
        newDeadline: null,
      },
      rules: {
        newTodo: [
          { required: true, message: 'Введите текст задачи!', trigger: 'blur' },
          { min: 1, message: 'Текст задачи не может быть пустым!', trigger: 'blur' },
        ],
      },
      detailDrawerVisible: false,
      selectedTodo: null,
      currentFilter: 'all',
      quickText: '',
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Done', value: 'done' },
        { label: 'Overdue', value: 'overdue' },
      ],
    };
  },
  computed: {
    ...mapGetters(['allTodos', 'doneTodos', 'overdueTodos']),
    stats() {
      return {
        total: this.allTodos.length,
        done: this.doneTodos.length,
        overdue: this.overdueTodos.length,
      };
    },
    todos(filterValue = 'all') {
      if (this.currentFilter == 'done') {
        return this.doneTodos;
      }
      if (this.currentFilter == 'overdue') {
        return this.overdueTodos;
      }
      if (this.currentFilter == 'all') {
        return this.allTodos;
      }
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
      this.$refs.todoForm.validate(valid => {
        if (valid) {
          this.$store.commit('ADD_TODO', {
            text: this.form.newTodo,
            creator: this.form.newCreator.trim() || 'Anonymous',
            deadline: this.form.newDeadline || '',
          });

          this.$refs.todoForm.resetFields();
          this.$message.success('Задача добавлена!');
        } else {
          return false;
        }
      });
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
    setFilter(filter) {
      this.currentFilter = filter;
    },
  },
};
</script>
