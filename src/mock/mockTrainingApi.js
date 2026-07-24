import {
  getDatabase,
  saveDatabase,
} from "./mockDatabase";

export async function createTrainingRegistration(
  registration
) {
  const database = getDatabase();

  const newRegistration = {
    id: crypto.randomUUID(),

    userId: registration.userId,
    participantName:
      registration.participantName,

    age: registration.age,
    sportType: registration.sportType,

    courtId: registration.courtId,
    courtName: registration.courtName,

    paymentMethod:
      registration.paymentMethod,

    transactionReference:
      registration.transactionReference,

    profileImage:
      registration.profileImage,

    paymentProofImage:
      registration.paymentProofImage,

    status: "pending",

    assignedCoachId: null,
    assignedCoachName: "",

    assignedDate: null,
    assignedTime: null,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.trainingRegistrations.push(
    newRegistration
  );

  saveDatabase(database);

  return newRegistration;
}

export async function getUserRegistrations(
  userId
) {
  const database = getDatabase();

  return database.trainingRegistrations
    .filter(
      (registration) =>
        registration.userId === userId
    )
    .sort(
      (first, second) =>
        new Date(second.createdAt) -
        new Date(first.createdAt)
    );
}

export async function getAllRegistrations() {
  const database = getDatabase();

  return [...database.trainingRegistrations]
    .sort(
      (first, second) =>
        new Date(second.createdAt) -
        new Date(first.createdAt)
    );
}

export async function updateRegistrationStatus({
  registrationId,
  status,
  coachId = null,
  coachName = "",
  assignedDate = null,
  assignedTime = null,
}) {
  const database = getDatabase();

  const registration =
    database.trainingRegistrations.find(
      (item) => item.id === registrationId
    );

  if (!registration) {
    throw new Error("طلب التدريب غير موجود.");
  }

  registration.status = status;
  registration.assignedCoachId = coachId;
  registration.assignedCoachName = coachName;
  registration.assignedDate = assignedDate;
  registration.assignedTime = assignedTime;
  registration.updatedAt =
    new Date().toISOString();

  const isApproved = status === "approved";

  database.notifications.unshift({
    id: crypto.randomUUID(),
    userId: registration.userId,

    type: isApproved
      ? "training-approved"
      : "training-rejected",

    title: isApproved
      ? "تم قبول طلب التدريب"
      : "تم رفض طلب التدريب",

    message: isApproved
      ? `تم قبول طلب تدريب ${registration.sportType}.`
      : `تم رفض طلب تدريب ${registration.sportType}.`,

    isRead: false,
    createdAt: new Date().toISOString(),

    link: "/profile",
  });

  saveDatabase(database);

  return registration;
}