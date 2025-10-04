<template>
  <div v-if="todo" class="p-4">
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
    <el-button @click="$emit('close')" type="info" class="w-full animated-hover">Close</el-button>
  </div>
  <div v-else class="text-center text-gray-500 py-8">
    <p class="text-xl">Todo not found :(</p>
    <el-button @click="$emit('close')" type="primary" class="mt-4">Close</el-button>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  computed: {
    isOverdue() {
      if (!this.todo || !this.todo.deadline) return false;
      const today = new Date();
      const deadline = new Date(this.todo.deadline);
      return deadline < today && !this.todo.done;
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
  },
  mounted() {
    console.log('TodoDetail opened for todo:', this.todo);
  },
};
</script>
