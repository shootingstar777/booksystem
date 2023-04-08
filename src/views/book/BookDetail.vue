<template>
  <div class="detail" @scroll="handleScroll">
       <a-page-header title="返回" style="background-color:#eee;" @back="() => $router.go(-1)" />
    <Loading v-if="loading"></Loading>
  <!--   <a-affix :offset-top="80" class="fixed">
      <book-detail :book="book" v-if="Object.keys(book).length !== 0" ref="scrollRef"></book-detail>
    </a-affix> -->
    <div>
      <book-detail :book="book" v-if="Object.keys(book).length !== 0" ref="scrollRef"></book-detail>
    </div>
    <div v-if="Object.keys(replyData).length !== 0" >
      <a-divider>评论专区</a-divider>
      <div>
        <a-comment>
          <div slot="content">
            <a-form-item>
              <a-textarea :rows="4" v-model="addForm.content" placeholder="请输入..." />
            </a-form-item>
            <a-form-item>
              <a-rate :count="10" v-model="addForm.score" />
              <a-button :loading="submitting" type="primary" @click="handleSubmit" style="float: right;">
                提交
              </a-button>

            </a-form-item>
          </div>
        </a-comment>
      </div>
      <div style="display:flex;justify-content: flex-end;">
        <a-select style="width: 10rem;margin-right:5rem" v-model="config.byLikes" @change="change">
          <a-select-option value="true">
            按点赞排序
          </a-select-option>
          <a-select-option value="false">
            按时间排序
          </a-select-option>
        </a-select>
        <a-select style="width:10rem" v-model="config.isDesc" @change="change">
          <a-select-option value="true">
            降序排序
          </a-select-option>
          <a-select-option value="false">
            升序排序
          </a-select-option>
        </a-select>
      </div>

      <a-list class="comment-list" :header="`${total} replies`" item-layout="horizontal" :data-source="replyData">

        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-comment :author="item.userName" :avatar="item.userPic ? 'http://' + item.userPic : defaultPic">
            <template slot="actions">
              <span v-for="action in item.actions">{{ action }}</span>
            </template>
            <p slot="content">
              {{ item.content }}
            </p>
            <span slot="datetime">
              <span>{{ moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </span>
            <a-rate :default-value="item.score" :count="10" disabled /> {{ item.score }}
            <template slot="actions">
              <span key="comment-basic-like" style="color:#f50">
                <a-tooltip title="Like">
                  <a-icon type="like" :theme="likes.indexOf(item.id) > -1 ? 'filled' : 'outlined'"
                    @click="likeAdd(item.id)" />
                </a-tooltip>
                <span style="padding-left:8px;color:#f50">
                  {{ likes.indexOf(item.id) > -1 ? item.likes + 1 : item.likes }}
                </span>
              </span>
            </template>
          </a-comment>
        </a-list-item>
      </a-list>
      <div class="pagination">
        <a-pagination @change="pageChange" v-model="page.currentPage" :showSizeChanger="true" @showSizeChange="pageChange"
          :total="total" show-size-changer show-quick-jumper />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getComment_, like_, addComment_ } from '@/network/bookComment.js'
import Loading from '@/components/public/Loading.vue';
import BookDetail from '@/components/book/BookDetail.vue'
import { getInfo_ } from '@/network/book.js'
export default {
  components: { BookDetail, Loading },
  data() {
    return {
      fixed: true,
      likes: [],
      moment,
      page: {
        size: 10,
        currentPage: 1,
      },
      replyData: [],
      total: 0,
      config: {
        id: this.$route.params.id,
        byLikes: 'true',
        isDesc: 'true'
      },
      book: {},
      submitting: false,
      loading: false,
      addForm: {
        bookId: this.$route.params.id,
        content: '啊啊啊啊啊啊啊啊！！！这是什么宝贝书籍啊！！！一整个绝绝子！！！',
        score: 8,
      },

    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getInfo()
      this.getComment(this.page, this.config)

    },
    handleScroll() {
 /*      let timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        let clientRectY = this.$refs['scrollRef'].$el.getBoundingClientRect().y
        let height = this.$refs['scrollRef'].$el.offsetHeight
        if (clientRectY + height < (height / 3)) {
          console.log(1);
          this.fixed = true
        } else {
          // this.fixed = false
        }
      }, 1000) */

    },
    getInfo() {
      getInfo_({ bookId: this.$route.params.id }).then(res => {
        if (res.success) {
          this.book = res.data
        }
      }, err => {
        console.log(err);
      }).finally(err => {
      })
    },
    change() {
      this.getComment(this.page, this.config)
    },
    handleSubmit() {
      if (!this.addForm.content) {
        return;
      }
      this.submitting = true;
      addComment_(this.addForm).then(res => {
        if (res.success) {
          /*  this.comments = [
             {
               author: 'Han Solo',
               avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
               content: this.value,
               datetime: moment().fromNow(),
             },
             ...this.comments,
           ]; */
          this.addForm.content = undefined;
          this.$message.success('发布成功！')
          this.getComment(this.page, this.config)
        }
      }, err => {
        this.$message.error(err.message)
        console.log(err);
      }).finally(err => {
        this.submitting = false
      })
    },
    likeAdd(id) {
      like_({ id: id }).then(res => {
        if (res.success) {
          this.likes.push(id)
        }
      }, err => {
        this.likes.push(id)
        this.$message.error(err.message)
        console.log(err);
      })
    },
    getComment(page, config) {
      this.replyData = []
      this.loading = true
      getComment_(page, config).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.replyData = res.data.records
        }
      }, err => {
        console.log(err);
      }).finally(err => {
        this.loading = false
      })
    },
    pageChange(page, size) {
      this.page.currentPage = page
      this.page.size = size
      this.getComment(this.page, this.config)
    },
  }
}
</script>

<style>
.fixed{
  position: absolute;
  top:0;
}
.ant-page-header{
  position: absolute;
  top:0;
  left:0;
}
.detail{
   height: 100%;
   overflow-y: scroll;
}

.ant-rate {
  margin-right: 1rem;
}

.ant-comment {
  width: 100%;
}

.ant-comment-content {
  position: relative;
}

.ant-comment-actions {
  position: absolute;
  top: 0;
  right: 0;
}

.ant-list-item {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
}

.pagination {
  text-align: center;
}

.comment {
  padding: 1rem;
  line-height: 2rem;

}
</style>