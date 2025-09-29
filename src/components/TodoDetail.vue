<template>
  <div v-if="todo">
    <h2>Details for: {{ todo.text }}</h2>
    <p>Status: {{ todo.done ? 'Done' : 'Not done yet' }}</p>
    <el-button @click="backToList" type="info">Back to List</el-button>
  </div>
  <div v-else>
    <p>Todo not found</p>
  </div>
</template>

<script>
export default {
  computed: {
    todo() {
      const id = parseInt(this.$route.params.id);
      return this.$store.getters.allTodos.find(t => t.id === id);
    },
  },
  methods: {
    backToList() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
h2 {
  color: #42b983;
}
</style>
