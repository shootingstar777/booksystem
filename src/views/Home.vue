<template>
  <div id="home">
    <!--     <MyBook class="myBook"></MyBook> -->
    <div class="leftContent">
      <a-carousel effect="fade" autoplay arrows>
        <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <my-book :books="books" v-if="books.length !== 0"></my-book>
      </a-carousel>
    </div>
    <div class="rightContent">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="热门书籍排行榜">
          <div v-for="item, index in hotList" :key="item.bookVo.id" :class="{ 'active': activeIndex == item.bookVo.id }">
            <div class="rankingItem" @click="checkDetail(item)">
              <div class="rankingTitle">
                <a-icon type="crown" class="crown" v-if="index == 0 || index == 1 || index == 2"
                  :style="{ color: index == 0 ? 'gold' : index == 1 ? 'rgb(180,180,180)' : index == 2 ? 'rgb(191,173,111)' : '' }" />
                <a-avatar slot="avatar"
                  :style="{ backgroundColor: index == 0 ? 'gold' : index == 1 ? 'rgb(180,180,180)' : index == 2 ? 'rgb(191,173,111)' : '' }">{{
                    index + 1 }}</a-avatar>
                <p>
                  {{ item.bookVo.name }}
                </p>
                <p><a-icon type="fire" theme="filled" style="color:orange" />{{ item.score }}</p>
              </div>
              <div>
                <p class="contentText"> 简介：{{ item.bookVo.comment }}</p>
              </div>
              <div>
                <p>标签：<a-tag color="blue" v-for="tag in item.bookVo.tag">{{ tag.name }}</a-tag></p>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import MyBook from '@/components/book/MyBook.vue'
import { getHotList_ } from '@/network/book.js'
export default {
  name: 'Home',
  components: { MyBook },
  data() {
    return {
      books: [],
      hotList: [],
      activeIndex: 0,
    }
  },
  created() {
    this.getHotList()
  },
  methods: {
    getHotList() {
      getHotList_().then(res => {
        console.log(res);
        this.hotList = res.data
        res.data.forEach(e => {
          this.books.push(e.bookVo)
        })
        console.log(this.books);
      }, err => {
        console.log(err);
      })
    },
    checkDetail(item) {

    }
  }
}
</script>

<style scoped>
/* For demo */
.ant-carousel>>>.slick-slide {
  height: 160px;
}

.ant-carousel {}

.crown {
  position: absolute;
  top: -1rem;
  left: -.5rem;
  font-size: 20px;
  transform: rotate(-45deg);
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

.active {
  font-weight: 700;
  color: #364d79;
}

.rankingItem:hover {
  color: #fff;
  background-color: #364d79;
  transition: all 0.3s linear;
}

/* .tagLi:active{
  background-color: skyblue;
} */
.rankingTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  position: relative;
}

.rankingItem {
  padding: 0.5rem;
  cursor: pointer;
}

#home {
  min-width: 900px;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.leftContent {
  flex: 3;
  width: 75%;
  margin-right: 1rem;
}

.rightContent {
  flex: 1;
}

.myBook {
  width: 100%;

}
</style>