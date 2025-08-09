import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { chatPageLayout, inputContainer, textareaStyle } from "./chat.css.ts";
import { useMutation } from "@tanstack/react-query";
import { sendMessageKey } from "../../api/mutation_keys.ts";
import { commands } from "../../api/bindings.gen.ts";

type ChatForm = {
  text: string;
}

export const Chat = () => {
  const { mutate: sendMessage } = useMutation({
    mutationKey: sendMessageKey,
    mutationFn: commands.sendMessage,
    onSuccess: commands.speak,
  })
  const { formState: { isValid }, handleSubmit, register, reset } = useForm<ChatForm>()
  const onSubmit = (data: ChatForm) => {
    sendMessage(data.text);
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
