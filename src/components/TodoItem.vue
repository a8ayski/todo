<template>
  <div
    class="todo-item flex flex-col p-4 bg-gray-50 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('open-detail', todo.id)"
  >
    <div class="flex items-center mb-2">
      <el-checkbox :checked="todo.done" @change="handleToggle" @click.native.stop class="mr-3"></el-checkbox>
      <span class="flex-1 fade-strike ml-4" :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
    </div>
    <div class="flex justify-between text-xs text-gray-500 ml-8 mb-2">
      <span>By: {{ todo.creator }}</span>
      <span v-if="todo.deadline" :class="{ 'text-red-500': isOverdue }">Deadline: {{ formatDate(todo.deadline) }}</span>
    </div>

    <div class="flex justify-end items-center space-x-2 ml-8">
      <i :class="[
          'el-icon-star-off text-lg text-gray-400 cursor-pointer transition-colors duration-200 hover:text-yellow-400',
          { 'el-icon-star-on text-lg text-yellow-500': todo.isFavorite }
        ]"
        @click.stop="favorited"
        title="Toggle Favorite"
      ></i>
      <i
        class="el-icon-delete text-lg text-gray-400 cursor-pointer animated-hover hover:text-red-500 hover:fill-red-500"
        @click.stop="remove"
        title="Delete Task"
      ></i>
    </div>
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
    handleToggle() {
      this.$emit('toggle', this.todo.id);
    },
    remove() {
      this.$emit('delete', this.todo.id);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
    favorited() {
      this.$emit('favorite', this.todo.id)
    }
  },
};
</script>
<!-- :class="[
'el-icon-star-off text-lg text-gray-400 cursor-pointer transition-colors duration-200 hover:text-yellow-400',
{ 'el-icon-star-on text-lg text-yellow-500': todo.isFavorite },
]" -->
