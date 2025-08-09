import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { buttonsLayout, chatPageLayout, inputContainer, messagesContainer, messageStyleBase, textareaStyle, userMessageStyle, zundamonMessageStyle } from "./chat.css.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAllMessagesKey, getMessagesKey, sendMessageKey } from "../../api/mutation_keys.ts";
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
    onSuccess: (res) => {
      commands.speak(res)
      queryClient.setQueryData<Message[]>(getMessagesKey, (oldMessages) => [...(oldMessages ?? []), {
        id: Math.random(),
        content: res,
        by_zundamon: true,
      }])
    },
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
  const { mutate: resetMessages } = useMutation({
    mutationKey: deleteAllMessagesKey,
    mutationFn: commands.deleteAllMessages,
    onSuccess: () => queryClient.setQueryData<Message[]>(getMessagesKey, [])

  })

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
        <div className={buttonsLayout}>
          <IconButton label="リセット" onClick={() => resetMessages()}>
            <TrashIcon />
          </IconButton>
          <IconButton label="送信" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
            <PaperPlaneIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
