<template>
  <div style="min-width:900px;overflow-y: scroll;height: 100%;">
    <loading v-if=loading></loading>
    <post-com :postData="post" v-if="post.length !== 0"></post-com>
    <div class="pagination">
      <a-pagination @change="pageChange" v-model="page.currentPage" :showSizeChanger="true" @showSizeChange="pageChange"
        :total="total" show-size-changer show-quick-jumper />
    </div>
  </div>
</template>

<script>
import Loading from '@/components/public/Loading.vue';
import PostCom from '@/components/post/PostCom.vue';
import { selectPost_ } from '@/network/post';
export default {
  components: { PostCom,Loading },
  data() {
    return {
      loading:false,
      total: 50,
      post: [],
      page: {
        currentPage: 1,
        size: 10
      },
      config: {
        byLikes: 'true',
        isDesc: 'true'
      }
    }
  },
  created() {
    this.selectPost(this.page, this.config)
  },
  mounted() { },
  methods: {
    pageChange(page, size) {
      this.page.currentPage = page
      this.page.size = size
      this.selectPost(this.page, this.config)
    },
    selectPost(page, config) {
      this.post=[]
      this.loading=true
      selectPost_(page, config).then(res => {
        this.post = res.data.records
        this.total=res.data.total
      }, err => {
        console.log(err);
      }).finally(err=>{
        this.loading=false
      })
    }
  }
}
</script>

<style scoped>
.pagination {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>