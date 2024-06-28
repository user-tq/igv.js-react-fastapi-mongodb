from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI()

origins = [
    "http://localhost:3000",  # 允许这个源的跨域请求
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def file_iterator(file_path, start, end, chunk_size=1024):
    with open(file_path, "rb") as f:
        f.seek(start)
        chunk = f.read(end - start + 1)
        yield chunk


@app.get("/dname_list")  # 获取下载目录的文件名列表
async def dname_list():
    # 需要读取服务器保存文件地址的目录，返回文件名列表
    file_list = []
    # 读取文件目录

    dictory = "./file/project_creat"
    for item in os.listdir(dictory):
        if os.path.isfile(os.path.join(dictory, item)):  # 检查是否为文件
            file_list.append(item)
    return {"file_list": file_list}


@app.get("/download")
async def download_file(request: Request, filename: str):
    file_path = "./file/project_creat/{}".format(filename)
    if request.headers.get("Range"):
        print("请求了范围请求")
        start, end = request.headers.get("Range").replace("bytes=", "").split("-")
        start, end = int(start), int(end)
        file_size = os.path.getsize(file_path)
        if end > file_size:
            return {"error": "start is greater than file size"}

        headers = {
            "Content-Disposition": "attachment",
            "Content-Length": str(end - start + 1),
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Content-Type": "binary/octet-stream",
        }

        return StreamingResponse(
            file_iterator(file_path, start, end),
            headers=headers,
            status_code=206,  # Partial Content
        )
    else:

        return FileResponse(file_path, status_code=200, filename=filename)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
