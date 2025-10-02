<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header
        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-8 flex justify-between items-center"
      >
        <h1 class="text-3xl font-bold">ToDo List</h1>

        <el-button type="text" @click="drawerVisible = true" class="text-white hover:text-gray-200"
          >Filters 📊</el-button
        >
      </header>
      <main>
        <router-view :filter="currentFilter"></router-view>
      </main>

      <el-drawer
        title="Filters & Stats"
        :visible.sync="drawerVisible"
        direction="ltr"
        :wrapperClosable="true"
        size="30%"
      >
        <div class="p-4">
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Filters:</h3>
            <div class="flex flex-wrap justify-start px-4">
              <el-button
                v-for="f in filters"
                :key="f.value"
                :type="currentFilter === f.value ? 'primary' : 'default'"
                size="small"
                class="mr-2 mb-2"
                @click="setFilter(f.value)"
              >
                {{ f.label }}
              </el-button>
            </div>
          </div>

          <div class="mb-6 bg-gray-50 rounded p-4">
            <h3 class="text-lg font-semibold mb-3">Stats:</h3>
            <p>
              Total: <span class="font-bold text-blue-600">{{ stats.total }}</span>
            </p>
            <p>
              Done: <span class="font-bold text-green-600">{{ stats.done }}</span>
            </p>
            <p>
              Overdue: <span class="font-bold text-red-600">{{ stats.overdue }}</span>
            </p>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-3">Quick Add:</h3>
            <el-input v-model="quickText" placeholder="Quick task..." size="small" class="mb-2"></el-input>
            <el-button type="success" size="small" @click="quickAdd" class="w-full" :disabled="!quickText.trim()"
              >Add Quick</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      drawerVisible: false,
      currentFilter: 'all',
      quickText: '',
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Done', value: 'done' },
        { label: 'Overdue', value: 'overdue' },
      ],
    };
  },
  computed: {
    ...mapGetters(['allTodos', 'doneTodos', 'overdueTodos']),
    stats() {
      return {
        total: this.allTodos.length,
        done: this.doneTodos.length,
        overdue: this.overdueTodos.length,
      };
    },
  },
  methods: {
    setFilter(value) {
      this.currentFilter = value;
      this.drawerVisible = false;
    },
    quickAdd() {
      if (this.quickText.trim()) {
        this.$store.commit('ADD_TODO', {
          text: this.quickText,
          creator: 'Quick Add',
          deadline: '',
        });
        this.quickText = '';
      }
    },
  },
};
</script>
