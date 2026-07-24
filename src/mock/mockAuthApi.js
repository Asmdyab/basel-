import {
  getDatabase,
  saveDatabase,
} from "./mockDatabase";

function createFakeToken(user) {
  return window.btoa(
    JSON.stringify({
      userId: user.id,
      role: user.role,
      createdAt: Date.now(),
    })
  );
}

export async function mockLogin(email, password) {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const database = getDatabase();

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const user = database.users.find(
    (item) =>
      item.email.toLowerCase() ===
        normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error(
      "الإيميل أو كلمة المرور غير صحيحة."
    );
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return {
    user: safeUser,
    accessToken: createFakeToken(safeUser),
  };
}

export async function mockRegister({
  name,
  email,
  phone,
  password,
}) {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const database = getDatabase();

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const emailExists = database.users.some(
    (user) =>
      user.email.toLowerCase() ===
      normalizedEmail
  );

  if (emailExists) {
    throw new Error(
      "يوجد حساب مسجل بهذا الإيميل."
    );
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    role: "User",
  };

  database.users.push(user);
  saveDatabase(database);

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return {
    user: safeUser,
    accessToken: createFakeToken(safeUser),
  };
}