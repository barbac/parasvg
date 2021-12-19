import { useTranslation } from "react-i18next";

interface BackgroundInputProps {
  onChange: (filename: string, image: string) => void;
}

export default function BackgroundInput({ onChange }: BackgroundInputProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div>{t("Background image")}</div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const reader = new FileReader();
            const file = e.target.files![0];
            reader.onload = (e) =>
              onChange(file.name, e.target!.result as string);
            reader.readAsDataURL(e.target.files![0]);
          }}
        />
      </div>
    </div>
  );
}
