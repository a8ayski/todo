<template>
  <div
    class="todo-item flex flex-col p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    :class="{ 'bg-gray-100': !todo.done, 'bg-green-200': todo.done }"
    @click="$emit('open-detail', todo.id)"
  >
    <div class="flex items-center mb-2">
      <el-radio
        v-model="isDone"
        :checked="isDone"
        @change="handleToggle"
        @click.native.stop
        class="mr-3 animated-hover"
        :class="{ 'is-checked text-green-500': isDone, 'text-gray-400': !isDone }"
      ></el-radio>
      <span class="flex-1 fade-strike" :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
    </div>
    <div class="flex items-center justify-between text-xs text-gray-500 ml-8">
      <div class="flex items-center ml-1 space-x-4">
        <span>By: {{ todo.creator }}</span>
        <span v-if="todo.deadline" :class="{ 'text-red-500': isOverdue }">
          Deadline: {{ formatDate(todo.deadline) }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <i
          :class="[
            'el-icon-star-off text-lg text-gray-400 cursor-pointer transition-colors duration-200 hover:text-yellow-400',
            { 'el-icon-star-on text-lg text-yellow-500': todo.isFavorite },
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
  </div>
</template>

<script>
import { getDateOnly } from '../utils/dateHelper';

export default {
  props: ['todo'],
  computed: {
    isDone: {
      get() {
        return this.todo.done;
      },
      set(newValue) {
        this.$emit('toggle', this.todo.id);
      },
    },
    isOverdue() {
      if (!this.todo || !this.todo.deadline) return false;
      const today = getDateOnly(new Date());
      const deadline = getDateOnly(new Date(this.todo.deadline));
      return deadline < today && !this.todo.done;
    },
  },
  methods: {
    handleToggle(value) {},
    remove() {
      this.$emit('delete', this.todo.id);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
    favorited() {
      this.$emit('favorite', this.todo.id);
    },
  },
};
</script>
