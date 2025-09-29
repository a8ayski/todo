<template>
  <div class="todo-item" @click="goToDetail">
    <el-checkbox :checked="todo.done" @change="handleToggle" @click.native.stop></el-checkbox>
    <span :class="{ done: todo.done }">{{ todo.text }}</span>
    <el-button type="danger" size="mini" @click="remove" class="delete-btn">Delete</el-button>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  methods: {
    handleToggle() {
      this.todo.done = !this.todo.done;
    },
    remove() {
      this.$emit('delete', this.todo.id);
    },
    goToDetail() {
      this.$router.push(`/todo/${this.todo.id}`);
    },
  },
};
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
}
.done {
  text-decoration: line-through;
  color: gray;
}
.delete-btn {
  margin-left: auto;
  transition: transform 0.2s;
}
.delete-btn:hover {
  transform: scale(0.95);
}
</style>
