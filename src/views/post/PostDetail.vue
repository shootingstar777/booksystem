<template>
  <div class="detail">
    <a-page-header title="返回" style="background-color:#eee;" @back="() => $router.go(-1)" />
    <Loading v-if="loading"></Loading>
    <!--   <a-affix :offset-top="80" class="fixed">
      <book-detail :book="book" v-if="Object.keys(book).length !== 0" ref="scrollRef"></book-detail>
    </a-affix> -->
    <div>
      <book-detail :book="book" v-if="Object.keys(book).length !== 0" ref="scrollRef"></book-detail>
    </div>
    <div v-if="Object.keys(replyData).length !== 0">
      <a-divider>评论专区</a-divider>
      <div>
        <a-comment>
          <div slot="content">
            <a-form-item>
              <a-textarea :rows="4" v-model="addForm.content" placeholder="请输入..." />
            </a-form-item>
            <a-form-item>
              <a-upload name="file" :multiple="false" :customRequest="uploadImg" :before-upload="beforeUpload">
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
              </a-upload>
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
            <div class="cardImgF" v-if="item.pic">
              <img class="cardImg" :src="'http://' + item.pic">
            </div>

            <template slot="actions">
              <span key="comment-basic-like" style="color:orange">
                <div style="position: relative;font-size: 18px;">
                  <a-icon type="like" :theme="likes.indexOf(item.id) > -1 ? 'filled' : 'outlined'"
                    @click="likeAdd(item.id)" />
                  <i v-if="likes.indexOf(item.id) > -1" id="infoI" class="animate__animated animate__fadeInUp">+1</i>
                  <span style="padding-left:8px">
                    {{ likes.indexOf(item.id) > -1 ? item.likes + 1 : item.likes }}
                  </span>
                </div>
              </span>
            </template>
            <span v-if="item.isMy">
              <a-icon class="deleteBtn" type="delete" @click="deletePostComment(item.id)" />
            </span>
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
import { getPostComment_, likePostComment_, addPostComment_, deletePostComment_ } from '../../network/postComment';
import { upload_ } from '@/network/util.js'
import Loading from '@/components/public/Loading.vue';
import DetailPost from '@/components/post/DetailPost.vue'
export default {
  components: { DetailPost, Loading },
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
        pic: '',
        postId: this.$route.params.id,
        content: '楼主说的也太对了叭！',
      },

    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // this.getInfo()
      this.getPostComment(this.page, this.config)

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
    deletePostComment(id) {
      const that=this
      this.$confirm({
        title: '删除',
        content: '确定要删除该帖子吗？',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          deletePostComment_({ id: id }).then(res => {
            that.$message.success('删除帖子成功！')
            that.init()
          }, err => {
            console.log(err);
          })
        },
        onCancel() { return; },
      });
    },
    change() {
      this.getPostComment(this.page, this.config)
    },
    handleSubmit() {
      if (!this.addForm.content) {
        return;
      }
      this.submitting = true;
      addPostComment_(this.addForm).then(res => {
        this.addForm.content = undefined;
        this.$message.success('发布成功！')
        this.getPostComment(this.page, this.config)
      }, err => {
        this.$message.error(err.message)
        console.log(err);
      }).finally(err => {
        this.submitting = false
      })
    },
    likeAdd(id) {
      likePostComment_({ id: id }).then(res => {
        if (res.success) {
          this.likes.push(id)
        }
      }, err => {
        /*      this.likes.push(id) */
        this.$message.error(err.message)
        console.log(err);
      })
    },
    getPostComment(page, config) {
      this.replyData = []
      this.loading = true
      getPostComment_(page, config).then(res => {
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
      this.getPostComment(this.page, this.config)
    },
    uploadImg(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      upload_(formData).then(res => {
        this.addForm.pic = res.data.picUrl
      }, err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      })
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  }
}
</script>

<style>
.deleteBtn {
  cursor: pointer;
  color: #f50;
  font-size: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.cardImg {
  width: 30%;
  margin-left: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

#infoI {
  position: absolute;
  top: -1rem;
  right: -1rem;
}

.ant-page-header {
  position: absolute;
  top: 0;
  left: 0;
}

.detail {
  min-width: 900px;
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