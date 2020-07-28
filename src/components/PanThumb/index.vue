<template>
  <div />
</template>

<script>
export default {
  name: 'PanThumb',
  props: {
    image: {
      type: String,
      required: true
    },
    zIndex: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '150px'
    }
  }
}
</script>

<style scoped>

</style>
