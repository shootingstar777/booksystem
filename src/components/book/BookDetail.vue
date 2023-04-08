<template>
  <div>
    <a-card style="width: 100%">
      <img :src="bookData.pic" class="cardImg" />
      <div class="cardContent">
        <span>{{ bookData.name }}
          <a-tag color="green" class="bookId">id号：{{ bookData.id }}</a-tag>
        </span>
        <span class="comment">简介：
          {{ bookData.comment }}
        </span>
        <span style="display:flex;justify-content: space-between;">
          <span style="font-size: 1.2rem;">{{ bookData.author }}</span>
          <div>
            <a-rate :value="bookData.score" :count="10" allow-half disabled />
            <span class="ant-rate-text">{{ bookData.score }}</span>
          </div>

        </span>

        <span class="cardTag">
          <a-tag v-for="item in bookData.tag" color="blue">{{ item.name }}</a-tag>
        </span>
      </div>
    </a-card>



  </div>
</template>

<script>
export default {
  props: ["book"],

  data() {
    return {
      bookData: {},
      sizeData: '',
      defaultPic: require('@/assets/defaultImg.jpg'),
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.bookData = this.$props.book
    }
  },
}
</script>

<style scoped>
.cardTag {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.ant-card-body {
  width: 100%;
  display: flex;
}

.bookId {
  display: inline-block;
  font-weight: normal;
  font-size: 0.7rem;
}

.cardContent>span:nth-child(1) {
  font-weight: 700;
  font-size: 1.2rem;
}

.cardContent {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 2rem;
}

.cardImg {
  width: 10rem;
  padding: 0.5rem;
  border: 2px solid #000;
  border-radius: 0.5rem;
}

.cardContent {
  display: flex;

}
</style>