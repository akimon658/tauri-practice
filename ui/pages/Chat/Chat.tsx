import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { chatPageLayout, inputContainer, messagesContainer, messageStyleBase, textareaStyle, userMessageStyle, zundamonMessageStyle } from "./chat.css.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesKey, sendMessageKey } from "../../api/mutation_keys.ts";
import { commands, Message } from "../../api/bindings.gen.ts";

type ChatForm = {
  text: string;
}

export const Chat = () => {
  const { data: messages } = useQuery({
    queryKey: getMessagesKey,
    queryFn: async () => {
      const messages = await commands.getMessages();

      messages.reverse()

      return messages;
    },
  })
  const { formState: { isValid }, handleSubmit, register, reset } = useForm<ChatForm>()
  const queryClient = useQueryClient();
  const { mutate: sendMessage } = useMutation({
    mutationKey: sendMessageKey,
    mutationFn: commands.sendMessage,
    onSuccess: commands.speak,
    onMutate: (content) => {
      queryClient.setQueryData<Message[]>(getMessagesKey, (oldMessages) => [...(oldMessages ?? []), {
        id: Math.random(),
        content,
        by_zundamon: false,
      }])
      reset();
    }
  })
  const onSubmit = (data: ChatForm) => {
    sendMessage(data.text);
  }

  return (
    <div className={chatPageLayout}>
      <div className={messagesContainer}>
        {messages?.map((message) => (
          <div key={message.id} className={`${messageStyleBase} ${message.by_zundamon ? zundamonMessageStyle : userMessageStyle}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className={inputContainer}>
        <Textarea {...register('text', { required: true })} className={textareaStyle} />
        <IconButton label="送信" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          <PaperPlaneIcon />
        </IconButton>
      </div>
    </div>
  )
}
