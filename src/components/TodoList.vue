<template>
  <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between mb-5">
      <h1 class="font-bold text-3xl">My Day</h1>
      <h2 class="font-bold text-3xl">{{ todays }}</h2>
    </div>
    <div class="mb-6">
      <div class="flex gap-1">
        <i
          class="el-icon-star-on text-lg text-yellow-500"
          title="Favorites"
        ></i>
        <p class="font-medium items-center pt-0.5">Favorites</p>
      </div>
      <div class="max-w-5xl mx-auto bg-gray-300 rounded-lg shadow-md p-6">
        <p v-if="favoriteTodos.length==0" class="text-center">
          You don't have favorite tasks yet
        </p>
         <el-list v-else>
        <el-list-item v-for="todo in myFovriteTodos" :key="todo.id">
          <TodoItem :todo="todo" @toggle="toggleTodo" @delete="deleteTodo" @open-detail="openDetail" @favorite="toggleFavorite"   />
        </el-list-item>
      </el-list>

      </div>
    </div>
    <div class="mb-6">
      <div class="flex gap-1">
        <i
          class="el-icon-s-claim text-lg text-green-400"
          title="Todays"
        ></i>
        <p class="font-medium items-center pt-0.5">Today</p>
      </div>
      <div class="max-w-5xl mx-auto bg-gray-300 rounded-lg shadow-md p-6 ">
        <p v-if="todayTodos.length==0" class="text-center">
          Today you are free!
        </p>
          <el-list v-else>
        <el-list-item v-for="todo in myTodayTodos" :key="todo.id">
          <TodoItem :todo="todo" @toggle="toggleTodo" @delete="deleteTodo" @open-detail="openDetail" @favorite="toggleFavorite"   />
        </el-list-item>
      </el-list>
          
      </div>
    </div>
    <div class="bg-gray-300 p-6 rounded-lg mb-6">
      <el-form ref="todoForm" :model="form" :rules="rules" class="space-y-4">
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
          <el-button type="primary" @click="handleAdd" class="max-w-24 animated-hover">Add Task</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <p class="mb-1">Filters</p>
      <div class="mb-6 flex gap-2">
        <el-button :type="currentFilter === 'all' ? 'primary' : 'default'" @click="setFilter('all')"> All </el-button>
        <el-button :type="currentFilter === 'done' ? 'primary' : 'default'" @click="setFilter('done')">
          Done
        </el-button>
        <el-button :type="currentFilter === 'overdue' ? 'primary' : 'default'" @click="setFilter('overdue')">
          Overdue
        </el-button>
      </div>
    </div>

    <div class="space-y-3">
      <el-list>
        <el-list-item v-for="todo in todos" :key="todo.id">
          <TodoItem :todo="todo" @toggle="toggleTodo" @delete="deleteTodo" @open-detail="openDetail" @favorite="toggleFavorite"   />
        </el-list-item>
      </el-list>
      <p v-if="todos.length === 0" class="text-center text-gray-500">No tasks 😴</p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm font-medium text-gray-600">Tasks: {{ todos.length }}</p>
    </div>

    <el-drawer
      :show-close = 'false'
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      :wrapperClosable="true"
      size="30%"
      class="m-1.5"
      :with-header="false"
      :before-close="closeDetail"
    >
    <div class="border-b">

      <div class="ml-3 mt-2 mb-2 mr-2 text-l flex justify-between items-center" >
        
        <i class="el-icon-close cursor-pointer"  @click="closeDetail"></i>
        <div>
     
          <i class="el-icon-star-off mr-1 cursor-pointer"  @click.stop="toggleFavorite(importedTodoId)"></i>
          
          <el-dropdown trigger="click">
            <i class="el-icon-more cursor-pointer"></i> 
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
            <el-dropdown-item :icon="CirclePlusFilled">
              Action 2
            </el-dropdown-item>
          
          </el-dropdown-menu>
        </template>
      </el-dropdown>
        </div>
      </div>
    </div>
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
    ...mapGetters(['allTodos', 'doneTodos', 'overdueTodos','todayTodos', 'favoriteTodos']),

    todos(currentFilter = 'all') {
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
  
    importedTodoId() {
      this.selectedTodo.isFavorite = true;
      return this.selectedTodo.id
    },
    todays() {
      const today = new Date();
      const options = {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
      };
      return today.toLocaleDateString('en-En', options);
    },
       myFovriteTodos() {
      return this.favoriteTodos
    },
     myTodayTodos() {
      return this.todayTodos
     }
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
        toggleFavorite(id) {
      this.$store.commit('TOGGLE_FAVORITE', id);
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
<style scoped>
::v-deep .el-drawer {
  border-radius: 8px !important;
}
</style>
