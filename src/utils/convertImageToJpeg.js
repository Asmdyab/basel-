import heic2any from "heic2any";

function removeExtension(fileName) {
  const dotIndex = fileName.lastIndexOf(".");

  return dotIndex > 0
    ? fileName.substring(0, dotIndex)
    : fileName;
}

export async function convertImageToJpeg(file) {
  if (!file) {
    throw new Error("اختار صورة.");
  }

  const fileName = file.name.toLowerCase();

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  if (isHeic) {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const jpegBlob = Array.isArray(result)
      ? result[0]
      : result;

    return new File(
      [jpegBlob],
      `${removeExtension(file.name)}.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("الملف المختار لازم يكون صورة.");
  }

  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("تعذر تجهيز الصورة.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0);

  bitmap.close();

  const jpegBlob = await new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(
              new Error("تعذر تحويل الصورة.")
            );
          }
        },
        "image/jpeg",
        0.9
      );
    }
  );

  return new File(
    [jpegBlob],
    `${removeExtension(file.name)}.jpg`,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
}