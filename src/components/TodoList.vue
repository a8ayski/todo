<template>
  <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between mb-5">
      <h1 class="font-bold text-3xl">My Day</h1>
      <h2 class="font-bold text-3xl">{{ todays }}</h2>
    </div>
    <div class="mb-6">
      <div class="flex gap-1 cursor-pointer hover:opacity-80 transition-opacity duration-200" @click="toggleFavorites">
        <i class="el-icon-star-on text-lg text-yellow-500" title="Favorites"></i>
        <p class="font-medium items-center pt-0.5">Favorites</p>
        <i
          :class="[
            'text-lg transition-transform duration-300 ease-in-out hover:text-blue-500',
            { 'el-icon-arrow-down': !isFavoritesVisible, 'el-icon-arrow-up rotate-180': isFavoritesVisible },
          ]"
          title="Toggle Favorites"
        ></i>
      </div>
      <div
        class="max-w-5xl pb-3 mx-auto overflow-hidden transition-all duration-300 ease-in-out"
        :class="{ 'max-h-0 opacity-0 py-0 my-0': !isFavoritesVisible }"
      >
        <div
          v-if="favoriteTodos.length == 0"
          class="text-center p-5 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <p>You don't have favorite tasks yet</p>
        </div>
        <el-list v-else>
          <el-list-item v-for="todo in myFovriteTodos" :key="todo.id">
            <TodoItem
              :todo="todo"
              @toggle="toggleTodo"
              @delete="deleteTodo"
              @open-detail="openDetail"
              @favorite="toggleFavorite"
              class="mt-3"
            />
          </el-list-item>
        </el-list>
      </div>
    </div>
    <div class="mb-6">
      <div class="flex gap-1 cursor-pointer hover:opacity-80 transition-opacity duration-200" @click="toggleToday">
        <i class="el-icon-s-claim text-lg text-green-400" title="Todays"></i>
        <p class="font-medium items-center pt-0.5">Today</p>
        <i
          :class="[
            'text-lg transition-transform duration-300 ease-in-out hover:text-blue-500',
            { 'el-icon-arrow-down': !isTodayVisible, 'el-icon-arrow-up rotate-180': isTodayVisible },
          ]"
          title="Toggle Today"
        ></i>
      </div>
      <div
        class="max-w-5xl mx-auto pb-3 overflow-hidden transition-all duration-300 ease-in-out"
        :class="{ 'max-h-0 opacity-0 py-0 my-0': !isTodayVisible }"
      >
        <div v-if="todayTodos.length == 0">
          <p class="text-center p-5 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            Today you are free!
          </p>
        </div>
        <el-list v-else>
          <el-list-item v-for="todo in myTodayTodos" :key="todo.id">
            <TodoItem
              :todo="todo"
              @toggle="toggleTodo"
              @delete="deleteTodo"
              @open-detail="openDetail"
              @favorite="toggleFavorite"
              class="mt-3"
            />
          </el-list-item>
        </el-list>
      </div>
    </div>
    <div class="bg-gray-100 p-6 rounded-lg mb-6">
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
        <el-form-item prop="newPriority">
          <el-select v-model="form.newPriority" placeholder="Priority" class="w-full">
            <el-option label="Low" value="Low"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="High" value="High"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="newTags">
          <el-input v-model="form.newTags" placeholder="Tags (, separator)" class="w-full" clearable></el-input>
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
          <TodoItem
            :todo="todo"
            @toggle="toggleTodo"
            @delete="deleteTodo"
            @open-detail="openDetail"
            @favorite="toggleFavorite"
            class="mt-3"
          />
        </el-list-item>
      </el-list>
      <p v-if="todos.length === 0" class="text-center text-gray-500">No tasks 😴</p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm font-medium text-gray-600">Tasks: {{ todos.length }}</p>
    </div>

    <el-drawer
      :show-close="false"
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      :wrapperClosable="true"
      size="30%"
      class="m-2"
      :with-header="false"
      :before-close="closeDetail"
    >
      <div class="border-b">
        <div class="ml-4 mt-2 mb-2 mr-2 text-l flex justify-between items-center">
          <div class="w-6 h-6 items-center cursor-pointer flex justify-center hover:text-blue-400" @click="closeDetail">
            <i class="el-icon-close"></i>
          </div>
          <div class="flex">
            <div
              class="w-7 flex justify-center"
              :class="[
                'el-icon-star-off  text-lg text-gray-400 cursor-pointer transition-colors duration-200 hover:text-yellow-400',
                { 'el-icon-star-on  text-lg text-yellow-500': selectedTodo && selectedTodo.isFavorite },
              ]"
              @click.stop="toggleFavorite(importedTodoId)"
              title="Toggle Favorite"
            >
              <i></i>
            </div>

            <el-dropdown trigger="click" class="flex items-center w-7 justify-center">
              <div
                class="el-icon-more cursor-pointer transform rotate-90 text-gray-400 hover:text-gray-600 transition-colors"
                title="More options"
              ></div>
              <template #dropdown>
                <el-dropdown-menu class="p-0">
                  <el-dropdown-item @click.native="showDeleteDialog" class="animated-hover">
                    <i class="el-icon-delete mr-1 text-red-500" title="Delete Task"></i>
                    Delete
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
        newPriority: 'Low',
        newTags: '',
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
      isFavoritesVisible: true,
      isTodayVisible: true,
    };
  },
  computed: {
    ...mapGetters(['allTodos', 'doneTodos', 'overdueTodos', 'todayTodos', 'favoriteTodos']),

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
      return this.selectedTodo.id;
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
      return this.favoriteTodos;
    },
    myTodayTodos() {
      return this.todayTodos;
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
    toggleFavorites() {
      this.isFavoritesVisible = !this.isFavoritesVisible;
    },
    toggleToday() {
      this.isTodayVisible = !this.isTodayVisible;
    },
    showDeleteDialog() {
      if (!this.selectedTodo) {
        this.$message.error('Task not found!');
        return;
      }
      this.$confirm('Are you sure you want to delete this task?', 'Confirm deletion', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      })
        .then(() => {
          this.$store.commit('DELETE_TODO', this.selectedTodo.id);
          this.$message.success('Task deleted!');
          this.closeDetail();
        })
        .catch(() => {
          this.$message.info('Deleting canceled');
        });
    },
    handleAdd() {
      this.$refs.todoForm.validate(valid => {
        if (valid) {
          const tags = this.form.newTags
            ? this.form.newTags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            : [];
          this.$store.commit('ADD_TODO', {
            text: this.form.newTodo,
            creator: this.form.newCreator.trim() || 'Anonymous',
            deadline: this.form.newDeadline || '',
            priority: this.form.newPriority,
            tags,
          });

          this.$refs.todoForm.resetFields();
          this.$message.success('Задача добавлена!');
        } else {
          return false;
        }
      });
    },
    deleteTodo(id) {
      const todo = this.allTodos.find(t => t.id === id);
      if (!todo) {
        this.$message.error('Задача не найдена!');
        return;
      }

      this.$confirm(`Вы уверены, что хотите удалить задачу "${todo.text}"?`, 'Подтверждение удаления', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        type: 'warning',
      })
        .then(() => {
          this.$store.commit('DELETE_TODO', id);
          this.$message.success('Задача удалена!');
        })
        .catch(() => {
          this.$message.info('Удаление отменено');
        });
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
