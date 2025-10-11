<template>
  <div v-if="todo" class="p-4 pt-0 h-100vh flex flex-col">
    <h1 class="text-xl font-bold text-gray-800 mb-4  pb-2">{{ todo.text }}</h1>

    <div class="flex-1 space-y-4 overflow-y-auto mb-4">
    

      <div class="bg-gray-50 p-3 rounded-lg">
        <p class="font-medium text-gray-700 mb-2 flex items-center">
          <i class="el-icon-user-solid text-gray-500 mr-2"></i>
          Assignee
        </p>
        <div class="flex items-center">
          <el-avatar :label="creatorInitial" size="small" class="mr-2 bg-vue-green text-white"></el-avatar>
          <span class="text-sm text-gray-800">{{ todo.creator }}</span>
        </div>
      </div>

      <div v-if="todo.deadline" class="bg-gray-50 p-3 rounded-lg">
        <p class="font-medium text-gray-700 mb-2 flex items-center">
          <i class="el-icon-date text-gray-500 mr-2"></i>
          Ending date
        </p>
        <span class="text-sm flex items-center" :class="{ 'text-red-600': isOverdue }">
          {{ formatDate(todo.deadline) }}
          <i v-if="isOverdue" class="el-icon-warning ml-1 text-red-500"></i>
          <span v-if="isOverdue" class="ml-1">(Overdue! 🚨)</span>
        </span>
      </div>

      <div class="bg-gray-50 p-3 rounded-lg">
        <p class="font-medium text-gray-700 mb-2 flex items-center">
          <i class="el-icon-info text-gray-500 mr-2"></i>
          Status
        </p>
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium"
          :class="{ 'bg-green-100 text-green-800': todo.done, 'bg-red-100 text-red-800': !todo.done }"
        >
          <i :class="{ 'el-icon-check': todo.done, 'el-icon-time': !todo.done }" class="mr-1"></i>
          {{ todo.done ? 'Done ✅' : 'Pending ⏳' }}
        </span>
      </div>

      <div class="mt-6">
        <h3 class="font-medium text-gray-700 mb-3 flex items-center">
          <i class="el-icon-chat-dot-round text-gray-500 mr-2"></i>
          Activity
        </h3>
        <div class="space-y-3">
  
          <div class="flex items-start p-3 bg-white rounded-lg shadow-sm border">
            <el-avatar :src="circleUrl" size="small" class="mr-3 bg-gray-300"></el-avatar>
            <div class="flex-1">
              <p class="text-sm text-gray-800">
                <strong>{{ todo.creator }}</strong> created this task
              </p>
              <p class="text-xs text-gray-500 mt-1">Yesterday at 10:45 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-gray-500 py-8 flex flex-col items-center justify-center h-full">
    <p class="text-xl mb-4">Todo not found :(</p>
    <el-button @click="$emit('close')" type="primary" class="animated-hover">Close</el-button>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activityItems: [],
    };
  },
  computed: {
    isOverdue() {
      if (!this.todo || !this.todo.deadline) return false;
      const today = new Date();
      const deadline = new Date(this.todo.deadline);
      return deadline < today && !this.todo.done;
    },
    creatorInitial() {
      if (this.todo && this.todo.creator) {
        return this.todo.creator.charAt(0).toUpperCase();
      }
      return 'A';
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    },
    remove() {
      this.$emit('delete', this.todo.id);
      this.$emit('close');
    },
  },
  mounted() {
    console.log('TodoDetail opened for todo:', this.todo);
  },
};
</script>
