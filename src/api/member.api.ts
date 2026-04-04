// const BASE_URL = "https://aiyuri-backend-3.onrender.com";
const BASE_URL = "http://localhost:3001";

// 🔥 DB -> CAMEL CASE
const mapFromDB = (row: any): any => ({
  id: row.id,
  name: row.name,
  avatar: row.avatar,
  generation: row.generation,
  borderFrame: row.borderframe,
  animation: row.animation,
  customDesign: row.customdesign,
  discord: row.discord,
  twitter: row.twitter,
  telegram: row.telegram,
  instagram: row.instagram,
  soundUrl: row.soundurl,
  backgroundImage: row.backgroundimage,
  backgroundGif: row.backgroundgif,
  introAnimation: row.introanimation,
  particleEffect: row.particleeffect,
  socialIconStyle: row.socialiconstyle,
  children: row.children || [],
});

// 🔥 CAMEL -> DB
const mapToDB = (member: any) => ({
  id: member.id,
  name: member.name,
  avatar: member.avatar,
  generation: member.generation,
  borderframe: member.borderFrame,
  animation: member.animation,
  customdesign: member.customDesign,
  discord: member.discord,
  twitter: member.twitter,
  telegram: member.telegram,
  instagram: member.instagram,
  soundurl: member.soundUrl,
  backgroundimage: member.backgroundImage,
  backgroundgif: member.backgroundGif,
  introanimation: member.introAnimation,
  particleeffect: member.particleEffect,
  socialiconstyle: member.socialIconStyle,
  children: member.children || [],
});

// 📥 GET
export const fetchMembersAPI = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/members`);
  const data = await res.json();
  return data.map(mapFromDB);
};

// ➕ ADD
export const addMemberAPI = async (member: any) => {
  await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToDB(member)),
  });
};

// ✏️ UPDATE
export const updateMemberAPI = async (member: any) => {
  await fetch(`${BASE_URL}/members/${member.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToDB(member)),
  });
};

// ❌ DELETE
export const deleteMemberAPI = async (id: string) => {
  await fetch(`${BASE_URL}/members/${id}`, {
    method: "DELETE",
  });
};

// 📤 UPLOAD
export const uploadFileAPI = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/members/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};

export const resetAllAPI = async () => {
  await fetch("http://localhost:3001/members/reset/all", {
    method: "DELETE",
  });
};

export const increaseViewAPI = async (id: string): Promise<void> => {
  try {
    await fetch(`${BASE_URL}/members/view/${id}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Increase view error:", error);
  }
};