<template>
  <div
    class="todo-item flex flex-col p-4 mb-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    @click="goToDetail"
  >
    <div class="flex items-center mb-2">
      <el-checkbox :checked="todo.done" @change="handleToggle" @click.native.stop class="mr-3"></el-checkbox>
      <span class="flex-1 fade-strike" :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
    </div>

    <div class="flex justify-between text-xs text-gray-500 ml-8">
      <span>By: {{ todo.creator }}</span>
      <span v-if="todo.deadline" :class="{ 'text-red-500': isOverdue }">
        Deadline: {{ formatDate(todo.deadline) }}
      </span>
    </div>
    <el-button type="danger" size="mini" @click.stop="remove" class="animated-hover mt-2 self-end">Delete</el-button>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  computed: {
    isOverdue() {
      if (!this.todo || !this.todo.deadline) return false;
      const today = new Date('2025-10-02');
      const deadline = new Date(this.todo.deadline);
      return deadline < today && !this.todo.done;
    },
  },
  methods: {
    handleToggle() {
      this.$emit('toggle', this.todo.id);
    },
    remove() {
      this.$emit('delete', this.todo.id);
    },
    goToDetail() {
      this.$router.push(`/todo/${this.todo.id}`);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
  },
};
</script>
