<template>
  <div>

  </div>
</template>

<script>
import { selectPost_ } from '../../network/post'
export default {
  data(){
    return{
      config:{
        byLikes:'true',
        byDesc:'true',
        id: this.$route.params.id
      }
    }
  },
  created(){
    this.selectPost()
  },
  methods: {
    selectPost(page, config) {
      this.post = []
      this.loading = true
      selectPost_('', config).then(res => {
       console.log(res);
      }, err => {
        console.log(err);
      }).finally(err => {
      
      })
    },
   
  },

}
</script>

<style></style>