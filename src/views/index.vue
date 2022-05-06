<script setup lang="ts">
import { reactive, ref } from 'vue'
import { LoadingPlugin, MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'
import store from '../utils/store'
import { StoreEnum } from '../enum/StoreEnum'

interface Message {
  type: 1 | 2
  date: number
  nickname: string
  message: string
  uid: number
}

const messageList = ref<Message[]>([])
const messageBox = ref<HTMLDivElement>()
const user = reactive({
  nickname: '',
  uid: 0,
})
const dialogVisible = ref(false)
const content = ref('')
const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
ws.onopen = () => {
  console.log('连接服务器成功')
  const { nickname, uid } = store.get(StoreEnum.CHATROOM_USER) || {}
  if (nickname && uid) {
    ws.send(
      JSON.stringify({
        type: 1,
        nickname,
        uid,
      })
    )
    user.nickname = nickname
    user.uid = uid
    store.set(StoreEnum.CHATROOM_USER, { nickname, uid }, 60 * 60 * 24)
    dialogVisible.value = false
  } else {
    dialogVisible.value = true
  }
}
ws.onclose = function () {
  MessagePlugin.warning('服务器关闭')
}
ws.onerror = function () {
  console.log('连接出错')
}
// 接收服务器的消息
ws.onmessage = function ({ data }) {
  data = JSON.parse(data)
  data.msg && data.type === 1 ? MessagePlugin.success(data.msg) : ''
  data.message && data.type === 2 ? messageList.value.push(data) : ''
}
const handleConfirm = () => {
  if (!user.nickname.trim()) {
    MessagePlugin.error('请输入昵称')
  }
  user.uid = dayjs().valueOf()
  ws.send(
    JSON.stringify({
      type: 1,
      nickname: user.nickname,
      uid: user.uid,
    })
  )
  store.set(StoreEnum.CHATROOM_USER, user, 60 * 60 * 24)
  dialogVisible.value = false
}
const sendMessage = () => {
  const loadingAttachInstance = LoadingPlugin({
    attach: () => messageBox.value!,
    showOverlay: true,
    size: '20px',
  })
  if (!content.value) {
    loadingAttachInstance.hide()
    return MessagePlugin.warning('请输入内容')
  }
  ws.send(
    JSON.stringify({
      type: 2,
      message: content.value,
      ...user,
    })
  )
  content.value = ''
  loadingAttachInstance.hide()
}
const judgeIsUser = (message: Message) => {
  return message.uid === user.uid
}
</script>

<template>
  <main>
    <div v-if="!dialogVisible" class="chatroom-container">
      <t-card :bordered="false" shadow hover-shadow>
        <template #title>
          <h2 class="text-xl font-bold">聊天室</h2>
        </template>
        <div ref="messageBox" class="w-[800px] h-[400px] overflow-auto bg-gray-100 p-4 py-10">
          <div
            v-for="(message, i) of messageList"
            :key="i"
            :class="{ 'justify-end': judgeIsUser(message) }"
            class="w-full my-4"
          >
            <div class="info items-center flex gap-2" :class="{ 'flex-row-reverse': judgeIsUser(message) }">
              <t-tooltip class="placement top center" :content="message.nickname" placement="top" show-arrow>
                <t-avatar size="40px" class="min-w-[40px] min-h-[40px]">
                  {{ message.nickname[0].toUpperCase() }}
                </t-avatar>
              </t-tooltip>
              <div>
                <div
                  class="bg-[#e7e7e7] py-1 px-2 rounded-md"
                  :class="{ 'bg-[#2151d1]': judgeIsUser(message), 'text-white': judgeIsUser(message) }"
                >
                  {{ message.message }}
                </div>
              </div>
            </div>
            <p class="text-xs mt-1 text-gray-600" :class="{ 'text-right': judgeIsUser(message) }">{{ message.date }}</p>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center gap-4">
            <t-input autofocus size="large" v-model="content" @enter="sendMessage" placeholder="请输入聊天内容" />
            <t-button size="large" @click="sendMessage">发送</t-button>
          </div>
        </template>
      </t-card>
    </div>
    <t-dialog
      v-model:visible="dialogVisible"
      header="昵称"
      :cancelBtn="null"
      :closeBtn="null"
      :closeOnEscKeydown="false"
      :closeOnOverlayClick="false"
      :onConfirm="handleConfirm"
    >
      <t-input v-model="user.nickname" placeholder="请输入您的昵称" />
    </t-dialog>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100vw;
  min-height: 100vh;
  background-color: #34495e;
  display: flex;
  justify-content: center;

  .chatroom-container {
    margin-top: 10%;
  }
}
</style>
