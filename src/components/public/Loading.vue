<template>
  <div class="modal">
    <a-spin tip="疯狂加载中"></a-spin>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  bottom:0;
  width: 900px;
  left: 50%;
  transform: translate(-50%,0);
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.ant-spin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>