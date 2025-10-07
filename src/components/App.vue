<template>
  <div class="min-h-screen bg-gray-100 pt-10">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: { TodoItem, TodoDetail },
  data() {
    return {
      newTodo: '',
      newCreator: '',
      newDeadline: null,
      detailDrawerVisible: false,
      selectedTodo: null,
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
    todos(filterValue = 'all') {
      if (this.currentFilter == 'done') {
        return this.doneTodos;
      }
      if (this.currentFilter == 'overdue') {
        return this.overdueTodos;
      }
      if (this.currentFilter == 'all') {
        return this.allTodos;
      }
    },
  },
  watch: {
    '$route.params.id'(newId) {
      console.log('Route id changed:', newId);
      if (newId) {
        this.selectedTodo = this.allTodos.find(t => t.id === parseInt(newId));
        this.detailDrawerVisible = true;
      } else {
        this.closeDetail();
      }
    },
  },
  methods: {
    handleAdd() {
      if (!this.newTodo.trim()) {
        this.$message.error('Введите текст задачи!');
        return;
      }
      this.$store.commit('ADD_TODO', {
        text: this.newTodo,
        creator: this.newCreator.trim() || 'Anonymous',
        deadline: this.newDeadline || '',
      });

      this.newTodo = '';
      this.newCreator = '';
      this.newDeadline = null;
      this.$message.success('Задача добавлена!');
    },
    deleteTodo(id) {
      this.$store.commit('DELETE_TODO', id);
    },
    toggleTodo(id) {
      this.$store.commit('TOGGLE_TODO', id);
    },
    openDetail(id) {
      console.log('Open detail for id:', id);
      this.$router.push(`/todo/${id}`);
    },
    closeDetail() {
      console.log('Close detail');
      this.$router.push('/');
      this.detailDrawerVisible = false;
      this.selectedTodo = null;
    },
    setFilter(filter) {
      this.currentFilter = filter;
    },
  },
};
</script>
