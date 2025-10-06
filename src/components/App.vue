<template>
  <div class="min-h-screen bg-gray-100 pt-10">
  
      <main>
        <router-view></router-view>
      </main>
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
