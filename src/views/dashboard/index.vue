<template>
  <div class="dashboard-container">
    <div class="minText">朵尔监护后台管理系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editorDashboard from '../../layout/components/AppMain'

export default {
  name: 'Dashboard',
  components: { editorDashboard },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {

  }
}
</script>
<style lang="scss">
.minText{
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.25rem 0 0 1.25rem;
}
</style>
