## 需要安裝

1. docker
2. docker-compose

## 供面試官驗證

- i18n 已實作: 可在註冊 request 的 locale 欄位輸入`en-US`, `zh-TW`
- Unit Test 已實作

---

1. 安裝 Node.js 依賴: `docker-compose run --entrypoint="npm install" server`
2. 測試 Unit Test: `docker-compose run --entrypoint="npm run test" server`
3. 啟動 Server 與 DB: `docker-compose up`
4. 在 Terminal 呼叫 curl 來註冊

   ```bash
   curl --request POST \
     --url http://localhost:3000/users/ \
     --header 'content-type: application/json' \
     --data '{
     "name": "yourName",
     "email": "yourEmail@gmail.com",
     "password": "thisIsPassword",
     "confirmPassword": "thisIsPassword",
     "phoneNumber": "(866)0912378516",
     "locale": "zh-TW"
   }'
   ```

5. 註冊成功獲得 token 並且收到信件
   ![](https://i.imgur.com/BcgUrwB.png)
6. 使用 curl 查看所有 users

   ```bash
   curl --request GET \
     --url http://localhost:3000/users/
   ```

   回傳

   ```json
   [
     {
       "id": 1,
       "name": "yourName",
       "email": "yourEmail@gmail.com",
       "phoneNumber": "(866)0912378516"
     }
   ]
   ```
