const DATABASE_KEY = "khub-demo-database";

const initialDatabase = {
  users: [
    {
      id: "admin-1",
      name: "K-HUB Admin",
      email: "admin@khub.com",
      password: "Admin123!",
      phone: "01000000000",
      role: "Admin",
    },
    {
      id: "user-1",
      name: "Demo User",
      email: "user@khub.com",
      password: "User123!",
      phone: "01111111111",
      role: "User",
    },
  ],

  trainingRegistrations: [],

  notifications: [],
};

export function getDatabase() {
  const savedDatabase = localStorage.getItem(DATABASE_KEY);

  if (!savedDatabase) {
    localStorage.setItem(
      DATABASE_KEY,
      JSON.stringify(initialDatabase)
    );

    return structuredClone(initialDatabase);
  }

  try {
    return JSON.parse(savedDatabase);
  } catch {
    localStorage.setItem(
      DATABASE_KEY,
      JSON.stringify(initialDatabase)
    );

    return structuredClone(initialDatabase);
  }
}

export function saveDatabase(database) {
  localStorage.setItem(
    DATABASE_KEY,
    JSON.stringify(database)
  );
}

export function resetDatabase() {
  localStorage.setItem(
    DATABASE_KEY,
    JSON.stringify(initialDatabase)
  );
}