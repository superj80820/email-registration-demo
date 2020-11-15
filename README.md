## 需要安裝

1. Node.js: v14.15.0
2. docker
3. docker-compose

## 供面試官驗證

- i18n 與 Unit Test 都已實作

---

1. 安裝 Node.js 依賴: `npm install`
2. 測試 Unit Test: `npm run test`
3. 啟動 DB: `docker-compose up`
4. 啟動 Server: `npm run start`
5. 在 Terminal 呼叫 curl 來註冊

   ```bash
   curl --request POST \
     --url http://localhost:3000/users/ \
     --header 'content-type: application/json' \
     --data '{
     "name": "yorkName",
     "email": "yorkEmail@gmail.com",
     "password": "thisIsPassword",
     "confirmPassword": "thisIsPassword",
     "phoneNumber": "(800)0958878516",
     "locale": "zh-TW"
   }'
   ```

6. 註冊成功獲得 token 並且收到信件
   ![](https://i.imgur.com/l2G1v0D.png)
7. 使用 curl 查看所有 users

   ```bash
   curl --request GET \
     --url http://localhost:3000/users/
   ```

   回傳

   ```json
   [
     {
       "id": 1,
       "name": "yorkName",
       "email": "yorkEmail@gmail.com",
       "phoneNumber": "(800)0958878516"
     }
   ]
   ```
