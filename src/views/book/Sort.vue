<template>
  <div id="sort">

    <div>
      <a-tabs default-active-key="2">
        <!--    <a-tab-pane key="1" tab="标签">
          <div id="tagBtn" v-if="tags.length">
            <a-button shape="round" v-for="(item, index) in tags" :key="item.id" @click="tagClick(item)"
              :class="{ 'active': id == item.id }">{{ item.name }}</a-button>
          </div>
        </a-tab-pane> -->
        <a-tab-pane key="2" tab="标签">
          <li v-for="item in tags" :key="item.id" class="tagLi" @click="tagClick(item)"
            :class="{ 'active': tag.id == item.id }">{{ item.name}}</li>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div id="tabContent">

      <MyBook v-if="books.length !== 0" :books="books"></MyBook>
      <a-spin v-else tip="疯狂加载中" style="margin-top:250px" />
     
      <div class="pagination">
        <a-pagination @change="pageChange" v-model="page.currentPage" :showSizeChanger="true" @showSizeChange="pageChange"
          :total="total" show-size-changer show-quick-jumper />
      </div>
    </div>



  </div>
</template>

<script>
import MyBook from '@/components/book/MyBook.vue'
import { getTags_ } from '@/network/tag.js'
import { getList_, selectList_ } from '@/network/book.js'

export default {
  components: {
    MyBook
  },
  data() {
    /*    const listData = [];
       for (let i = 0; i < 4; i++) {
         listData.push({
           href: 'https://www.antdv.com/',
           title: `ant design vue part ${i}`,
           avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
           description:
             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
           content:
             'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
         });
       } */

    return {
      total: 50,
      /*   listData,
    
        actions: [
          { type: 'star-o', text: '156' },
          { type: 'like-o', text: '156' },
          { type: 'message', text: '2' },
        ], */
      tags: [],
      tag: {
        id: 0,
        name: '全部'
      },
      books: [],
      page: {
        size: 10,
        currentPage: 1,
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getTags()
      this.getList(this.page)
    },
    getList(page) {
      this.books = []
      getList_(page).then(res => {
        if (res.success) {
          this.books = res.data.records
          this.total = res.data.total
        }
      }, err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      })
    },
    selectList(params, data) {
      this.books = []
      selectList_(params, data).then(res => {
        if (res.success) {
          this.books = res.data.records
          this.total = res.data.total
        }
      }, err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      })
    },
    tagClick(item) {
      console.log(item);
      if (item.id == this.tag.id) { return; }
      this.tag = item
      if (item.id == 0) {
        this.getList()
      } else {
        this.selectList(this.page, { tag: this.tag })
      }
    },
    pageChange(page, size) {
      this.page.currentPage = page
      this.page.size = size
      if (this.tag.id == 0) {
        this.getList(this.page)
      } else {
        this.selectList(this.page, { tag: this.tag })
      }
    },
    getTags() {
      let tags = JSON.parse(sessionStorage.getItem('tags'))
      if (tags) {
        this.tags = tags
        return;
      }
      getTags_().then(res => {
        if (res.success) {
          res.data.unshift({ id: 0, name: '全部' })
          this.tags = res.data
          sessionStorage.setItem('tags', JSON.stringify(this.tags))
        }
      }, err => {
        console.log(err);
      }).catch((err) =>
        console.log(err)
      )
    }
  }

}
</script>

<style scoped>
.active {
  font-weight: 700;
  color: #364d79;
}

.tagLi:hover {
  color: #fff;
  background-color: #364d79;
  transition: all 0.3s linear;
}

/* .tagLi:active{
  background-color: skyblue;
} */
.tagLi {
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;
  margin: 0.5rem;
}

.pagination {
  position: absolute;
  bottom: 0;
  right: 25%;
/*   transform: translate(-50%,0); */
  padding: 20px 0;

}

#sort {
  min-width: 900px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
}

#sort>div:nth-child(1) {
  flex: 2;
  background-color: #fff;
  border-radius: 5px;
  margin-right: 40px;
}

#tabContent {
  height: 100%;
  overflow-y: scroll;
  flex: 8;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
</style>