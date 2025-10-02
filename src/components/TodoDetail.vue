<template>
  <div v-if="todo" class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-vue-green mb-4">Details for: {{ todo.text }}</h2>
    <div class="space-y-2 mb-6">
      <p><strong>Creator:</strong> {{ todo.creator }}</p>
      <p>
        <strong>Status:</strong>
        <span :class="{ 'text-green-600 font-semibold': todo.done, 'text-red-600 font-semibold': !todo.done }">
          {{ todo.done ? 'Done ✅' : 'Pending ⏳' }}
        </span>
      </p>
      <p v-if="todo.deadline">
        <strong>Deadline:</strong>
        <span :class="{ 'text-red-600': isOverdue }">
          {{ formatDate(todo.deadline) }} {{ isOverdue ? '(Overdue! 🚨)' : '' }}
        </span>
      </p>
    </div>
    <el-button @click="backToList" type="info" class="w-full animated-hover">Back to List</el-button>
  </div>
  <div v-else class="text-center text-gray-500 py-8">
    <p class="text-xl">Todo not found :(</p>
    <el-button @click="backToList" type="primary" class="mt-4">Go Back</el-button>
  </div>
</template>

<script>
export default {
  computed: {
    todo() {
      const id = parseInt(this.$route.params.id);
      return this.$store.getters.allTodos.find(t => t.id === id);
    },
    isOverdue() {
      if (!this.todo || !this.todo.deadline) return false;
      const deadline = new Date(this.todo.deadline);
      return deadline < new Date();
    },
  },
  methods: {
    backToList() {
      this.$router.push('/');
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
  },
  mounted() {
    console.log('Detail mounted for id:', this.$route.params.id);
  },
};
</script>
