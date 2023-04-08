<template>
  <div>
    <a-card v-for="item in post" style="margin-bottom: 1rem;">
      <div style="display:flex;">
        <a-avatar :src="'http://' + item.pic"></a-avatar>
        <p style="margin-left:1rem">{{ item.userName }}</p>
      </div>
      <div style="padding:.5rem 1rem;">
        {{ item.content }}
      </div>
      <div class="cardImgF">
        <img class="cardImg" :src="'http://' + index" v-for="index in item.pics">
      </div>
      <div class="cardIcon">
        <div style="position: relative;">
          <a-icon type="like" :theme="likes.indexOf(item.id) > -1 ? 'filled' : 'outlined'" @click="likeAdd(item.id)" />
          <i v-if="likes.indexOf(item.id) > -1" id="infoI" class="animate__animated animate__fadeInUp">+1</i>
        </div>
        <a-icon type="message" @click="checkDetail(item)" />
      </div>
      <a-icon type="ellipsis" class="CardEllipsis" @click="checkDetail(item)" />
    </a-card>
  </div>
</template>

<script>
import { likePost_ } from '@/network/post.js'
export default {
  props: ["postData"],
  data() {
    return {
      likes: [],
      post: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.post = this.$props.postData
      this.post.forEach(e => {
        let arr = []
        let { pic1, pic2, pic3 } = e
        if (pic1) arr.push(pic1)
        if (pic2) arr.push(pic2)
        if (pic3) arr.push(pic3)
        e['pics'] = arr
      })
    },
    likeAdd(id) {
      likePost_({ id: id }).then(res => {
        this.likes.push(id)
      }, err => {
        this.likes.push(id)
        this.$message.error(err.message)
      })
    },
    checkDetail(item) {
      this.$router.push(`/postDetail/${item.id}`)
    }
  }
}
</script>

<style scoped>
#infoI {
  position: absolute;
  top: -1rem;
  right: -1rem;
}

.cardImgF {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

.CardEllipsis {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 20px;
  cursor: pointer;
}

.cardIcon>i {
  cursor: pointer;
}

.cardIcon {
  color:#f50;
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-size: 16px;
  display: flex;
  justify-content: space-around;

}

.cardImg {
  width: 30%;
  margin-left: 1rem;
  border-radius: 1rem;
}
</style>