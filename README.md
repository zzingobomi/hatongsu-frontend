### Hatongsu frontend

##### Shadcn UI 설치

```bash
pnpm dlx shadcn@latest add button
```

##### TODO

- exif 정보가 없는경우 프론트에서 파일 수정시간을 백엔드로 전송하기

```js
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const modifiedDate = new Date(file.lastModified);

  const formData = new FormData();
  formData.append("image", file);
  formData.append("modifiedDate", modifiedDate.toISOString());

  // 백엔드로 전송
  axios.post("/upload", formData);
};
```

- hydration 에러 수정하기
