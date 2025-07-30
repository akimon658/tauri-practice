import { useSpeak } from "../../api/hooks.ts";
import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { chatPageLayout, inputContainer, textareaStyle } from "./chat.css.ts";

type ChatForm = {
  text: string;
}

export const Chat = () => {
  const { mutate: speak } = useSpeak();
  const { formState: { isValid }, handleSubmit, register, reset } = useForm<ChatForm>()
  const onSubmit = (data: ChatForm) => {
    speak(data.text);
    reset();
  }

  return (
    <div className={chatPageLayout}>
      <div className={inputContainer}>
        <Textarea {...register('text', { required: true })} className={textareaStyle} />
        <IconButton label="送信" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          <PaperPlaneIcon />
        </IconButton>
      </div>
    </div>
  )
}
