export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:3001/members/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  return data.url;
}
