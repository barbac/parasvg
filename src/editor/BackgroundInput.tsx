interface BackgroundInputProps {
  onChange: (image: string) => void;
}

export default function BackgroundInput({ onChange }: BackgroundInputProps) {
  return (
    <div>
      <div>Background image</div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const reader = new FileReader();
            reader.onload = (e) => onChange(e.target!.result as string);
            reader.readAsDataURL(e.target.files![0]);
          }}
        />
      </div>
    </div>
  );
}
