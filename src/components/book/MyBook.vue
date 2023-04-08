<template>
  <div>
    <div class="item" @click="checkDetail(item)" v-for="(item, index) in books" :key="item.id">
      <img class="cover" :src="item.pic" @error="itemError(item)" />
      <div class="content">
        <div>
          <p class="contentTitle">{{ item.name }}</p>
        </div>
        <p class="contentText">
          {{ item.comment }}
        </p>
        <div class="contentFooter">
          <span>{{ item.author }}</span>
          <span><a-tag v-for="e in item.tag" color="blue">{{ e.name }} </a-tag></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
export default {
  name: 'MyBook',
  props: ["books"],
  data() {
    return {

    }
  },
  methods: {
    itemError(item) {
      item.pic = require('@/assets/defaultImg.jpg')
    },
    checkDetail(e) {
      console.log(e);
      this.$router.push(`/bookDetail/${e.id}`)
    }
  }
}
</script>

<style>
.item:last-child {
  margin-bottom: 2rem;
}

.item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 150px;
  cursor: pointer;
}

.content {
  flex: 1;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.contentTitle {
  font-size: 1rem;
  font-weight: 700;
  color: #303133;
}

.contentFooter {
  display: flex;
  justify-content: space-between;
}

.contentText {
  color: #a6a6b6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  flex: 1;
  width: 100%;
  height: 100%;
}

.cover {
  box-sizing: border-box;
  margin: 1rem;
  border-radius: 1rem;
}
.ant-card-body{
  display: flex;
}
</style>