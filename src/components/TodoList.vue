<template>
  <div>
    <el-input
      v-model="newTodo"
      placeholder="Add new todo"
      @change="handleAdd"
      style="width: 300px; margin-bottom: 20px"
    ></el-input>
    <el-button type="primary" @click="handleAdd" :class="{ animated: true }">Add</el-button>

    <el-list>
      <el-list-item v-for="todo in todos" :key="todo.id">
        <TodoItem :todo="todo" @delete="deleteTodo" />
      </el-list-item>
    </el-list>

    <p>Done: {{ doneCount }}</p>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue';
export default {
  components: { TodoItem },
  data() {
    return {
      newTodo: '',
    };
  },
  computed: {
    todos() {
      return this.$store.getters.allTodos;
    },
    doneTodos() {
      return this.$store.getters.doneTodos;
    },
    doneCount() {
      return this.doneTodos.length;
    },
  },
  methods: {
    handleAdd() {
      if (this.newTodo.trim()) {
        this.$store.commit('addTodo', this.newTodo);
        this.newTodo = '';
      }
    },
    deleteTodo(id) {
      this.$store.commit('deleteTodo', id);
    },
  },
};
</script>
